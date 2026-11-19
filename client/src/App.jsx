'use client'

import { createContext, useCallback, useContext, useEffect, useRef, useState, useSyncExternalStore } from 'react'
import NextLink from 'next/link'
import { usePathname } from 'next/navigation'

const API_URL = '/api'
const LanguageContext = createContext({ language: 'en', setLanguage: () => {} })
const languageNames = { en: 'English', am: 'አማርኛ', sid: 'Sidaamu Afoo' }

function getStoredLanguage() {
  const savedLanguage = window.localStorage.getItem('sidama-language')
  return Object.hasOwn(languageNames, savedLanguage) ? savedLanguage : 'en'
}

function subscribeToLanguageChanges(callback) {
  window.addEventListener('sidama-language-change', callback)
  return () => window.removeEventListener('sidama-language-change', callback)
}

function useStoredLanguage() {
  const language = useSyncExternalStore(subscribeToLanguageChanges, getStoredLanguage, () => 'en')
  const setLanguage = useCallback((nextLanguage) => {
    window.localStorage.setItem('sidama-language', nextLanguage)
    window.dispatchEvent(new Event('sidama-language-change'))
  }, [])
  return [language, setLanguage]
}

function Link({ to, ...props }) {
  return <NextLink href={to} {...props} />
}

function NavLink({ to, end = false, ...props }) {
  const pathname = usePathname()
  const isActive = pathname === to || (!end && to !== '/' && pathname.startsWith(`${to}/`))
  const className = [props.className, isActive && 'active'].filter(Boolean).join(' ')
  return <Link to={to} {...props} className={className} aria-current={isActive ? 'page' : undefined} />
}

