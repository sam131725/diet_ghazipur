// Edit this file to customise the site. Coordinates are APPROXIMATE — replace DIET's
// with the exact campus location (right-click the place in Google Maps -> copy lat,lng).
export const SITE = {
  nameHi: 'जिला शिक्षा एवं प्रशिक्षण संस्थान, गाज़ीपुर',
  name: 'DIET GHAZIPUR',
  sub: 'District Institute of Education & Training',
  dept: '(Department of Basic Education, Government of Uttar Pradesh)',
  address: 'DIET Ghazipur, Saidpur, Ghazipur, Uttar Pradesh, India',   // TODO: put the exact postal address
  phone: '0548-0000000',                                       // TODO
  email: 'diet.ghazipur@example.com',                          // TODO
  hours: 'Mon - Sat: 10:00 AM - 05:00 PM',
  mapQuery: 'District Institute of Education and Training, Saidpur, Ghazipur, Uttar Pradesh',   // TODO: exact place name or 'lat,lng' as shown in Google Maps
  principal: { name: 'Principal Name', title: 'DDR / PRINCIPAL', message:
    'Our aim is to contribute to society building through quality teacher education. We are committed to the all-round development of learners through innovation, discipline and collaboration.' },
};

export const DIET_LOCATION = { lat: 25.5420, lng: 83.2300 };   // approximate: DIET is at Saidpur, Ghazipur — replace with exact campus coordinates

// Towns / tehsil HQs shown on the interactive map (approximate positions).
export const PLACES = [
  { name: 'DIET Ghazipur', lat: DIET_LOCATION.lat, lng: DIET_LOCATION.lng, type: 'diet', info: 'District Institute of Education & Training, Saidpur' },
  { name: 'Ghazipur (Sadar)', lat: 25.5880, lng: 83.5780, type: 'tehsil', info: 'District headquarters' },
  { name: 'Zamania', lat: 25.4170, lng: 83.5600, type: 'tehsil', info: 'Tehsil' },
  { name: 'Mohammadabad', lat: 25.6230, lng: 83.7560, type: 'tehsil', info: 'Tehsil' },
  { name: 'Saidpur', lat: 25.5380, lng: 83.2240, type: 'tehsil', info: 'Tehsil' },
  { name: 'Jakhania', lat: 25.7120, lng: 83.3330, type: 'block', info: 'Block' },
  { name: 'Karanda', lat: 25.6860, lng: 83.4580, type: 'block', info: 'Block' },
  { name: 'Birno', lat: 25.6780, lng: 83.5920, type: 'block', info: 'Block' },
];

// ---- About DIET pages (edit all text here with the official content) ----
export const ABOUT = [
  { slug: 'overview', label: 'Overview', icon: 'grid', sub: 'Who we are and what we do.' },
  { slug: 'vision-mission', label: 'Vision & mission', icon: 'target', sub: 'Our vision and mission guide us in achieving excellence in teacher education and professional development.' },
  { slug: 'objectives', label: 'Objectives', icon: 'award', sub: 'What the institute works to achieve.' },
  { slug: 'infrastructure', label: 'Infrastructure', icon: 'building', sub: 'Facilities available on campus.' },
  { slug: 'principal-message', label: "Principal's message", icon: 'user', sub: 'A message from the Principal.' },
  { slug: 'history-of-principals', label: 'History of principals', icon: 'clock', sub: 'Principals who have led the institute.' },
  { slug: 'organizational-structure', label: 'Organizational structure', icon: 'org', sub: 'How the institute is organised.' },
  { slug: 'faculty', label: 'Faculty members', icon: 'users', sub: 'Our academic staff.' },
];

