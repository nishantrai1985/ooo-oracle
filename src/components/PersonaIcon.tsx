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

    case 'swdev':
      return (
        <svg aria-hidden="true" width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Terminal window frame */}
          <rect x="3" y="5" width="30" height="26" rx="3" stroke="#2D6B4A" strokeWidth="2"/>
          {/* Title bar */}
          <line x1="3" y1="12" x2="33" y2="12" stroke="#2D6B4A" strokeWidth="1.5" opacity="0.4"/>
          {/* Window dots */}
          <circle cx="8" cy="8.5" r="1.3" fill="#2D6B4A" opacity="0.4"/>
          <circle cx="12.5" cy="8.5" r="1.3" fill="#2D6B4A" opacity="0.4"/>
          {/* > chevron prompt */}
          <path d="M8 21 L14 17.5 L8 14" stroke="#2D6B4A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          {/* _ cursor */}
          <line x1="17" y1="21" x2="24" y2="21" stroke="#2D6B4A" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      );

    case 'productleader':
      return (
        <svg aria-hidden="true" width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Compass circle */}
          <circle cx="18" cy="18" r="13" stroke="#8B3A9E" strokeWidth="2"/>
          {/* North arrow (bold — the north star) */}
          <path d="M18 5 L18 14" stroke="#8B3A9E" strokeWidth="2.5" strokeLinecap="round"/>
          <path d="M14.5 10 L18 5 L21.5 10" fill="#8B3A9E"/>
          {/* South (faint) */}
          <line x1="18" y1="22" x2="18" y2="31" stroke="#8B3A9E" strokeWidth="1.5" strokeLinecap="round" opacity="0.3"/>
          {/* East (faint) */}
          <line x1="22" y1="18" x2="31" y2="18" stroke="#8B3A9E" strokeWidth="1.5" strokeLinecap="round" opacity="0.3"/>
          {/* West (faint) */}
          <line x1="5" y1="18" x2="14" y2="18" stroke="#8B3A9E" strokeWidth="1.5" strokeLinecap="round" opacity="0.3"/>
          {/* Centre dot */}
          <circle cx="18" cy="18" r="2.2" fill="#8B3A9E"/>
        </svg>
      );

    case 'projectmanager':
      return (
        <svg aria-hidden="true" width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Clipboard */}
          <rect x="5" y="6" width="26" height="26" rx="2" stroke="#B8400B" strokeWidth="2"/>
          <rect x="13" y="3" width="10" height="6" rx="1.5" stroke="#B8400B" strokeWidth="1.5" fill="white"/>
          {/* Row 1 — checked */}
          <rect x="9" y="14" width="5.5" height="5.5" rx="1" fill="#B8400B"/>
          <path d="M10 16.8 L11.5 18.2 L14.5 14.8" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <line x1="17.5" y1="16.8" x2="27" y2="16.8" stroke="#B8400B" strokeWidth="1.5" strokeLinecap="round"/>
          {/* Row 2 — checked */}
          <rect x="9" y="22" width="5.5" height="5.5" rx="1" fill="#B8400B"/>
          <path d="M10 24.8 L11.5 26.2 L14.5 22.8" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <line x1="17.5" y1="24.8" x2="27" y2="24.8" stroke="#B8400B" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      );

    case 'dataspecialist':
      return (
        <svg aria-hidden="true" width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Bar 1 — short */}
          <rect x="4" y="24" width="7" height="8" rx="1" fill="#1A5F9E" opacity="0.45"/>
          {/* Bar 2 — medium */}
          <rect x="14.5" y="16" width="7" height="16" rx="1" fill="#1A5F9E" opacity="0.7"/>
          {/* Bar 3 — tall */}
          <rect x="25" y="8" width="7" height="24" rx="1" fill="#1A5F9E"/>
          {/* Baseline */}
          <line x1="2" y1="32" x2="34" y2="32" stroke="#1A5F9E" strokeWidth="2" strokeLinecap="round"/>
          {/* Trend line */}
          <path d="M7.5 24 L18 16 L28.5 8" stroke="#1A5F9E" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2.5 2" opacity="0.45"/>
        </svg>
      );
  }
}
