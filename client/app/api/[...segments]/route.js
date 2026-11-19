import { NextResponse } from 'next/server'
import { assistantKnowledge } from '../../../lib/assistant-knowledge.js'
import { getPool, initializeDatabase } from '../../../lib/db.js'

export const runtime = 'nodejs'

const MAX_REQUEST_SIZE = 20 * 1024
const CHAT_RATE_LIMIT = 50
const CHAT_RATE_WINDOW_MS = 60 * 60 * 1000
const RATE_LIMIT_CLEANUP_INTERVAL_MS = 5 * 60 * 1000
const MAX_CHAT_QUESTION_LENGTH = 1000
const CHAT_LANGUAGES = {
  en: 'English',
  am: 'Amharic',
  sid: 'Sidaamu Afoo (Sidama language)',
}
const API_SECURITY_HEADERS = {
  'Content-Security-Policy': "default-src 'self';base-uri 'self';font-src 'self' https: data:;form-action 'self';frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src 'self';script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests",
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Resource-Policy': 'same-origin',
  'Origin-Agent-Cluster': '?1',
  'Referrer-Policy': 'no-referrer',
  'X-Content-Type-Options': 'nosniff',
  'X-DNS-Prefetch-Control': 'off',
  'X-Download-Options': 'noopen',
  'X-Frame-Options': 'SAMEORIGIN',
  'X-Permitted-Cross-Domain-Policies': 'none',
  'X-XSS-Protection': '0',
}
const chatRateLimits = new Map()
let lastRateLimitCleanup = 0
let searchGroundingUnavailableUntil = 0

function json(data, status = 200, headers) {
  return NextResponse.json(data, {
    status,
    headers: { ...API_SECURITY_HEADERS, ...headers },
  })
}

async function readJson(request) {
  const contentLength = Number(request.headers.get('content-length'))
  if (contentLength > MAX_REQUEST_SIZE) {
    return { error: json({ error: 'Request body is too large.' }, 413) }
  }

  const body = await request.text()
  if (new TextEncoder().encode(body).byteLength > MAX_REQUEST_SIZE) {
    return { error: json({ error: 'Request body is too large.' }, 413) }
  }

  try {
    return { data: JSON.parse(body) }
  } catch {
    return { error: json({ error: 'Request body must be valid JSON.' }, 400) }
  }
}

function getClientIp(request) {
  return request.headers.get('x-real-ip')
    || request.headers.get('x-forwarded-for')?.split(',')[0].trim()
    || 'unknown'
}

function handleError(error) {
  console.error('API request failed:', error)
  return json({ error: 'An unexpected server error occurred.' }, 500)
}

export async function GET(request, context) {
  try {
    const { segments = [] } = await context.params
    const [resource, id] = segments

    if (resource === 'health' && !id) {
      await initializeDatabase()
      await getPool().query('SELECT 1')
      return json({ status: 'ok', database: 'connected' })
    }

    if (resource === 'news' && !id) {
      await initializeDatabase()
      const { rows } = await getPool().query(
        'SELECT id, title, category, summary, published_at FROM news ORDER BY published_at DESC, id DESC',
      )
      return json(rows)
    }

    if (resource === 'news' && id) {
      const newsId = Number(id)
      if (!Number.isSafeInteger(newsId) || newsId < 1) {
        return json({ error: 'News ID must be a positive integer.' }, 400)
      }

      await initializeDatabase()
      const { rows } = await getPool().query(
        'SELECT id, title, category, summary, published_at FROM news WHERE id = $1',
        [newsId],
      )
      if (!rows[0]) return json({ error: 'News story not found.' }, 404)
      return json(rows[0])
    }

    if (resource === 'services' && !id) {
      await initializeDatabase()
      const { rows } = await getPool().query(
        'SELECT id, name, description, category FROM services ORDER BY id',
      )
      return json(rows)
    }

    return json({ error: 'Not found' }, 404)
  } catch (error) {
    return handleError(error)
  }
}