export const ABOUT_CONTENT = {
  overview: 'DIET Ghazipur works under the Department of Basic Education, Government of Uttar Pradesh. It runs pre-service (D.El.Ed.) and in-service teacher training, supports schools academically, and carries out action research for the district. Replace this text with the official profile of the institute.',
  vision: 'To be a leading institute in teacher education and professional development for quality education.',
  visionEn: [
    'The vision of the District Institute of Education and Training (DIET), Saidpur, Ghazipur is to develop a high-quality, inclusive and innovation-oriented teacher education system that ensures continuous improvement in the quality of school education by preparing skilled, sensitive, value-driven and technologically capable teachers.',
    'The institute aims to make teacher training effective, practice-based and child-centred, in line with the National Education Policy 2020, the National Curriculum Framework 2023 and the educational priorities of the State, so that every child gets equal opportunities and a joyful, safe and quality teaching-learning environment.',
    'The institute is committed to building an educational environment that encourages teacher training, educational and action research, innovation, digital learning, foundational literacy and numeracy, and the participation of schools and communities, where teachers are lifelong learners, schools are effective centres of learning, and students grow into responsible citizens equipped with knowledge, skills, values and life skills.',
    'Our resolve: empowered teachers, quality education, innovative teaching and the all-round development of every child.',
  ],
  visionHi: [
    'जिला शिक्षा एवं प्रशिक्षण संस्थान (DIET), सैदपुर, गाजीपुर का विजन एक ऐसे गुणवत्तापूर्ण, समावेशी एवं नवाचार-उन्मुख शिक्षक-शिक्षा तंत्र का विकास करना है, जो दक्ष, संवेदनशील, नैतिक मूल्यों से युक्त एवं तकनीकी रूप से सक्षम शिक्षकों के निर्माण के माध्यम से विद्यालयी शिक्षा की गुणवत्ता में सतत सुधार सुनिश्चित करे।',
    'संस्थान का उद्देश्य राष्ट्रीय शिक्षा नीति 2020, राष्ट्रीय पाठ्यचर्या रूपरेखा 2023 तथा राज्य की शैक्षिक प्राथमिकताओं के अनुरूप शिक्षक-प्रशिक्षण को प्रभावी, व्यवहारपरक एवं बाल-केंद्रित बनाना है, ताकि प्रत्येक बच्चे को समान अवसरों के साथ आनंदपूर्ण, सुरक्षित एवं गुणवत्तापूर्ण शिक्षण-अधिगम का वातावरण प्राप्त हो सके।',
    'संस्थान शिक्षक-प्रशिक्षण, शैक्षिक अनुसंधान, क्रियात्मक अनुसंधान, नवाचार, डिजिटल शिक्षण, आधारभूत साक्षरता एवं संख्यात्मक दक्षता तथा विद्यालय एवं समुदाय की सहभागिता को प्रोत्साहित करते हुए एक ऐसे शैक्षिक परिवेश के निर्माण के लिए प्रतिबद्ध है, जिसमें शिक्षक सतत सीखने वाले, विद्यालय प्रभावी अधिगम केंद्र तथा विद्यार्थी ज्ञान, कौशल, मूल्यों एवं जीवन-कौशल से संपन्न जिम्मेदार नागरिक बन सकें।',
    'हमारा संकल्प: सशक्त शिक्षक, गुणवत्तापूर्ण शिक्षा, नवाचारी शिक्षण और प्रत्येक बच्चे का सर्वांगीण विकास।',
  ],
  mission: 'To empower educators through training, research, innovation and community engagement to enhance the quality of school education and transform lives.',
  values: [['award', 'Excellence'], ['shield', 'Integrity'], ['bulb', 'Innovation'], ['users', 'Collaboration'], ['heart', 'Inclusiveness'], ['handshake', 'Commitment']],
  objectives: [
    'Provide quality pre-service teacher education through the D.El.Ed. programme.',
    'Organise in-service training for teachers, head teachers and school principals.',
    'Support schools with academic resources, guidance and monitoring.',
    'Carry out action research and innovation in elementary education.',
    'Promote inclusive education and equity in every classroom.',
  ],
  infrastructure: ['Administrative building', 'Classrooms and training halls', 'Library and reading room', 'Computer and ICT lab', 'Science and resource room', 'Hostel and campus facilities'],
  principals: [ // { name, from, to }  -- replace with real records
    { name: 'Name of current principal', from: '2024', to: 'Present' },
  ],
  structure: [
    ['Principal (DDR)', 'Head of the institute'],
    ['Senior Lecturer', 'Heads academic branches'],
    ['Lecturers', 'Teaching, training and research'],
    ['Administrative staff', 'Office, accounts and records'],
  ],
  faculty: [ // { name, designation, branch }  -- replace with real faculty
    { name: 'Faculty name', designation: 'Lecturer', branch: 'Branch / subject' },
  ],
};

// ---- Menu: same structure as the other DIET sites. Edit labels / sub-pages here. ----
export const SESSIONS = ['2026-27', '2025-26', '2024-25'];
export const DOWNLOAD_GROUPS = [['all', 'All'], ['forms', 'Forms'], ['circulars', 'Circulars'], ['orders', 'Government orders'], ['other', 'Other']];

const kid = (slug, label, sub, text) => ({ slug, label, sub, text, icon: 'file' });
const LOREM = 'This page is ready for the official content of DIET Ghazipur. Staff can upload related documents from the admin panel (Documents) and they appear in the table below automatically.';