const translations = {
  am: {
    'Home': 'መነሻ', 'About Sidama': 'ስለ ሲዳማ', 'Culture & Heritage': 'ባህልና ቅርስ', 'Tourism': 'ቱሪዝም', 'Economy & Coffee': 'ኢኮኖሚና ቡና',
    'Language': 'ቋንቋ', 'Government': 'መንግሥት', 'Health & Wellbeing': 'ጤናና ደህንነት', 'Education': 'ትምህርት', 'Environment': 'አካባቢ',
    'Transport': 'ትራንስፖርት', 'Public Services': 'የሕዝብ አገልግሎቶች', 'Services': 'አገልግሎቶች', 'Investment': 'ኢንቨስትመንት', 'News & Updates': 'ዜናና ዝማኔዎች',
    'News': 'ዜና', 'Documents': 'ሰነዶች', 'More': 'ተጨማሪ', 'Contact us': 'ያግኙን', 'Official website of the Sidama Regional State': 'የሲዳማ ክልል መንግሥት ይፋዊ ድረ ገጽ',
    'Welcome to Sidama': 'ወደ ሲዳማ እንኳን በደህና መጡ', 'A region of': 'የተስፋና', 'promise & possibility.': 'የዕድል ክልል።',
    'Discover our people, culture, and shared vision for a thriving future in the heart of southern Ethiopia.': 'በደቡባዊ ኢትዮጵያ ልብ ውስጥ ስላሉት ሕዝቦቻችን፣ ባህላችንና ለብሩህ የጋራ የወደፊት ራዕያችን ይወቁ።',
    'Discover Sidama': 'ሲዳማን ይወቁ', 'Our government': 'መንግሥታችን', 'A home for heritage. A future for all.': 'የቅርስ ቤት። ለሁሉም የወደፊት ተስፋ።',
    'Our home': 'ቤታችን', 'Rooted in heritage.': 'በቅርስ የተመሠረተ።', 'Growing together.': 'አብረን እያደግን።',
    'Get to know Sidama': 'ሲዳማን ይበልጥ ይወቁ', 'regional state, many communities': 'ክልል፣ ብዙ ማኅበረሰቦች', 'Here to help': 'ለመርዳት ዝግጁ',
    'Services for every community': 'ለሁሉም ማኅበረሰብ አገልግሎቶች', 'Explore information and support from regional institutions.': 'ከክልላዊ ተቋማት መረጃና ድጋፍ ያግኙ።',
    'View all services': 'ሁሉንም አገልግሎቶች ይመልከቱ', 'From the region': 'ከክልሉ', 'Stories, announcements, and the latest from across Sidama.': 'ከሲዳማ የሚመጡ ታሪኮች፣ ማስታወቂያዎችና የቅርብ መረጃዎች።',
    'All news': 'ሁሉም ዜናዎች', 'Your next chapter': 'ቀጣዩ ምዕራፍዎ', 'Find your opportunity': 'ዕድልዎን ያግኙ', 'in Sidama.': 'በሲዳማ።',
    'Explore investment': 'የኢንቨስትመንት ዕድሎችን ይወቁ', 'Explore': 'ይወቁ', 'Information': 'መረጃ', 'Get in touch': 'ያግኙን',
    'About the region': 'ስለ ክልሉ', 'Economy & livelihoods': 'ኢኮኖሚና ኑሮ', 'Environment & health': 'አካባቢና ጤና',
    'Invest in Sidama': 'በሲዳማ ኢንቨስት ያድርጉ', 'Documents & resources': 'ሰነዶችና ምንጮች', 'Contact the regional administration': 'የክልሉን አስተዳደር ያግኙ',
    'Southern Ethiopia': 'ደቡባዊ ኢትዮጵያ', 'Want to learn more or get in touch?': 'ተጨማሪ ለማወቅ ወይም ለማግኘት ይፈልጋሉ?',
    'We’re here to help': 'ለመርዳት ዝግጁ ነን', 'Let’s talk.': 'እንነጋገር።', 'Contact information': 'የመገኛ መረጃ',
    'Visit us': 'ይጎብኙን', 'Public inquiries': 'የሕዝብ ጥያቄዎች', 'Your name': 'ስምዎ', 'Email address': 'የኢሜይል አድራሻ',
    'Subject': 'ርዕስ', 'Your message': 'መልዕክትዎ', 'Send message': 'መልዕክት ይላኩ', 'Sending…': 'በመላክ ላይ…',
    'Thank you. Your message has been received.': 'እናመሰግናለን። መልዕክትዎ ደርሶናል።', 'Back to news': 'ወደ ዜናዎች ይመለሱ',
    'Read story': 'ታሪኩን ያንብቡ', 'Loading story…': 'ታሪኩ በመጫን ላይ…', 'Page not found': 'ገጹ አልተገኘም',
    'Our region': 'ክልላችን', 'A place to belong.': 'የእኛ መገኛ።', 'Public leadership': 'የሕዝብ አመራር',
    'Government & institutions.': 'መንግሥትና ተቋማት።', 'Livelihoods & trade': 'ኑሮና ንግድ', 'An economy rooted in the land.': 'በመሬት ላይ የተመሠረተ ኢኮኖሚ።',
    'Identity & heritage': 'ማንነትና ቅርስ', 'Culture carried forward.': 'ባህልን ወደፊት ማስቀጠል።',
    'Learning & opportunity': 'ትምህርትና ዕድል', 'Education for every generation.': 'ለሁሉም ትውልድ ትምህርት።',
    'Land, water & wellbeing': 'መሬት፣ ውሃና ደህንነት', 'A healthy environment matters.': 'ጤናማ አካባቢ ወሳኝ ነው።',
    'A journey worth taking.': 'ሊደረግ የሚገባው ጉዞ።', 'Health & Public Care': 'ጤናና የሕዝብ እንክብካቤ',
    'Dedicated to health and vitality.': 'ለጤናና ለሕዝብ ደህንነት የተተጋ።', 'Sidaamu Afoo Language': 'ሲዳሙ አፎ ቋንቋ',
    'The living voice of our heritage.': 'የቅርሳችን ሕያው ድምፅ።',
    'Getting around': 'መጓጓዣ', 'Transport & connections.': 'ትራንስፖርትና ግንኙነቶች።',
    'Resources': 'ምንጮች', 'Documents & publications.': 'ሰነዶችና ህትመቶች።',
    'Sidaamu Afoo': 'ሲዳሙ አፎ', 'Fichee–Chambalaalla, the Sidama New Year': 'ፊቼ–ጫምባላላ፣ የሲዳማ አዲስ ዓመት',
    'UNESCO recognition': 'የዩኔስኮ እውቅና', 'Sidama coffee': 'የሲዳማ ቡና', 'Public services.': 'የሕዝብ አገልግሎቶች።',
    'Close menu': 'ምናሌውን ዝጋ', 'Open menu': 'ምናሌውን ክፈት',
    'Official Sidama Regional State AI Assistant': 'የሲዳማ ክልል መንግሥት ይፋዊ የኤ አይ ረዳት',
    'Searches the web and links to sources. Verify current or official information.': 'ድረ ገጾችን ይፈልጋል፤ ምንጮችን ያጋራል። ወቅታዊ መረጃዎችን ያረጋግጡ።',
    'Hello! Ask me about Sidama. I search the web and share sources in English, Amharic, or Sidaamu Afoo.': 'ሰላም! ስለ ሲዳማ ይጠይቁኝ። መረጃዎችን በእንግሊዝኛ፣ በአማርኛ ወይም በሲዳሙ አፎ አጋራለሁ።',
    'Ask about Sidama...': 'ስለ ሲዳማ ይጠይቁ...', 'Preparing an answer…': 'ምላሽ በማዘጋጀት ላይ…', 'Check linked sources.': 'የተያያዙ ምንጮችን ያረጋግጡ።',
    'Search the web for this question': 'ስለዚህ ጥያቄ ድረ ገጽ ይፈልጉ', 'Open Google Search results in a new tab.': 'የጉግል ፍለጋ ውጤቶችን በአዲስ ትር ይክፈቱ።',
    'Where is Sidama?': 'ሲዳማ የት ይገኛል?', 'What is Fichee–Chambalaalla?': 'ፊቼ–ጫምባላላ ምንድን ነው?', 'What is Luwa?': 'ሉዋ ምንድን ነው?',
    'Cannot reach the API server. Start the server and try again.': 'የኤ ፒ አይ ሰርቨሩ አልደረሰም። ሰርቨሩን አስጀምረው እንደገና ይሞክሩ።',
    'Some content may still be shown in English.': 'አንዳንድ ይዘቶች አሁንም በእንግሊዝኛ ሊታዩ ይችላሉ።',
    'Skip to content': 'ወደ ይዘቱ ይሂዱ', 'Main navigation': 'ዋና ማውጫ', 'Select language': 'ቋንቋ ይምረጡ',
    'Ask Sidama': 'ስለ ሲዳማ ይጠይቁ', 'Close chat': 'ውይይቱን ዝጋ', 'Suggested questions': 'የተጠቆሙ ጥያቄዎች',
    'Administrative divisions': 'አስተዳደራዊ ክፍፍሎች', 'Districts (woredas)': 'ወረዳዎች', 'Towns': 'ከተሞች',
    'Sub-cities': 'ክፍለ ከተሞች', 'Zone-level city': 'በዞን ደረጃ ያለች ከተማ',
    'Districts by Population': 'ወረዳዎች በሕዝብ ብዛት', 'District': 'ወረዳ', '2007 census': 'የ2007 ቆጠራ', '2022 projection': 'የ2022 ግምት',
    'English': 'እንግሊዝኛ', 'Context / Meaning': 'አውድ / ትርጉም',
    'Everyday Vocabulary & Phrases': 'የዕለት ተዕለት ቃላትና አባባሎች',
    'Core phrases and expressions in Sidaamu Afoo for greeting and daily conversation.': 'በሲዳሙ አፎ ለሰላምታና ለዕለት ውይይት የሚያገለግሉ ቁልፍ አባባሎች።',
    'Numerals in Sidaamu Afoo': 'የሲዳሙ አፎ ቁጥሮች',
    'Count from 1 to 10 in Sidaamu Afoo.': 'በሲዳሙ አፎ ከ1 እስከ 10 ይቁጠሩ።',
    'Number': 'ቁጥር', 'Digit': 'አሃዝ',
    'The Great 5 Adventures of Sidama': 'የሲዳማ ታላላቅ 5 ጉዞዎች',
    'The Great Adventures of Sidama': 'የሲዳማ ታላላቅ ጉዞዎች',
    'Highest Peak in Sidama': 'የሲዳማ ከፍተኛው ተራራ',
    'River & Canyon Expedition': 'የወንዝ እና ገደላማ ሸለቆ ጉዞ',
    'Mount Garamba Alpine Trek (Arbegona)': 'የጋራምባ ተራራ የእግር ጉዞ (አርበጎና)',
    'Genale River Canyon & Rapids (Aroresa & Bensa)': 'የገናሌ ወንዝ ሸለቆና ፈጣን ፍሰት (አሮሬሳና ቤንሳ)',
    'Mount Garamba: alpine roof of Sidama (Arbegona)': 'ጋራምባ ተራራ፡ የሲዳማ ደጋማ ጣሪያ (አርበጎና)',
    'Genale River canyon & gorges (Aroresa & Bensa)': 'የገናሌ ወንዝ ሸለቆና ገደሎች (አሮሬሳና ቤንሳ)',
    'Geography: from Rift Valley to Mount Garamba': 'መልክዓ-ምድር፡ ከስምጥ ሸለቆ እስከ ጋራምባ ተራራ',
    'Unforgettable regional wonders from Rift Valley lakes to cloud coffee peaks.': 'ከስምጥ ሸለቆ ሐይቆች እስከ ደመናማ የቡና ተራሮች ድረስ የማይረሱ ድንቆች።',
    'Explore all adventures': 'ሁሉንም ጉዞዎች ይመልከቱ',
    'Elevation': 'ከፍታ', 'Distance': 'ርቀት', 'Best Season': 'ተስማሚ ወቅት',
    'Explore adventure': 'ጉዞውን ይጀምሩ',
    'People of the Land: Living Stories': 'የምድሪቱ ሕዝቦች፡ ሕያው ታሪኮች',
    'Authentic voices from the elders, astronomers, coffee growers, and stewards of Sidama.': 'ከሲዳማ ሽማግሌዎች፣ የሰለስቲያል ተመልካቾች፣ የቡና አብቃዮችና ጠባቂዎች የተገኙ እውነተኛ ታሪኮች።',
    'Travel with Halaale: Ethical Visitor Charter': 'በሃላሌ ይጓዙ፡ የጎብኚዎች የስነ-ምግባር ቃል ኪዳን',
    'Honor the sacred heritage, protect ancient forests, and tread lightly with respect.': 'ቅዱስ ቅርሶችን ያክብሩ፣ ጥንታዊ ደኖችን ይጠብቁ፣ በአክብሮትና በሰላም ይጓዙ።',
    'Curated Regional Itineraries': 'የተመረጡ ክልላዊ የጉዞ እቅዶች',
    'Handcrafted travel routes to experience the best of Sidama culture, wildlife, and coffee.': 'የሲዳማን ባህል፣ የዱር አራዊትና ቡና በተሻለ ሁኔታ ለመለማመድ የተዘጋጁ የጉዞ መርሃ-ግብሮች።',
  },
  sid: {
    'Home': 'Mino', 'About Sidama': 'Sidama Qoqqowo', 'Culture & Heritage': 'Aadaa nna Kaima', 'Tourism': 'Turizime', 'Economy & Coffee': 'Ekonomi nna Buna',
    'Language': 'Afii', 'Government': 'Govermentete', 'Health & Wellbeing': 'Fayya nna Danchomma', 'Education': 'Barsiisamme', 'Environment': 'Qilleensa',
    'Transport': 'Gaamo', 'Public Services': 'Hawalle Ooshshe', 'Services': 'Ooshshe', 'Investment': 'Investimenti', 'News & Updates': 'Hawalle nna Haaroo',
    'News': 'Hawalle', 'Documents': 'Boroote', 'More': 'Leddo', 'Contact us': 'Toshshe', 'Official website of the Sidama Regional State': 'Sidama Qoqqowo Mootimma Awaajju Woyite',
    'Welcome to Sidama': 'Sidama woyite keeshshite', 'A region of': 'Hagiro Qoqqowo', 'promise & possibility.': 'Ammanne dandiinote.',
    'Discover our people, culture, and shared vision for a thriving future in the heart of southern Ethiopia.': 'Kaima, aadaa nna garaanchu kaima leellishanno gede, Dihhi Ethiopia giddo Sidama kaima xaado assine beettanno.',
    'Discover Sidama': 'Sidama leellishshe', 'Our government': 'Mootimma', 'A home for heritage. A future for all.': 'Aadaa mine. Baalunku kaima.',
    'Our home': 'Kaima mine', 'Rooted in heritage.': 'Aadaa giddo xaphoosine.', 'Growing together.': 'Xaphoosine dichoommo.',
    'Get to know Sidama': 'Sidama leellishshe', 'regional state, many communities': 'Qoqqowo, danchu xaadooshshe', 'Here to help': 'Kaa’looshsho',
    'Services for every community': 'Baalunku xaadooshshe ooshshe', 'Explore information and support from regional institutions.': 'Qoqqowo xaadooshshu gummeete giddo xawishsha nna kaa’lo leellishshe.',
    'View all services': 'Baalunku ooshshe leellishshe', 'From the region': 'Qoqqowote', 'Stories, announcements, and the latest from across Sidama.': 'Sidama giddo gara, awaajju nna haaroo xawishsha.',
    'All news': 'Baalunku hawalle', 'Your next chapter': 'Wolu gara', 'Find your opportunity': 'Dandiino hakkino', 'in Sidama.': 'Sidama giddo.',
    'Explore investment': 'Investimenti leellishshe', 'Explore': 'Leellishshe', 'Information': 'Xawishsha', 'Get in touch': 'Toshshe',
    'About the region': 'Qoqqowo garinni', 'Economy & livelihoods': 'Ekonomi nna jira', 'Environment & health': 'Qilleensa nna fayya',
    'Invest in Sidama': 'Sidama giddo investimenti assi', 'Documents & resources': 'Boroote nna gummeete', 'Contact the regional administration': 'Qoqqowo mootimma toshthe',
    'Southern Ethiopia': 'Dihhi Ethiopia', 'Want to learn more or get in touch?': 'Leddo leellishate woy toshate hasiissanno?',
    'We’re here to help': 'Kaa’looshsho', 'Let’s talk.': 'Hasaawino.', 'Contact information': 'Toshshe xawishsha',
    'Visit us': 'Woyite', 'Public inquiries': 'Hawalle hasaawa', 'Your name': 'Sunku', 'Email address': 'Emailte adresi',
    'Subject': 'Hasiishsha', 'Your message': 'Kaaima', 'Send message': 'Kaaima soyi', 'Sending…': 'Soyaanni…',
    'Thank you. Your message has been received.': 'Galatoommo. Kaaimasi ikkito.', 'Back to news': 'Hawallete widira',
    'Read story': 'Gara nabbawi', 'Loading story…': 'Gara laadanni…', 'Page not found': 'Qoola dihino',
    'Our region': 'Qoqqowo mine', 'A place to belong.': 'Kaima mine.', 'Identity & heritage': 'Ama nna aadaa',
    'Culture carried forward.': 'Aadaa haaroo.', 'Learning & opportunity': 'Barsiisamme nna dandiino',
    'Education for every generation.': 'Baalunku ilatera barsiisamme.', 'Land, water & wellbeing': 'Umo, wo’a nna fayya',
    'A healthy environment matters.': 'Danchu qilleensi hasiisannoha.', 'A journey worth taking.': 'Dancha ha’rooshsho.',
    'Health & Public Care': 'Fayya nna Hawalle Kaa’lo', 'Dedicated to health and vitality.': 'Fayya nna danchoommate shiqino.',
    'Sidaamu Afoo Language': 'Sidaamu Afoo Afii', 'The living voice of our heritage.': 'Aadaanke lubboote qaaleeti.',
    'Getting around': 'Ha’rooshsho', 'Transport & connections.': 'Gaamo nna xaadooshshe.',
    'Resources': 'Gummeete', 'Documents & publications.': 'Boroote nna bukkoota.',
    'Sidaamu Afoo': 'Sidaamu Afoo', 'Fichee–Chambalaalla, the Sidama New Year': 'Fichee–Chambalaalla, Sidamu Haaroo Dira',
    'UNESCO recognition': 'UNESCO leellishsha', 'Sidama coffee': 'Sidama Buna', 'Public services.': 'Hawalle ooshshe.',
    'Close menu': 'Menu cufi', 'Open menu': 'Menu fani',
    'Official Sidama Regional State AI Assistant': 'Sidama Qoqqowo Mootimma Awaajju AI Kaa’looshsho',
    'Searches the web and links to sources. Verify current or official information.': 'Webete giddo hasaawa, gummeete xaadisha. Haaroo woy awaajju xawishsha buuxi.',
    'Hello! Ask me about Sidama. I search the web and share sources in English, Amharic, or Sidaamu Afoo.': 'Keessho! Sidama garinni hasaawi. Webete giddo English, Amharic woy Sidaamu Afoo giddo hasaawa nna gummeete leellisha.',
    'Ask about Sidama...': 'Sidama garinni hasaawi...', 'Preparing an answer…': 'Daafira qixxeessanni…',
    'Check linked sources.': 'Xaaddino gummeete leellishshe.', 'Search the web for this question': 'Tini hasaawira webete giddo hasaawi',
    'Open Google Search results in a new tab.': 'Google hasaawu gumma haaroo taabete giddo fani.',
    'Where is Sidama?': 'Sidama hakkoonni?', 'What is Fichee–Chambalaalla?': 'Fichee–Chambalaalla maati?', 'What is Luwa?': 'Luwa maati?',
    'Cannot reach the API server. Start the server and try again.': 'API servera geeshsha didandiino. Servera kaimi nna qolte qorophisi.',
    'Some content may still be shown in English.': 'Mitte xawishsha English giddo leellishanno.',
    'Skip to content': 'Toso giddo worba', 'Main navigation': 'Gobbaanni qineessamme', 'Select language': 'Afii doori',
    'Ask Sidama': 'Sidama garinni hasaawi', 'Close chat': 'Hasaawa cufi', 'Suggested questions': 'Hassantino hasaawishsha',
    'Administrative divisions': 'Qoqqowote beeha', 'Districts (woredas)': 'Woradda', 'Towns': 'Katamubba',
    'Sub-cities': 'Kifile Katama', 'Zone-level city': 'Zoonete garinni katama',
    'Districts by Population': 'Woradda Manna Kiiro', 'District': 'Woradda', '2007 census': '2007 Kiiro', '2022 projection': '2022 Hedeweelo',
    'English': 'Ingilizete', 'Context / Meaning': 'Tircho / Gara',
    'Everyday Vocabulary & Phrases': 'Barru Qoolla nna Hasaawa',
    'Core phrases and expressions in Sidaamu Afoo for greeting and daily conversation.': 'Sidaamu Afooti keere leellishanno nna barru hasaawira kaa’lanno qaalla.',
    'Numerals in Sidaamu Afoo': 'Sidaamu Afooti Kiiro',
    'Count from 1 to 10 in Sidaamu Afoo.': 'Sidaamu Afoo garinni 1 geeshsha 10 kiiri.',
    'Number': 'Kiiro', 'Digit': 'Kiiro Malaate',
    'The Great 5 Adventures of Sidama': 'Sidamu 5 Gedaano Ha’rooshsho',
    'The Great Adventures of Sidama': 'Sidamu Gedaano Ha’rooshsho',
    'Highest Peak in Sidama': 'Sidamu Roore Ilata',
    'River & Canyon Expedition': 'Wo’u nna Giwa Ha’rooshsho',
    'Mount Garamba Alpine Trek (Arbegona)': 'Garamba Ilata Ha’rooshsho (Arbegona)',
    'Genale River Canyon & Rapids (Aroresa & Bensa)': 'Genale Wo’a Gari Darga (Aroresa nna Bensa)',
    'Mount Garamba: alpine roof of Sidama (Arbegona)': 'Garamba Ilata: Sidamu Roore Ilata (Arbegona)',
    'Genale River canyon & gorges (Aroresa & Bensa)': 'Genale Wo’a Gari Darga (Aroresa nna Bensa)',
    'Geography: from Rift Valley to Mount Garamba': 'Umu gara: Rift Valley ka’e Garamba Ilata geeshsha',
    'Unforgettable regional wonders from Rift Valley lakes to cloud coffee peaks.': 'Rift Valley baaleeti ka’e buna dandiino ilatanna woyite.',
    'Explore all adventures': 'Baalunku ha’rooshsho leellishshe',
    'Elevation': 'Keeraancho', 'Distance': 'Xeertinye', 'Best Season': 'Dancha Woyite',
    'Explore adventure': 'Ha’rooshsho kaimi',
    'People of the Land: Living Stories': 'Umu Daga: Lubboote Gara',
    'Authentic voices from the elders, astronomers, coffee growers, and stewards of Sidama.': 'Cimeeyye, Ayyaanto, buna laalannori nna agarsiisanno manni gara.',
    'Travel with Halaale: Ethical Visitor Charter': 'Halaalunni Ha’re: Daanno Manni Seera',
    'Honor the sacred heritage, protect ancient forests, and tread lightly with respect.': 'Qullaawa kaima ayirrisi, durru mukka agari, nna ayirrinyeenni ha’ri.',
    'Curated Regional Itineraries': 'Doono Ha’rooshshu Qineessamme',
    'Handcrafted travel routes to experience the best of Sidama culture, wildlife, and coffee.': 'Sidamu aadaa, saada nna buna danchunni leellishate qixxaawino ha’rooshshu gara.',
  },
}