function getRegionalKnowledgeAnswer(question, language = 'en') {
  const q = question.toLowerCase().trim()

  const topics = [
    {
      match: () => q.includes('where') || q.includes('location') || q.includes('capital') || q.includes('hawassa') || q.includes('geography') || q.includes('map') || q.includes('border') || q.includes('የት') || q.includes('hakkoonni'),
      sources: [
        { title: 'About Sidama Regional State', url: '/about', snippet: 'Geography, statehood, Hawassa capital, and territorial boundaries.' },
        { title: 'Tourism Destinations', url: '/tourism', snippet: 'Lake Hawassa and regional natural wonders.' },
      ],
      answers: {
        en: `Sidama Regional State is located in the Great Rift Valley in southern Ethiopia. Its administrative capital and largest urban hub is Hawassa (Awassa), situated approximately 275 km south of Addis Ababa along the eastern shores of Lake Hawassa.\n\nThe region spans fertile Rift Valley lake plains to cool alpine highlands exceeding 3,000 meters above sea level (such as Mount Garamba). Sidama is bounded by Lake Hawassa to the northwest, Lake Abaya to the south, and the Bilate River basin to the west. It encompasses 4 administrative zones and Hawassa City Administration, with more than 30 woredas (districts).`,
        am: `የሲዳማ ክልል በደቡባዊ ኢትዮጵያ በታላቁ ስምጥ ሸለቆ ውስጥ ይገኛል። የክልሉ ዋና ከተማና አስተዳደራዊ ማዕከል በሐዋሳ ሐይቅ ዳርቻ የምትገኘው ሐዋሳ ከተማ ናት (ከአዲስ አበባ በስተደቡብ 275 ኪሎ ሜትር ርቀት ላይ)።\n\nክልሉ ከስምጥ ሸለቆ ሐይቆች አንስቶ ከባህር ወለል በላይ እስከ 3,000 ሜትር ከፍታ ወዳላቸው ቀዝቃዛ አረንጓዴ ተራሮች (እንደ ጋራምባ ተራራ) ይዘልቃል። ሲዳማ በሰሜን ምዕራብ በሐዋሳ ሐይቅ፣ በደቡብ በአባያ ሐይቅ እና በምዕራብ በቢላቴ ወንዝ ተፋሰስ ይዋሰናል። ክልሉ 4 ዞኖችና የሐዋሳ ከተማ አስተዳደር እንዲሁም ከ30 በላይ ወረዳዎችን ያጠቃልላል።`,
        sid: `Sidama Qoqqowo Dihhi Ethiopia giddo Rift Valley baaleeti afantanno. Qoqqowote qaru katamanna kaimu Awassa (Hawassa) katamaati, Addis Ababanni 275 km xeertinye giddo Hawassa baara dargaati no.\n\nQoqqowo Rift Valley baara ka’e 3,000 m kaima geeshsha ka’ino ha’rooshsho afi'rino (Garamba ilata gede). Qoqqowo Hawassa baara, Abaya baara nna Bilate wo'a ledo noha, 4 zoonubba, Hawassa Katama nna 30 woradda amaddinote.`,
      },
    },
    {
      match: () => q.includes('fichee') || q.includes('chambalaalla') || q.includes('new year') || q.includes('ዓመት') || q.includes('dira') || q.includes('ayyaanto') || q.includes('qetala'),
      sources: [
        { title: 'Culture & Living Heritage', url: '/culture', snippet: 'Fichee-Chambalaalla UNESCO intangible cultural heritage, Ayyaanto astronomers, and Qetala dance.' },
      ],
      answers: {
        en: `Fichee–Chambalaalla is the celebrated Sidama New Year festival, inscribed by UNESCO on the Representative List of the Intangible Cultural Heritage of Humanity in November 2015.\n\nUnlike fixed calendar celebrations, the exact date of Fichee is determined each year by traditional astronomers known as "Ayyaanto", who observe constellations, the moon, and seasonal stellar paths. Celebrations begin in homes with the sharing of "Buurisame" (traditional fermented enset with seasoned butter) and culminate at communal "Gudumaale" grounds in Hawassa with the ecstatic "Qetala" dance, songs of peace, inter-clan reconciliation, and solemn pledges to protect nature and uphold truth (Halaale).`,
        am: `ፊቼ–ጫምባላላ በ2015 እ.ኤ.አ በዩኔስኮ (UNESCO) የማይዳሰስ የሰው ልጅ የባህል ቅርስ ሆኖ የተመዘገበው ታላቁ የሲዳማ ሕዝብ ባህላዊ አዲስ ዓመት በዓል ነው።\n\nየበዓሉ ትክክለኛ ቀን በዘመናዊ ካላንደር የማይወሰን ሲሆን፣ 'አያያንቶ' በሚባሉ ባህላዊ የከዋክብትና የጨረቃ ተመራማሪዎች አማካኝነት በሰማያዊ አካላት እንቅስቃሴ ተሰልቶ ይታወጃል። በዓሉ በቤተሰብ ደረጃ 'ቡሪሳሜ' (የተዘጋጀ ቆጮ ከቅቤና ወተት ጋር) በመመገብ ይጀምራል፤ በሐዋሳ ጉዱማሌ ሜዳ ላይ በሚደረግ የቄጣላ ጭፈራ፣ እርቅ፣ የይቅርታና የሰላም ስምምነቶች እንዲሁም የተፈጥሮ ጥበቃ ቃልኪዳን በደመቀ ሁኔታ ይከበራል።`,
        sid: `Fichee–Chambalaalla Sidamu Haaroo Diraati, 2015 UNESCO aadaa kaima giddo borreesamino. Qaru barri Ayyaanto yinanni cimeeyye aganna nna beetto la’’e woyite buuxanni yannaati.\n\nFichee kaimi mine Buurisame sagale itte hanafanni, Gudumaalete darga Qetala sirba, keere fushsho nna Seera/Halaale agarooshshe leellishanno.`,
      },
    },
    {
      match: () => q.includes('luwa') || q.includes('governance') || q.includes('age-grade') || q.includes('gadaana') || q.includes('seera') || q.includes('halaale') || q.includes('ፍትህ'),
      sources: [
        { title: 'Culture & Living Heritage', url: '/culture', snippet: 'Luwa generational governance and Seera customary legal code.' },
        { title: 'Government & Institutions', url: '/government', snippet: 'Regional administrative frameworks.' },
      ],
      answers: {
        en: `Luwa is the indigenous generational age-grade democratic governance system of the Sidama people. It operates on a 35-year cycle composed of five rotating 7-year age-sets: Darara, Fullaasa, Hirobora, Wawwawa, and Mogissa.\n\nLed by the "Gadaana" leader and his "Ja'lawa" council, the Luwa system organizes civic leadership, community defense, rites of passage, and orderly generational power transition. Parallel to Luwa is "Seera", the moral and customary legal code anchored on "Halaale" (absolute truth, justice, and cosmic balance), which guides village assemblies (Ollaa Songo) in resolving disputes without adversarial conflict.`,
        am: `ሉዋ የሲዳማ ሕዝብ ባህላዊና ዴሞክራሲያዊ የእድሜ እርከን የአስተዳደር ሥርዓት ነው። ሥርዓቱ አምስት ተዘዋዋሪ የ7 ዓመት እርከኖች (ዳራራ፣ ፉላሳ፣ ሂርቦራ፣ ዋዋዋ፣ ሞጊሳ) ያሉት ሲሆን በአጠቃላይ 35 ዓመታትን ይሸፍናል።\n\nበገዳና (ዋና መሪ) እና በጃላዋ (ምክትሎች) የሚመራ ሲሆን፣ የሲቪክ ስልጠናን፣ የኅብረተሰብ ጥበቃንና የሥልጣን ሽግግርን በሰላማዊ መንገድ ያስተናግዳል። ከዚህ ጎን ለጎን 'ሴራ' የተሰኘው የባህል ሕግ በ'ሃላሌ' (ፍጹም እውነት፣ ፍትህና ስምምነት) መርህ ላይ ተመስርቶ አለመግባባቶችን በዕርቅ ይፈታል።`,
        sid: `Luwa Sidamu aadaa mootimma nna cimeeyye giddonni dandiino ha’rooshsho kaimaati. Ontu 7-diro gedensoanni dandiino ganna (Darara, Fullaasa, Hirobora, Wawwawa, Mogissa) 35-diro geeshsha dandiitanno.\n\nGadaana nna Ja'lawa soorranno kaimi giddonni seera nna keere agarsiisanno. Seera nna Halaale cimeeyye Ollaa Songo giddo keere nna taashsho leellishanno.`,
      },
    },
    {
      match: () => q.includes('coffee') || q.includes('buna') || q.includes('ቡና') || q.includes('economy') || q.includes('trade') || q.includes('bensa') || q.includes('export') || q.includes('park'),
      sources: [
        { title: 'Economy & Coffee', url: '/economy', snippet: 'Specialty Arabica coffee, SCFCU cooperative union, and Hawassa Industrial Park.' },
      ],
      answers: {
        en: `Sidama is internationally renowned as the birthplace of some of the highest-scoring specialty Arabica coffees in the world, characterized by complex floral jasmine, citrus bergamot, and sweet stone fruit notes. High-altitude micro-climates in Bensa, Arbegona, and Dale consistently produce Cup of Excellence champion micro-lots.\n\nThe Sidama Coffee Farmers Cooperative Union (SCFCU), founded in 2001, represents over 80,000 smallholder farming households across 50+ cooperatives, exporting organic, fair-trade certified beans globally. The region also hosts the 1.4M m² Hawassa Industrial Park (HIP), specialized in zero-liquid discharge textile manufacturing, and the Yirgalem Integrated Agro-Industrial Park.`,
        am: `ሲዳማ በዓለም አቀፍ ደረጃ በልዩ የአረቢካ ቡና (Specialty Arabica Coffee) ጣዕምና ጥራት ቀዳሚ ከሆኑ አካባቢዎች አንዱ ነው። በቤንሳ፣ አርበጎና እና ዳሌ ወረዳዎች የሚመረቱ ቡናዎች በዓለም አቀፉ 'የልህቀት ዋንጫ' (Cup of Excellence) ውድድር ላይ ከፍተኛ ውጤት በማስመዝገብ ይታወቃሉ።\n\nከ2001 ጀምሮ የተቋቋመው የሲዳማ ቡና አርሶ አደሮች የህብረት ሥራ ዩኒየን (SCFCU) ከ80,000 በላይ አነስተኛ አርሶ አደሮችን በማቀፍ ኦርጋኒክ ቡናን ወደ ውጭ ይልካል። በተጨማሪም ክልሉ 1.4 ሚሊዮን ካሬ ሜትር ስፋት ያለውን የሐዋሳ ኢንዱስትሪ ፓርክ (HIP) እና የይርጋለም የተቀናጀ የግብርና ማቀነባበሪያ ኢንዱስትሪ ፓርክን ያስተዳድራል።`,
        sid: `Sidama alame doogo buna laalshunni woyyannote. Bensa, Arbegona nna Dale woraddanni fulanno buna Cup of Excellence giddo roore kiiro afi’ranno.\n\nSidama Coffee Farmers Cooperative Union (SCFCU) 80,000 roore buna laalannoha kaimasi assino. Qoleno Hawassa Industrial Park (HIP) nna Yirgalem Agro-Industrial Park giddo luphi yino ooshshe no.`,
      },
    },
    {
      match: () => q.includes('tour') || q.includes('lake') || q.includes('hawassa') || q.includes('falls') || q.includes('waterfall') || q.includes('wondo') || q.includes('hotel') || q.includes('lodge') || q.includes('visit') || q.includes('ጉብኝት') || q.includes('ቱሪዝም') || q.includes('turizime'),
      sources: [
        { title: 'Tourism & Destinations', url: '/tourism', snippet: 'The Great 5 Adventures, Lake Hawassa, Wondo Genet hot springs, and Logita Falls.' },
      ],
      answers: {
        en: `Sidama is one of southern Ethiopia's top ecotourism paradises, featuring "The Great 5 Adventures":\n1. Lake Hawassa & Amora Gedel: Freshwater lake renowned for boat safaris, hippos, fresh tilapia, and great white pelicans.\n2. Wondo Genet Geothermal Springs: Natural hot mineral pools, lush botanical arboretum, and forest hiking trails.\n3. Logita & Bonora Falls: Roaring waterfall gorges in the high-altitude misty rainforests of Bensa.\n4. Loka Abaya National Park: 500 km² wildlife sanctuary bordering Lake Abaya with acacia savannah and wetland fauna.\n5. Bensa & Arbegona Cloud Coffee Trail: Agro-tourism visits to champion coffee farms, raised drying beds, and traditional ceremonies.`,
        am: `ሲዳማ በደቡብ ኢትዮጵያ ቀዳሚ የኢኮ-ቱሪዝም መዳረሻ ሲሆን 'የሲዳማ ታላላቅ 5 ጉዞዎች' በሚከተሉት ይጠቃለላሉ፡\n1. ሐዋሳ ሐይቅና አሞራ ገደል፡ በጀልባ ጉዞ፣ ጉማሬዎች፣ ትኩስ አሳና ፔሊካኖች የታወቀ የተፈጥሮ ሐይቅ።\n2. ወንዶ ገነት የተፈጥሮ ፍልውሃ፡ ፈዋሽ የፍልውሃ ምንጮች፣ የመዋኛ ገንዳዎችና ጥንታዊ የደን ምርምር ፓርክ።\n3. የሎጊታና ቦኖራ ፏፏቴዎች፡ በቤንሳ ደጋማ አካባቢ በገደላማ ሸለቆዎች ውስጥ የሚወርዱ አስደናቂ ፏፏቴዎች።\n4. ሎካ አባያ ብሔራዊ ፓርክ፡ ከአባያ ሐይቅ ዳርቻ 500 ካሬ ኪሎ ሜትር የዱር እንስሳትና ወፎች መጠለያ።\n5. የቤንሳና አርበጎና የቡና ጉዞ፡ ታዋቂ የቡና እርሻዎችንና ባህላዊ የቡና ማፍላት ሥነ-ሥርዓትን የመጎብኘት ዕድል።`,
        sid: `Sidama qoqqowo giddo 5 gedaano ha’rooshsho no:\n1. Hawassa Baara nna Amora Gedel: Doonote ha’rooshsho, guummarre nna haadhu xawishsha.\n2. Wondo Genet Wo’a: Qorrichu wo’a, waaxillu darga nna cawu kaimi arboretum.\n3. Logita nna Bonora Wo’a Darga: Bensa woradda giddo roore wo’a dargaati.\n4. Loka Abaya National Park: 500 km² kaima giddo saada nna baara agarsiisanno darga.\n5. Bensa nna Arbegona Buna Ha’rooshsho: Alame doogo buna laalanno kaima nna buna woyisi.`,
      },
    },
    {
      match: () => q.includes('language') || q.includes('afoo') || q.includes('speak') || q.includes('words') || q.includes('greeting') || q.includes('qubee') || q.includes('ቋንቋ') || q.includes('ሰላምታ') || q.includes('afii'),
      sources: [
        { title: 'Sidaamu Afoo Language', url: '/language', snippet: 'Linguistic background, Latin Qubee writing system, everyday vocabulary, and numerals 1-10.' },
      ],
      answers: {
        en: `Sidaamu Afoo is the native tongue of the Sidama people, belonging to the Highland East Cushitic branch of the Afroasiatic language family, spoken by over 4 million people. Since 1993, it has been officially written using the Latin "Qubee" script.\n\nKey Everyday Phrases:\n- "Keere" / "Keereho": Hello / Peace (universal greeting)\n- "Keere gallito" / "Keere gallita": Good morning (to male / female)\n- "Hittonni nootto?" / "Hittonni nootta?": How are you? (to male / female)\n- "Keerunni noo'ma": I am fine / in peace\n- "Galatoommo": Thank you\n- "Hoo" (Yes) / "Weyi" (No)\n\nNumerals (1-10): 1 Mite, 2 Lame, 3 Sase, 4 Shoole, 5 Onte, 6 Lee, 7 Lamala, 8 Sette, 9 Honse, 10 Tonne.`,
        am: `ሲዳሙ አፎ የሲዳማ ሕዝብ የአፍ መፍቻ ቋንቋ ሲሆን፣ በአፍሮ-ኤዥያዊ የቋንቋ ቤተሰብ ውስጥ በደጋማ ምስራቅ ኩሻዊ ቅርንጫፍ ይመደባል። ከ1993 ጀምሮ በላቲን 'ቁቤ' ፊደል ይጻፋል።\n\nመሰረታዊ የዕለት ተዕለት ሰላምታዎች፡\n- 'ኬሬ' / 'ኬሬሆ'፡ ሰላም / ጤና ይስጥልኝ\n- 'ኬሬ ጋሊቶ' / 'ኬሬ ጋሊታ'፡ እንደምን አደርክ / አደርሽ\n- 'ሂቶኒ ኖቶ?' / 'ሂቶኒ ኖታ?'፡ እንዴት ነህ? / ነሽ?\n- 'ኬሩኒ ኖማ'፡ ደህና ነኝ\n- 'ገላቶሞ'፡ አመሰግናለሁ\n- 'ሆ' (አዎ) / 'ወዪ' (አይደለም)\n\nቁጥሮች (1-10)፡ 1 ሚቴ፣ 2 ላሜ፣ 3 ሳሴ፣ 4 ሾሌ፣ 5 ኦንቴ፣ 6 ሌኤ፣ 7 ላማላ፣ 8 ሴቴ፣ 9 ሆንሴ፣ 10 ቶኔ።`,
        sid: `Sidaamu Afoo Cushitic afii kaimi giddooti, 4 miliyone roore manni hasaawanno. 1993 ka’e Latin Qubee borrooti horoonsi’nanni.\n\nBarru Qaalla nna Keere fushsho:\n- "Keere" / "Keereho": Keere heedho\n- "Keere gallito" / "Keere gallita": Dancha soodo\n- "Hittonni nootto?" / "Hittonni nootta?": Dancha heedhe?\n- "Keerunni noo'ma": Keerunni noommoti\n- "Galatoommo": Galata shiqishoommo\n- "Hoo" (Eeyye) / "Weyi" (Dihino)\n\nKiiro (1-10): 1 Mite, 2 Lame, 3 Sase, 4 Shoole, 5 Onte, 6 Lee, 7 Lamala, 8 Sette, 9 Honse, 10 Tonne.`,
      },
    },
    {
      match: () => q.includes('enset') || q.includes('wesse') || q.includes('kocho') || q.includes('buurisame') || q.includes('food') || q.includes('ቆጮ') || q.includes('እንሰት') || q.includes('sagale'),
      sources: [
        { title: 'Culture & Living Heritage', url: '/culture', snippet: 'Wesse (Enset) - the tree against hunger, food sovereignty, and festive Buurisame.' },
      ],
      answers: {
        en: `Wesse (Enset ventricosum / false banana) is the bedrock of Sidama agriculture, food sovereignty, and cultural hospitality. Often called "the tree against hunger", it is deeply drought-resilient and provides food throughout the year.\n\nThe fermented pulp (Waasa) is prepared into beloved staple dishes like "Buurisame" (richly blended with spiced butter and milk for celebrations such as Fichee) and "Ccukkame". Its sturdy fibers are also used to make ropes, roofing materials, and traditional domestic packaging.`,
        am: `ወሴ (እንሰት) የሲዳማ ግብርና፣ የምግብ ዋስትና እና የባህል ማዕከል ነው። ድርቅን የሚቋቋም በመሆኑ 'የራብ መከላከያ ዛፍ' በመባል ይታወቃል።\n\nከእንሰት የሚገኘው ዋሳ (ቆጮ) እንደ 'ቡሪሳሜ' (ለፊቼ በዓል በቅቤና ወተት ተለውሶ የሚዘጋጅ) እና 'ጩካሜ' የመሳሰሉ ተወዳጅ ባህላዊ ምግቦች ይዘጋጁበታል። ቃጫው ደግሞ ለቤት ጣሪያ፣ ገመድና ልዩ ልዩ የቤት ቁሳቁሶች መሥሪያ ያገለግላል።`,
        sid: `Wesse (Enset) Sidamu kaima sagaleeti, olanna hude sa’anno mukkaati. Gobba baala wo’naalshi giddo jajjabba dandiitanno.\n\nWaasa giddonni Buurisame (Ficheete yanna woyite buuri nna adonni qixxeessannoha) nna Ccukkame ikkanno. Qari kaimasi mi’ne minatenna dafe qolateno kaa’lanno.`,
      },
    },
    {
      match: () => q.includes('health') || q.includes('hospital') || q.includes('clinic') || q.includes('doctor') || q.includes('ህክምና') || q.includes('ሆስፒታል') || q.includes('ጤና') || q.includes('fayya'),
      sources: [
        { title: 'Health & Wellbeing', url: '/health', snippet: 'Hawassa University Referral Hospital, PHCU networks, and health extension workers.' },
      ],
      answers: {
        en: `Healthcare in Sidama is coordinated by the Regional Health Bureau, anchored by the Hawassa University Comprehensive Specialized Hospital (HU-CSH), the premier tertiary teaching and referral center in southern Ethiopia serving over 5 million people with cardiology, oncology, pediatric, and trauma surgery.\n\nAcross all 30+ woredas, Primary Health Care Units (PHCUs) and community Health Extension Workers provide accessible primary care, maternal deliveries, infant immunizations, and clean water sanitation initiatives directly to rural households.`,
        am: `በሲዳማ ክልል የጤና አገልግሎት የሚመራው በክልሉ ጤና ቢሮ ሲሆን፣ በደቡብ ኢትዮጵያ ከፍተኛ የማስተማሪያና ሪፈራል ማዕከል በሆነው በሐዋሳ ዩኒቨርሲቲ ኮምፕረሄንሲቭ ስፔሻላይዝድ ሆስፒታል (HU-CSH) ይደገፋል። ሆስፒታሉ ለ5 ሚሊዮን በላይ ሰዎች የልብ፣ የካንሰር፣ የሕፃናትና የቀዶ ሕክምና አገልግሎቶችን ይሰጣል።\n\nበሁሉም 30+ ወረዳዎች የመጀመሪያ ደረጃ የጤና ተቋማትና የጤና ኤክስቴንሽን ባለሙያዎች የእናቶችና የሕፃናት ጤናን፣ ክትባቶችንና ንጹህ የመጠጥ ውሃ ተደራሽነትን ያረጋግጣሉ።`,
        sid: `Sidama Qoqqowo Fayyate Biiro Hawassa University Comprehensive Specialized Hospital (HU-CSH) ledo loosanno. Kuni hospitaale 5 miliyoone mannihira fayya agarsiisanno.\n\n30 woradda giddo Health Center nna Fayyate Kebele loosaasine amaanna qaaqquullu fayya, doogote qorophishsha nna keere wo’a shiqishanno.`,
      },
    },
    {
      match: () => q.includes('education') || q.includes('university') || q.includes('school') || q.includes('college') || q.includes('ትምህርት') || q.includes('ዩኒቨርሲቲ') || q.includes('barsiisamme'),
      sources: [
        { title: 'Education & Higher Learning', url: '/education', snippet: 'Hawassa University, Wondo Genet College of Forestry, and mother-tongue primary schools.' },
      ],
      answers: {
        en: `Education in Sidama includes major higher learning institutions led by Hawassa University (HU), one of Ethiopia’s top research universities with flagship campuses in medicine, agriculture, engineering, and business. Wondo Genet College of Forestry and Natural Resources is an East African pioneer in sustainable environmental and watershed science.\n\nPrimary education is delivered in mother-tongue Sidaamu Afoo using the Latin Qubee script, alongside comprehensive TVET polytechnics in Hawassa and major districts.`,
        am: `የሲዳማ ክልል የትምህርት ዘርፍ በዋናነት በሐዋሳ ዩኒቨርሲቲ (HU) የሚመራ ሲሆን፣ በግብርና፣ ሕክምና፣ ምህንድስናና ቢዝነስ የላቀ ምርምር ያካሂዳል። የወንዶ ገነት የደንና የተፈጥሮ ሀብት ኮሌጅ ደግሞ በምስራቅ አፍሪካ የታወቀ የአካባቢ ጥበቃና የደን ሳይንስ ማዕከል ነው።\n\nበመጀመሪያ ደረጃ ትምህርት ቤቶች በአፍ መፍቻ ቋንቋ በሲዳሙ አፎ (በቁቤ ፊደል) ትምህርት ይሰጣል፤ እንዲሁም የቴክኒክና ሙያ (TVET) ማሰልጠኛዎች በስፋት ይገኛሉ።`,
        sid: `Sidama giddo Hawassa University (HU) roore bukkoota afi'rino university-ti, fayya, qotiye nna teknologiye giddo roore looso loosanno. Wondo Genet Forestry College qoleno qilleensa nna cawu kaimi rosinni alame doogo rooranno.\n\nRosaano umikki afiinni Sidaamu Afooti Qubee borrooti rosdanno, TVET kaimubba katamubba giddo looso la’anno.`,
      },
    },
  ]

  const matched = topics.find((t) => t.match())
  if (matched) {
    const langKey = ['en', 'am', 'sid'].includes(language) ? language : 'en'
    return {
      answer: matched.answers[langKey] || matched.answers.en,
      sources: matched.sources,
    }
  }

  const genericSources = [
    { title: 'About Sidama Regional State', url: '/about', snippet: 'Comprehensive guide to Sidama Regional State, history, and institutions.' },
    { title: 'Culture & Heritage', url: '/culture', snippet: 'Living traditions, Fichee-Chambalaalla, and community heritage.' },
  ]

  const genericAnswers = {
    en: `Welcome to the official portal of Sidama Regional State, Ethiopia. Sidama is renowned for its rich cultural civilization—including the UNESCO-inscribed Fichee–Chambalaalla festival and Luwa democratic governance—as well as world-famous specialty coffee from Bensa and Arbegona, and breathtaking tourism destinations like Lake Hawassa and Wondo Genet.\n\nFeel free to explore our portal pages for comprehensive information on culture, tourism, economy, education, and public services.`,
    am: `እንኳን ወደ ሲዳማ ክልላዊ መንግሥት ይፋዊ ፖርታል በደህና መጡ። ሲዳማ በዩኔስኮ በተመዘገበው የፊቼ–ጫምባላላ አዲስ ዓመት በዓል፣ በዴሞክራሲያዊው የሉዋ ሥርዓት፣ በዓለም ታዋቂው የቤንሳና አርበጎና ልዩ የቡና ምርት እንዲሁም እንደ ሐዋሳ ሐይቅና ወንዶ ገነት ባሉ ውብ የቱሪዝም መዳረሻዎቹ ይታወቃል።\n\nስለ ባህል፣ ቱሪዝም፣ ኢኮኖሚ፣ ትምህርትና አገልግሎቶች ተጨማሪ መረጃ ለማግኘት የድረ ገጹን ክፍሎች መጎብኘት ይችላሉ።`,
    sid: `Sidama Qoqqowo Mootimma Awaajju Woyite woyite keeshshite. Sidama UNESCO borreesamino Fichee–Chambalaalla, Luwa aadaa mootimma, Bensa nna Arbegona alame doogo buna, nna Hawassa Baara ledo turizimete dargaati.\n\nLeddo xawishsha afi’rate aadaa, turizime, ekonomi nna ooshshe qoola leellishshe.`,
  }

  const langKey = ['en', 'am', 'sid'].includes(language) ? language : 'en'
  return {
    answer: genericAnswers[langKey] || genericAnswers.en,
    sources: genericSources,
  }
}