export const MENU = [
  { key: 'home', label: 'Home', hi: 'मुख्य पृष्ठ', to: '/', home: true },
  { key: 'about', label: 'About DIET', hi: 'डाइट के बारे में', base: '/about', children: ABOUT },
  { key: 'administration', label: 'Administration', hi: 'प्रशासन', base: '/section/administration', children: [
    { slug: 'structure', label: 'Administrative Structure', sub: '', text: '', noDocs: true },
    { slug: 'calendar', label: 'Academic Calendar', href: '/awp', sub: '', text: '', noDocs: true },
  ] },
  { key: 'academics', label: 'Academics', hi: 'शैक्षणिक', base: '/section/academics', children: [
    kid('branches', 'Academic branches', 'Branches and their activities.', LOREM),
    kid('library', 'Library and resources', 'Library, ICT lab and learning resources.', LOREM),
    kid('research', 'Research and innovation', 'Action research and innovation projects.', LOREM),
  ] },
  { key: 'deled', label: 'D.El.Ed.', hi: 'डी.एल.एड.', base: '/section/deled', children: [
    kid('overview', 'Programme overview', 'The two-year Diploma in Elementary Education.', LOREM),
    kid('admission', 'Admission and eligibility', 'Eligibility, process and important dates.', LOREM),
    kid('syllabus', 'Syllabus', 'Course structure and syllabus.', LOREM),
    kid('seats', 'Seats and fee', 'Sanctioned seats and fee structure.', LOREM),
  ] },
  { key: 'training', label: 'Training programs', hi: 'प्रशिक्षण कार्यक्रम', base: '/section/training', children: [
    kid('pre-service', 'Pre-service training', 'Training before entering service.', LOREM),
    kid('in-service', 'In-service training', 'Training for serving teachers and principals.', LOREM),
    kid('calendar', 'Training calendar', 'Schedule of upcoming programmes.', LOREM),
  ] },
  { key: 'examination', label: 'Examination', hi: 'परीक्षा', base: '/section/examination', children: [
    kid('schedule', 'Examination schedule', 'Dates and time tables.', LOREM),
    kid('results', 'Results', 'Published results.', LOREM),
    kid('papers', 'Previous papers', 'Question papers of earlier sessions.', LOREM),
  ] },
  { key: 'internship', label: 'Internship', hi: 'इन्टर्नशिप', to: '/internship', badge: 'NEW' },
  { key: 'downloads', label: 'Downloads', hi: 'डाउनलोड्स', to: '/downloads' },
  { key: 'gallery', label: 'Gallery', hi: 'गैलरी', to: '/gallery' },
  { key: 'awp', label: 'AWP', hi: 'वार्षिक कार्य योजना', to: '/awp' },
  { key: 'contact', label: 'Contact Us', hi: 'संपर्क करें', to: '/contact' },
];

export const INTERNSHIP = { label: 'Internship', sub: 'School internship for D.El.Ed. trainees.', text: LOREM };

// Keys that staff can attach documents to (used by the admin "Documents" form)
export const DOC_TARGETS = [
  ['awp', 'Academic calendar (AWP)'], ['downloads', 'Downloads'], ['internship/overview', 'Internship'],
  ...MENU.filter((m) => m.key !== 'about' && m.children).flatMap((m) => m.children.filter((c) => !c.noDocs).map((c) => [`${m.key}/${c.slug}`, `${m.label}: ${c.label}`])),
];

export const POLICIES = {
  privacy: ['Privacy policy', 'This website collects personal information only when you submit a form (registration, contact or application). The information is used only for the purpose it was given and is not shared with third parties except as required by law. Replace this text with the official privacy policy approved by the department.'],
  terms: ['Terms and conditions', 'This website is maintained by DIET Ghazipur, Department of Basic Education, Government of Uttar Pradesh. Content is for information only. Replace this text with the official terms and conditions.'],
  copyright: ['Copyright policy', 'Content on this website may be reproduced free of charge with acknowledgement of the source, provided it is not used in a misleading context. Replace this text with the official copyright policy.'],
  hyperlink: ['Hyperlink policy', 'Links to external websites are provided for convenience. DIET Ghazipur is not responsible for the content or availability of linked websites and a link does not imply endorsement. Replace this text with the official hyperlink policy.'],
  accessibility: ['Screen reader access', 'This website can be used with screen readers such as NVDA and JAWS. Use the "Skip to main content" link at the top of each page, the A- / A / A+ buttons to change text size, and the dark mode button for better contrast. Tell us about any accessibility problem through the Contact page.'],
};

/* Administrative structure page. TODO: confirm and update the figures with the institute. */
export const STRUCTURE = {
  intro: 'Under the Basic Education Department of Uttar Pradesh, a four-tier administrative hierarchy runs from the State Council of Educational Research and Training (SCERT) down to the government schools of the district.',
  stats: [
    ['layers', '4 Tiers', 'Administrative governance chain'],
    ['building', '75', 'DIETs across the state'],
    ['org', '16', 'Blocks in Ghazipur district'],
    ['target', 'To be updated', 'Schools supervised'],
  ],
  levels: [
    { n: 1, tag: 'Level 1', name: 'SCERT', where: 'State level', icon: 'building',
      text: 'The apex academic authority for elementary and secondary teacher education in Uttar Pradesh. It sets curriculum, training policy and academic standards for all DIETs.' },
    { n: 2, tag: 'Level 2', name: 'DIET', where: 'District level', icon: 'cap',
      text: 'The District Institute of Education and Training runs pre-service (D.El.Ed.) and in-service teacher education for the district, and supports schools with research and resource material.' },
    { n: 3, tag: 'Level 3', name: 'BRC', where: 'Block level', icon: 'org',
      text: 'Block Resource Centres coordinate teacher training, monitoring and academic support for the schools of each block.' },
    { n: 4, tag: 'Level 4', name: 'Schools', where: 'School level', icon: 'home',
      text: 'Government primary and upper primary schools, where trained teachers put learning into practice.' },
  ],
};