function useLanguage() {
  const { language, setLanguage } = useContext(LanguageContext)
  const t = (text) => translations[language]?.[text] || text
  return { language, setLanguage, t }
}

const primaryNavigation = [
  { label: 'Home', to: '/' },
  { label: 'About Sidama', to: '/about' },
  { label: 'Culture & Heritage', to: '/culture' },
  { label: 'Tourism', to: '/tourism' },
  { label: 'Economy & Coffee', to: '/economy' },
  { label: 'Language', to: '/language' },
]

const moreNavigation = [
  { label: 'Government', to: '/government' },
  { label: 'Health & Wellbeing', to: '/health' },
  { label: 'Education', to: '/education' },
  { label: 'Environment', to: '/environment' },
  { label: 'Transport', to: '/transport' },
  { label: 'Public Services', to: '/services' },
  { label: 'Investment', to: '/investment' },
  { label: 'News & Updates', to: '/news' },
  { label: 'Documents', to: '/documents' },
]

// Utah-inspired Great 5 Adventures Showcase
const greatAdventures = [
  {
    id: 'hawassa',
    badge: 'Lakeside & Wildlife',
    elevation: '1,708 m',
    title: 'Lake Hawassa & The Fisherman’s Shore',
    description: 'Boat safaris alongside pods of hippos, vibrant morning tilapia catches at Amora Gedel, and thousands of great white pelicans framing shimmering golden sunsets.',
    distance: 'Hawassa City Center',
    season: 'Year-Round',
    image: '/lake-hawassa.jpg',
    link: '/tourism',
  },
  {
    id: 'wondo-genet',
    badge: 'Wellness & Rainforest',
    elevation: '1,850 m',
    title: 'Wondo Genet Geothermal Springs',
    description: 'Natural therapeutic hot springs, mineral swimming pools, colobus monkeys leaping overhead, and hiking through Ethiopia’s premier historic forestry arboretum.',
    distance: '35 km from Hawassa',
    season: 'Oct – May',
    image: '/wondo-genet.jpg',
    link: '/tourism',
  },
  {
    id: 'logita',
    badge: 'Highland Adventure',
    elevation: '2,400 m',
    title: 'Logita & Bonora Waterfall Gorges',
    description: 'Torrential roaring cascades cutting through virgin green highland gorges in Bensa, surrounded by mist-drenched cloud forests and dramatic basalt amphitheaters.',
    distance: '120 km (Bensa District)',
    season: 'Nov – March',
    image: '/logita-falls.jpg',
    link: '/tourism',
  },
  {
    id: 'loka-abaya',
    badge: 'Wild Rift Valley',
    elevation: '1,175 m',
    title: 'Loka Abaya National Park Sanctuary',
    description: '500 square kilometers of untamed acacia savannah, riverine wetlands bordering Lake Abaya, home to bushbucks, warthogs, and rare migratory waterbirds.',
    distance: '70 km from Hawassa',
    season: 'Oct – April',
    image: '/loka-abaya.jpg',
    link: '/tourism',
  },
  {
    id: 'garamba',
    badge: 'Highest Peak in Sidama',
    elevation: '3,368 m',
    title: 'Mount Garamba Alpine Trek (Arbegona)',
    description: 'The "Water Tower of Sidama" and highest summit. Trek through afro-alpine moorlands, giant lobelias, and highland bamboo forests with 360-degree vistas stretching toward the Bale Mountains.',
    distance: 'Arbegona Woreda',
    season: 'Oct – March',
    image: '/garamba-mountain.jpg',
    link: '/tourism',
  },
  {
    id: 'genale-river',
    badge: 'River & Canyon Expedition',
    elevation: '1,450 m',
    title: 'Genale River Canyon & Rapids (Aroresa & Bensa)',
    description: 'A mighty river carving sheer volcanic basalt canyons through eastern Sidama. Fed by roaring tributaries like Logita Falls, offering pristine whitewater, canyon trekking, and untouched riparian biodiversity.',
    distance: 'Aroresa & Bensa Woredas',
    season: 'Nov – May',
    image: '/genale-river.jpg',
    link: '/tourism',
  },
  {
    id: 'bensa-coffee',
    badge: 'Agro-Tourism Heritage',
    elevation: '2,200 – 2,800 m',
    title: 'Bensa & Arbegona Cloud Coffee Trail',
    description: 'The birthplace of Cup of Excellence champion micro-lots. Trek through family agroforests, witness raised drying beds, and participate in authentic coffee ceremonies.',
    distance: 'Sidama Highlands',
    season: 'Nov – Feb (Harvest)',
    image: '/sidama-coffee-landscape.png',
    link: '/economy',
  },
]

// Hawaii-inspired Community Storytelling
const communityStories = [
  {
    id: 'ayyaanto',
    role: 'Living Celestial Heritage',
    title: 'The Sky Watchers: Reading the Stars of Fichee',
    excerpt: 'For centuries, traditional astronomers known as Ayyaanto have guided Sidama society by reading the alignment of the moon, stars, and seasonal constellations to proclaim the exact date of Fichee–Chambalaalla.',
    quote: '“Halaale and the celestial order teach us that nature, cosmos, and community must always beat in unison.”',
    image: '/ayyaanto-astronomy.jpg',
  },
  {
    id: 'coffee-farmers',
    role: 'Specialty Coffee Masters',
    title: 'The Shade Garden Alchemists of Bensa',
    excerpt: 'In misty mountain gardens situated at 2,200 meters, multi-generational Sidama farming families hand-pick only ruby-ripe cherries, nurturing heirloom trees beneath ancient canopies.',
    quote: '“Every coffee bean carries our family’s honor, the red volcanic soil, and the breath of the high mountains.”',
    image: '/sidama-coffee-harvest.png',
  },
  {
    id: 'wesse-mothers',
    role: 'Agrarian Food Sovereignty',
    title: 'Wesse: The Living Tree Against Hunger',
    excerpt: 'Fermenting the pulp of false banana into nourishing Waasa and festive Buurisame, Sidama mothers have preserved food security, soil moisture, and hospitality through generations.',
    quote: '“Where Enset stands, drought and hunger find no doorway into our homes.”',
    image: '/fichee-chambalaalla.png',
  },
]

// Hawaii-inspired Ethical Visitor Code (Travel with Halaale)
const visitorCharterItems = [
  {
    title: 'Honor Sacred Grounds',
    text: 'Walk reverently on open-air Gudumaale ceremonial grounds, seeking permission from community elders and respecting sacred celebrations.',
  },
  {
    title: 'Protect Indigenous Canopies',
    text: 'Sidama customary law (Seera) strictly forbids cutting Podocarpus (Zigba) and Cordia (Wanza) trees. Tread lightly on forest and wetland trails.',
  },
  {
    title: 'Support Local Cooperatives',
    text: 'Purchase roasted coffee, handwoven textiles, and pottery directly from primary cooperative unions and village artisans to enrich local families.',
  },
  {
    title: 'Embrace Peace (Keere)',
    text: 'The traditional coffee ceremony is an invitation of peaceful fellowship. Receive every cup with two hands, warmth, and gratitude.',
  },
]

// Flanders/Wallonia-inspired Curated Itineraries
const curatedItineraries = [
  {
    duration: '1-Day Express',
    title: 'Hawassa Lakeside & Cultural Highlights',
    description: 'Perfect for weekend visitors wanting to capture the spirit and scenery of the regional capital.',
    stops: [
      'Early Morning: Amora Gedel Fish Market & Great White Pelicans',
      'Mid-Day: Scenic Boat Safari on Lake Hawassa with Hippo Viewing',
      'Afternoon: Hike Mount Tabor for 360-degree Rift Valley views',
      'Evening: Traditional Sidama Cultural Dinner & Coffee Ceremony',
    ],
  },
  {
    duration: '3-Day Circuit',
    title: 'Highlands, Hot Springs & Coffee Roots',
    description: 'A rejuvenating blend of thermal springs, cloud forest hiking, and agro-industrial exploration.',
    stops: [
      'Day 1: Hawassa Lakeside Explorations & Cultural Center',
      'Day 2: Wondo Genet Geothermal Springs, Thermal Pools & Birdwatching',
      'Day 3: Yirgalem Integrated Agro-Industrial Park & Dale Coffee Farms',
    ],
  },
  {
    duration: '7-Day Grand Tour',
    title: 'Complete Sidama Wilderness & Heritage Immersion',
    description: 'The ultimate expedition across lakes, canyons, Cup of Excellence coffee trails, and savannahs.',
    stops: [
      'Days 1–2: Hawassa & Wondo Genet Hot Springs Exploration',
      'Days 3–4: Bensa Highlands & Roaring Logita Waterfall Trekking',
      'Day 5: Arbegona Cloud Coffee Gardens & Cooperative Washing Stations',
      'Day 6: Loka Abaya National Park Safari & Lake Abaya Wetlands',
      'Day 7: Return to Hawassa for Artisan Craft Markets & Departure',
    ],
  },
]

