import { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { PERSONALITIES, PersonalityKey } from '../types';
import PersonaIcon from './PersonaIcon';

interface Props {
  message: string;
  isStreaming: boolean;
  personality: PersonalityKey;
  name: string;
  destination: string;
  onGenerateAnother: () => void;
}

export default function MessageOutput({
  message,
  isStreaming,
  personality,
  name,
  destination,
  onGenerateAnother,
}: Props) {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const shareCardRef = useRef<HTMLDivElement>(null);

  const persona = PERSONALITIES.find(p => p.key === personality)!;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message);
    } catch {
      const el = document.createElement('textarea');
      el.value = message;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = async () => {
    if (!shareCardRef.current || downloading) return;
    setDownloading(true);
    try {
      const canvas = await html2canvas(shareCardRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
        logging: false,
      });
      const link = document.createElement('a');
      link.download = `ericsson-ooo-${personality}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Failed to generate image:', err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="animate-slide-up space-y-4">
      {/* Output card */}
      <div
        className="eric-card overflow-hidden"
        style={{ borderLeft: `4px solid ${persona.accentColor}` }}
      >
        {/* Card header bar */}
        <div
          className="px-5 py-3 flex items-center gap-3 border-b"
          style={{ borderColor: '#E8EDF8', background: '#F8FAFD' }}
        >
          <PersonaIcon personaKey={persona.key} size={24} />
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span
              className="text-xs font-bold uppercase tracking-widest px-2 py-1 rounded"
              style={{
                background: persona.badgeBg,
                color: persona.badgeText,
                letterSpacing: '0.07em',
              }}
            >
              {persona.name}
            </span>
            <span className="text-xs truncate" style={{ color: '#4E6275' }}>
              {name} · {destination}
            </span>
          </div>
          {/* Ericsson badge */}
          <div className="flex items-center gap-1.5 ml-auto flex-shrink-0">
            <div
              className="w-2 h-2 rounded-full"
              style={{ background: isStreaming ? '#FFB300' : '#00974A' }}
            />
            <span className="text-xs font-medium" style={{ color: '#4E6275' }}>
              {isStreaming ? 'Generating…' : 'Complete'}
            </span>
          </div>
        </div>

        {/* Message body */}
        <div className="px-6 py-5">
          <div
            aria-live="polite"
            aria-label="Generated out-of-office message"
            className={`text-sm leading-relaxed whitespace-pre-wrap ${isStreaming ? 'cursor-blink' : ''}`}
            style={{ color: '#2A3850', lineHeight: '1.85', fontWeight: 400 }}
          >
            {message || (
              <span style={{ color: '#5A6E8A', fontStyle: 'italic' }}>
                Consulting the oracle…
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Action buttons */}
      {!isStreaming && message && (
        <div className="flex flex-wrap gap-3 animate-fade-in">
          <button
            onClick={handleCopy}
            className={copied ? 'eric-btn-neutral' : 'eric-btn-ghost'}
            style={
              copied
                ? { borderColor: '#00974A', color: '#00974A', background: 'rgba(0,151,74,0.07)' }
                : {}
            }
          >
            {copied ? (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
                Copy Message
              </>
            )}
          </button>

          <button onClick={onGenerateAnother} className="eric-btn-ghost">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="23 4 23 10 17 10" />
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
            </svg>
            Generate Another
          </button>

          <button
            onClick={handleDownload}
            disabled={downloading}
            className="eric-btn-neutral ml-auto"
          >
            {downloading ? (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-spin">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
                Creating…
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Save as Image
              </>
            )}
          </button>
        </div>
      )}

      {/* Hidden share card for html2canvas */}
      <div
        ref={shareCardRef}
        className="share-card-bg"
        aria-hidden="true"
        style={{
          position: 'fixed',
          left: '-9999px',
          top: 0,
          width: '640px',
          padding: '0',
          borderRadius: '8px',
          overflow: 'hidden',
        }}
      >
        {/* Header strip */}
        <div
          style={{
            background: '#001C3D',
            padding: '20px 32px 16px',
            borderBottom: '3px solid #0082F0',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{
                fontWeight: 800,
                fontSize: '17px',
                color: '#FFFFFF',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
              }}>
                Ericsson
              </span>
              <span style={{
                fontSize: '11px',
                background: '#FFB300',
                color: '#001C3D',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '2px',
                letterSpacing: '0.06em',
              }}>
                ☀ SUMMER 2026
              </span>
            </div>
            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.05em' }}>
              OOO ORACLE
            </span>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '32px', background: 'linear-gradient(160deg, #001C3D 0%, #003875 60%, #0062BC 100%)' }}>
          {/* Persona badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
            <PersonaIcon personaKey={persona.key} size={40} />
            <div>
              <div style={{
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.5)',
                marginBottom: '2px',
              }}>
                Persona Mode
              </div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: '#FFFFFF' }}>
                {persona.name}
              </div>
            </div>
          </div>

          {/* Message */}
          <div style={{
            fontSize: '14px',
            lineHeight: '1.85',
            color: 'rgba(255,255,255,0.88)',
            whiteSpace: 'pre-wrap',
            fontWeight: 400,
            background: 'rgba(255,255,255,0.06)',
            borderRadius: '4px',
            padding: '20px 24px',
            borderLeft: `3px solid ${persona.accentColor}`,
          }}>
            {message}
          </div>

          {/* Footer */}
          <div style={{
            marginTop: '24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)' }}>
              {name} · {destination}
            </span>
            <span style={{ fontSize: '11px', color: '#0082F0', fontWeight: 600 }}>
              ericsson.com
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
