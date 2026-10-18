// Minimal line icons (24px grid, stroke). Usage: <Icon name="bell" />
const P = {
  layers: 'M12 3l9 5-9 5-9-5 9-5zm-9 9l9 5 9-5M3 16l9 5 9-5',
  cap: 'M2 9l10-5 10 5-10 5L2 9zm4 3.5V17c0 1.5 3 3 6 3s6-1.5 6-3v-4.5M22 9v6',
  bell: 'M6 9a6 6 0 1112 0c0 6 2 7 2 7H4s2-1 2-7zm4 10a2 2 0 004 0',
  cal: 'M4 6h16v14H4V6zm0 4h16M8 3v4m8-4v4',
  image: 'M4 5h16v14H4V5zm0 11l5-5 4 4 3-3 4 4M9 9.5h.01',
  user: 'M12 12a4 4 0 100-8 4 4 0 000 8zm-7 8c0-4 3-6 7-6s7 2 7 6',
  phone: 'M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z',
  mail: 'M3 6h18v12H3V6zm0 0l9 7 9-7',
  pin: 'M12 21s7-6 7-11a7 7 0 10-14 0c0 5 7 11 7 11zm0-8.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z',
  clock: 'M12 21a9 9 0 100-18 9 9 0 000 18zm0-14v5l3 2',
  file: 'M7 3h7l5 5v13H7V3zm7 0v5h5M10 13h6m-6 3h6',
  book: 'M4 5a2 2 0 012-2h13v16H6a2 2 0 00-2 2V5zm2 14h13v2H6',
  grid: 'M4 4h7v7H4V4zm9 0h7v7h-7V4zM4 13h7v7H4v-7zm9 0h7v7h-7v-7z',
  edit: 'M4 20h4L19 9l-4-4L4 16v4zM14 6l4 4',
  inbox: 'M3 13l3-8h12l3 8v6H3v-6zm0 0h5l1 2h6l1-2h5',
  users: 'M9 11a3.5 3.5 0 100-7 3.5 3.5 0 000 7zM2 20c0-3.5 3-5.5 7-5.5s7 2 7 5.5M16 4.5a3.5 3.5 0 010 7M18 14.8c2.2.6 4 2.2 4 5.2',
  film: 'M3 5h18v14H3V5zm4 0v14m10-14v14M3 9h4m10 0h4M3 15h4m10 0h4',
  menu: 'M4 7h16M4 12h16M4 17h16',
  moon: 'M20 14A8 8 0 1110 4a7 7 0 0010 10z',
  sun: 'M12 16a4 4 0 100-8 4 4 0 000 8zm0-13v2m0 14v2M3 12h2m14 0h2M5.6 5.6L7 7m10 10l1.4 1.4M5.6 18.4L7 17M17 7l1.4-1.4',
  home: 'M3 11l9-8 9 8v10h-6v-6H9v6H3V11z',
  filter: 'M3 5h18l-7 8v6l-4 2v-8L3 5z',
  megaphone: 'M3 10v4h3l8 4V6L6 10H3zm13-1a4 4 0 010 6',
  eye: 'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zm10 3a3 3 0 100-6 3 3 0 000 6z',
  rocket: 'M5 15c-1 1-1.5 4-1.5 4s3-.5 4-1.5M9 15l-2-2c1-4 4-8 12-9 0 8-5 11-9 12l-1-1zm5-5h.01',
  award: 'M12 14a6 6 0 100-12 6 6 0 000 12zm-3.5-.5L7 22l5-3 5 3-1.5-8.5',
  shield: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3zm-3 9l2 2 4-4',
  bulb: 'M9 18h6m-5 3h4M12 3a6 6 0 00-3 11v2h6v-2a6 6 0 00-3-11z',
  heart: 'M12 21s-8-5-8-11a4.5 4.5 0 018-3 4.5 4.5 0 018 3c0 6-8 11-8 11z',
  handshake: 'M3 11l4-4 4 2 4-2 6 5-4 4-3 1-3 2-3-2-3-1-2-2 0-3zm5 3l2 2m1-1l2 2',
  building: 'M5 21V4h9v17M14 9h5v12M8 8h3M8 12h3M8 16h3M3 21h18',
  org: 'M9 3h6v5H9V3zM3 16h6v5H3v-5zm12 0h6v5h-6v-5zM12 8v4M6 16v-4h12v4',
  target: 'M12 21a9 9 0 100-18 9 9 0 000 18zm0-5a4 4 0 100-8 4 4 0 000 8zm0-2a2 2 0 100-4 2 2 0 000 4z',
  search: 'M11 19a8 8 0 100-16 8 8 0 000 16zm10 2l-4.5-4.5',
  map: 'M9 4l6 2 6-2v14l-6 2-6-2-6 2V6l6-2zm0 0v14m6-12v14',
  globe: 'M12 21a9 9 0 100-18 9 9 0 000 18zM3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18',
  chevron: 'M9 6l6 6-6 6',
  external: 'M14 4h6v6m0-6L10 14M18 14v6H4V6h6',
};

export default function Icon({ name, size = 20, className = '', solid = false }) {
  return (
    <svg className={`icon ${className}`} width={size} height={size} viewBox="0 0 24 24" fill={solid ? 'currentColor' : 'none'}
      stroke="currentColor" strokeWidth={solid ? 1.2 : 1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={P[name]} />
    </svg>
  );
}