const localServices = [
  { id: '1', name: 'Specialty Coffee Export Certification', description: 'Facilitating origin certificates, laboratory cupping scores, and export compliance for cooperative unions and private washing stations in Sidama.', category: 'Coffee & Trade' },
  { id: '2', name: 'Business & Investment Licensing', description: 'One-stop regional support for agricultural processing, commercial farming, light manufacturing, and tourism hospitality permits.', category: 'Investment' },
  { id: '3', name: 'Cultural Tourism & Trekking Permits', description: 'Guidance and permits for Lake Hawassa boat safaris, Logita Waterfall treks, Wondo Genet hot spring conservation, and community eco-lodges.', category: 'Tourism' },
  { id: '4', name: 'Public Health & Referral Guidance', description: 'Information on regional health centers, specialized care at Hawassa University Comprehensive Specialized Hospital, and rural health extension.', category: 'Health' },
]

const localNews = [
  { id: '1', title: 'Sidama Prepares for UNESCO-Inscribed Fichee–Chambalaalla Celebrations', category: 'Culture', published_at: '2026-03-01', summary: 'Traditional Ayyaanto astronomers prepare for the upcoming New Year date declaration as Hawassa readies the Gudumaale grounds for the national Qetala festivities.' },
  { id: '2', title: 'Sidama Coffee Micro-Lots Score Record Highs in Global Cupping Trials', category: 'Economy', published_at: '2026-02-14', summary: 'Single-origin washed and natural coffees from Bensa and Arbegona woredas achieve top international specialty grades, reinforcing Sidama’s prestige worldwide.' },
  { id: '3', title: 'Hawassa Industrial Park Expands Eco-Friendly Manufacturing and Local Youth Jobs', category: 'Development', published_at: '2026-01-28', summary: 'Regional bureaus and industrial partners celebrate new production lines and sustainable zero-liquid discharge milestones in southern Ethiopia.' },
]

function Icon({ name, size = 20 }) {
  const paths = {
    arrow: <><path d="M4 12h15" /><path d="m13 5 7 7-7 7" /></>,
    pin: <><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
    menu: <><path d="M4 7h16" /><path d="M4 12h16" /><path d="M4 17h16" /></>,
    close: <><path d="m18 6-12 12" /><path d="m6 6 12 12" /></>,
    chat: <><path d="M20 11.5a7.5 7.5 0 0 1-7.5 7.5H5l1.5-3A7.5 7.5 0 1 1 20 11.5Z" /><path d="M8 11h.01M12 11h.01M16 11h.01" /></>,
    send: <><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></>,
    leaf: <><path d="M20 4c-9 0-15 4-15 11a5 5 0 0 0 5 5c7 0 11-6 10-16Z" /><path d="M5 20c3-5 7-8 12-11" /></>,
    compass: <><circle cx="12" cy="12" r="10" /><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" /></>,
  }
  return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)
  const { language, setLanguage, t } = useLanguage()

  return <>
    <div className="utility-bar"><div className="container utility-inner"><span><Icon name="pin" size={15} /> Hawassa, Sidama, Ethiopia</span><span className="utility-right">{language !== 'en' && <span className="translation-note">{t('Some content may still be shown in English.')}</span>}{t('Official website of the Sidama Regional State')}</span></div></div>
    <header className="site-header"><div className="container header-inner">
      <Link className="brand" to="/" aria-label={t('Sidama Regional State home')}><span className="brand-mark"><Icon name="leaf" size={25} /></span><span className="brand-copy"><strong>SIDAMA</strong><small>REGIONAL STATE</small></span></Link>
      <button className="menu-toggle" type="button" onClick={() => setMenuOpen(!menuOpen)} aria-label={t(menuOpen ? 'Close menu' : 'Open menu')} aria-expanded={menuOpen} aria-controls="primary-navigation"><Icon name={menuOpen ? 'close' : 'menu'} /></button>
      <nav id="primary-navigation" className={`main-nav${menuOpen ? ' is-open' : ''}`} aria-label={t('Main navigation')} onClick={(event) => {
        if (event.target.closest('a')) {
          setMenuOpen(false)
          setMoreOpen(false)
        }
      }}>
        {primaryNavigation.map((item) => <NavLink key={item.to} to={item.to} end={item.to === '/'}>{t(item.label)}</NavLink>)}
        <div className={`nav-more${moreOpen ? ' is-open' : ''}`}>
          <button className="nav-more-toggle" type="button" aria-expanded={moreOpen} onClick={() => setMoreOpen(!moreOpen)}>{t('More')} <Icon name="arrow" size={14} /></button>
          {moreOpen && <div className="nav-more-menu">{moreNavigation.map((item) => <NavLink key={item.to} to={item.to}>{t(item.label)}</NavLink>)}</div>}
        </div>
        <label className="language-picker"><span className="sr-only">{t('Language')}</span><select value={language} onChange={(event) => setLanguage(event.target.value)} aria-label={t('Select language')}>{Object.entries(languageNames).map(([code, name]) => <option key={code} value={code}>{name}</option>)}</select></label>
        <Link className="nav-contact" to="/contact">{t('Contact us')} <Icon name="arrow" size={16} /></Link>
      </nav>
    </div></header>
  </>
}

function Footer() {
  const { t } = useLanguage()
  return <footer className="site-footer">
    <div className="container footer-main">
      <div className="footer-about"><Link className="brand footer-brand" to="/"><span className="brand-mark"><Icon name="leaf" size={25} /></span><span className="brand-copy"><strong>SIDAMA</strong><small>REGIONAL STATE</small></span></Link><p>{t('Serving our communities and building a bright, inclusive future for Sidama.')}</p></div>
      <div><h3>{t('Explore')}</h3><Link to="/about">{t('About Sidama')}</Link><Link to="/culture">{t('Culture & Heritage')}</Link><Link to="/tourism">{t('Tourism')}</Link><Link to="/economy">{t('Economy & Coffee')}</Link><Link to="/language">{t('Language')}</Link></div>
      <div><h3>{t('Information')}</h3><Link to="/government">{t('Government')}</Link><Link to="/health">{t('Health & Wellbeing')}</Link><Link to="/education">{t('Education')}</Link><Link to="/environment">{t('Environment')}</Link><Link to="/transport">{t('Transport')}</Link><Link to="/investment">{t('Investment')}</Link><Link to="/services">{t('Public Services')}</Link><Link to="/documents">{t('Documents')}</Link></div>
      <div><h3>{t('Get in touch')}</h3><p>Hawassa, Sidama Regional State<br />Ethiopia</p><Link to="/contact">{t('Contact the regional administration')} <Icon name="arrow" size={15} /></Link></div>
    </div>
    <div className="footer-bottom"><div className="container"><span>© Sidama Regional State. All rights reserved.</span><span>Heritage · Progress · Unity</span></div></div>
  </footer>
}

function useApi(path) {
  const [state, setState] = useState({ items: [], loading: true, error: '' })
  useEffect(() => {
    const controller = new AbortController()
    fetch(`${API_URL}${path}`, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error(`Request failed (${response.status})`)
        return response.json()
      })
      .then((items) => setState({ items, loading: false, error: '' }))
      .catch((error) => {
        if (error.name !== 'AbortError') setState({ items: [], loading: false, error: 'Live updates are temporarily unavailable. Showing verified regional information.' })
      })
    return () => controller.abort()
  }, [path])
  return state
}

function SectionHeading({ id, title, description, link, to }) {
  const { t } = useLanguage()
  return <div className="section-heading"><div><h2 id={id}>{t(title)}</h2>{description && <p>{t(description)}</p>}</div>{link && <Link className="text-link" to={to}>{t(link)}<Icon name="arrow" size={17} /></Link>}</div>
}

function ServiceCard({ service }) {
  const { t } = useLanguage()
  return <article className="service-card"><span className="card-kicker">{t(service.category || 'Public service')}</span><h3>{t(service.name)}</h3><p>{t(service.description)}</p><Link className="text-link" to="/services" aria-label={`${t('Learn more about')} ${t(service.name)}`}>{t('Learn more about')} <Icon name="arrow" size={17} /></Link></article>
}

function NewsCard({ article, featured = false }) {
  const { language, t } = useLanguage()
  const published = article.published_at
    ? new Date(article.published_at).toLocaleDateString(language === 'am' ? 'am-ET' : language === 'sid' ? 'en-ET' : 'en', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })
    : t('Latest update')
  return <article className={`news-card${featured ? ' news-featured' : ''}`}>
    <div className="news-card-content"><p className="news-meta"><span>{t(article.category || 'Regional update')}</span><time dateTime={article.published_at || undefined}>{published}</time></p><h3><Link to={`/news/${article.id}`}>{t(article.title)}</Link></h3><p>{t(article.summary)}</p><Link className="text-link" to={`/news/${article.id}`}>{t('Read story')} <Icon name="arrow" size={16} /></Link></div>
  </article>
}

// Great Adventures Grid Component (Utah inspired)
function AdventuresSection({ isStandalone = false }) {
  const { t } = useLanguage()
  return <section className="adventures-section" aria-labelledby="adventures-heading">
    <div className="container">
      <SectionHeading
        id="adventures-heading"
        title="The Great Adventures of Sidama"
        description="Unforgettable regional wonders from Rift Valley lakes to cloud coffee peaks."
        link={isStandalone ? undefined : "Explore all adventures"}
        to="/tourism"
      />
      <div className="adventures-grid">
        {greatAdventures.map((adv) => <article key={adv.id} className="adventure-card">
          {adv.image && <img className="adventure-image" src={adv.image} alt={t(adv.title)} loading="lazy" />}
          <div className="adventure-header">
            <span className="adventure-badge">{t(adv.badge)}</span>
            <span className="adventure-elevation">{adv.elevation}</span>
          </div>
          <h3>{t(adv.title)}</h3>
          <p>{t(adv.description)}</p>
          <div className="adventure-meta">
            <div><span>{t('Distance')}</span><strong>{adv.distance}</strong></div>
            <div><span>{t('Best Season')}</span><strong>{adv.season}</strong></div>
          </div>
        </article>)}
      </div>
    </div>
  </section>
}

// Storytelling Showcase Component (Hawaii inspired)
function StorytellingSection() {
  const { t } = useLanguage()
  return <section className="storytelling-section" aria-labelledby="stories-heading">
    <div className="container">
      <SectionHeading
        id="stories-heading"
        title="People of the Land: Living Stories"
        description="Authentic voices from the elders, astronomers, coffee growers, and stewards of Sidama."
        link="Discover Sidama"
        to="/culture"
      />
      <div className="stories-grid">
        {communityStories.map((story) => <article key={story.id} className="story-card">
          {story.image && <img className="story-image" src={story.image} alt={t(story.title)} loading="lazy" />}
          <div>
            <span className="story-role">{t(story.role)}</span>
            <h3>{t(story.title)}</h3>
            <p>{t(story.excerpt)}</p>
          </div>
          <blockquote className="story-quote">{story.quote}</blockquote>
        </article>)}
      </div>
    </div>
  </section>
}

