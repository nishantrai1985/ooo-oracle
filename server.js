import express from 'express';
import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(express.json());

// Serve Vite build (dist/ exists after npm run build; harmless if absent in dev)
app.use(express.static(join(__dirname, 'dist')));

// ─── Provider detection ─────────────────────────────────────────────────────
const PROVIDER = (process.env.AI_PROVIDER || 'anthropic').toLowerCase();
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3.2';
const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';

// ─── Persona character (tone-free) ───────────────────────────────────────────
// These describe WHO the person is — not HOW to write. Tone is injected separately.
const PERSONALITY_PROMPTS = {
  uxdesigner: `CHARACTER: You are a UX designer. Your world revolves around Figma, component libraries, design tokens, and layer naming conventions. You believe naming conventions are a moral issue. You spent the three days before this holiday making sure every frame, component, and variant was perfectly organised — because you know with quiet certainty that the moment you leave, someone will use the wrong font size or detach a component. Your vocabulary includes: auto-layout, variants, frames, components, design tokens, Figma, handoff, annotation, design system.`,

  servicedesigner: `CHARACTER: You are a Service Designer. You see every situation — including your holiday — as a system to be mapped. You cannot experience anything without mentally blueprinting it: the flight is a "service journey," the hotel check-in is a "front-stage interaction," airport security is a "pain point in the pre-departure touchpoint sequence." You think in swimlanes. You have a post-it note in your carry-on. Your vocabulary includes: service blueprint, customer journey, touchpoints, front stage, back stage, ecosystem, swimlanes, moments of truth, service failure, orchestration.`,

  frontend: `CHARACTER: You are a Front-End Developer embedded in a design-heavy team. You are the bridge between beautiful Figma screens and working software. You have received countless design files with no mobile states, no error states, no loading states, and fonts that cost €400 a year. You have strong opinions about CSS that no one asked for. You've developed a gentle, loving martyrdom about your role. Your vocabulary includes: CSS, React, responsive, mobile states, error states, empty states, pixel-perfect, TypeScript, components, Figma handoff, z-index, border-radius.`,

  designmanager: `CHARACTER: You are a Design Manager. You run the team, own the process, communicate extensively (possibly excessively), and genuinely care about your people. You have had meetings about reducing meetings. You think in frameworks: double diamond, north star, OKRs, design maturity. You sent 12 Slack messages before going offline to "really disconnect this time." You believe strongly in clear ownership, documented decisions, and psychological safety. Your vocabulary includes: alignment, stakeholders, north star, roadmap, OKRs, design strategy, cross-functional, deliverables, double diamond, design ops, decision log.`,

  researcher: `CHARACTER: You are a User Researcher. You cannot turn off research mode. You have already started informally interviewing your Airbnb host about their daily routines. You see your holiday as legitimate field research — n=1, but still. You have spotted two usability issues at the airport and one on the plane menu. You are genuinely, deeply curious about people. Your vocabulary includes: contextual inquiry, think-aloud, diary study, affinity mapping, synthesis, insights, n=1, qualitative, participants, empathy map, research question, observation.`,
};

// ─── Tone prompts — injected at system level alongside persona ────────────────
// These control HOW to write. They must override any tonal assumptions from the persona.
const TONE_PROMPTS = {
  formal: `TONE — FORMAL:
Write a clean, professional, warm out-of-office reply. This could be forwarded to a client or a VP without hesitation.
STRICT RULES:
- Zero jokes. Zero sarcasm. Zero winking self-awareness.
- The persona's vocabulary may appear naturally, but never for comic effect.
- Polished, warm, concise. One sentence about what you're doing, one about coverage, one sign-off.
- Sign-off must be professional: "Best regards," / "Kind regards," / "Warm regards,"`,

  playful: `TONE — PLAYFUL:
Write a warm, lightly funny out-of-office. The kind that makes a colleague smile and think "haha, classic them."
STRICT RULES:
- Exactly one gentle, relatable joke or wink — not a full punchline, just a moment of personality.
- Safe for the whole team, nothing edgy, nothing that needs explaining.
- Warm and collegial throughout.
- Sign-off can be slightly informal: "Cheers," / "Talk soon," / "Back soon,"`,

  unhinged: `TONE — UNHINGED:
Write a completely unhinged, maximally chaotic out-of-office. This MUST be funny enough that it gets screenshotted and posted in team Slack with 💀 reactions within minutes of being received.
STRICT RULES:
- Commit FULLY. No half-measures. No tasteful restraint.
- Use hyperbole, absurdist tangents, excessive parenthetical asides, and self-aware oversharing.
- The persona's professional quirks must be taken to a ridiculous, unhinged extreme.
- Include at least one thing that makes the reader go "I cannot believe they actually sent this."
- Sign-off must be chaotic: "Chaotically yours," / "Professionally unravelling," / something equally unhinged.`,

  poetic: `TONE — POETIC:
Write as if a literary writer briefly possessed this person's email account. Unexpectedly lyrical. Slightly dramatic. Beautifully out of place in an inbox.
STRICT RULES:
- Use vivid imagery, metaphors, and elevated, precise language.
- The persona's role and vocabulary must appear — but transformed through a literary lens.
- Short, rhythmic sentences. A gentle cadence. Read it aloud — it should sound intentional.
- Can have a quietly melancholy or romantic quality (summer, distance, departure, return).
- Sign-off must feel like the closing line of a poem: "Until the light returns," / "In absentia," / similar.`,

  corporate: `TONE — CORPORATE BUZZWORD MODE:
Write the most aggressively corporate out-of-office imaginable. Peak LinkedIn. Weaponised jargon. The holiday reframed as a strategic initiative.
STRICT RULES:
- Pack in as many buzzwords as possible while remaining grammatically coherent. Required words to include: at least 4 from this list: leverage, synergize, circle back, move the needle, bandwidth, alignment, actionable insights, best-in-class, holistic, ideate, pivot, scale, stakeholder buy-in, deliverables, north star.
- The persona's actual vocabulary must appear as one more layer of domain jargon on top of the corporate speak.
- Treat the vacation as a "strategic offsite," "recharge sprint," or "personal capacity optimisation initiative."
- Sign-off must be faintly absurd: "Strategically aligned," / "Optimistically yours," / "With full bandwidth,"`,
};

