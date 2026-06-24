import { useState, useRef } from 'react';
import PersonalityCard from './components/PersonalityCard';
import MessageOutput from './components/MessageOutput';
import { PERSONALITIES, PersonalityKey, TONES, ToneKey } from './types';

interface FormState {
  name: string;
  destination: string;
  returnDate: string;
  personality: PersonalityKey;
  tone: ToneKey;
}

type AppPhase = 'form' | 'loading' | 'result';

/* ——— Ericsson Logo SVG ——— */
function EricssonLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Ericsson"
    >
      <text
        x="0" y="18"
        fontFamily="'DM Sans', system-ui, sans-serif"
        fontWeight="800"
        fontSize="20"
        fill="currentColor"
        letterSpacing="1"
      >
        ERICSSON
      </text>
    </svg>
  );
}

/* ——— Animated Summer Sun ——— */
function SummerSun() {
  return (
    <div aria-hidden="true" className="relative w-28 h-28 mx-auto" style={{ animation: 'sunPulse 4s ease-in-out infinite' }}>
      <svg viewBox="0 0 112 112" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Rotating rays group */}
        <g style={{ transformOrigin: '56px 56px', animation: 'raySpin 24s linear infinite' }}>
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(deg => {
            const r = Math.PI * deg / 180;
            const x1 = 56 + 36 * Math.cos(r);
            const y1 = 56 + 36 * Math.sin(r);
            const x2 = 56 + 50 * Math.cos(r);
            const y2 = 56 + 50 * Math.sin(r);
            return (
              <line
                key={deg}
                x1={x1} y1={y1} x2={x2} y2={y2}
                stroke="#FFD740"
                strokeWidth={deg % 60 === 0 ? '3.5' : '2'}
                strokeLinecap="round"
                opacity={deg % 60 === 0 ? 1 : 0.7}
              />
            );
          })}
        </g>
        {/* Outer glow ring */}
        <circle cx="56" cy="56" r="30" fill="rgba(255,179,0,0.18)" />
        {/* Sun body */}
        <circle cx="56" cy="56" r="24" fill="#FFB300" />
        <circle cx="56" cy="56" r="20" fill="#FFD740" />
        {/* Shine highlight */}
        <circle cx="48" cy="46" r="5" fill="rgba(255,255,255,0.3)" />
      </svg>
    </div>
  );
}

/* ——— Wave Divider (animated) ——— */
function WaveDivider() {
  return (
    <div aria-hidden="true" style={{ marginTop: '-2px', lineHeight: 0, overflow: 'hidden' }}>
      <svg
        viewBox="0 0 2880 70"
        preserveAspectRatio="none"
        style={{ display: 'block', width: '200%', height: '70px', animation: 'waveSlide 14s linear infinite' }}
      >
        {/* Back layer — softer, slightly different phase */}
        <path
          d="M0,42 C360,8 720,62 1080,38 C1440,14 1800,58 2160,36 C2520,12 2880,55 2880,42 L2880,70 L0,70 Z"
          fill="rgba(255,255,255,0.3)"
        />
        {/* Front layer */}
        <path
          d="M0,35 C360,70 720,0 1080,35 C1440,70 1800,0 2160,35 C2520,70 2880,0 2880,35 L2880,70 L0,70 Z"
          className="wave-fill"
        />
      </svg>
    </div>
  );
}

/* ——— Palm tree silhouette (decorative) ——— */
function PalmTree({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 80 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Trunk */}
      <path
        d="M40,120 C40,100 36,80 38,60 C40,40 38,20 40,10"
        stroke="rgba(255,255,255,0.25)" strokeWidth="5" strokeLinecap="round"
      />
      {/* Fronds */}
      <path d="M40,20 C20,10 -5,18 5,30 C15,18 40,20 40,20" fill="rgba(255,255,255,0.2)" />
      <path d="M40,20 C60,10 85,18 75,30 C65,18 40,20 40,20" fill="rgba(255,255,255,0.2)" />
      <path d="M40,20 C30,5 35,-10 45,0 C42,10 40,20 40,20" fill="rgba(255,255,255,0.2)" />
      <path d="M40,28 C15,25 -8,38 5,48 C18,34 40,28 40,28" fill="rgba(255,255,255,0.15)" />
      <path d="M40,28 C65,25 88,38 75,48 C62,34 40,28 40,28" fill="rgba(255,255,255,0.15)" />
    </svg>
  );
}