// Ethical Visitor Code Component (Hawaii Malaphiya inspired)
function VisitorCharterSection() {
  const { t } = useLanguage()
  return <section className="container" aria-labelledby="charter-heading">
    <div className="charter-banner">
      <h3 id="charter-heading">{t('Travel with Halaale: Ethical Visitor Charter')}</h3>
      <p>{t('Honor the sacred heritage, protect ancient forests, and tread lightly with respect.')}</p>
      <div className="charter-rules">
        {visitorCharterItems.map((item) => <div key={item.title} className="charter-item">
          <strong>{t(item.title)}</strong>
          <span>{t(item.text)}</span>
        </div>)}
      </div>
    </div>
  </section>
}

// Curated Regional Itineraries Component (Flanders / Wallonia inspired)
function ItinerarySection() {
  const { t } = useLanguage()
  return <section className="itineraries-section" aria-labelledby="itineraries-heading">
    <div className="section-heading">
      <div>
        <h2 id="itineraries-heading">{t('Curated Regional Itineraries')}</h2>
        <p>{t('Handcrafted travel routes to experience the best of Sidama culture, wildlife, and coffee.')}</p>
      </div>
    </div>
    <div className="itinerary-grid">
      {curatedItineraries.map((it) => <article key={it.title} className="itinerary-card">
        <span className="itinerary-pill">{it.duration}</span>
        <h4>{t(it.title)}</h4>
        <p>{t(it.description)}</p>
        <ul className="itinerary-stops">
          {it.stops.map((stop, i) => <li key={i}>{stop}</li>)}
        </ul>
      </article>)}
    </div>
  </section>
}

function Home() {
  const { t } = useLanguage()
  const news = useApi('/news')
  const services = useApi('/services')
  const articles = news.items.length ? news.items.slice(0, 3) : localNews
  const serviceItems = services.items.length ? services.items.slice(0, 3) : localServices
  return <main id="main-content">
    <section className="hero" aria-labelledby="home-heading"><div className="container hero-inner"><div className="hero-copy"><h1 id="home-heading">{t('A region of')}<br /><em>{t('promise & possibility.')}</em></h1><p>{t('Discover our people, culture, and shared vision for a thriving future in the heart of southern Ethiopia.')}</p><div className="hero-actions"><Link className="button button-gold" to="/about">{t('Discover Sidama')} <Icon name="arrow" size={17} /></Link><Link className="hero-secondary" to="/government">{t('Our government')} <Icon name="arrow" size={16} /></Link></div><div className="hero-note"><span className="note-line" /><span>{t('Welcome to Sidama')}</span><span aria-hidden="true">·</span><span>{t('A home for heritage. A future for all.')}</span></div></div><aside className="hero-visual" aria-label={t('Sidama Regional State')}><h2>{t('Rooted in heritage.')}<br /><em>{t('Growing together.')}</em></h2><p>{t('From the fertile highlands and celebrated coffee farms to the warmth of our communities, Sidama is a region shaped by resilience, rich traditions, and a bold vision for tomorrow.')}</p><div className="hero-stat"><p><strong>{t('One')}</strong><span>{t('regional state, many communities')}</span></p><span>{t('A diverse region connected by a shared future')}</span></div></aside></div></section>
    
    {/* International Benchmark Upgrades */}
    <AdventuresSection />
    <StorytellingSection />
    <VisitorCharterSection />

    <section className="services-section" aria-labelledby="services-heading"><div className="container"><SectionHeading id="services-heading" title="Services for every community" description="Explore information and support from regional institutions." link="View all services" to="/services" />{services.error && <p className="api-note" role="status">{t(services.error)}</p>}<div className="service-grid">{serviceItems.map((item) => <ServiceCard key={item.id} service={item} />)}</div></div></section>
    <section className="news-section" aria-labelledby="news-heading"><div className="container"><SectionHeading id="news-heading" title="News & updates" description="Stories, announcements, and the latest from across Sidama." link="All news" to="/news" />{news.error && <p className="api-note" role="status">{t(news.error)}</p>}<div className="news-grid">{articles.map((item, index) => <NewsCard key={item.id} article={item} featured={index === 0} />)}</div></div></section>
    <section className="cta-section"><div className="container cta-inner"><h2>{t('Find your opportunity')}<br /><em>{t('in Sidama.')}</em></h2><div><p>{t('Explore investment potential, connect with our institutions, and be part of our region’s progress.')}</p><Link className="button button-outline" to="/investment">{t('Explore investment')} <Icon name="arrow" size={17} /></Link></div></div></section>
  </main>
}

