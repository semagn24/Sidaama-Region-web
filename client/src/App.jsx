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
    'Home': 'መነሻ', 'About Sidama': 'ስለ ሲዳማ', 'Government': 'መንግሥት', 'Economy': 'ኢኮኖሚ', 'Culture': 'ባህል', 'Tourism': 'ቱሪዝም',
    'Education': 'ትምህርት', 'Environment': 'አካባቢ', 'Transport': 'ትራንስፖርት', 'Services': 'አገልግሎቶች', 'Investment': 'ኢንቨስትመንት', 'News': 'ዜና', 'Documents': 'ሰነዶች',
    'More': 'ተጨማሪ', 'Contact us': 'ያግኙን', 'Official website of the Sidama Regional State': 'የሲዳማ ክልል መንግሥት ይፋዊ ድረ ገጽ',
    'Welcome to Sidama': 'ወደ ሲዳማ እንኳን በደህና መጡ', 'A region of': 'የተስፋና', 'promise & possibility.': 'የዕድል ክልል።',
    'Discover our people, culture, and shared vision for a thriving future in the heart of southern Ethiopia.': 'በደቡባዊ ኢትዮጵያ ልብ ውስጥ ስላሉት ሕዝቦቻችን፣ ባህላችንና ለብሩህ የጋራ የወደፊት ራዕያችን ይወቁ።',
    'Discover Sidama': 'ሲዳማን ይወቁ', 'Our government': 'መንግሥታችን', 'A home for heritage. A future for all.': 'የቅርስ ቤት። ለሁሉም የወደፊት ተስፋ።',
    'Our home': 'ቤታችን', 'Rooted in heritage.': 'በቅርስ የተመሠረተ።', 'Growing together.': 'አብረን እያደግን።',
    'Get to know Sidama': 'ሲዳማን ይበልጥ ይወቁ', 'regional state, many communities': 'ክልል፣ ብዙ ማኅበረሰቦች', 'Here to help': 'ለመርዳት ዝግጁ', 'Services for every community': 'ለሁሉም ማኅበረሰብ አገልግሎቶች',
    'Explore information and support from regional institutions.': 'ከክልላዊ ተቋማት መረጃና ድጋፍ ያግኙ።', 'View all services': 'ሁሉንም አገልግሎቶች ይመልከቱ',
    'From the region': 'ከክልሉ', 'News & updates': 'ዜናና ዝማኔዎች', 'Stories, announcements, and the latest from across Sidama.': 'ከሲዳማ የሚመጡ ታሪኮች፣ ማስታወቂያዎችና የቅርብ መረጃዎች።',
    'All news': 'ሁሉም ዜናዎች', 'Your next chapter': 'ቀጣዩ ምዕራፍዎ', 'Find your opportunity': 'ዕድልዎን ያግኙ', 'in Sidama.': 'በሲዳማ።',
    'Explore investment': 'የኢንቨስትመንት ዕድሎችን ይወቁ', 'Explore': 'ይወቁ', 'Information': 'መረጃ', 'Get in touch': 'ያግኙን',
    'About the region': 'ስለ ክልሉ', 'Economy & livelihoods': 'ኢኮኖሚና ኑሮ', 'Environment & health': 'አካባቢና ጤና',
    'Public services': 'የሕዝብ አገልግሎቶች', 'Invest in Sidama': 'በሲዳማ ኢንቨስት ያድርጉ', 'Documents & resources': 'ሰነዶችና ምንጮች',
    'Contact the regional administration': 'የክልሉን አስተዳደር ያግኙ', 'Southern Ethiopia': 'ደቡባዊ ኢትዮጵያ',
    'Want to learn more or get in touch?': 'ተጨማሪ ለማወቅ ወይም ለማግኘት ይፈልጋሉ?',
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
    'A journey worth taking.': 'ሊደረግ የሚገባው ጉዞ።',
    'Getting around': 'መጓጓዣ', 'Transport & connections.': 'ትራንስፖርትና ግንኙነቶች።',
    'Resources': 'ምንጮች', 'Documents & publications.': 'ሰነዶችና ህትመቶች።',
    'Sidaamu Afoo': 'ሲዳሙ አፎ', 'Fichee–Chambalaalla, the Sidama New Year': 'ፊቼ–ጫምባላላ፣ የሲዳማ አዲስ ዓመት',
    'Festival dates & celebrations': 'የበዓሉ ቀናትና አከባበር', 'Customs & community values': 'ልማዶችና የማኅበረሰብ እሴቶች',
    'Reconciliation before the New Year': 'ከአዲሱ ዓመት በፊት እርቅ', 'Enset foods & sustainability': 'የእንሰት ምግቦችና ዘላቂነት',
    'The Gudumaale & Qetala': 'ጉዱማሌና ቄጣላ', 'Passing traditions on': 'ትውፊትን ማስተላለፍ',
    'UNESCO recognition': 'የዩኔስኮ እውቅና', 'Experience the festival from Hawassa': 'በሐዋሳ የበዓሉን ድባብ ይለማመዱ',
    'Traditional leadership': 'ባህላዊ አመራር', 'Living heritage': 'ሕያው ቅርስ',
    'Sidama coffee': 'የሲዳማ ቡና', 'The latest stories and announcements from Sidama Regional State.': 'የቅርብ ጊዜ ታሪኮችና ማስታወቂያዎች ከሲዳማ ክልል።',
    'Public services.': 'የሕዝብ አገልግሎቶች።', 'For public information, service questions, or general inquiries, send us a message or visit the regional administration in Hawassa.': 'ለሕዝብ መረጃ፣ ለአገልግሎት ጥያቄ ወይም ለአጠቃላይ ጥያቄ መልዕክት ይላኩልን ወይም በሐዋሳ የክልሉን አስተዳደር ይጎብኙ።',
    'Use the contact form and our team will follow up.': 'የመገኛ ቅጹን ይጠቀሙ፤ ቡድናችንም ምላሽ ይሰጣል።',
    'Grow with us': 'አብረውን ያድጉ', 'Invest in Sidama.': 'በሲዳማ ኢንቨስት ያድርጉ።',
    'A regional state': 'ክልላዊ መንግሥት', 'People & language': 'ሕዝብና ቋንቋ', 'Culture & heritage': 'ባህልና ቅርስ',
    'Land & climate': 'መሬትና የአየር ንብረት', 'Towns & livelihoods': 'ከተሞችና ኑሮ', 'Transport & connections': 'ትራንስፖርትና ግንኙነቶች',
    'Regional administration': 'ክልላዊ አስተዳደር', 'Council & representation': 'ምክር ቤትና ውክልና', 'Regional bureaus': 'ክልላዊ ቢሮዎች',
    'Coffee & trade': 'ቡናና ንግድ', 'Farming & food crops': 'እርሻና የምግብ ሰብሎች', 'Livestock & rural livelihoods': 'እንስሳት እርባታና የገጠር ኑሮ',
    'Water & opportunity': 'ውሃና ዕድል', 'Building a resilient economy': 'ጠንካራ ኢኮኖሚ መገንባት',
    'Lake Hawassa & Logita Falls': 'ሐይቅ ሐዋሳና ሎጊታ ፏፏቴ', 'Highlands & changing landscapes': 'ደጋማ አካባቢዎችና የተለያዩ መልክዓ ምድሮች',
    'Coffee country': 'የቡና አገር', 'Culture & community': 'ባህልና ማኅበረሰብ',
    'Starting in Hawassa': 'ከሐዋሳ መነሳት', 'Road travel': 'የመንገድ ጉዞ', 'Public and local transport': 'የሕዝብና የአካባቢ ትራንስፖርት',
    'Travel responsibly': 'በኃላፊነት መጓዝ', 'Official information': 'ይፋዊ መረጃ',
    'Public information': 'የሕዝብ መረጃ', 'Request a document': 'ሰነድ ይጠይቁ', 'Stay informed': 'መረጃ ያግኙ',
    'Current information': 'ወቅታዊ መረጃ', 'Access to early learning': 'የቅድመ ትምህርት ተደራሽነት',
    'Current environmental information': 'ወቅታዊ የአካባቢ መረጃ', 'Water resources & community action': 'የውሃ ሀብትና የማኅበረሰብ እርምጃ',
    'Land & soil': 'መሬትና አፈር', 'Water, sanitation & health': 'ውሃ፣ ንጽህናና ጤና',
    'Schools listed in the source': 'በምንጩ የተጠቀሱ ትምህርት ቤቶች', 'Kindergarten enrollment': 'የመዋዕለ ሕፃናት ምዝገባ',
    'Close menu': 'ምናሌውን ዝጋ', 'Open menu': 'ምናሌውን ክፈት', 'Language': 'ቋንቋ',
    'Learn more about': 'ተጨማሪ ይወቁ', 'Serving our communities and building a bright, inclusive future for Sidama.': 'ማኅበረሰቦቻችንን ማገልገልና ለሲዳማ ብሩህ፣ ሁሉን አካታች የወደፊት ጊዜ መገንባት።',
    'Illustrated green highlands and coffee trees of Sidama': 'የሲዳማ አረንጓዴ ደጋማ መሬትና የቡና ዛፎች ምስል',
    'Rooted in nature, growing together': 'በተፈጥሮ ላይ ተመሥርተን አብረን እያደግን',
    'A diverse region connected by a shared future': 'በጋራ የወደፊት ራዕይ የተሳሰረ ልዩ ልዩ ክልል',
    'Starter service listings are illustrative and should be replaced with verified regional information.': 'የአገልግሎት ዝርዝሮቹ ምሳሌዎች ናቸው፤ በተረጋገጠ ክልላዊ መረጃ መተካት አለባቸው።',
    'Starter stories are illustrative sample content, not official announcements.': 'የታሪክ ምሳሌዎቹ ለማብራሪያ የቀረቡ ናቸው፤ ይፋዊ ማስታወቂያዎች አይደሉም።',
    'Official Sidama Regional State AI Assistant': 'የሲዳማ ክልል መንግሥት ይፋዊ የAI ረዳት',
    'Searches the web and links to sources. Verify current or official information.': 'ድረ ገጽን ፈልጎ ምንጮችን ያያይዛል። ወቅታዊ ወይም ይፋዊ መረጃን ያረጋግጡ።',
    'Hello! Ask me about Sidama. I search the web and share sources in English, Amharic, or Sidaamu Afoo.': 'ሰላም! ስለ ሲዳማ ይጠይቁኝ። በእንግሊዝኛ፣ በአማርኛ ወይም በሲዳሙ አፎ ድረ ገጽን እፈልጋለሁ፤ ምንጮችንም አካፍላለሁ።',
    'Ask about Sidama...': 'ስለ ሲዳማ ይጠይቁ...',
    'Preparing an answer…': 'መልስ በማዘጋጀት ላይ…',
    'Check linked sources.': 'የተያያዙ ምንጮችን ይመልከቱ።',
    'Search the web for this question': 'ለዚህ ጥያቄ ድረ ገጹን ይፈልጉ',
    'Open Google Search results in a new tab.': 'የGoogle ፍለጋ ውጤቶችን በአዲስ ታብ ይክፈቱ።',
    'Where is Sidama?': 'ሲዳማ የት ይገኛል?',
    'What is Fichee–Chambalaalla?': 'ፊቼ–ጫምባላላ ምንድን ነው?',
    'What is Luwa?': 'ሉዋ ምንድን ነው?',
    'Cannot reach the API server. Start the server and try again.': 'የAPI አገልጋዩን ማግኘት አልተቻለም። አገልጋዩን አስነስተው እንደገና ይሞክሩ።',
    'Explore investment potential, connect with our institutions, and be part of our region’s progress.': 'የኢንቨስትመንት ዕድሎችን ይመርምሩ፣ ከተቋሞቻችን ጋር ይገናኙ፣ በክልላችን እድገትም ይሳተፉ።',
    'Sidama is described as four zones and the zone-level city of Hawassa.': 'ሲዳማ በአራት ዞኖችና በዞን ደረጃ በምትገኘው ሐዋሳ ከተማ የተዋቀረ ነው።',
    'Some content may still be shown in English.': 'አንዳንድ ይዘቶች አሁንም በእንግሊዝኛ ሊታዩ ይችላሉ።',
    'Skip to content': 'ወደ ይዘቱ ይሂዱ', 'Main navigation': 'ዋና ማውጫ', 'Select language': 'ቋንቋ ይምረጡ',
    'Ask Sidama': 'ስለ ሲዳማ ይጠይቁ', 'Close chat': 'ውይይቱን ዝጋ', 'Suggested questions': 'የተጠቆሙ ጥያቄዎች',
  },
  sid: {
    'Home': 'Mino', 'About Sidama': 'Sidama Qoqqowo', 'Government': 'Govermentete', 'Economy': 'Ekonomi', 'Culture': 'Aadaa', 'Tourism': 'Turizime',
    'Education': 'Barsiisamme', 'Environment': 'Qilleensa', 'Transport': 'Gaamo', 'Services': 'Ooshshe', 'Investment': 'Investimenti', 'News': 'Hawalle', 'Documents': 'Boroote',
    'More': 'Leddo', 'Contact us': 'Toshshe', 'Official website of the Sidama Regional State': 'Sidama Qoqqowo Mootimma Awaajju Woyite',
    'Welcome to Sidama': 'Sidama woyite keeshshite', 'A region of': 'Hagiro Qoqqowo', 'promise & possibility.': 'Ammanne dandiinote.', 
    'Discover our people, culture, and shared vision for a thriving future in the heart of southern Ethiopia.': 'Kaima, aadaa nna garaanchu kaima leellishanno gede, Dihhi Ethiopia giddo Sidama kaima xaado assine beettanno.',
    'Discover Sidama': 'Sidama leellishshe', 'Our government': 'Mootimma', 'A home for heritage. A future for all.': 'Aadaa mine. Baalunku kaima.',
    'Our home': 'Kaima mine', 'Rooted in heritage.': 'Aadaa giddo xaphoosine.', 'Growing together.': 'Xaphoosine dichoommo.',
    'Get to know Sidama': 'Sidama leellishshe', 'regional state, many communities': 'Qoqqowo, danchu xaadooshshe', 'Here to help': 'Kaa’looshsho', 'Services for every community': 'Baalunku xaadooshshe ooshshe',
    'Explore information and support from regional institutions.': 'Qoqqowo xaadooshshu gummeete giddo xawishsha nna kaa’lo leellishshe.', 'View all services': 'Baalunku ooshshe leellishshe',
    'From the region': 'Qoqqowote', 'News & updates': 'Hawalle nna haaroo', 'Stories, announcements, and the latest from across Sidama.': 'Sidama giddo gara, awaajju nna haaroo xawishsha.',
    'All news': 'Baalunku hawalle', 'Your next chapter': 'Wolu gara', 'Find your opportunity': 'Dandiino hakkino', 'in Sidama.': 'Sidama giddo.',
    'Explore investment': 'Investimenti leellishshe', 'Explore': 'Leellishshe', 'Information': 'Xawishsha', 'Get in touch': 'Toshshe',
    'About the region': 'Qoqqowo garinni', 'Economy & livelihoods': 'Ekonomi nna jira', 'Environment & health': 'Qilleensa nna fayya',
    'Public services': 'Hawalle ooshshe', 'Invest in Sidama': 'Sidama giddo investimenti assi', 'Documents & resources': 'Boroote nna gummeete',
    'Contact the regional administration': 'Qoqqowo mootimma toshthe', 'Southern Ethiopia': 'Dihhi Ethiopia',
    'Want to learn more or get in touch?': 'Leddo leellishate woy toshate hasiissanno?',
    'We’re here to help': 'Kaa’looshsho', 'Let’s talk.': 'Hasaawino.', 'Contact information': 'Toshshe xawishsha',
    'Visit us': 'Woyite', 'Public inquiries': 'Hawalle hasaawa', 'Your name': 'Sunku', 'Email address': 'Emailte adresi',
    'Subject': 'Hasiishsha', 'Your message': 'Kaaima', 'Send message': 'Kaaima soyi', 'Sending…': 'Soyaanni…',
    'Thank you. Your message has been received.': 'Galatoommo. Kaaimasi ikkito.', 'Back to news': 'Hawallete widira',
    'Read story': 'Gara nabbawi', 'Loading story…': 'Gara laadanni…', 'Page not found': 'Qoola dihino',
    'Our region': 'Qoqqowo mine', 'A place to belong.': 'Kaima mine.', 'Identity & heritage': 'Ama nna aadaa',
    'Culture carried forward.': 'Aadaa haaroo.', 'Sidaamu Afoo': 'Sidaamu Afoo',
    'Festival dates & celebrations': 'Baala nna baalishsha', 'Customs & community values': 'Aadaa nna xaadooshshe',
    'Reconciliation before the New Year': 'Haaroo dirri albaanni shiqishsha', 'Enset foods & sustainability': 'Weese muusa nna ammanamme',
    'The Gudumaale & Qetala': 'Gudumaale nna Qetala', 'Passing traditions on': 'Aadaa worra leellishsha',
    'UNESCO recognition': 'UNESCO leellishsha', 'Experience the festival from Hawassa': 'Hawassa giddo baala leellishsha',
    'Traditional leadership': 'Aadaa moota', 'Living heritage': 'Jira aadaa',
    'Sidama coffee': 'Sidama Buna', 'Public services.': 'Hawalle ooshshe.',
    'Close menu': 'Menu cufi', 'Open menu': 'Menu fani', 'Language': 'Afii',
    'Learn more about': 'Leddo leellishshe', 'Serving our communities and building a bright, inclusive future for Sidama.': 'Xaadooshshe ooshshe nna Sidama kaima leellishsha.',
    'Illustrated green highlands and coffee trees of Sidama': 'Sidama mittu diri nna buna mitto misile',
    'Rooted in nature, growing together': 'Umo giddo xaphoosine dichoommo',
    'A diverse region connected by a shared future': 'Danchu qoqqowo kaima leellishshinni xaphoosine',
    'Starter service listings are illustrative and should be replaced with verified regional information.': 'Ooshshe leellishshu mitte misileeti; qoqqowo xawishshinni soorramanno.',
    'Starter stories are illustrative sample content, not official announcements.': 'Gara leellishshu mitte misileeti; mootimma awaajju dikki.',
    'Official Sidama Regional State AI Assistant': 'Sidama Qoqqowo Mootimma Awaajju AI Kaa’looshsho',
    'Searches the web and links to sources. Verify current or official information.': 'Webete giddo hasaawa, gummeete xaadisha. Haaroo woy awaajju xawishsha buuxi.',
    'Hello! Ask me about Sidama. I search the web and share sources in English, Amharic, or Sidaamu Afoo.': 'Keessho! Sidama garinni hasaawi. Webete giddo English, Amharic woy Sidaamu Afoo giddo hasaawa nna gummeete leellisha.',
    'Ask about Sidama...': 'Sidama garinni hasaawi...',
    'Preparing an answer…': 'Daafira qixxeessanni…',
    'Check linked sources.': 'Xaaddino gummeete leellishshe.',
    'Search the web for this question': 'Tini hasaawira webete giddo hasaawi',
    'Open Google Search results in a new tab.': 'Google hasaawu gumma haaroo taabete giddo fani.',
    'Where is Sidama?': 'Sidama hakkoonni? ',
    'What is Fichee–Chambalaalla?': 'Fichee–Chambalaalla maati?',
    'What is Luwa?': 'Luwa maati?',
    'Cannot reach the API server. Start the server and try again.': 'API servera geeshsha didandiino. Servera kaimi nna qolte qorophisi.',
    'Explore investment potential, connect with our institutions, and be part of our region’s progress.': 'Investimenti dandiino leellishshe, gummeete xaado assi, nna qoqqowo dichooma giddo kaima assi.',
    'Some content may still be shown in English.': 'Mitte xawishsha English giddo leellishanno.',
    'For public information, service questions, or general inquiries, send us a message or visit the regional administration in Hawassa.': 'Hawalle xawishsha, ooshshe hasaawa woy xaphooma hasaawa ikkite kaaima soyi woy Hawassa Qoqqowo mootimma woyite.',
    'Use the contact form and our team will follow up.': 'Toshshe formete horoonsi, kaima mine widooshshi.',
    'Skip to content': 'Toso giddo worba', 'Main navigation': 'Gobbaanni qineessamme', 'Select language': 'Afii doori',
    'Ask Sidama': 'Sidama garinni hasaawi', 'Close chat': 'Hasaawa cufi', 'Suggested questions': 'Hassantino hasaawishsha',
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
  { label: 'Government', to: '/government' },
  { label: 'Economy', to: '/economy' },
  { label: 'Culture', to: '/culture' },
  { label: 'Tourism', to: '/tourism' },
]