/* ——— Ocean ambient audio ——— */
function createOceanAmbience(ctx: AudioContext): () => void {
  const rate = ctx.sampleRate;
  const buf = ctx.createBuffer(2, rate * 6, rate);
  for (let ch = 0; ch < 2; ch++) {
    const d = buf.getChannelData(ch);
    let last = 0;
    for (let i = 0; i < d.length; i++) {
      last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02;
      d[i] = last * 4;
    }
  }
  const noise = ctx.createBufferSource();
  noise.buffer = buf;
  noise.loop = true;

  const lp = ctx.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.value = 380;

  const lfo = ctx.createOscillator();
  lfo.frequency.value = 0.12;
  const lfoG = ctx.createGain();
  lfoG.gain.value = 0.035;
  lfo.connect(lfoG);

  const master = ctx.createGain();
  master.gain.value = 0.055;
  lfoG.connect(master.gain);

  noise.connect(lp);
  lp.connect(master);
  master.connect(ctx.destination);
  noise.start();
  lfo.start();

  return () => { try { noise.stop(); lfo.stop(); } catch { /* already stopped */ } };
}

export default function App() {
  const [form, setForm] = useState<FormState>({
    name: '',
    destination: '',
    returnDate: '',
    personality: 'uxdesigner',
    tone: 'playful',
  });
  const [phase, setPhase] = useState<AppPhase>('form');
  const [message, setMessage] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [musicOn, setMusicOn] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const stopAudioRef = useRef<(() => void) | null>(null);

  const toggleMusic = () => {
    if (musicOn) {
      stopAudioRef.current?.();
      stopAudioRef.current = null;
      setMusicOn(false);
    } else {
      const ctx = audioCtxRef.current ?? new AudioContext();
      audioCtxRef.current = ctx;
      if (ctx.state === 'suspended') ctx.resume();
      stopAudioRef.current = createOceanAmbience(ctx);
      setMusicOn(true);
    }
  };
  const [error, setError] = useState<string | null>(null);

  const selectedPersona = PERSONALITIES.find(p => p.key === form.personality)!;
  const isFormValid = form.name.trim() && form.destination.trim() && form.returnDate;

  const generateMessage = async () => {
    if (!isFormValid) return;
    setError(null);
    setMessage('');
    setPhase('loading');

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const data = await response.json() as { error?: string };
        throw new Error(data.error ?? `Server error: ${response.status}`);
      }

      setPhase('result');
      setIsStreaming(true);

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const raw = line.slice(6).trim();
          if (raw === '[DONE]') continue;

          let parsed: { text?: string; error?: string };
          try {
            parsed = JSON.parse(raw) as { text?: string; error?: string };
          } catch {
            continue;
          }
          if (parsed.error) throw new Error(parsed.error);
          if (parsed.text) setMessage(prev => prev + parsed.text);
        }
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      setError(msg);
      setPhase('form');
    } finally {
      setIsStreaming(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void generateMessage();
  };

  const handleReset = () => {
    setPhase('form');
    setMessage('');
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col">

      {/* ——— Ericsson Nav Bar ——— */}
      <nav className="eric-nav">
        {/* Logo */}
        <a href="/" className="flex items-center gap-3 no-underline flex-shrink-0">
          <EricssonLogo className="h-5 text-white w-auto" />
        </a>

        {/* Divider */}
        <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.15)' }} />

        {/* Tool name */}
        <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', fontWeight: 500 }}>
          XD Team's OOO Oracle
        </span>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Summer badge */}
        <div
          style={{
            background: '#FFB300',
            color: '#001C3D',
            fontSize: '11px',
            fontWeight: 800,
            padding: '4px 12px',
            borderRadius: '2px',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          ☀ Summer 2026
        </div>
      </nav>

      {/* ——— Hero Section ——— */}
      <div className="hero-bg" style={{ paddingTop: '48px', paddingBottom: '0' }}>
        {/* Palm trees (decorative) */}
        <div className="absolute left-4 bottom-0 opacity-60 pointer-events-none" style={{ width: '80px' }}>
          <PalmTree />
        </div>
        <div
          className="absolute right-6 bottom-0 opacity-40 pointer-events-none"
          style={{ width: '60px', transform: 'scaleX(-1)' }}
        >
          <PalmTree />
        </div>

        <div className="relative max-w-3xl mx-auto px-6 text-center">
          {/* Sun */}
          <div className="animate-bob mb-6">
            <SummerSun />
          </div>

          {/* Headline */}
          <h1
            style={{
              fontSize: 'clamp(32px, 6vw, 58px)',
              fontWeight: 800,
              color: '#FFFFFF',
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
              marginBottom: '12px',
            }}
          >
            XD Team's OOO Oracle
          </h1>

          {/* Subhead */}
          <p
            style={{
              fontSize: '16px',
              color: 'rgba(255,255,255,0.65)',
              fontWeight: 400,
              marginBottom: '6px',
              lineHeight: 1.5,
            }}
          >
            AI-generated OOO messages for your summer escape
          </p>
          <p
            style={{
              fontSize: '12px',
              color: '#FFB300',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              marginBottom: '48px',
            }}
          >
            Ericsson · Summer 2026
          </p>
        </div>

        {/* Wave */}
        <WaveDivider />
      </div>

      {/* ——— Main Content ——— */}
      <main className="flex-1" style={{ background: '#EEF3FB', paddingBottom: '64px' }}>
        <div className="max-w-2xl mx-auto px-4 pt-10">

          {/* Error banner */}
          {error && (
            <div
              className="mb-6 px-4 py-3 rounded flex items-start gap-3 animate-fade-in"
              style={{
                background: 'rgba(255, 81, 64, 0.08)',
                border: '1px solid rgba(255, 81, 64, 0.25)',
                color: '#C8311E',
                fontSize: '14px',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="flex-shrink-0 mt-0.5">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Form card */}
            <div className="eric-card p-6 space-y-5">
              <div className="eric-section-title">Your Details</div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="eric-label">Your Name</label>
                  <input
                    id="name"
                    type="text"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="e.g. Alex Johansson"
                    className="eric-input"
                    required
                    disabled={phase === 'loading'}
                    autoComplete="name"
                  />
                </div>
                <div>
                  <label htmlFor="returnDate" className="eric-label">Return Date</label>
                  <div style={{ position: 'relative' }}>
                    <div className="eric-input" style={{ display: 'flex', alignItems: 'center', gap: '8px', pointerEvents: 'none' }}>
                      <span style={{ flex: 1, color: form.returnDate ? '#2A3850' : '#9BAEC4' }}>
                        {form.returnDate
                          ? new Date(form.returnDate + 'T12:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })
                          : 'Select return date'}
                      </span>
                      <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ opacity: 0.35, flexShrink: 0 }}>
                        <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                      </svg>
                    </div>
                    <input
                      id="returnDate"
                      type="date"
                      value={form.returnDate}
                      onChange={e => setForm(f => ({ ...f, returnDate: e.target.value }))}
                      required
                      disabled={phase === 'loading'}
                      min={new Date().toISOString().split('T')[0]}
                      style={{
                        position: 'absolute', inset: 0,
                        width: '100%', height: '100%',
                        opacity: 0, cursor: 'pointer', zIndex: 1,
                      }}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="destination" className="eric-label">Destination / Vibe</label>
                <input
                  id="destination"
                  type="text"
                  value={form.destination}
                  onChange={e => setForm(f => ({ ...f, destination: e.target.value }))}
                  placeholder="e.g. Gothenburg cabin, Croatia beach, Tuscany vineyard…"
                  className="eric-input"
                  required
                  disabled={phase === 'loading'}
                />
              </div>
            </div>

            {/* Persona selector */}
            <div className="eric-card p-5">
              <div className="eric-section-title">Choose Your Persona</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {PERSONALITIES.map(p => (
                  <PersonalityCard
                    key={p.key}
                    personality={p}
                    selected={form.personality === p.key}
                    onClick={() => setForm(f => ({ ...f, personality: p.key }))}
                    disabled={phase === 'loading'}
                  />
                ))}
              </div>
            </div>

            {/* Tone selector */}
            <div className="eric-card p-5">
              <div className="eric-section-title">Choose Your Tone</div>
              <div role="group" aria-label="Choose your tone" className="flex flex-wrap gap-2 mt-1">
                {TONES.map(t => {
                  const selected = form.tone === t.key;
                  return (
                    <button
                      key={t.key}
                      type="button"
                      disabled={phase === 'loading'}
                      aria-pressed={selected}
                      onClick={() => setForm(f => ({ ...f, tone: t.key }))}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '8px 14px',
                        borderRadius: '999px',
                        border: selected ? '2px solid #0082F0' : '2px solid #D8E4F4',
                        background: selected ? 'rgba(0,130,240,0.08)' : '#FFFFFF',
                        color: selected ? '#0052A0' : '#4A5E78',
                        fontWeight: selected ? 700 : 500,
                        fontSize: '13px',
                        cursor: phase === 'loading' ? 'not-allowed' : 'pointer',
                        opacity: phase === 'loading' ? 0.5 : 1,
                        transition: 'all 0.15s ease',
                        boxShadow: selected ? '0 0 0 1px #0082F033, 0 2px 8px rgba(0,130,240,0.12)' : '0 1px 3px rgba(0,50,122,0.06)',
                      }}
                    >
                      <span style={{ fontSize: '15px', lineHeight: 1 }}>{t.icon}</span>
                      <span>{t.name}</span>
                      {selected && (
                        <span style={{
                          fontSize: '10px',
                          background: '#0082F0',
                          color: '#fff',
                          borderRadius: '999px',
                          padding: '1px 7px',
                          fontWeight: 700,
                          letterSpacing: '0.04em',
                          marginLeft: '2px',
                        }}>ON</span>
                      )}
                    </button>
                  );
                })}
              </div>
              <p style={{ fontSize: '11px', color: '#5A6E8A', marginTop: '10px' }}>
                {TONES.find(t => t.key === form.tone)?.description}
              </p>
            </div>

            {/* CTA Button */}
            <button
              type="submit"
              disabled={!isFormValid || phase === 'loading'}
              className="eric-btn-primary"
              style={
                isFormValid && phase !== 'loading'
                  ? { background: selectedPersona.accentColor === '#0082F0' ? '#0082F0' : '#0082F0' }
                  : {}
              }
            >
              {phase === 'loading' ? (
                <>
                  <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-spin">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                  Consulting the oracle…
                </>
              ) : (
                <>
                  <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                  </svg>
                  Generate My OOO Message
                </>
              )}
            </button>
          </form>

          {/* Output */}
          {phase !== 'form' && (message || isStreaming) && (
            <div className="mt-8">
              <div className="flex items-center justify-between mb-3">
                <span className="eric-section-title" style={{ marginBottom: 0, flex: 1 }}>
                  Your Oracle Message
                </span>
                {!isStreaming && (
                  <button
                    onClick={handleReset}
                    style={{
                      fontSize: '13px',
                      color: '#8496AD',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontFamily: 'DM Sans, sans-serif',
                    }}
                    onMouseOver={e => (e.currentTarget.style.color = '#0082F0')}
                    onMouseOut={e => (e.currentTarget.style.color = '#8496AD')}
                  >
                    ← Start over
                  </button>
                )}
              </div>
              <MessageOutput
                message={message}
                isStreaming={isStreaming}
                personality={form.personality}
                name={form.name}
                destination={form.destination}
                onGenerateAnother={() => { setMessage(''); void generateMessage(); }}
              />
            </div>
          )}
        </div>
      </main>

      {/* ——— Footer ——— */}
      <footer
        style={{
          background: '#001C3D',
          borderTop: '3px solid #0082F0',
          padding: '24px 32px',
        }}
      >
        <div className="max-w-2xl mx-auto flex items-center justify-center">
          <div className="flex items-center gap-3">
            <EricssonLogo className="h-4 text-white w-auto opacity-70" />
            <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '12px' }}>·</span>
            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px' }}>☀ Summer 2026</span>
          </div>
        </div>
      </footer>

      {/* Floating music toggle */}
      <button
        onClick={toggleMusic}
        aria-label={musicOn ? 'Pause ocean ambience' : 'Play ocean ambience'}
        title={musicOn ? 'Pause ocean ambience' : 'Play ocean ambience 🌊'}
        style={{
          position: 'fixed', bottom: '24px', right: '24px',
          width: '48px', height: '48px', borderRadius: '50%',
          background: musicOn ? '#0082F0' : '#001C3D',
          border: '2px solid rgba(255,255,255,0.15)',
          color: 'white', fontSize: '20px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', zIndex: 999,
          boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
          transition: 'background 0.2s ease, transform 0.15s ease',
        }}
        onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.1)')}
        onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
      >
        {musicOn ? '🔊' : '🎵'}
      </button>
    </div>
  );
}