const pages = {
  '/about': {
    eyebrow: 'Our region',
    title: 'A place to belong.',
    intro: 'Sidama is Ethiopia’s 10th autonomous regional state, defined by rich egalitarian traditions, vibrant towns, lush highland ecosystems, and an enterprising people.',
    sections: [
      ['A sovereign people & ancient heritage', 'The Sidama people belong to the Highland East Cushitic group and have inhabited the fertile lands between Lake Hawassa, Lake Abaya, and the Bilate River basin for centuries. Historically, Sidama society flourished through indigenous democratic institutions such as the Luwa generational system and the moral law of Seera.'],
      ['Historic referendum & statehood (2020)', 'Following decades of community aspiration, a historic regional referendum was held on 20 November 2019, where 98.52% of voters decisively chose autonomous statehood. Sidama officially became the 10th Regional State of the Federal Democratic Republic of Ethiopia on 18 June 2020.'],
      ['Hawassa: the regional capital', 'Hawassa (Awassa) is the administrative capital, economic motor, and cultural melting pot of the region. Located on the scenic shores of Lake Hawassa at 1,708 meters altitude, it is widely celebrated for its clean boulevards, resort hospitality, higher education institutions, and the Hawassa Industrial Park.'],
      ['Geography: from Rift Valley to Mount Garamba', 'Sidama’s topography ranges from warm, semi-arid lowlands near Lake Abaya (1,100 m) to the afro-alpine summit of Mount Garamba in Arbegona woreda (3,368 m), the highest peak and water tower of the region. The landscape is bordered by Lake Hawassa and the Bilate River to the west, and carved by the deep volcanic gorges of the Genale River basin to the east and southeast through Aroresa, Bensa, and Chire woredas. This varied geography creates abundant rainfall, fertile volcanic soil, and ideal microclimates for world-class specialty coffee and enset cultivation.'],
      ['People, language & identity', 'Over 4 million people call Sidama home. The indigenous language, Sidaamu Afoo, is spoken as the mother tongue by the vast majority of residents and serves as the working language of the regional state, alongside Amharic and English.'],
      ['Towns & growth centers', 'Beyond Hawassa, vital urban and economic centers include Yirgalem (a historic administrative hub and agro-industrial center), Aleta Wondo, Wondo Genet, Daye (Bensa), Leku, Hula, Chuko, and Bona.'],
    ],
  },
  '/culture': {
    eyebrow: 'Identity & heritage',
    title: 'Culture carried forward.',
    intro: 'Sidama culture is celebrated for its deep moral philosophy of Halaale, democratic generational governance, culinary mastery of Enset, and the UNESCO-inscribed Fichee–Chambalaalla festival.',
    cultureImage: { src: '/fichee-chambalaalla.png', alt: 'Sidama elders and youth in cultural attire celebrating at Gudumaale', caption: 'Fichee–Chambalaalla brings all generations together in Hawassa and across Sidama.' },
    showStorytelling: true,
    showVisitorCharter: true,
    sections: [
      ['Fichee–Chambalaalla: UNESCO World Heritage', 'Fichee–Chambalaalla is the grand Sidama New Year festival, inscribed by UNESCO on the Representative List of the Intangible Cultural Heritage of Humanity in November 2015. Rooted in oral tradition celebrating a married daughter who annually visited her family with a nourishing dish of enset, butter, and milk, the festival has grown into a powerful symbol of unity, hospitality, and communal sharing.'],
      ['Ayyaanto: traditional astronomers & calendar', 'The date of Fichee is not fixed on a modern calendar; it is precisely determined each year by traditional astronomers and astrologers known as Ayyaanto. By tracking the lunar cycle, constellations, and the movement of the stars, the Ayyaanto proclaim the exact day of the New Year to community clans.'],
      ['Gudumaale & the ecstatic Qetala dance', 'Celebrations begin at the household level with family meals and culminate in mass public gatherings at communal cultural grounds called Gudumaale (most famously in Hawassa). The celebration reaches its peak with the energetic Qetala dance, where men, women, and youth sing praise songs, brandish ceremonial staffs, and rejoice in shared blessings.'],
      ['Luwa: indigenous generational governance', 'Luwa is the ancient age-grade and leadership system that organizes Sidama society into 5 rotating 7-year generational classes (Darara, Fullaasa, Hirobora, Wawwawa, Mogissa), completing a full 35-year cycle. Led by the Gadaana (head) and Ja’lawa (deputies), the Luwa trains generations in leadership, civic defense, and ethical stewardship.'],
      ['Seera customary law & the principle of Halaale', 'Seera is the foundational customary legal framework of Sidama society. At its very center is Halaale — the supreme principle of absolute truth, justice, moral uprightness, and harmony with Magano (the Creator). Village assemblies (Ollaa Songo) resolve disputes using Halaale through restorative justice, mutual reconciliation, and sacred oaths.'],
      ['Wesse (Enset): the Tree of Life', 'Enset ventricosum (false banana), known locally as Wesse, is the foundation of Sidama food sovereignty and material culture. Fermented into Waasa (pulp) and prepared into cherished dishes such as Buurisame (blended with seasoned butter and milk) and Ccukkame, enset is drought-resilient, environmentally sustainable, and deeply symbolic of life and hospitality.'],
    ],
  },
  '/tourism': {
    eyebrow: 'Discover Sidama',
    title: 'A journey worth taking.',
    intro: 'From bird-rich Rift Valley lakes and therapeutic natural hot springs to roaring mountain waterfalls and mist-covered coffee forests, Sidama is a premier ecotourism haven.',
    showAdventures: true,
    showItineraries: true,
    showVisitorCharter: true,
    sections: [
      ['Lake Hawassa & Amora Gedel fish market', 'Lake Hawassa is a scenic, freshwater Rift Valley lake framed by acacia trees and hills. At the bustling Amora Gedel morning fish market, visitors observe fishermen landing fresh tilapia and catfish amidst massive, photogenic flocks of marabou storks, great white pelicans, and playful colobus monkeys in the shoreline canopy.'],
      ['Mount Tabor: panoramic vistas', 'Rising beside Hawassa city, Mount Tabor offers a scenic hiking route and a breathtaking 360-degree panoramic lookout over the expanding city skyline, lush green farmlands, and the sparkling expanse of Lake Hawassa.'],
      ['Wondo Genet geothermal hot springs & arboretum', 'Nestled in forested mountain foothills approximately 35 km southeast of Hawassa, Wondo Genet is world-famous for its natural thermal springs, therapeutic mineral pools, lush botanical arboretum, and forest hiking trails populated by endemic bird species.'],
      ['Logita & Bonora waterfalls in Bensa', 'Located roughly 120 km from Hawassa in the rugged highland district of Bensa, Logita Falls plunges through dramatic green gorges with a roaring cascade. Nearby Bonora Falls offers further unspoiled ecotourism for adventure travelers.'],
      ['Loka Abaya National Park', 'Spanning nearly 500 km² along the eastern shores of Lake Abaya, Loka Abaya National Park protects diverse ecosystems ranging from lakeshore wetlands to acacia savannahs, serving as a sanctuary for bushbucks, warthogs, waterbirds, and aquatic life.'],
      ['Mount Garamba: alpine roof of Sidama (Arbegona)', 'Towering at 3,368 meters above sea level in Arbegona woreda, Mount Garamba is the highest peak in Sidama Regional State. Revered as the "Water Tower of Sidama", it feeds the Genale, Gidabo, and Galana rivers. Hikers traverse afro-alpine meadows, giant lobelia forests, and highland bamboo groves, rewarded at the summit with sweeping 360-degree vistas extending to the Bale Mountains.'],
      ['Genale River canyon & gorges (Aroresa & Bensa)', 'The mighty Genale River (Ganale Dorya) cuts through steep, dramatic volcanic gorges along Sidama’s eastern border with Oromia, passing through Aroresa, Bensa, and Chire woredas. Fed by roaring tributary cascades including Logita and Bonora falls, the river canyon offers thrilling whitewater expeditions, sheer basalt cliffs, and pristine riparian birdwatching corridors.'],
      ['Specialty coffee agro-tourism trails', 'Visitors can journey into the heart of world-famous coffee woredas like Bensa, Arbegona, and Aleta Wondo to tour family coffee gardens, observe traditional washing stations and drying beds, and take part in an authentic Sidama coffee ceremony.'],
    ],
  },
  '/economy': {
    eyebrow: 'Livelihoods & trade',
    title: 'An economy rooted in the land.',
    intro: 'Sidama couples centuries-old agricultural excellence with modern industrial parks, leading Ethiopia’s specialty coffee exports and agro-processing transformation.',
    coffeeFeature: { image: '/sidama-coffee-harvest.png', alt: 'A Sidama farmer handpicking specialty red coffee cherries', title: 'World-renowned specialty Arabica coffee', copy: 'Sidama specialty coffee is globally treasured for its complex notes of citrus, bergamot, floral jasmine, and wild berries. Smallholder farmers cultivate coffee under shade trees, preserving biodiversity and delivering premier washed and natural micro-lots.' },
    coffeeLandscape: { image: '/sidama-coffee-landscape.png', alt: 'Cultivated green coffee hills of Sidama Regional State', caption: 'Lush agroforestry hillsides define the agricultural beauty of the Sidama highlands.' },
    sections: [
      ['Specialty coffee export excellence', 'Sidama is one of the world’s most celebrated coffee origins. Renowned micro-regions like Bensa, Arbegona, and Dale consistently achieve winning cup scores in international Cup of Excellence competitions, commanding top specialty premiums on the international market.'],
      ['Sidama Coffee Farmers Cooperative Union (SCFCU)', 'Formed in 2001, SCFCU represents over 50 primary cooperatives and more than 80,000 smallholder farming households. The union enables farmers to export high-grade organic and Fair Trade certified coffees directly to international roasters.'],
      ['Hawassa Industrial Park (HIP)', 'Spanning 1.4 million square meters, Hawassa Industrial Park is Ethiopia’s flagship eco-industrial park. Specialized in sustainable textile and apparel production with a state-of-the-art Zero Liquid Discharge (ZLD) facility, HIP provides employment for tens of thousands of skilled young workers.'],
      ['Yirgalem Integrated Agro-Industrial Park (IAIP)', 'Strategically situated in Yirgalem, this modern agro-industrial park transforms regional produce into high-value consumer goods, including cold-pressed organic avocado oil, pure honey, dairy products, and processed fruit juices for export.'],
      ['Enset, livestock & rural livelihoods', 'Beyond coffee, the region’s rural economy is anchored by enset cultivation, dairy and cattle farming, apiculture (beekeeping), and vegetable horticulture, creating resilient multi-crop farm ecosystems.'],
    ],
  },
  '/language': {
    eyebrow: 'Sidaamu Afoo Language',
    title: 'The living voice of our heritage.',
    intro: 'Sidaamu Afoo is a Highland East Cushitic language spoken by over 4 million Sidama people. It is rich in oral poetry, proverbs, and philosophical expression.',
    sections: [
      ['Origins & linguistic family', 'Sidaamu Afoo belongs to the Highland East Cushitic branch of the Afroasiatic language family, closely related to Hadiyya, Kambaata, Gedeo, and Alaaba. It is the official working language of Sidama Regional State.'],
      ['The Latin Qubee writing system (1993)', 'Since 1993, Sidaamu Afoo has been written using a Latin-based alphabet known as Qubee. The script is taught in primary and secondary schools across the region, supporting mother-tongue education, literacy, and administrative documentation.'],
      ['Grammar: Subject - Object - Verb (SOV)', 'Sidaamu Afoo follows a strict Subject - Object - Verb sentence structure. Verbs carry rich conjugations reflecting person, number, gender, tense, and aspect. Word meanings can change completely based on vowel lengthening (e.g., "a" vs "aa") and consonant gemination (doubled consonants).'],
      ['Oral literature & proverbs (Mammaaksha)', 'The language preserves an enormous library of proverbs (Mammaaksha), historical narratives (Dhuki), praise poems, and festival songs that encode the ethical and social values of the Sidama people.'],
    ],
    vocabularyTable: {
      title: 'Everyday Vocabulary & Phrases',
      description: 'Core phrases and expressions in Sidaamu Afoo for greeting and daily conversation.',
      rows: [
        ['Hello / Peace', 'Keere / Keereho', 'ሰላም / ጤና ይስጥልኝ', 'Universal greeting of peace'],
        ['Good morning (to male)', 'Keere gallito', 'እንደምን አደርክ', 'Morning greeting to a man'],
        ['Good morning (to female)', 'Keere gallita', 'እንደምን አደርሽ', 'Morning greeting to a woman'],
        ['Good morning (respectful / plural)', 'Keere galtini', 'እንደምን አደራችሁ', 'Polite or plural morning greeting'],
        ['Good afternoon / evening', 'Keere hosito / hosita', 'እንደምን ዋልክ / ዋልሽ', 'Afternoon greeting'],
        ['How are you? (to male)', 'Hittonni nootto?', 'እንዴት ነህ?', 'Inquiring about wellbeing'],
        ['How are you? (to female)', 'Hittonni nootta?', 'እንዴት ነሽ?', 'Inquiring about wellbeing'],
        ['I am fine / in peace', 'Keerunni noo\'ma', 'ደህና ነኝ', 'Standard response to greeting'],
        ['Thank you', 'Galatoommo', 'አመሰግናለሁ', 'Expression of gratitude'],
        ['Yes / No', 'Hoo / Weyi', 'አዎ / አይደለም', 'Affirmation and negation'],
        ['What is your name?', 'Ate su\'mi ayeti?', 'ስምህ/ሽ ማን ነው?', 'Asking someone’s name'],
        ['My name is...', 'Ane su\'mi [...]ti', 'ስሜ [...] ይባላል', 'Introducing oneself'],
        ['Water', 'Wo\'a', 'ውሃ', 'Essential life element'],
        ['Coffee', 'Buna', 'ቡና', 'Sidama’s famous beverage'],
        ['Food', 'Sagale', 'ምግብ', 'Daily nourishment'],
        ['House / Home', 'Mine / Bale', 'ቤት', 'Dwelling place'],
      ],
    },
    numbersTable: {
      title: 'Numerals in Sidaamu Afoo',
      description: 'Count from 1 to 10 in Sidaamu Afoo.',
      rows: [
        ['1', '1', 'Mite (or Mitto)', 'አንድ'],
        ['2', '2', 'Lame', 'ሁለት'],
        ['3', '3', 'Sase', 'ሦስት'],
        ['4', '4', 'Shoole', 'አራት'],
        ['5', '5', 'Onte', 'አምስት'],
        ['6', '6', 'Lee', 'ስድስት'],
        ['7', '7', 'Lamala', 'ሰባት'],
        ['8', '8', 'Sette', 'ስምንት'],
        ['9', '9', 'Honse', 'ዘጠኝ'],
        ['10', '10', 'Tonne', 'አሥር'],
      ],
    },
  },
  '/health': {
    eyebrow: 'Health & Public Care',
    title: 'Dedicated to health and vitality.',
    intro: 'The Sidama Regional Health Bureau coordinates tertiary referral hospitals, district health centers, and community health extension networks to serve over 5 million people.',
    sections: [
      ['Hawassa University Comprehensive Specialized Hospital (HU-CSH)', 'Serving as the paramount tertiary medical teaching and referral center in southern Ethiopia, HU-CSH offers advanced medical care across pediatrics, internal medicine, oncology, surgery, cardiology, and emergency trauma for over 5 million people.'],
      ['Primary Health Care Units (PHCUs)', 'Across all 30+ woredas and city administrations, a comprehensive network of district hospitals and Primary Health Care Units delivers maternal delivery care, infant immunization, infectious disease screening, and essential medicines.'],
      ['Community Health Extension Program (HEP)', 'Grassroots female Health Extension Workers (HEWs) are deployed in every rural kebele, bringing health education, prenatal checks, family planning, hygiene awareness, and malaria control directly to farm households.'],
      ['Clean water & hygiene promotion', 'In partnership with regional water bureaus, ongoing community programs expand spring capping, deep groundwater wells, and gravity-fed pipeline schemes across highland coffee communities.'],
    ],
  },
  '/education': {
    eyebrow: 'Learning & opportunity',
    title: 'Education for every generation.',
    intro: 'From mother-tongue primary schooling in Sidaamu Afoo to internationally recognized university research centers, education fuels the regional renaissance.',
    sections: [
      ['Hawassa University (HU)', 'One of Ethiopia’s top-tier national research universities, Hawassa University operates multiple campuses with flagship colleges including Agriculture, Medicine and Health Sciences, Business & Economics, and the Institute of Technology.'],
      ['Wondo Genet College of Forestry & Natural Resources', 'Renowned across East Africa as a pioneer in forestry education, watershed conservation, and environmental science, this specialized college leads research in biodiversity and sustainable agroforestry.'],
      ['Mother-tongue primary education', 'Sidama Regional State champions mother-tongue primary education in Sidaamu Afoo using the Qubee script, ensuring strong early literacy and cultural continuity before transitioning to Amharic and English in later grades.'],
      ['Technical & Vocational Training (TVET)', 'Hawassa Polytechnic College and district TVET institutes prepare thousands of youths each year in agro-processing, mechanical engineering, garment manufacturing, construction, and digital technologies.'],
    ],
  },
  '/government': {
    eyebrow: 'Public leadership',
    title: 'Government & institutions.',
    intro: 'Regional institutions work under the constitution of Sidama Regional State to serve citizens, protect rights, and lead regional socioeconomic transformation.',
    sections: [
      ['Regional administration & executive council', 'Headed by the Regional President, the Executive Council coordinates public policy, strategic development master plans, and public service delivery across all bureaus.'],
      ['Regional council (legislative assembly)', 'The elected Regional Council represents the citizens of Sidama, passing regional legislation, approving budgets, and providing democratic oversight over public institutions.'],
      ['Regional sectoral bureaus', 'Dedicated bureaus direct public initiatives in Agriculture, Health, Education, Culture & Tourism, Trade & Industry, Water & Energy, and Transport.'],
    ],
    zones: [
      { name: 'Central Sidama Zone', districts: ['Arbegona', 'Dale', 'Darara', 'Loko Abaya', 'Shafamo', 'Wensho (Wonsho)'], towns: ['Yirgalem'] },
      { name: 'Eastern Sidama Zone', districts: ['Aroresa', 'Bensa', 'Bona Zuria', 'Bura', 'Chabe Gambeltu', 'Chere', 'Daela', 'Hoko'], towns: ['Daye'] },
      { name: 'Northern Sidama Zone', districts: ['Bilate Zuria', 'Boricha', 'Gorche', 'Hawassa Zuria', 'Malga', 'Shebedino', 'Wondo Genet'], towns: ['Leku'] },
      { name: 'Southern Sidama Zone', districts: ['Aleta Wondo', 'Bursa', 'Chuko', 'Dara', 'Dara Otilcho', 'Hula', 'Teticha'], towns: ['Aleta Wondo'] },
    ],
    city: { name: 'Hawassa', subdivisions: ['Addis Ketema', 'Hayk Dar', 'Mehal', 'Menahariya', 'Misrak', 'Tabor', 'Hawela Tula', 'Bahil Adarash'] },
    districtPopulation: [
      ['Bensa', '250,727', '342,116'],
      ['Boricha', '250,260', '339,933'],
      ['Dale', '242,658', '357,733'],
      ['Shebedino', '233,922', '320,639'],
      ['Aleta Wondo', '188,976', '276,385'],
      ['Aroresa', '170,240', '225,582'],
      ['Cheko', '167,300', '225,450'],
      ['Wendo Genet', '155,715', '234,490'],
      ['Dara', '155,265', '216,756'],
      ['Arbegona', '135,862', '186,021'],
      ['Hula', '129,263', '176,997'],
      ['Hawassa Zuria', '124,472', '161,914'],
      ['Bona Zuria', '121,236', '166,043'],
      ['Chere', '120,449', '159,944'],
      ['Malga', '109,793', '148,377'],
      ['Gorche', '105,472', '141,320'],
      ['Bursa', '103,631', '137,982'],
      ['Loko Abaya', '99,233', '130,539'],
      ['Wensho', '89,662', '119,461'],
      ['Hawassa city', '258,808', '555,480'],
    ],
  },
  '/environment': {
    eyebrow: 'Land, water & wellbeing',
    title: 'A healthy environment matters.',
    intro: 'From Rift Valley aquatic ecosystems to highland watershed conservation, preserving Sidama’s biodiversity and volcanic soils is fundamental to our shared future.',
    sections: [
      ['Rift Valley lakes & watershed stewardship', 'Lake Hawassa and Lake Abaya are delicate closed-basin aquatic systems. Regional environmental bureaus lead programs to mitigate siltation, monitor industrial effluents, and safeguard lakeshore wetland buffer zones.'],
      ['Enset multi-strata agroforestry', 'The traditional Sidama home garden (enset and coffee agroforestry system) provides continuous soil cover, prevents hillside erosion under tropical downpours, and sequesters significant carbon dioxide.'],
      ['Indigenous forest conservation & Seera ethics', 'Under traditional Seera customary rules, cutting indigenous trees such as Podocarpus (Zigba) and Cordia africana (Wanza) is strictly prohibited. Modern reforestation programs build on this conservation heritage.'],
      ['Community sanitation & spring water protection', 'Protecting natural highland springs and promoting ecological sanitation preserves groundwater quality for both rural farming communities and downstream urban centers.'],
    ],
  },
  '/investment': {
    eyebrow: 'Grow with us',
    title: 'Invest in Sidama.',
    intro: 'A young and skilled workforce, high agricultural yields, strategic highway connections, and modern eco-industrial parks make Sidama a premier investment corridor in the Horn of Africa.',
    sections: [
      ['Specialty coffee & agro-processing', 'Tap into unmatched supplies of raw specialty coffee, organic avocados, honey, tropical fruits, and dairy by establishing value-adding processing facilities at the Yirgalem Integrated Agro-Industrial Park.'],
      ['Eco-tourism, resorts & hospitality', 'Develop premium lakeside eco-lodges along Lake Hawassa, wellness spas at Wondo Genet thermal springs, and trekking camps in the Bensa highland waterfall circuits.'],
      ['Manufacturing at Hawassa Industrial Park', 'Leverage state-of-the-art industrial sheds, reliable renewable hydropower, zero liquid discharge facilities, and favorable tax incentives for export apparel and light manufacturing.'],
      ['Regional investment one-stop support', 'The Sidama Investment Commission provides streamlined company registration, land lease facilitation, and operational support for foreign and domestic investors.'],
    ],
  },
  '/transport': {
    eyebrow: 'Getting around',
    title: 'Transport & connections.',
    intro: 'Hawassa is connected via modern express highways and scheduled air routes, serving as the central transport hub for southern Ethiopia.',
    sections: [
      ['Addis Ababa - Hawassa Expressway', 'The modern multi-lane expressway cuts travel time from Addis Ababa to Hawassa to approximately 3.5 hours, seamlessly connecting the regional capital with central Ethiopia and the port corridors.'],
      ['Hawassa Airport (AWA)', 'Hawassa Airport operates daily scheduled commercial flights to and from Addis Ababa Bole International Airport, providing convenient domestic and international connections.'],
      ['Regional highway & woreda networks', 'All-weather asphalt roads connect Hawassa to Yirgalem, Aleta Wondo, Dilla, and the Moyale border corridor to Kenya, while feeder roads link highland districts like Bensa and Arbegona.'],
      ['Lakeside & city public transit', 'Hawassa offers convenient urban mobility with city buses, bajajs (auto-rickshaws), bicycle lanes, and scenic lakeside boat transport across Lake Hawassa.'],
    ],
  },
  '/documents': {
    eyebrow: 'Resources',
    title: 'Documents & publications.',
    intro: 'Access official regional government publications, development master plans, investment guides, and cultural heritage research.',
    sections: [
      ['Regional investment guide & sector profiles', 'Comprehensive guidelines on priority investment areas, land lease terms, tax incentives, and application procedures in Sidama Regional State.'],
      ['Fichee–Chambalaalla UNESCO documentation', 'Official nomination documents, ethnographic studies, and educational brochures commemorating Sidama’s intangible cultural heritage.'],
      ['Annual regional socio-economic reports', 'Data digests detailing regional school enrollments, healthcare indicators, coffee export volumes, and infrastructure milestones.'],
      ['Request official records & forms', 'Citizens and researchers can request archived reports or submission forms directly from the regional administration in Hawassa.'],
    ],
  },
}

