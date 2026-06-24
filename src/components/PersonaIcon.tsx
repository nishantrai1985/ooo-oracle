import { PersonalityKey } from '../types';

interface Props {
  personaKey: PersonalityKey;
  size?: number;
}

export default function PersonaIcon({ personaKey, size = 36 }: Props) {
  switch (personaKey) {
    case 'uxdesigner':
      return (
        <svg aria-hidden="true" width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Artboard corner brackets — the Figma frame tool */}
          <path d="M4 13 L4 4 L13 4" stroke="#0062BC" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M23 4 L32 4 L32 13" stroke="#0062BC" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M4 23 L4 32 L13 32" stroke="#0062BC" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M23 32 L32 32 L32 23" stroke="#0062BC" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          {/* Center crosshair */}
          <line x1="18" y1="13" x2="18" y2="15" stroke="#0062BC" strokeWidth="1.5" strokeLinecap="round" opacity="0.4"/>
          <line x1="18" y1="21" x2="18" y2="23" stroke="#0062BC" strokeWidth="1.5" strokeLinecap="round" opacity="0.4"/>
          <line x1="13" y1="18" x2="15" y2="18" stroke="#0062BC" strokeWidth="1.5" strokeLinecap="round" opacity="0.4"/>
          <line x1="21" y1="18" x2="23" y2="18" stroke="#0062BC" strokeWidth="1.5" strokeLinecap="round" opacity="0.4"/>
          <circle cx="18" cy="18" r="2" fill="#0062BC" opacity="0.5"/>
        </svg>
      );

    case 'servicedesigner':
      return (
        <svg aria-hidden="true" width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Journey path */}
          <path d="M4 26 C9 26 9 8 18 8 C27 8 27 26 32 26" stroke="#0097A7" strokeWidth="2" strokeLinecap="round" strokeDasharray="0"/>
          {/* Touchpoint nodes */}
          <circle cx="4" cy="26" r="4" fill="#0097A7"/>
          <circle cx="18" cy="8" r="3.5" fill="#0097A7" opacity="0.55"/>
          <circle cx="32" cy="26" r="4" fill="#0097A7"/>
          {/* Mid nodes */}
          <circle cx="11" cy="14" r="2" fill="#0097A7" opacity="0.3"/>
          <circle cx="25" cy="14" r="2" fill="#0097A7" opacity="0.3"/>
        </svg>
      );

    case 'frontend':
      return (
        <svg aria-hidden="true" width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* < bracket */}
          <path d="M14 8 L5 18 L14 28" stroke="#4A7C59" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          {/* > bracket */}
          <path d="M22 8 L31 18 L22 28" stroke="#4A7C59" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          {/* / slash */}
          <line x1="22" y1="6" x2="14" y2="30" stroke="#4A7C59" strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
        </svg>
      );

    case 'designmanager':
      return (
        <svg aria-hidden="true" width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Double diamond — the design thinking process */}
          <path d="M2 18 L11 7 L20 18 L11 29 Z" stroke="#B86A00" strokeWidth="2" strokeLinejoin="round" fill="#B86A00" fillOpacity="0.14"/>
          <path d="M16 18 L25 7 L34 18 L25 29 Z" stroke="#B86A00" strokeWidth="2" strokeLinejoin="round" fill="#B86A00" fillOpacity="0.14"/>
        </svg>
      );

    case 'researcher':
      return (
        <svg aria-hidden="true" width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Magnifying glass */}
          <circle cx="15" cy="15" r="10" stroke="#6348AA" strokeWidth="2.5"/>
          <line x1="22.5" y1="22.5" x2="31" y2="31" stroke="#6348AA" strokeWidth="2.5" strokeLinecap="round"/>
          {/* Insight lines inside */}
          <line x1="10" y1="13" x2="20" y2="13" stroke="#6348AA" strokeWidth="1.5" strokeLinecap="round" opacity="0.55"/>
          <line x1="10" y1="16.5" x2="17" y2="16.5" stroke="#6348AA" strokeWidth="1.5" strokeLinecap="round" opacity="0.55"/>
          <line x1="10" y1="20" x2="19" y2="20" stroke="#6348AA" strokeWidth="1.5" strokeLinecap="round" opacity="0.35"/>
        </svg>
      );
  }
}
