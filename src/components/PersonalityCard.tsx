import { Personality } from '../types';
import PersonaIcon from './PersonaIcon';

interface Props {
  personality: Personality;
  selected: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export default function PersonalityCard({ personality, selected, onClick, disabled }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={selected}
      className="persona-card text-left w-full rounded-md p-4 border-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-eric-blue focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      style={{
        background: selected ? `${personality.badgeBg}` : '#FFFFFF',
        borderColor: selected ? personality.accentColor : '#D8E4F4',
        boxShadow: selected
          ? `0 0 0 1px ${personality.accentColor}33, 0 4px 16px ${personality.accentColor}20`
          : '0 1px 4px rgba(0,50,122,0.06)',
      }}
    >
      <div className="flex items-start gap-3">
        <span className="leading-none mt-0.5 flex-shrink-0" aria-hidden="true">
          <PersonaIcon personaKey={personality.key} size={36} />
        </span>
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span
              className="text-sm font-700 leading-tight"
              style={{
                fontWeight: 700,
                color: selected ? personality.accentColor : '#1A2740',
              }}
            >
              {personality.name}
            </span>
            {selected && (
              <span
                className="text-xs px-2 py-0.5 rounded-full font-semibold"
                style={{
                  background: personality.accentColor,
                  color: '#fff',
                  fontSize: '10px',
                  letterSpacing: '0.04em',
                }}
              >
                SELECTED
              </span>
            )}
          </div>
          <p
            className="text-xs italic mb-1 leading-snug"
            style={{ color: selected ? personality.badgeText : '#4E6275', fontSize: '12px' }}
          >
            "{personality.tagline}"
          </p>
          <p className="text-xs leading-snug" style={{ color: '#4A5D70', fontSize: '12px' }}>
            {personality.description}
          </p>
        </div>
      </div>
    </button>
  );
}