function AdministrativeDivisions({ zones, city, districtPopulation }) {
  const { t } = useLanguage()
  return <section className="administrative-section" aria-labelledby="administrative-heading">
    <div className="section-heading"><div><h2 id="administrative-heading">{t('Administrative divisions')}</h2><p>{t('Sidama is described as four zones and the zone-level city of Hawassa.')}</p></div></div>
    <div className="zone-grid">{zones.map((zone) => <article className="zone-card" key={zone.name}>
      <h3>{zone.name}</h3>
      <p className="division-label">{t('Districts (woredas)')}</p>
      <ul>{zone.districts.map((district) => <li key={district}>{district}</li>)}</ul>
      <p className="division-label">{t('Towns')}</p>
      <ul>{zone.towns.map((town) => <li key={town}>{town}</li>)}</ul>
    </article>)}</div>
    <article className="city-card"><div><h3>{city.name}</h3><span className="city-level">{t('Zone-level city')}</span></div><div><p className="division-label">{t('Sub-cities')}</p><ul>{city.subdivisions.map((subdivision) => <li key={subdivision}>{subdivision}</li>)}</ul></div></article>
    {districtPopulation && <div className="population-section">
      <div className="section-heading"><div><h2>{t('Districts by Population')}</h2><p>{t('Census tables still report Sidama on its older district boundaries. These figures are the most recent official numbers per district.')}</p></div></div>
      <div className="population-table-wrap">
        <table className="population-table">
          <thead><tr><th scope="col">{t('District')}</th><th scope="col">{t('2007 census')}</th><th scope="col">{t('2022 projection')}</th></tr></thead>
          <tbody>{districtPopulation.map(([name, census, projection]) => <tr key={name}><th scope="row">{name}</th><td>{census}</td><td>{projection}</td></tr>)}</tbody>
        </table>
      </div>
    </div>}
  </section>
}

function VocabularySection({ vocabularyTable }) {
  const { t } = useLanguage()
  return <section className="population-section" aria-labelledby="vocab-heading">
    <div className="section-heading"><div><h2 id="vocab-heading">{t(vocabularyTable.title)}</h2><p>{t(vocabularyTable.description)}</p></div></div>
    <div className="population-table-wrap">
      <table className="population-table">
        <thead><tr><th scope="col">{t('English')}</th><th scope="col">Sidaamu Afoo</th><th scope="col">አማርኛ</th><th scope="col">{t('Context / Meaning')}</th></tr></thead>
        <tbody>{vocabularyTable.rows.map(([en, sid, am, ctx]) => <tr key={en}><th scope="row">{t(en)}</th><td><strong>{sid}</strong></td><td>{am}</td><td>{t(ctx)}</td></tr>)}</tbody>
      </table>
    </div>
  </section>
}

function NumbersSection({ numbersTable }) {
  const { t } = useLanguage()
  return <section className="population-section" aria-labelledby="numbers-heading">
    <div className="section-heading"><div><h2 id="numbers-heading">{t(numbersTable.title)}</h2><p>{t(numbersTable.description)}</p></div></div>
    <div className="population-table-wrap">
      <table className="population-table">
        <thead><tr><th scope="col">{t('Digit')}</th><th scope="col">{t('Number')}</th><th scope="col">Sidaamu Afoo</th><th scope="col">አማርኛ</th></tr></thead>
        <tbody>{numbersTable.rows.map(([digit, num, sid, am]) => <tr key={digit}><th scope="row">{digit}</th><td>{num}</td><td><strong>{sid}</strong></td><td>{am}</td></tr>)}</tbody>
      </table>
    </div>
  </section>
}

function InfoPage({ page }) {
  const { t } = useLanguage()
  return <main id="main-content" className="page-main"><div className="container"><div className="page-heading"><h1>{t(page.title)}</h1><p>{t(page.intro)}</p></div>{page.coffeeFeature && <section className="coffee-feature" aria-labelledby="coffee-feature-heading"><img src={page.coffeeFeature.image} alt={t(page.coffeeFeature.alt)} /><div className="coffee-feature-copy"><h2 id="coffee-feature-heading">{t(page.coffeeFeature.title)}</h2><p>{t(page.coffeeFeature.copy)}</p></div></section>}{page.coffeeLandscape && <figure className="coffee-landscape"><img src={page.coffeeLandscape.image} alt={t(page.coffeeLandscape.alt)} /><figcaption>{t(page.coffeeLandscape.caption)}</figcaption></figure>}{page.cultureImage && <figure className="culture-image"><img src={page.cultureImage.src} alt={t(page.cultureImage.alt)} /><figcaption>{t(page.cultureImage.caption)}</figcaption></figure>}<div className="info-layout"><aside className="info-aside" aria-label={t('Sidama Regional State')}><span className="aside-leaf"><Icon name="leaf" size={32} /></span><p>{t('Sidama Regional State')}</p><span>{t('Southern Ethiopia')}</span></aside><div className="info-sections">{page.sections.map(([title, copy], index) => <article className="info-row" key={title}><span className="info-index">{String(index + 1).padStart(2, '0')}</span><div><h2>{t(title)}</h2><p>{t(copy)}</p></div></article>)}</div></div>{page.showAdventures && <AdventuresSection isStandalone={true} />}{page.showItineraries && <ItinerarySection />}{page.showStorytelling && <StorytellingSection />}{page.showVisitorCharter && <VisitorCharterSection />}{page.vocabularyTable && <VocabularySection vocabularyTable={page.vocabularyTable} />}{page.numbersTable && <NumbersSection numbersTable={page.numbersTable} />}{page.zones && <AdministrativeDivisions zones={page.zones} city={page.city} districtPopulation={page.districtPopulation} />}<div className="page-cta"><p>{t('Want to learn more or get in touch?')}</p><Link className="button button-green" to="/contact">{t('Contact us')} <Icon name="arrow" size={17} /></Link></div></div></main>
}