async function handleChat(request, body) {
  const { question, language = 'en' } = body ?? {}
  if (typeof question !== 'string' || !question.trim() || question.trim().length > MAX_CHAT_QUESTION_LENGTH) {
    return json({ error: `Question must be between 1 and ${MAX_CHAT_QUESTION_LENGTH} characters.` }, 400)
  }
  if (!Object.hasOwn(CHAT_LANGUAGES, language)) {
    return json({ error: 'Language must be en, am, or sid.' }, 400)
  }

  const searchUrl = new URL('https://www.google.com/search')
  searchUrl.searchParams.set('q', `${question.trim()} Sidama Ethiopia`)

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    const fallback = getRegionalKnowledgeAnswer(question, language)
    return json({ answer: fallback.answer, sources: fallback.sources, searchUrl: searchUrl.href })
  }

  const now = Date.now()
  const clientIp = getClientIp(request)
  let rateLimit = chatRateLimits.get(clientIp)
  if (!rateLimit || rateLimit.resetAt <= now) {
    rateLimit = { count: 0, resetAt: now + CHAT_RATE_WINDOW_MS }
    chatRateLimits.set(clientIp, rateLimit)
  }
  if (rateLimit.count >= CHAT_RATE_LIMIT) {
    const fallback = getRegionalKnowledgeAnswer(question, language)
    return json({ answer: fallback.answer, sources: fallback.sources, searchUrl: searchUrl.href })
  }
  rateLimit.count += 1

  if (now - lastRateLimitCleanup > RATE_LIMIT_CLEANUP_INTERVAL_MS) {
    for (const [ip, entry] of chatRateLimits) {
      if (entry.resetAt <= now) chatRateLimits.delete(ip)
    }
    lastRateLimitCleanup = now
  }

  const model = process.env.GEMINI_MODEL || 'gemini-3.1-flash-lite'
  const knowledgeContext = assistantKnowledge
    .map((k) => `## ${k.title}\n${k.content}`)
    .join('\n\n')

  const prompt = [
    `### Official Regional Knowledge Base (Sidama Regional State, Ethiopia):\n${knowledgeContext}`,
    `### Visitor Question:\n${question.trim()}`,
  ].join('\n\n')

  const systemText = [
    'You are the official Sidama Regional State AI assistant in Ethiopia.',
    `Always respond in ${CHAT_LANGUAGES[language]}.`,
    'Be welcoming, factual, concise, and helpful (under 3-4 short paragraphs).',
    'Use the official regional knowledge base provided in the prompt to answer questions about Sidama history, culture (such as Fichee–Chambalaalla, Luwa age-grade system, Seera customary law, Wesse/enset), tourism destinations (Lake Hawassa, Wondo Genet, Logita Falls, Loka Abaya), language (Sidaamu Afoo), coffee economy, and public institutions.',
    'If the question asks about something not explicitly in the text, answer accurately and politely based on verified knowledge of Sidama and Ethiopia.',
  ].join(' ')

  const contents = [{ role: 'user', parts: [{ text: prompt }] }]
  const generationConfig = {
    temperature: 0.2,
    maxOutputTokens: 700,
  }

  async function callModel(tools = null) {
    const payload = {
      systemInstruction: { parts: [{ text: systemText }] },
      contents,
      generationConfig,
    }
    if (tools) {
      payload.tools = tools
    }

    return fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey,
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(tools ? 6000 : 15000),
      },
    )
  }

  const useSearchGrounding = process.env.GEMINI_SEARCH_GROUNDING === 'true' && now >= searchGroundingUnavailableUntil

  let modelResponse

  try {
    if (useSearchGrounding) {
      try {
        modelResponse = await callModel([{ googleSearch: {} }])
        if (!modelResponse.ok) {
          searchGroundingUnavailableUntil = Date.now() + 60 * 60 * 1000
          modelResponse = await callModel(null)
        }
      } catch {
        searchGroundingUnavailableUntil = Date.now() + 60 * 60 * 1000
        modelResponse = await callModel(null)
      }
    } else {
      modelResponse = await callModel(null)
    }

    if (modelResponse.status === 503) {
      await new Promise((resolve) => setTimeout(resolve, 500))
      modelResponse = await callModel(null)
    }
  } catch (err) {
    console.warn('[AI Assistant] Connection error calling Gemini; serving regional knowledge synthesis.', err?.message || err)
    const fallback = getRegionalKnowledgeAnswer(question, language)
    return json({ answer: fallback.answer, sources: fallback.sources, searchUrl: searchUrl.href })
  }

  if (!modelResponse.ok) {
    console.warn(`[AI Assistant] Gemini returned HTTP ${modelResponse.status}; serving regional knowledge synthesis.`)
    const fallback = getRegionalKnowledgeAnswer(question, language)
    return json({ answer: fallback.answer, sources: fallback.sources, searchUrl: searchUrl.href })
  }

  let modelData
  try {
    modelData = await modelResponse.json()
  } catch {
    const fallback = getRegionalKnowledgeAnswer(question, language)
    return json({ answer: fallback.answer, sources: fallback.sources, searchUrl: searchUrl.href })
  }

  const candidate = modelData.candidates?.[0]
  const answer = candidate?.content?.parts
    ?.map((part) => part.text || '')
    .join('')
  if (typeof answer !== 'string' || !answer.trim()) {
    const fallback = getRegionalKnowledgeAnswer(question, language)
    return json({ answer: fallback.answer, sources: fallback.sources, searchUrl: searchUrl.href })
  }

  const chunks = candidate.groundingMetadata?.groundingChunks || []
  const seenUrls = new Set()
  const sources = chunks.flatMap((chunk) => {
    const { uri, title } = chunk.web || {}
    if (typeof uri !== 'string' || typeof title !== 'string') return []
    try {
      const url = new URL(uri)
      if ((url.protocol !== 'https:' && url.protocol !== 'http:') || seenUrls.has(url.href)) return []
      seenUrls.add(url.href)
      return [{ title, url: url.href, snippet: '' }]
    } catch {
      return []
    }
  }).slice(0, 5)

  if (sources.length === 0) {
    const fallback = getRegionalKnowledgeAnswer(question, language)
    sources.push(...fallback.sources)
  }

  return json({ answer: answer.trim(), sources, searchUrl: searchUrl.href })
}