const moreNavigation = [
  { label: 'Education', to: '/education' },
  { label: 'Environment', to: '/environment' },
  { label: 'Transport', to: '/transport' },
  { label: 'Services', to: '/services' },
  { label: 'Investment', to: '/investment' },
  { label: 'News', to: '/news' },
  { label: 'Documents', to: '/documents' },
]

const localServices = [
  { id: '1', name: 'Business registration', description: 'Register a business or update an existing license through the relevant regional bureau.', category: 'Business' },
  { id: '2', name: 'Investment support', description: 'Explore priority sectors, investment opportunities, and support available to investors.', category: 'Investment' },
  { id: '3', name: 'Public information', description: 'Find official notices, publications, and information from regional institutions.', category: 'Information' },
]

const localNews = [
  { id: '1', title: 'Building opportunity across Sidama', category: 'Development', published_at: '2025-02-18', summary: 'Regional institutions continue working with communities to strengthen inclusive growth and essential public services.' },
  { id: '2', title: 'A region rich in culture and natural beauty', category: 'Culture', published_at: '2025-01-30', summary: 'Discover vibrant traditions, highland landscapes, and the coffee heritage that make Sidama distinctive.' },
  { id: '3', title: 'Public service information in one place', category: 'Public notice', published_at: '2025-01-12', summary: 'Residents can explore regional services and find contact information through this public portal.' },
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
      <div><h3>{t('Explore')}</h3><Link to="/about">{t('About the region')}</Link><Link to="/government">{t('Government')}</Link><Link to="/economy">{t('Economy & livelihoods')}</Link><Link to="/culture">{t('Culture')}</Link><Link to="/tourism">{t('Discover Sidama')}</Link></div>
      <div><h3>{t('Information')}</h3><Link to="/education">{t('Education')}</Link><Link to="/environment">{t('Environment & health')}</Link><Link to="/transport">{t('Transport')}</Link><Link to="/services">{t('Public services')}</Link><Link to="/investment">{t('Invest in Sidama')}</Link><Link to="/documents">{t('Documents & resources')}</Link></div>
      <div><h3>{t('Get in touch')}</h3><p>Hawassa, Sidama Regional State<br />Ethiopia</p><Link to="/contact">{t('Contact the regional administration')} <Icon name="arrow" size={15} /></Link></div>
    </div>
    <div className="footer-bottom"><div className="container"><span>© Sidama Regional State. All rights reserved.</span><span>Public service · Shared progress</span></div></div>
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
        if (error.name !== 'AbortError') setState({ items: [], loading: false, error: 'Live updates are temporarily unavailable. Showing the latest available information.' })
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

function Home() {
  const { t } = useLanguage()
  const news = useApi('/news')
  const services = useApi('/services')
  const articles = news.items.length ? news.items.slice(0, 3) : localNews
  const serviceItems = services.items.length ? services.items.slice(0, 3) : localServices
  return <main id="main-content">
    <section className="hero" aria-labelledby="home-heading"><div className="container hero-inner"><div className="hero-copy"><h1 id="home-heading">{t('A region of')}<br /><em>{t('promise & possibility.')}</em></h1><p>{t('Discover our people, culture, and shared vision for a thriving future in the heart of southern Ethiopia.')}</p><div className="hero-actions"><Link className="button button-gold" to="/about">{t('Discover Sidama')} <Icon name="arrow" size={17} /></Link><Link className="hero-secondary" to="/government">{t('Our government')} <Icon name="arrow" size={16} /></Link></div><div className="hero-note"><span className="note-line" /><span>{t('Welcome to Sidama')}</span><span aria-hidden="true">·</span><span>{t('A home for heritage. A future for all.')}</span></div></div><aside className="hero-visual" aria-label={t('Sidama Regional State')}><h2>{t('Rooted in heritage.')}<br /><em>{t('Growing together.')}</em></h2><p>{t('From the fertile highlands and celebrated coffee farms to the warmth of our communities, Sidama is a region shaped by resilience, rich traditions, and a bold vision for tomorrow.')}</p><div className="hero-stat"><p><strong>{t('One')}</strong><span>{t('regional state, many communities')}</span></p><span>{t('A diverse region connected by a shared future')}</span></div></aside></div></section>
    <section className="services-section" aria-labelledby="services-heading"><div className="container"><SectionHeading id="services-heading" title="Services for every community" description="Explore information and support from regional institutions." link="View all services" to="/services" /><p className="sample-note">{t('Starter service listings are illustrative and should be replaced with verified regional information.')}</p>{services.error && <p className="api-note" role="status">{t(services.error)}</p>}<div className="service-grid">{serviceItems.map((item) => <ServiceCard key={item.id} service={item} />)}</div></div></section>
    <section className="news-section" aria-labelledby="news-heading"><div className="container"><SectionHeading id="news-heading" title="News & updates" description="Stories, announcements, and the latest from across Sidama." link="All news" to="/news" /><p className="sample-note">{t('Starter stories are illustrative sample content, not official announcements.')}</p>{news.error && <p className="api-note" role="status">{t(news.error)}</p>}<div className="news-grid">{articles.map((item, index) => <NewsCard key={item.id} article={item} featured={index === 0} />)}</div></div></section>
    <section className="cta-section"><div className="container cta-inner"><h2>{t('Find your opportunity')}<br /><em>{t('in Sidama.')}</em></h2><div><p>{t('Explore investment potential, connect with our institutions, and be part of our region’s progress.')}</p><Link className="button button-outline" to="/investment">{t('Explore investment')} <Icon name="arrow" size={17} /></Link></div></div></section>
  </main>
}

const pages = {
  '/about': { eyebrow: 'Our region', title: 'A place to belong.', intro: 'Sidama is a regional state in southern Ethiopia, shaped by the history, language, and traditions of its people and by landscapes that range from highlands to lakeside communities.', sections: [['A regional state', 'Sidama became a regional state on 18 June 2020, following the 2019 referendum in which 98.52% of voters supported regional autonomy. Hawassa is the regional capital.'], ['People & language', 'The Sidama people give their name to the region and its language, Sidaamu Afoo. In Ethiopia’s 2007 census, Sidama made up 93.01% of the regional population, and 94.23% reported Sidama as their first language.'], ['Culture & heritage', 'Fichche, the Sidama New Year, is an important cultural celebration. In the traditional moote system, a Mootichcha led political and administrative life with the support of a Ga’ro; this describes a historical institution, not the current regional government.'], ['Land & climate', 'The region lies between Lake Hawassa and the Bilate River, with terrain that extends from warm lowlands to cooler highlands. Lake Hawassa and the surrounding fertile landscapes are among its defining natural features.'], ['Towns & livelihoods', 'Hawassa, Yirgalem, Wondo Genet, Chuko, Hula, Bona, Bensa, and Aleta Wendo are among Sidama’s towns. Agriculture is central to local livelihoods, and Sidama is especially well known for coffee.'], ['Transport & connections', 'A 2004 World Bank memorandum reported a road density of 137.4 km per 1,000 km² for the area. This is a historical figure, not a measure of current roads or travel conditions; check current local information when planning a journey.']] },
  '/government': { eyebrow: 'Public leadership', title: 'Government & institutions.', intro: 'Regional institutions work to serve residents, support communities, and deliver on the priorities of Sidama Regional State.', sections: [['Regional administration', 'The regional administration coordinates public policy, development priorities, and the delivery of government services.'], ['Council & representation', 'Elected representatives contribute to regional legislation, public accountability, and representation of community interests.'], ['Regional bureaus', 'Public bureaus lead work across essential sectors, including education, health, agriculture, infrastructure, and investment.']], zones: [
    { name: 'Central Sidama Zone', districts: ['Arbegona', 'Dale', 'Darara', 'Loko Abaya', 'Shafamo', 'Wensho (Wonsho)'], towns: ['Irgalem'] },
    { name: 'Eastern Sidama Zone', districts: ['Aroresa', 'Bensa', 'Bona Zuria', 'Bura', 'Chabe Gambeltu', 'Chere', 'Daela', 'Hoko'], towns: ['Daye'] },
    { name: 'Northern Sidama Zone', districts: ['Bilate Zuria', 'Boricha', 'Gorche', 'Hawassa Zuria', 'Malga', 'Shebedino', 'Wondo Genet'], towns: ['Leku'] },
    { name: 'Southern Sidama Zone', districts: ['Aleta Wendo', 'Bursa', 'Chuko', 'Dara', 'Dara Otilcho', 'Hula', 'Teticha'], towns: ['Aleta Wendo'] },
  ], city: { name: 'Hawassa', subdivisions: ['Addis Ketema', 'Hayk Dar', 'Mehal', 'Menahariya', 'Misrak', 'Tabor', 'Hawela Tula', 'Bahil Adarash'] }, districtPopulation: [
    ['Bensa', '250,727', '342,116'],
    ['Boricha', '250,260', '339,933'],
    ['Dale', '242,658', '357,733'],
    ['Shebedino', '233,922', '320,639'],
    ['Aleta Wendo', '188,976', '276,385'],
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
  ] },
  '/economy': { eyebrow: 'Livelihoods & trade', title: 'An economy rooted in the land.', intro: 'Agriculture is central to livelihoods in Sidama. Coffee, food crops, and livestock are important parts of rural life, alongside the region’s markets, services, and growing towns.', coffeeFeature: { image: '/sidama-coffee-harvest.png', alt: 'A Sidama coffee farmer harvesting ripe red coffee cherries into a basket', title: 'Coffee is the backbone of Sidama’s economy', copy: 'Coffee sustains livelihoods across the region, connects farming communities to global markets, and is one of Sidama’s most recognized contributions to Ethiopia’s economy.' }, coffeeLandscape: { image: '/sidama-coffee-landscape.png', alt: 'Illustration of coffee plants and cultivated green hills in Sidama', caption: 'Coffee-growing hillsides are part of Sidama’s agricultural landscape.' }, sections: [['Coffee & trade', 'Sidama is one of Ethiopia’s well-known coffee-growing areas. Coffee supports rural households and connects local producers with domestic and international markets. A source cited in the supplied material reported that Sidama and Gedeo together produced 63,562 tonnes in 2005; this combined, historical figure should not be read as current Sidama-only output.'], ['Farming & food crops', 'Many households depend on agriculture, including subsistence farming. The supplied source describes varied crop production and notes that reliable rainfall and fertile land have supported local food production, while reliance on rainfall and limited agricultural development can leave livelihoods vulnerable.'], ['Livestock & rural livelihoods', 'Livestock, particularly cattle, have economic and social importance in Sidama. They contribute to household livelihoods and are traditionally regarded as a measure of wealth.'], ['Water & opportunity', 'The region has significant water resources, which the supplied source describes as underutilized. Responsible investment in water access, sanitation, and productive uses can support communities and economic development.'], ['Building a resilient economy', 'Diversifying livelihoods, strengthening agricultural productivity, and expanding value-added coffee processing can help communities respond to changing market prices and climate risks. For current economic indicators and investment guidance, consult the relevant regional institutions.']] },
  '/culture': {
    eyebrow: 'Identity & heritage',
    title: 'Culture carried forward.',
    intro: 'Sidama culture is expressed through language, community life, traditional knowledge, and celebrations that connect generations.',
    cultureImage: { src: '/fichee-chambalaalla.png', alt: 'Men in traditional attire carrying shields and staffs at an outdoor Sidama cultural gathering', caption: 'Fichee–Chambalaalla brings communities together for vibrant cultural celebrations.' },
    sections: [
      ['Sidaamu Afoo', 'Sidaamu Afoo is the language of the Sidama people and an important part of cultural identity. The 2007 census material supplied for this site reported it as the first language of 94.23% of the region’s population at that time.'],
      ['Fichee–Chambalaalla, the Sidama New Year', 'Fichee-Chambalaalla is the Sidama New Year festival, celebrated by the Sidama people of Sidama Regional State. Oral tradition tells of a Sidama woman who, after marriage, visited her parents and relatives once a year, bringing a meal made from false banana, milk, and butter to share with neighbors. The visit and shared meal grew into a unifying symbol of Sidama identity.'],
      ['Festival dates & celebrations', 'Astrologers determine the festival date each year and announce it to the clans. In 2026, Chambalaalla was celebrated on 15 March. The 2027 celebration is expected around the second week of March, but its exact date has not yet been confirmed; check for an official announcement closer to the festival. Sequences of events take place throughout the Sidama New Year, with especially vibrant celebrations on Fichee day and the following day, Chambalaalla. Traditional songs, dances, and communal events bring Sidama people of all ages, genders, and social backgrounds together.'],
      ['Customs & community values', 'On the first day, children visit homes in their neighborhoods to greet their neighbors. During the festival, clan leaders encourage people to work hard, respect and support elders, and avoid cutting indigenous trees, begging, idleness, false testimony, and theft. The festival promotes equity, good governance, social cohesion, peaceful coexistence, and connections among Sidama clans and Ethiopia’s diverse communities.'],
      ['Reconciliation before the New Year', 'Fichee is also a time to seek reconciliation and begin the New Year without unresolved grievances. In the weeks before the festival, elders may help mediate disputes between relatives and neighbors. The ideal of a clean, peaceful heart is associated with the sharing of milk and Burisame.'],
      ['Enset culture: the tree against hunger', 'Enset, also known as Weese or false banana, is central to Sidama foodways, livelihoods, and cultural identity. The plant supports food security and provides staple foods such as Kocho, Bula, and Wassa, as well as traditional medicine and useful materials. Festival foods such as Burisame and Chukame also reflect enset’s place in community life.'],
      ['The Gudumaale & Qetala', 'Public celebrations are also held at Gudumaale, traditional open-air community gathering grounds often shaded by mature trees. The community gathering and renewal known as Qetala is an important part of the celebration, bringing people together in a shared public space.'],
      ['Passing traditions on', 'Parents pass the tradition to children through oral teaching and participation in festival events. Women play an important role in sharing knowledge and skills, including hairdressing and preparing festival meals, with their daughters and other girls in their villages.'],
      ['UNESCO recognition', 'Fichee–Chambalaalla was inscribed on UNESCO’s Representative List of the Intangible Cultural Heritage of Humanity in November 2015. The recognition reflects the festival’s significance and the values of peace, justice, and community it shares with the wider world.'],
      ['Experience the festival from Hawassa', 'A festival visit can include a two-night stay in Hawassa, the lively Rift Valley city on the shore of Lake Hawassa. The lake is known for its scenic shoreline, colobus and vervet monkeys, and diverse birdlife. Fichee–Chambalaalla can also be part of a longer itinerary combining history and culture, coffee experiences, visits to the Omo area, birdwatching, trekking, and other activities. Confirm festival dates, local arrangements, and access with tour operators and community hosts before travel.'],
      ['The Luwa and Indigenous Governance System', 'Luwa is a traditional Sidama generational age-grade and socio-political institution. Historical accounts describe it as an organizing framework for community responsibilities, leadership, social order, and conflict resolution, with councils of elders playing an important role. It is part of Sidama’s indigenous heritage and is distinct from the present regional government and formal legal system.'],
      ['Luwa grades and cycle', 'Descriptions of the Luwa system identify five grades: Darara, Fullassa, Mawa, Wawissa, and Mogissa. The grades are described as rotating through seven-year periods, making a full five-grade cycle 35 years. Membership and initiation are traditionally associated with a person’s father’s grade rather than birth year.'],
      ['Life stages and responsibilities', 'Traditional descriptions distinguish stages of life and service: Cotte refers to youth learning and helping their families and communities; Kirma to initiated young people learning community duties; Lallawa to the active governing grade; and Cimeeyye to elders serving in advisory, judicial, and ritual roles. Practices and interpretations may vary across communities and over time.'],
      ['Luwa Shino: initiation and transition', 'Luwa Shino, also referred to as Gara in accounts of the tradition, marks initiation and transition into greater responsibility. Descriptions include preparation and instruction guided by elders, followed by ceremonies and blessings. Traditional leadership titles associated with this transition include Woma and Woma-Cimeessa.'],
      ['Songo: community deliberation and conflict resolution', 'Songo refers to traditional councils and dispute-resolution practices described at village and higher community levels. Halale—the principle of truth, justice, and harmony with Magano—is presented as a moral foundation. Ollaa Songo addresses local matters, with an emphasis on reconciliation; responses may include apology or fines, while serious breaches can carry social consequences. These traditional practices should not be confused with or represented as a replacement for formal courts.'],
      ['Living heritage', 'Cultural knowledge is carried through family and community life, language, customs, and shared celebrations. Respectful engagement with local communities helps keep these traditions valued and thriving.'],
    ],
  },
  '/education': { eyebrow: 'Learning & opportunity', title: 'Education for every generation.', intro: 'Access to learning supports opportunity for children and communities. The supplied source reports a low kindergarten gross enrollment ratio and barriers including school availability and community awareness. Its reporting year is not stated, so the statistics below are historical reference figures, not current totals.', sections: [['Schools listed in the source', 'The source lists 75 kindergartens, 633 primary schools, and 12 secondary schools in Sidama. The reporting year is not provided, so these counts should not be treated as current.'], ['Kindergarten enrollment', 'The source reports 6,863 kindergarten students: 3,700 boys and 3,163 girls. For children aged 4–6, it gives a total population of about 360,547: 181,543 boys and 179,004 girls. The reported kindergarten gross enrollment ratio is about 1.9% overall, 2.04% for boys, and 1.77% for girls. These are figures from an undated source and do not establish present enrollment.'], ['Access to early learning', 'The source points to limited school availability and community awareness as barriers to young children’s participation. Improving access to early learning and supporting families to enroll children can help widen educational opportunity.'], ['Current information', 'For up-to-date school counts, enrollment data, and education programs, consult the relevant Sidama regional education authorities.']] },
  '/environment': { eyebrow: 'Land, water & wellbeing', title: 'A healthy environment matters.', intro: 'Sidama’s fertile landscapes and water resources are vital to livelihoods and wellbeing. The available information includes older studies and should not be read as a current environmental or public-health assessment.', sections: [['Land & soil', 'A study cited in the supplied material classified soil erosion in Sidama as medium in 1988 and described pressure on farmland and pasture. These are historical observations; current conditions may differ. Soil conservation and sustainable land management remain important to resilient livelihoods.'], ['Water, sanitation & health', 'A 2009 baseline survey reported that 7% of surveyed households used a latrine, with open defecation reported by the remainder. This is a historical survey result, not a current estimate. The supplied source also describes health extension workers and community health promoters as supporting hygiene and sanitation education.'], ['Health figures in context', 'A 2009–2011 emergency response plan for the wider SNNPR estimated up to 65,260 acute watery diarrhea cases in 2009. This was an estimate for the wider region, not a Sidama-only count, and it should not be interpreted as current.'], ['Water resources & community action', 'The supplied material describes water resources as important but subject to pollution and access challenges. Community participation, safe water, sanitation, and hygiene education are essential elements of local solutions.'], ['Current environmental information', 'The available environmental observations are dated and do not provide a verified picture of current conditions. Consult current regional environment, water, and health authorities for recent data and programs.']] },
  '/investment': { eyebrow: 'Grow with us', title: 'Invest in Sidama.', intro: 'A dynamic economy, productive agricultural land, and a strategic location create opportunities for responsible, sustainable investment.', sections: [['Agriculture & agro-processing', 'Build on Sidama’s strong agricultural base and globally recognized coffee sector with value-added production.'], ['Tourism & hospitality', 'Develop experiences grounded in the region’s landscapes, culture, and welcoming communities.'], ['Partnership & support', 'Connect with regional institutions to learn about priority sectors, local conditions, and investment processes.']] },
  '/tourism': { eyebrow: 'Discover Sidama', title: 'A journey worth taking.', intro: 'From lakeside scenery and highland landscapes to coffee-growing communities and living cultural traditions, Sidama offers many ways to experience southern Ethiopia.', sections: [['Lake Hawassa & Logita Falls', 'Lake Hawassa and Logita Falls are among the region’s natural attractions. The lakeside setting offers a chance to enjoy the water and surrounding landscape.'], ['Highlands & changing landscapes', 'Sidama’s terrain ranges from warm lowlands to cooler highlands. Wondo Genet and the countryside around Yirgalem are among the places visitors can explore while discovering the region’s varied scenery.'], ['Coffee country', 'Coffee is part of Sidama’s agricultural heritage and a defining feature of its landscape. Visitors can learn about coffee-growing communities and the work behind the region’s coffee.'], ['Culture & community', 'Fichche, the Sidama New Year, is a notable cultural tradition. Local food, language, and community life are also important ways to understand the region’s heritage.'], ['Getting around', 'Hawassa is the regional capital and a useful starting point for exploring nearby towns and attractions. Road figures available in the supplied historical source date to 2004, so check current local sources for routes, transport options, and travel conditions.']] },
  '/transport': { eyebrow: 'Getting around', title: 'Transport & connections.', intro: 'Plan journeys between Hawassa, Sidama’s towns, and the communities that make up the region. Routes, schedules, and road conditions can change, so confirm current details locally before travelling.', sections: [['Starting in Hawassa', 'Hawassa is Sidama’s regional capital and an important starting point for journeys around the region. Confirm your onward route and transport arrangements with a current local source.'], ['Road travel', 'Road connections link regional towns and rural communities. Journey times and road conditions vary by route, season, and weather; allow extra time and check conditions before setting out.'], ['Public and local transport', 'Transport options and service frequency vary between towns and rural areas. Ask a local transport operator or trusted local contact about current departures, fares, and the best connection for your destination.'], ['Travel responsibly', 'For visits to rural communities and natural sites, plan your return journey, carry essentials, and seek local guidance about access and community customs. Do not rely on historical road statistics as a guide to present conditions.'], ['Official information', 'This page does not provide live schedules, fares, road closures, or emergency updates. Consult current regional transport authorities and local operators for verified travel information.']] },
  '/documents': { eyebrow: 'Resources', title: 'Documents & publications.', intro: 'Find public information, regional publications, and resources shared by Sidama Regional State institutions.', sections: [['Public information', 'This portal is being prepared to make official publications and public notices easier to find.'], ['Request a document', 'Contact the regional administration to ask about a publication or public record.'], ['Stay informed', 'Visit the news page for current announcements and updates from across the region.']] },
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
    <p className="administrative-note">{t('Administrative names and boundaries may change; consult current regional sources for official use.')}</p>
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

function InfoPage({ page }) {
  const { t } = useLanguage()
  return <main id="main-content" className="page-main"><div className="container"><div className="page-heading"><h1>{t(page.title)}</h1><p>{t(page.intro)}</p></div>{page.coffeeFeature && <section className="coffee-feature" aria-labelledby="coffee-feature-heading"><img src={page.coffeeFeature.image} alt={t(page.coffeeFeature.alt)} /><div className="coffee-feature-copy"><h2 id="coffee-feature-heading">{t(page.coffeeFeature.title)}</h2><p>{t(page.coffeeFeature.copy)}</p></div></section>}{page.coffeeLandscape && <figure className="coffee-landscape"><img src={page.coffeeLandscape.image} alt={t(page.coffeeLandscape.alt)} /><figcaption>{t(page.coffeeLandscape.caption)}</figcaption></figure>}{page.cultureImage && <figure className="culture-image"><img src={page.cultureImage.src} alt={t(page.cultureImage.alt)} /><figcaption>{t(page.cultureImage.caption)}</figcaption></figure>}<div className="info-layout"><aside className="info-aside" aria-label={t('Sidama Regional State')}><span className="aside-leaf"><Icon name="leaf" size={32} /></span><p>{t('Sidama Regional State')}</p><span>{t('Southern Ethiopia')}</span></aside><div className="info-sections">{page.sections.map(([title, copy], index) => <article className="info-row" key={title}><span className="info-index">{String(index + 1).padStart(2, '0')}</span><div><h2>{t(title)}</h2><p>{t(copy)}</p></div></article>)}</div></div>{page.zones && <AdministrativeDivisions zones={page.zones} city={page.city} districtPopulation={page.districtPopulation} />}<div className="page-cta"><p>{t('Want to learn more or get in touch?')}</p><Link className="button button-green" to="/contact">{t('Contact us')} <Icon name="arrow" size={17} /></Link></div></div></main>
}

function ListingPage({ type }) {
  const { t } = useLanguage()
  const isNews = type === 'news'
  const result = useApi(isNews ? '/news' : '/services')
  const items = result.items.length ? result.items : (isNews ? localNews : localServices)
  return <main id="main-content" className="page-main"><div className="container"><div className="page-heading"><h1>{t(isNews ? 'News & updates.' : 'Public services.')}</h1><p>{t(isNews ? 'The latest stories and announcements from Sidama Regional State.' : 'Information about services and support available from regional institutions.')}</p></div><p className="sample-note">{t(`These starter ${isNews ? 'stories' : 'service listings'} are illustrative and should be replaced with verified regional information.`)}</p>{result.error && <p className="api-note" role="status">{t(result.error)}</p>}{isNews ? <div className="news-grid listing-grid">{items.map((item, index) => <NewsCard key={item.id} article={item} featured={index === 0} />)}</div> : <div className="service-grid listing-grid">{items.map((item) => <ServiceCard key={item.id} service={item} />)}</div>}</div></main>
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
    {status === 'sample' && <p className="sample-note">{t('This illustrative sample story is not an official announcement.')}</p>}
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