function ListingPage({ type }) {
  const { t } = useLanguage()
  const isNews = type === 'news'
  const result = useApi(isNews ? '/news' : '/services')
  const items = result.items.length ? result.items : (isNews ? localNews : localServices)
  return <main id="main-content" className="page-main"><div className="container"><div className="page-heading"><h1>{t(isNews ? 'News & Updates.' : 'Public Services.')}</h1><p>{t(isNews ? 'The latest stories and announcements from Sidama Regional State.' : 'Information about services and support available from regional institutions.')}</p></div>{result.error && <p className="api-note" role="status">{t(result.error)}</p>}{isNews ? <div className="news-grid listing-grid">{items.map((item, index) => <NewsCard key={item.id} article={item} featured={index === 0} />)}</div> : <div className="service-grid listing-grid">{items.map((item) => <ServiceCard key={item.id} service={item} />)}</div>}</div></main>
}

function NewsDetail() {
  const { language, t } = useLanguage()
  const pathname = usePathname()
  const id = pathname?.match(/^\/news\/([^/]+)\/?$/)?.[1] || ''
  const [story, setStory] = useState(null)
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    const controller = new AbortController()
    fetch(`${API_URL}/news/${id}`, { signal: controller.signal })
      .then(async (response) => {
        const result = await response.json()
        if (!response.ok) throw new Error(result.error || `Request failed (${response.status})`)
        return result
      })
      .then((result) => {
        setStory(result)
        setStatus('ready')
      })
      .catch((error) => {
        if (error.name !== 'AbortError') {
          const sample = localNews.find((article) => String(article.id) === id)
          setStory(sample || null)
          setStatus(sample ? 'sample' : 'missing')
        }
      })
    return () => controller.abort()
  }, [id])

  if (status === 'loading') return <main id="main-content" className="page-main"><div className="container"><p className="api-note" role="status">{t('Loading story…')}</p></div></main>
  if (!story) return <NotFound />

  const published = story.published_at
    ? new Date(story.published_at).toLocaleDateString(language === 'am' ? 'am-ET' : language === 'sid' ? 'en-ET' : 'en', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })
    : t('Latest update')
  return <main id="main-content" className="page-main"><article className="container news-detail">
    <Link className="text-link" to="/news">← {t('Back to news')}</Link>
    <div className="page-heading"><h1>{t(story.title)}</h1><p>{t(story.summary)}</p></div>
    <p className="news-detail-meta"><span>{t(story.category || 'Regional update')}</span><time dateTime={story.published_at || undefined}>{published}</time></p>
  </article></main>
}

function Contact() {
  const { t } = useLanguage()
  const [status, setStatus] = useState({ sending: false, message: '', error: false })
  async function submit(event) {
    event.preventDefault()
    const form = event.currentTarget
    setStatus({ sending: true, message: '', error: false })
    const payload = Object.fromEntries(new FormData(form).entries())
    try {
      const response = await fetch(`${API_URL}/contact`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || `Request failed (${response.status})`)
      form.reset()
      setStatus({ sending: false, message: t('Thank you. Your message has been received.'), error: false })
    } catch (error) {
      setStatus({ sending: false, message: error.message || 'We could not send your message. Please try again.', error: true })
    }
  }
  return <main id="main-content" className="page-main"><div className="container"><div className="page-heading"><h1>{t('Let’s talk.')}</h1><p>{t('Get in touch with the Sidama Regional State administration. We’ll direct your message to the right team.')}</p></div><div className="contact-layout"><div className="contact-details"><h2>{t('Contact information')}</h2><p>{t('For public information, service questions, or general inquiries, send us a message or visit the regional administration in Hawassa.')}</p><div className="contact-detail"><span><Icon name="pin" /></span><div><b>{t('Visit us')}</b><p>Hawassa, Sidama Regional State<br />Ethiopia</p></div></div><div className="contact-detail"><span><Icon name="leaf" /></span><div><b>{t('Public inquiries')}</b><p>{t('Use the contact form and our team will follow up.')}</p></div></div></div><form className="contact-form" onSubmit={submit}><div className="form-row"><label>{t('Your name')}<input name="name" autoComplete="name" required maxLength="120" /></label><label>{t('Email address')}<input name="email" type="email" autoComplete="email" required maxLength="254" /></label></div><label>{t('Subject')}<input name="subject" required maxLength="180" /></label><label>{t('Your message')}<textarea name="message" rows="5" required minLength="10" maxLength="3000" /></label>{status.message && <p className={status.error ? 'form-message form-error' : 'form-message'} role="status">{t(status.message)}</p>}<button className="button button-green" type="submit" disabled={status.sending}>{t(status.sending ? 'Sending…' : 'Send message')} <Icon name="arrow" size={17} /></button></form></div></div></main>
}

function NotFound() {
  const { t } = useLanguage()
  return <main id="main-content" className="page-main"><div className="container not-found"><h1>{t('Let’s find your way.')}</h1><p><strong>{t('Page not found')}.</strong> {t('The page you’re looking for may have moved or is no longer available.')}</p><Link className="button button-green" to="/">{t('Back to home')} <Icon name="arrow" size={17} /></Link></div></main>
}

function SidamaChatbot() {
  const { language, t } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const [draft, setDraft] = useState('')
  const [isResponding, setIsResponding] = useState(false)
  const greeting = 'Hello! Ask me about Sidama. I search the web and share sources in English, Amharic, or Sidaamu Afoo.'
  const [messages, setMessages] = useState([{ id: 0, role: 'bot', text: t(greeting) }])
  const visibleMessages = messages.length === 1 && messages[0].id === 0
    ? [{ ...messages[0], text: t(greeting) }]
    : messages
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isOpen])

  async function sendQuestion(question) {
    const text = question.trim()
    if (!text || isResponding) return
    setDraft('')
    setIsResponding(true)
    setMessages((current) => [...current, { id: current.length, role: 'user', text }])
    let fallbackSource
    try {
      const response = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: text, language }),
      })
      const responseBody = await response.text()
      if (!response.ok && response.status >= 500 && !responseBody.trim()) {
        throw new Error(t('Cannot reach the API server. Start the server and try again.'))
      }

      let result
      try {
        result = JSON.parse(responseBody)
      } catch {
        throw new Error('The assistant received an invalid response. Please try again.')
      }
      if (typeof result.searchUrl === 'string') {
        try {
          const searchUrl = new URL(result.searchUrl)
          if (searchUrl.protocol === 'https:' && searchUrl.hostname === 'www.google.com' && searchUrl.pathname === '/search') {
            fallbackSource = {
              title: t('Search the web for this question'),
              url: searchUrl.href,
              snippet: t('Open Google Search results in a new tab.'),
            }
          }
        } catch {
          fallbackSource = undefined
        }
      }
      if (!response.ok) throw new Error(result.error || `Request failed (${response.status})`)
      setMessages((current) => [...current, { id: current.length, role: 'bot', text: result.answer, sources: result.sources }])
    } catch (error) {
      const message = error instanceof TypeError
        ? t('Cannot reach the API server. Start the server and try again.')
        : error.message || 'The assistant is temporarily unavailable. Please try again.'
      setMessages((current) => [...current, { id: current.length, role: 'bot', text: message, sources: fallbackSource ? [fallbackSource] : undefined, error: true }])
    } finally {
      setIsResponding(false)
    }
  }

  function submit(event) {
    event.preventDefault()
    sendQuestion(draft)
  }

  return <aside className="sidama-chatbot">
    {isOpen && <section className="chatbot-panel" aria-label={t('Official Sidama Regional State AI Assistant')}>
      <header className="chatbot-header"><div><strong>{t('Official Sidama Regional State AI Assistant')}</strong><span>{t('Searches the web and links to sources. Verify current or official information.')}</span></div><button type="button" className="chatbot-close" aria-label={t('Close chat')} onClick={() => setIsOpen(false)}><Icon name="close" size={19} /></button></header>
      <div className="chatbot-messages" role="log" aria-live="polite">
        {visibleMessages.map((message) => <div className={`chatbot-message chatbot-message-${message.role}${message.error ? ' chatbot-message-error' : ''}`} key={message.id}>
          <p>{message.text}</p>
          {message.sources?.map((source) => <a className="chatbot-source" key={source.url} href={source.url} target="_blank" rel="noopener noreferrer">
            <strong>{source.title}</strong><span>{source.snippet}</span><small>{new URL(source.url, window.location.origin).hostname}</small>
          </a>)}
        </div>)}
        {isResponding && <div className="chatbot-message chatbot-message-bot chatbot-searching" role="status">{t('Preparing an answer…')}</div>}
        <div ref={messagesEndRef} />
      </div>
      {visibleMessages.length === 1 && <div className="chatbot-suggestions" aria-label={t('Suggested questions')}>
        {['Where is Sidama?', 'What is Fichee–Chambalaalla?', 'What is Luwa?'].map((question) => <button key={question} type="button" disabled={isResponding} onClick={() => sendQuestion(question)}>{t(question)}</button>)}
      </div>}
      <form className="chatbot-form" onSubmit={submit}>
        <label className="sr-only" htmlFor="sidama-chat-question">{t('Ask about Sidama...')}</label>
        <input id="sidama-chat-question" value={draft} onChange={(event) => setDraft(event.target.value)} placeholder={t('Ask about Sidama...')} maxLength="1000" />
        <button type="submit" aria-label="Send question" disabled={!draft.trim() || isResponding}><Icon name="send" size={18} /></button>
      </form>
      <p className="chatbot-note">{t('Searches the web and links to sources. Verify current or official information.')} {t('Check linked sources.')}</p>
    </section>}
    <button className="chatbot-launcher" type="button" aria-expanded={isOpen} onClick={() => setIsOpen(!isOpen)}><Icon name={isOpen ? 'close' : 'chat'} size={21} /><span>{t(isOpen ? 'Close chat' : 'Ask Sidama')}</span></button>
  </aside>
}

function App() {
  const pathname = usePathname()
  const pagePath = pathname.replace(/\/+$/, '') || '/'
  const newsDetailMatch = pagePath.match(/^\/news\/([^/]+)$/)
  const [language, setLanguage] = useStoredLanguage()

  useEffect(() => {
    document.documentElement.lang = language === 'sid' ? 'sid' : language
  }, [language])

  let page
  if (pagePath === '/') page = <Home />
  else if (pagePath === '/news') page = <ListingPage type="news" />
  else if (newsDetailMatch) page = <NewsDetail />
  else if (pagePath === '/services') page = <ListingPage type="services" />
  else if (pagePath === '/contact') page = <Contact />
  else if (pages[pagePath]) page = <InfoPage page={pages[pagePath]} />
  else page = <NotFound />

  return <LanguageContext.Provider value={{ language, setLanguage }}><a className="skip-link" href="#main-content">{translations[language]?.['Skip to content'] || 'Skip to content'}</a><Header />{page}<Footer /><SidamaChatbot /></LanguageContext.Provider>
}

export default App