async function handleContact(body) {
  const { name, email, subject, message } = body ?? {}
  const fields = [name, email, subject, message]
  if (fields.some((value) => typeof value !== 'string')) {
    return json({ error: 'Name, email, subject, and message are required.' }, 400)
  }

  const values = fields.map((value) => value.trim())
  const [cleanName, cleanEmail, cleanSubject, cleanMessage] = values
  if (
    !cleanName || cleanName.length > 120 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail) || cleanEmail.length > 254 ||
    !cleanSubject || cleanSubject.length > 180 ||
    cleanMessage.length < 10 || cleanMessage.length > 3000
  ) {
    return json({ error: 'Please provide valid contact details and a message between 10 and 3000 characters.' }, 400)
  }

  await initializeDatabase()
  const { rows } = await getPool().query(
    `INSERT INTO contact_messages (name, email, subject, message)
     VALUES ($1, $2, $3, $4)
     RETURNING id, created_at`,
    values,
  )
  return json({ message: 'Your message has been received.', id: rows[0].id }, 201)
}

export async function POST(request, context) {
  try {
    const { segments = [] } = await context.params
    const [resource] = segments
    const parsed = await readJson(request)
    if (parsed.error) return parsed.error

    if (resource === 'chat') return await handleChat(request, parsed.data)
    if (resource === 'contact') return await handleContact(parsed.data)
    return json({ error: 'Not found' }, 404)
  } catch (error) {
    return handleError(error)
  }
}
