import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

/* English → Hindi dictionary for every fixed piece of text on the public site.
   Text that staff publish (notices, events, documents...) carries its own Hindi fields instead:
   use `pick(lang, item, 'title')` for those. Official translations can replace any line below. */
export const HI = {
  // top bar / header / menu
  'Government of India': 'भारत सरकार',
  'Skip to Main Content': 'मुख्य सामग्री पर जाएं',
  'Screen Reader Access': 'स्क्रीन रीडर एक्सेस',
  'Student login': 'छात्र लॉगिन',
  'Staff login': 'कर्मचारी लॉगिन',
  'Dashboard': 'डैशबोर्ड',
  'Log out': 'लॉग आउट',
  'Government of Uttar Pradesh': 'उत्तर प्रदेश सरकार',
  'District Institute of Education & Training': 'जिला शिक्षा एवं प्रशिक्षण संस्थान',
  'Department of Basic Education, Government of Uttar Pradesh': 'बेसिक शिक्षा विभाग, उत्तर प्रदेश सरकार',
  'DIET GHAZIPUR': 'डाइट गाज़ीपुर',
  'Search': 'खोजें',
  'Sitemap': 'साइटमैप',
  'AWP': 'वार्षिक कार्य योजना',
  'Contact Us': 'संपर्क करें',
  'Menu': 'मेनू',
  'Latest updates': 'ताज़ा सूचनाएं',
  'NEW': 'नया',

  // menu children
  'Overview': 'परिचय',
  'Vision & mission': 'दृष्टि एवं लक्ष्य',
  'Objectives': 'उद्देश्य',
  'Infrastructure': 'अवसंरचना',
  "Principal's message": 'प्राचार्य का संदेश',
  'History of principals': 'प्राचार्यों का इतिहास',
  'Organizational structure': 'संगठनात्मक संरचना',
  'Faculty members': 'संकाय सदस्य',
  'Administrative Structure': 'प्रशासनिक संरचना',
  'Academic Calendar': 'शैक्षणिक कैलेंडर',
  'Academic branches': 'शैक्षणिक शाखाएं',
  'Library and resources': 'पुस्तकालय एवं संसाधन',
  'Research and innovation': 'शोध एवं नवाचार',
  'Programme overview': 'कार्यक्रम का परिचय',
  'Admission and eligibility': 'प्रवेश एवं पात्रता',
  'Syllabus': 'पाठ्यक्रम',
  'Seats and fee': 'सीटें एवं शुल्क',
  'Pre-service training': 'सेवापूर्व प्रशिक्षण',
  'In-service training': 'सेवाकालीन प्रशिक्षण',
  'Training calendar': 'प्रशिक्षण कैलेंडर',
  'Examination schedule': 'परीक्षा कार्यक्रम',
  'Results': 'परिणाम',
  'Previous papers': 'पिछले वर्षों के प्रश्नपत्र',
  'Who we are and what we do.': 'हम कौन हैं और क्या करते हैं।',
  'Our vision and mission guide us in achieving excellence in teacher education and professional development.': 'हमारी दृष्टि और लक्ष्य शिक्षक शिक्षा एवं व्यावसायिक विकास में उत्कृष्टता प्राप्त करने में हमारा मार्गदर्शन करते हैं।',
  'What the institute works to achieve.': 'संस्थान किन लक्ष्यों के लिए कार्य करता है।',
  'Facilities available on campus.': 'परिसर में उपलब्ध सुविधाएं।',
  'A message from the Principal.': 'प्राचार्य की ओर से संदेश।',
  'Principals who have led the institute.': 'संस्थान का नेतृत्व करने वाले प्राचार्य।',
  'How the institute is organised.': 'संस्थान का संगठन कैसे किया गया है।',
  'Our academic staff.': 'हमारे शैक्षणिक कर्मचारी।',
  'Branches and their activities.': 'शाखाएं एवं उनकी गतिविधियां।',
  'Library, ICT lab and learning resources.': 'पुस्तकालय, आईसीटी प्रयोगशाला एवं अधिगम संसाधन।',
  'Action research and innovation projects.': 'क्रियात्मक शोध एवं नवाचार परियोजनाएं।',
  'The two-year Diploma in Elementary Education.': 'प्रारंभिक शिक्षा में दो वर्षीय डिप्लोमा।',
  'Eligibility, process and important dates.': 'पात्रता, प्रक्रिया एवं महत्वपूर्ण तिथियां।',
  'Course structure and syllabus.': 'पाठ्यक्रम की संरचना एवं विषय-वस्तु।',
  'Sanctioned seats and fee structure.': 'स्वीकृत सीटें एवं शुल्क संरचना।',
  'Training before entering service.': 'सेवा में आने से पहले का प्रशिक्षण।',
  'Training for serving teachers and principals.': 'कार्यरत शिक्षकों एवं प्रधानाचार्यों के लिए प्रशिक्षण।',
  'Schedule of upcoming programmes.': 'आगामी कार्यक्रमों की सूची।',
  'Dates and time tables.': 'तिथियां एवं समय सारणी।',
  'Published results.': 'प्रकाशित परिणाम।',
  'Question papers of earlier sessions.': 'पिछले सत्रों के प्रश्नपत्र।',
  'School internship for D.El.Ed. trainees.': 'डी.एल.एड. प्रशिक्षुओं के लिए विद्यालय इंटर्नशिप।',
  'This page is ready for the official content of DIET Ghazipur. Staff can upload related documents from the admin panel (Documents) and they appear in the table below automatically.':
    'यह पृष्ठ डाइट गाज़ीपुर की आधिकारिक सामग्री के लिए तैयार है। कर्मचारी एडमिन पैनल (दस्तावेज़) से संबंधित दस्तावेज़ अपलोड कर सकते हैं, जो नीचे तालिका में अपने आप दिखाई देंगे।',

  // generic UI
  'Home': 'मुख्य पृष्ठ',
  'Documents': 'दस्तावेज़',
  'S. No.': 'क्र.सं.',
  'Title': 'शीर्षक',
  'Activity / Event': 'गतिविधि / कार्यक्रम',
  'From': 'से',
  'To': 'तक',
  'Date': 'तिथि',
  'Details': 'विवरण',
  'View': 'देखें',
  'No documents have been uploaded yet.': 'अभी तक कोई दस्तावेज़ अपलोड नहीं किया गया है।',
  'No activities scheduled for this session.': 'इस सत्र के लिए कोई गतिविधि निर्धारित नहीं है।',
  'No documents in this category yet.': 'इस श्रेणी में अभी कोई दस्तावेज़ नहीं है।',
  'Read More': 'और पढ़ें',
  'VIEW ALL': 'सभी देखें',
  'Loading notices.': 'सूचनाएं लोड हो रही हैं…',
  'No notices in this category yet.': 'इस श्रेणी में अभी कोई सूचना नहीं है।',
  'CATEGORY:': 'श्रेणी:',
  'All Notices': 'सभी सूचनाएं',
  'All': 'सभी',
  'Pre-Service': 'सेवापूर्व',
  'In-Service': 'सेवाकालीन',
  'Examination': 'परीक्षा',
  'General': 'सामान्य',
  'Academic': 'शैक्षणिक',
  'Training': 'प्रशिक्षण',
  'Research': 'शोध',
  'Other': 'अन्य',
  'Previous update': 'पिछली सूचना',
  'Next update': 'अगली सूचना',

  // home
  'OFFICIAL NOTICE BOARD': 'आधिकारिक सूचना पट्ट',
  'QUICK ACCESS': 'त्वरित पहुंच',
  'D.EL.ED.': 'डी.एल.एड.',
  'TRAINING PROGRAMS': 'प्रशिक्षण कार्यक्रम',
  'EXAMINATION': 'परीक्षा',
  'INTERNSHIP': 'इन्टर्नशिप',
  'NOTICES': 'सूचनाएं',
  'DOWNLOADS': 'डाउनलोड्स',
  'GALLERY': 'गैलरी',
  'CONTACT US': 'संपर्क करें',
  "PRINCIPAL'S MESSAGE": 'प्राचार्य का संदेश',
  'UPCOMING EVENTS': 'आगामी कार्यक्रम',
  'No upcoming events. New events appear here when staff publish them.': 'कोई आगामी कार्यक्रम नहीं है। कर्मचारियों द्वारा प्रकाशित करने पर नए कार्यक्रम यहां दिखेंगे।',
  'EXPLORE GHAZIPUR DISTRICT': 'गाज़ीपुर जनपद को जानें',
  'PHOTO GALLERY': 'फोटो गैलरी',
  'Photos appear here once staff upload them.': 'कर्मचारियों द्वारा अपलोड करने पर फोटो यहां दिखेंगी।',
  'IMPORTANT LINKS': 'महत्वपूर्ण लिंक',
  'Uttar Pradesh Government': 'उत्तर प्रदेश सरकार',
  'SCERT Uttar Pradesh': 'एससीईआरटी उत्तर प्रदेश',
  'NCTE': 'एनसीटीई',
  'DIKSHA': 'दीक्षा',
  'National Education Policy': 'राष्ट्रीय शिक्षा नीति',
  'Centre for Quality Education and Teacher Training': 'गुणवत्तापूर्ण शिक्षा एवं शिक्षक प्रशिक्षण केंद्र',
  'Our aim is to contribute to society building through quality teacher education. We are committed to the all-round development of learners through innovation, discipline and collaboration.':
    'हमारा उद्देश्य गुणवत्तापूर्ण शिक्षक शिक्षा के माध्यम से समाज निर्माण में योगदान देना है। हम नवाचार, अनुशासन और सहयोग के द्वारा शिक्षार्थियों के सर्वांगीण विकास के लिए प्रतिबद्ध हैं।',
  'Principal Name': 'प्राचार्य का नाम',
  'DDR / PRINCIPAL': 'उप निदेशक / प्राचार्य',

  // map
  'Tehsils': 'तहसीलें',
  'Blocks': 'विकास खंड',
  'Institute': 'संस्थान',
  'Tehsil': 'तहसील',
  'Block': 'विकास खंड',
  'Get directions': 'मार्ग देखें',
  'DIET Ghazipur': 'डाइट गाज़ीपुर',
  'Ghazipur (Sadar)': 'गाज़ीपुर (सदर)',
  'Zamania': 'ज़मानिया',
  'Mohammadabad': 'मोहम्मदाबाद',
  'Saidpur': 'सैदपुर',
  'Jakhania': 'जखनिया',
  'Karanda': 'करंडा',
  'Birno': 'बिरनो',
  'District headquarters': 'जिला मुख्यालय',
  'District Institute of Education & Training, Saidpur': 'जिला शिक्षा एवं प्रशिक्षण संस्थान, सैदपुर',

  // about pages
  'Excellence': 'उत्कृष्टता', 'Integrity': 'सत्यनिष्ठा', 'Innovation': 'नवाचार',
  'Collaboration': 'सहयोग', 'Inclusiveness': 'समावेशिता', 'Commitment': 'प्रतिबद्धता',
  'VISION': 'दृष्टि', 'MISSION': 'लक्ष्य', 'OUR CORE VALUES': 'हमारे मूल मूल्य',
  'DIET Ghazipur works under the Department of Basic Education, Government of Uttar Pradesh. It runs pre-service (D.El.Ed.) and in-service teacher training, supports schools academically, and carries out action research for the district. Replace this text with the official profile of the institute.':
    'डाइट गाज़ीपुर उत्तर प्रदेश सरकार के बेसिक शिक्षा विभाग के अंतर्गत कार्य करता है। यह सेवापूर्व (डी.एल.एड.) एवं सेवाकालीन शिक्षक प्रशिक्षण संचालित करता है, विद्यालयों को शैक्षणिक सहयोग देता है तथा जनपद के लिए क्रियात्मक शोध करता है।',
  'To be a leading institute in teacher education and professional development for quality education.': 'गुणवत्तापूर्ण शिक्षा के लिए शिक्षक शिक्षा एवं व्यावसायिक विकास में अग्रणी संस्थान बनना।',
  'To empower educators through training, research, innovation and community engagement to enhance the quality of school education and transform lives.':
    'प्रशिक्षण, शोध, नवाचार और सामुदायिक सहभागिता के माध्यम से शिक्षकों को सशक्त बनाना, ताकि विद्यालयी शिक्षा की गुणवत्ता बढ़े और जीवन में परिवर्तन आए।',
  'Provide quality pre-service teacher education through the D.El.Ed. programme.': 'डी.एल.एड. कार्यक्रम के माध्यम से गुणवत्तापूर्ण सेवापूर्व शिक्षक शिक्षा प्रदान करना।',
  'Organise in-service training for teachers, head teachers and school principals.': 'शिक्षकों, प्रधानाध्यापकों एवं प्रधानाचार्यों के लिए सेवाकालीन प्रशिक्षण आयोजित करना।',
  'Support schools with academic resources, guidance and monitoring.': 'विद्यालयों को शैक्षणिक संसाधन, मार्गदर्शन एवं अनुश्रवण द्वारा सहयोग देना।',
  'Carry out action research and innovation in elementary education.': 'प्रारंभिक शिक्षा में क्रियात्मक शोध एवं नवाचार करना।',
  'Promote inclusive education and equity in every classroom.': 'प्रत्येक कक्षा में समावेशी शिक्षा एवं समानता को बढ़ावा देना।',
  'Administrative building': 'प्रशासनिक भवन', 'Classrooms and training halls': 'कक्षाएं एवं प्रशिक्षण कक्ष',
  'Library and reading room': 'पुस्तकालय एवं वाचनालय', 'Computer and ICT lab': 'कंप्यूटर एवं आईसीटी प्रयोगशाला',
  'Science and resource room': 'विज्ञान एवं संसाधन कक्ष', 'Hostel and campus facilities': 'छात्रावास एवं परिसर सुविधाएं',
  'Name': 'नाम', 'Photo': 'फोटो', 'Designation': 'पदनाम',
  'Principal (DDR)': 'प्राचार्य (उप निदेशक)', 'Head of the institute': 'संस्थान के प्रमुख',
  'Senior Lecturer': 'वरिष्ठ प्रवक्ता', 'Heads academic branches': 'शैक्षणिक शाखाओं के प्रमुख',
  'Lecturers': 'प्रवक्ता', 'Teaching, training and research': 'शिक्षण, प्रशिक्षण एवं शोध',
  'Administrative staff': 'प्रशासनिक कर्मचारी', 'Office, accounts and records': 'कार्यालय, लेखा एवं अभिलेख',
  'Name of current principal': 'वर्तमान प्राचार्य का नाम', 'Present': 'वर्तमान',
  'Faculty name': 'संकाय सदस्य का नाम', 'Lecturer': 'प्रवक्ता', 'Branch / subject': 'शाखा / विषय',

  // administration page
  'Administrative & Governance Structure': 'प्रशासनिक एवं शासन संरचना',
  'Under the Basic Education Department of Uttar Pradesh, a four-tier administrative hierarchy runs from the State Council of Educational Research and Training (SCERT) down to the government schools of the district.':
    'उत्तर प्रदेश के बेसिक शिक्षा विभाग के अंतर्गत चार स्तरीय प्रशासनिक व्यवस्था है, जो राज्य शैक्षिक अनुसंधान एवं प्रशिक्षण परिषद (एससीईआरटी) से लेकर जनपद के सरकारी विद्यालयों तक जाती है।',
  '4 Tiers': '4 स्तर', 'Administrative governance chain': 'प्रशासनिक शासन श्रृंखला',
  'DIETs across the state': 'राज्य भर में डाइट', 'Blocks in Ghazipur district': 'गाज़ीपुर जनपद में विकास खंड',
  'To be updated': 'अद्यतन किया जाना है', 'Schools supervised': 'पर्यवेक्षित विद्यालय',
  'Hierarchy chain (top to bottom)': 'पदानुक्रम श्रृंखला (ऊपर से नीचे)', '4 levels': '4 स्तर',
  'Level 1': 'स्तर 1', 'Level 2': 'स्तर 2', 'Level 3': 'स्तर 3', 'Level 4': 'स्तर 4',
  'State level': 'राज्य स्तर', 'District level': 'जनपद स्तर', 'Block level': 'खंड स्तर', 'School level': 'विद्यालय स्तर',
  'SCERT': 'एससीईआरटी', 'DIET': 'डाइट', 'BRC': 'बीआरसी', 'Schools': 'विद्यालय',
  'The apex academic authority for elementary and secondary teacher education in Uttar Pradesh. It sets curriculum, training policy and academic standards for all DIETs.':
    'उत्तर प्रदेश में प्रारंभिक एवं माध्यमिक शिक्षक शिक्षा की शीर्ष शैक्षणिक संस्था। यह सभी डाइट के लिए पाठ्यक्रम, प्रशिक्षण नीति एवं शैक्षणिक मानक तय करती है।',
  'The District Institute of Education and Training runs pre-service (D.El.Ed.) and in-service teacher education for the district, and supports schools with research and resource material.':
    'जिला शिक्षा एवं प्रशिक्षण संस्थान जनपद के लिए सेवापूर्व (डी.एल.एड.) एवं सेवाकालीन शिक्षक शिक्षा संचालित करता है और शोध एवं संसाधन सामग्री से विद्यालयों को सहयोग देता है।',
  'Block Resource Centres coordinate teacher training, monitoring and academic support for the schools of each block.':
    'खंड संसाधन केंद्र प्रत्येक खंड के विद्यालयों के लिए शिक्षक प्रशिक्षण, अनुश्रवण एवं शैक्षणिक सहयोग का समन्वय करते हैं।',
  'Government primary and upper primary schools, where trained teachers put learning into practice.':
    'सरकारी प्राथमिक एवं उच्च प्राथमिक विद्यालय, जहां प्रशिक्षित शिक्षक सीखने को व्यवहार में लाते हैं।',

  // AWP / downloads / internship / sitemap / search
  'The academic calendar provides an overview of important academic, administrative and examination activities for the session': 'शैक्षणिक कैलेंडर सत्र के महत्वपूर्ण शैक्षणिक, प्रशासनिक एवं परीक्षा संबंधी गतिविधियों का अवलोकन प्रस्तुत करता है, सत्र',
  'SESSIONS': 'सत्र', 'SESSION': 'सत्र', 'Session': 'सत्र',
  'Forms': 'प्रपत्र', 'Circulars': 'परिपत्र', 'Government orders': 'शासनादेश',
  'Downloads': 'डाउनलोड्स',
  'Forms, circulars, government orders and other documents.': 'प्रपत्र, परिपत्र, शासनादेश एवं अन्य दस्तावेज़।',
  'Internship': 'इन्टर्नशिप',
  'Every page of the website, grouped by section.': 'वेबसाइट के सभी पृष्ठ, अनुभागवार।',
  'Main pages': 'मुख्य पृष्ठ', 'Portals': 'पोर्टल', 'Policies': 'नीतियां',
  'Notices': 'सूचनाएं', 'Events': 'कार्यक्रम', 'Gallery': 'गैलरी',
  'Administration': 'प्रशासन', 'Academics': 'शैक्षणिक', 'D.El.Ed.': 'डी.एल.एड.',
  'Training programs': 'प्रशिक्षण कार्यक्रम', 'About DIET': 'डाइट के बारे में', 'Contact': 'संपर्क',
  'Search notices, documents and events': 'सूचनाएं, दस्तावेज़ और कार्यक्रम खोजें',
  'Privacy policy': 'गोपनीयता नीति', 'Terms and conditions': 'नियम एवं शर्तें',
  'Copyright policy': 'कॉपीराइट नीति', 'Hyperlink policy': 'हाइपरलिंक नीति',

  // contact page
  'Address': 'पता', 'Contact info': 'संपर्क जानकारी', 'Website': 'वेबसाइट',
  'Official website of DIET Ghazipur.': 'डाइट गाज़ीपुर की आधिकारिक वेबसाइट।',
  'Open in Maps': 'मानचित्र में खोलें',
  'Send us a message': 'हमें संदेश भेजें',
  'Your name': 'आपका नाम', 'Email': 'ईमेल', 'Phone': 'फ़ोन', 'Message': 'संदेश',
  'Send message': 'संदेश भेजें',
  'Thank you — your message has been sent.': 'धन्यवाद — आपका संदेश भेज दिया गया है।',
  'DIET Ghazipur, Saidpur, Ghazipur, Uttar Pradesh, India': 'डाइट गाज़ीपुर, सैदपुर, गाज़ीपुर, उत्तर प्रदेश, भारत',
  'Mon - Sat: 10:00 AM - 05:00 PM': 'सोम - शनि: प्रातः 10:00 से सायं 05:00 बजे तक',
  'No photos yet.': 'अभी कोई फोटो नहीं है।',
  'No events scheduled.': 'कोई कार्यक्रम निर्धारित नहीं है।',
  'Events and training programmes': 'कार्यक्रम एवं प्रशिक्षण',

  // footer
  'CONTACT US ': 'संपर्क करें',
  'QUICK LINKS': 'त्वरित लिंक', 'POLICIES': 'नीतियां', 'FIND US': 'हमें खोजें', 'VISITOR COUNT': 'आगंतुक संख्या',
  'Faculty & Staff': 'संकाय एवं कर्मचारी', 'Academic Calendar (AWP)': 'शैक्षणिक कैलेंडर (वार्षिक कार्य योजना)',
  'Privacy Policy': 'गोपनीयता नीति', 'Terms & Conditions': 'नियम एवं शर्तें',
  'Copyright Policy': 'कॉपीराइट नीति', 'Hyperlink Policy': 'हाइपरलिंक नीति',
  'AWP (Annual Work Plan)': 'वार्षिक कार्य योजना',
  'SCAN QR CODE': 'क्यूआर कोड स्कैन करें', 'Scan QR Code for Mobile View': 'मोबाइल व्यू के लिए क्यूआर कोड स्कैन करें',
  'All Rights Reserved': 'सर्वाधिकार सुरक्षित', 'Last updated': 'अंतिम अपडेट',
  'Website designed & developed by DIET Ghazipur': 'वेबसाइट का डिज़ाइन एवं विकास: डाइट गाज़ीपुर',

  // login / portal
  'Student Portal': 'छात्र पोर्टल', 'Staff / Admin Login': 'कर्मचारी / एडमिन लॉगिन',
  'Login to apply for programmes and track your application.': 'कार्यक्रमों के लिए आवेदन करने और अपने आवेदन की स्थिति देखने हेतु लॉगिन करें।',
  'Authorised DIET employees only.': 'केवल अधिकृत डाइट कर्मचारियों के लिए।',
  'Full name': 'पूरा नाम', 'Enrollment no. (if any)': 'नामांकन संख्या (यदि हो)', 'Batch (e.g. 2026-28)': 'बैच (जैसे 2026-28)',
  'Password': 'पासवर्ड', 'Please wait…': 'कृपया प्रतीक्षा करें…', 'Create account': 'खाता बनाएं', 'Login': 'लॉगिन',
  'New student?': 'नए छात्र?', 'Register here': 'यहां पंजीकरण करें', 'Already registered?': 'पहले से पंजीकृत?',
  'DIET employee? Staff login': 'डाइट कर्मचारी? कर्मचारी लॉगिन', 'Student? Student login': 'छात्र? छात्र लॉगिन',

  // policies
  'This website collects personal information only when you submit a form (registration, contact or application). The information is used only for the purpose it was given and is not shared with third parties except as required by law. Replace this text with the official privacy policy.':
    'यह वेबसाइट व्यक्तिगत जानकारी केवल तभी एकत्र करती है जब आप कोई प्रपत्र (पंजीकरण, संपर्क या आवेदन) जमा करते हैं। जानकारी का उपयोग केवल उसी उद्देश्य के लिए किया जाता है जिसके लिए वह दी गई है और कानून द्वारा अपेक्षित होने के अतिरिक्त किसी तीसरे पक्ष से साझा नहीं की जाती।',
  'This website is maintained by DIET Ghazipur, Department of Basic Education, Government of Uttar Pradesh. Content is for information only. Replace this text with the official terms and conditions.':
    'यह वेबसाइट डाइट गाज़ीपुर, बेसिक शिक्षा विभाग, उत्तर प्रदेश सरकार द्वारा संचालित है। सामग्री केवल सूचना के लिए है।',
  'Content on this website may be reproduced free of charge with acknowledgement of the source, provided it is not used in a misleading context. Replace this text with the official copyright policy.':
    'इस वेबसाइट की सामग्री स्रोत का उल्लेख करते हुए निःशुल्क पुनः प्रस्तुत की जा सकती है, बशर्ते उसका उपयोग भ्रामक संदर्भ में न किया जाए।',
  'Links to external websites are provided for convenience. DIET Ghazipur is not responsible for the content or availability of linked websites and a link does not imply endorsement. Replace this text with the official hyperlink policy.':
    'बाहरी वेबसाइटों के लिंक सुविधा के लिए दिए गए हैं। डाइट गाज़ीपुर लिंक की गई वेबसाइटों की सामग्री या उपलब्धता के लिए उत्तरदायी नहीं है।',
};

const LOWER = Object.fromEntries(Object.entries(HI).map(([k, v]) => [k.toLowerCase(), v]));
const Ctx = createContext({ lang: 'en', setLang: () => {}, t: (s) => s });

export function LangProvider({ children }) {
  const [lang, setLangState] = useState(() => { try { return localStorage.getItem('lang') || 'en'; } catch { return 'en'; } });
  if (typeof document !== 'undefined') document.documentElement.lang = lang === 'hi' ? 'hi' : 'en';
  const setLang = useCallback((l) => { setLangState(l); try { localStorage.setItem('lang', l); } catch {} }, []);
  useEffect(() => { document.documentElement.lang = lang === 'hi' ? 'hi' : 'en'; }, [lang]);
  const value = useMemo(() => ({ lang, setLang, t: (s) => (lang === 'hi' && s && (HI[s] || LOWER[String(s).toLowerCase()])) || s }), [lang, setLang]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useLang = () => useContext(Ctx);

/* Staff-published content: show the Hindi field when it exists, otherwise the English one. */
export const pick = (lang, item, key) => (lang === 'hi' && item?.[`${key}Hi`]) || item?.[key];