function buildPrompt(name, destination, returnDate) {
  const formattedDate = new Date(returnDate).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long'
  });
  return `Write an out-of-office email for ${name}, a design professional based in Stockholm, heading to ${destination} and returning on ${formattedDate}.

FORMAT RULES (non-negotiable):
- 3–4 lines maximum — punchy, never padded
- NO subject line, NO "From:", NO "To:", NO email headers of any kind
- First line is the actual email body — start immediately
- End with a sign-off that matches the tone
- Weave ${destination} and ${formattedDate} in naturally — do not list them as bullet points`;
}

// ─── SSE helpers ─────────────────────────────────────────────────────────────
function sseText(res, text) {
  res.write(`data: ${JSON.stringify({ text })}\n\n`);
}
function sseDone(res) {
  res.write('data: [DONE]\n\n');
  res.end();
}
function sseError(res, message) {
  res.write(`data: ${JSON.stringify({ error: message })}\n\n`);
  res.end();
}

// ─── Provider streaming functions ────────────────────────────────────────────
async function streamAnthropic(res, systemPrompt, userMessage) {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const stream = await client.messages.stream({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    system: systemPrompt,
    messages: [{ role: 'user', content: userMessage }],
  });
  for await (const event of stream) {
    if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
      sseText(res, event.delta.text);
    }
  }
}

async function streamGroq(res, systemPrompt, userMessage) {
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      stream: true,
      max_tokens: 1024,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Groq error ${response.status}: ${err}`);
  }

  const reader = response.body.getReader();
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
      if (raw === '[DONE]') return;
      try {
        const parsed = JSON.parse(raw);
        const text = parsed.choices?.[0]?.delta?.content;
        if (text) sseText(res, text);
      } catch { /* skip malformed */ }
    }
  }
}

async function streamOllama(res, systemPrompt, userMessage) {
  const response = await fetch(`${OLLAMA_URL}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      prompt: `${systemPrompt}\n\n${userMessage}`,
      stream: true,
    }),
  });

  if (!response.ok) {
    throw new Error(`Ollama error ${response.status}. Is Ollama running? Try: ollama serve`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';
    for (const line of lines) {
      if (!line.trim()) continue;
      try {
        const parsed = JSON.parse(line);
        if (parsed.response) sseText(res, parsed.response);
        if (parsed.done) return;
      } catch { /* skip malformed */ }
    }
  }
}

// ─── Route ───────────────────────────────────────────────────────────────────
app.post('/api/generate', async (req, res) => {
  const { name, destination, returnDate, personality, tone } = req.body;

  if (!name || !destination || !returnDate || !personality) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }
  const personaPrompt = PERSONALITY_PROMPTS[personality];
  if (!personaPrompt) {
    return res.status(400).json({ error: 'Invalid personality type.' });
  }
  const validTone = TONE_PROMPTS[tone] ? tone : 'playful';
  // Combine persona + tone at system level so both carry equal weight
  const systemPrompt = `${personaPrompt}\n\n${TONE_PROMPTS[validTone]}`;

  // Provider key checks
  if (PROVIDER === 'anthropic' && !process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY not set in .env' });
  }
  if (PROVIDER === 'groq' && !process.env.GROQ_API_KEY) {
    return res.status(500).json({ error: 'GROQ_API_KEY not set in .env. Get a free key at console.groq.com' });
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', '*');

  const userMessage = buildPrompt(name, destination, returnDate);

  try {
    if (PROVIDER === 'groq') {
      await streamGroq(res, systemPrompt, userMessage);
    } else if (PROVIDER === 'ollama') {
      await streamOllama(res, systemPrompt, userMessage);
    } else {
      await streamAnthropic(res, systemPrompt, userMessage);
    }
    sseDone(res);
  } catch (err) {
    sseError(res, err instanceof Error ? err.message : 'Unknown error');
  }
});

app.get('/api/health', (_req, res) => {
  const info = {
    status: 'ok',
    provider: PROVIDER,
    ready: PROVIDER === 'anthropic' ? !!process.env.ANTHROPIC_API_KEY
         : PROVIDER === 'groq'      ? !!process.env.GROQ_API_KEY
         : true, // ollama needs no key
  };
  if (PROVIDER === 'ollama') info.model = OLLAMA_MODEL;
  res.json(info);
});

// SPA fallback — must be after all API routes
app.get('*', (_req, res, next) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'), err => err ? next() : undefined);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`\n🔮 OOO Oracle server — provider: ${PROVIDER.toUpperCase()}`);
  if (PROVIDER === 'anthropic') {
    console.log(process.env.ANTHROPIC_API_KEY
      ? '✅ Anthropic key loaded (claude-sonnet-4-6)\n'
      : '⚠️  No ANTHROPIC_API_KEY found in .env\n');
  } else if (PROVIDER === 'groq') {
    console.log(process.env.GROQ_API_KEY
      ? '✅ Groq key loaded (llama-3.3-70b-versatile) — FREE tier\n'
      : '⚠️  No GROQ_API_KEY found. Get one free at console.groq.com\n');
  } else if (PROVIDER === 'ollama') {
    console.log(`✅ Using Ollama (${OLLAMA_MODEL}) at ${OLLAMA_URL}\n`);
  }
});
