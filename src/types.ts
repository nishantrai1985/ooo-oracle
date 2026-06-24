export type PersonalityKey = 'uxdesigner' | 'servicedesigner' | 'frontend' | 'designmanager' | 'researcher';

export type ToneKey = 'formal' | 'playful' | 'unhinged' | 'poetic' | 'corporate';

export interface Tone {
  key: ToneKey;
  name: string;
  icon: string;
  description: string;
}

export const TONES: Tone[] = [
  { key: 'formal',    name: 'Formal',    icon: '🧳', description: 'Polished, client-safe' },
  { key: 'playful',   name: 'Playful',   icon: '😄', description: 'Warm & gently funny' },
  { key: 'unhinged',  name: 'Unhinged',  icon: '🤪', description: 'Will get screenshotted' },
  { key: 'poetic',    name: 'Poetic',    icon: '📜', description: 'Unexpectedly lyrical' },
  { key: 'corporate', name: 'Corporate', icon: '💼', description: 'Peak buzzword mode' },
];

export interface Personality {
  key: PersonalityKey;
  name: string;
  tagline: string;
  description: string;
  accentColor: string;
  badgeBg: string;
  badgeText: string;
}

export const PERSONALITIES: Personality[] = [
  {
    key: 'uxdesigner',
    name: 'UX Designer',
    tagline: '"Please don\'t touch my Figma files"',
    description: 'Strong opinions. Properly named layers. You\'re welcome.',
    accentColor: '#0062BC',
    badgeBg: 'rgba(0, 98, 188, 0.08)',
    badgeText: '#0052A0',
  },
  {
    key: 'servicedesigner',
    name: 'Service Designer',
    tagline: 'Mapped the holiday on a service blueprint',
    description: 'Touchpoints, swimlanes, and a beach. Holistic.',
    accentColor: '#0097A7',
    badgeBg: 'rgba(0, 151, 167, 0.08)',
    badgeText: '#007A88',
  },
  {
    key: 'frontend',
    name: 'Front-End Dev',
    tagline: 'No Figma pings for 2 whole weeks',
    description: 'Gone. The mobile states were never there anyway.',
    accentColor: '#4A7C59',
    badgeBg: 'rgba(74, 124, 89, 0.08)',
    badgeText: '#3A6347',
  },
  {
    key: 'designmanager',
    name: 'Design Manager',
    tagline: 'Left 47 Slack messages before logging off',
    description: 'Fully aligned on being fully offline.',
    accentColor: '#B86A00',
    badgeBg: 'rgba(184, 106, 0, 0.08)',
    badgeText: '#965700',
  },
  {
    key: 'researcher',
    name: 'User Researcher',
    tagline: 'Recruiting participants at the airport',
    description: 'n=1 qualitative fieldwork. Do not disturb.',
    accentColor: '#6348AA',
    badgeBg: 'rgba(99, 72, 170, 0.08)',
    badgeText: '#523B8F',
  },
];
