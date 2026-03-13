import { useState, useEffect, useRef } from "react";

const T = null;
const G = {
  dark:   '#333333',
  mid:    '#555555',
  smoke:  '#777777',
  silver: '#999999',
  light:  '#444444',
};

// ── Activity scenes ─────────────────────────────────────────────
const scenes = [
  {
    label: "sipping coffee",
    pixels: [
      T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,
      T,T,T,T,G.smoke,T,G.smoke,T,T,T,T,T,T,T,T,T,
      T,T,T,T,T,G.smoke,T,T,T,T,T,T,T,T,T,T,
      T,T,T,T,G.smoke,T,G.smoke,T,T,T,T,T,T,T,T,T,
      T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,
      T,T,G.light,G.light,G.light,G.light,G.light,G.light,G.light,T,T,T,T,T,T,T,
      T,T,G.light,G.dark,G.dark,G.dark,G.dark,G.dark,G.light,G.silver,T,T,T,T,T,T,
      T,T,G.light,G.mid,G.mid,G.mid,G.mid,G.mid,G.light,G.silver,T,T,T,T,T,T,
      T,T,G.light,G.smoke,G.smoke,G.smoke,G.smoke,G.smoke,G.light,T,T,T,T,T,T,T,
      T,T,G.light,G.light,G.light,G.light,G.light,G.light,G.light,T,T,T,T,T,T,T,
      T,T,T,G.silver,G.silver,G.silver,G.silver,G.silver,T,T,T,T,T,T,T,T,
      T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,
      T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,
      T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,
      T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,
      T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,
    ],
  },
  {
    label: "reading a book",
    pixels: [
      T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,
      T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,
      T,T,T,T,'#d8d8d8','#d8d8d8','#d8d8d8',T,'#bbbbbb','#bbbbbb','#bbbbbb',T,T,T,T,T,
      T,T,T,T,'#d8d8d8',G.dark,'#d8d8d8',T,'#bbbbbb',G.dark,'#bbbbbb',T,T,T,T,T,
      T,T,T,T,'#d8d8d8',G.dark,'#d8d8d8',T,'#bbbbbb',G.dark,'#bbbbbb',T,T,T,T,T,
      T,T,T,T,'#d8d8d8',G.dark,'#d8d8d8',T,'#bbbbbb',G.dark,'#bbbbbb',T,T,T,T,T,
      T,T,T,T,'#d8d8d8','#d8d8d8','#d8d8d8',T,'#bbbbbb','#bbbbbb','#bbbbbb',T,T,T,T,T,
      T,T,T,G.silver,G.silver,G.silver,G.silver,G.silver,G.silver,G.silver,G.silver,T,T,T,T,T,
      T,T,T,G.smoke,'#d8d8d8','#d8d8d8',G.smoke,'#bbbbbb','#bbbbbb','#bbbbbb',G.smoke,T,T,T,T,T,
      T,T,T,G.smoke,'#d8d8d8','#d8d8d8',G.smoke,'#bbbbbb','#bbbbbb','#bbbbbb',G.smoke,T,T,T,T,T,
      T,T,T,G.silver,G.silver,G.silver,G.silver,G.silver,G.silver,G.silver,G.silver,T,T,T,T,T,
      T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,
      T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,
      T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,
      T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,
      T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,
    ],
  },
  {
    label: "hanging with her pup",
    pixels: [
      T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,
      T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,
      T,T,G.silver,G.silver,T,T,T,G.silver,G.silver,T,T,T,T,T,T,T,
      T,T,G.silver,G.silver,G.silver,G.silver,G.silver,G.silver,G.silver,T,T,T,T,T,T,T,
      T,T,T,G.silver,G.dark,G.silver,G.silver,G.dark,G.silver,T,T,T,T,T,T,T,
      T,T,T,G.silver,G.silver,G.silver,G.silver,G.silver,G.silver,T,T,T,T,T,T,T,
      T,T,T,T,'#bbbbbb','#bbbbbb','#bbbbbb','#bbbbbb',T,T,T,T,T,T,T,T,
      T,T,T,G.silver,G.silver,G.silver,G.silver,G.silver,G.silver,T,T,T,T,T,T,T,
      T,T,T,G.silver,T,G.silver,G.silver,T,G.silver,T,T,T,T,T,T,T,
      T,T,T,G.silver,T,G.silver,G.silver,T,G.silver,T,T,T,T,T,T,T,
      T,T,T,G.smoke,T,G.smoke,G.smoke,T,G.smoke,T,T,T,T,T,T,T,
      T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,
      T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,
      T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,
      T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,
      T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,
    ],
  },
  {
    label: "throwing pottery",
    pixels: [
      T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,
      T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,
      T,T,T,T,T,'#bbbbbb','#bbbbbb',T,T,T,T,T,T,T,T,T,
      T,T,T,T,'#bbbbbb',G.silver,G.silver,'#bbbbbb',T,T,T,T,T,T,T,T,
      T,T,T,'#bbbbbb',G.silver,G.silver,G.silver,G.silver,'#bbbbbb',T,T,T,T,T,T,T,
      T,T,T,'#bbbbbb',G.silver,G.mid,G.mid,G.silver,'#bbbbbb',T,T,T,T,T,T,T,
      T,T,T,T,'#bbbbbb',G.silver,G.silver,'#bbbbbb',T,T,T,T,T,T,T,T,
      T,T,T,G.smoke,G.smoke,G.smoke,G.smoke,G.smoke,G.smoke,T,T,T,T,T,T,T,
      T,T,T,T,T,G.dark,G.dark,T,T,T,T,T,T,T,T,T,
      T,T,G.mid,G.mid,G.mid,G.mid,G.mid,G.mid,G.mid,G.mid,T,T,T,T,T,T,
      T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,
      T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,
      T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,
      T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,
      T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,
      T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,
    ],
  },
  {
    label: "tending her plants",
    pixels: [
      T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,
      T,T,T,T,T,G.mid,T,T,T,T,T,T,T,T,T,T,
      T,T,T,T,G.mid,G.mid,G.mid,T,T,G.mid,T,T,T,T,T,T,
      T,T,T,G.silver,G.silver,G.silver,G.silver,G.silver,T,G.silver,G.silver,T,T,T,T,T,
      T,T,T,T,G.silver,G.silver,G.silver,T,T,T,G.silver,T,T,T,T,T,
      T,T,T,T,T,G.silver,G.silver,T,T,T,T,T,T,T,T,T,
      T,T,T,T,T,G.smoke,G.smoke,T,T,T,G.smoke,T,T,T,T,T,
      T,T,T,'#bbbbbb','#bbbbbb',G.smoke,G.smoke,'#bbbbbb','#bbbbbb',G.smoke,'#bbbbbb',T,T,T,T,T,
      T,T,T,'#bbbbbb','#bbbbbb',G.smoke,G.smoke,'#bbbbbb','#bbbbbb',G.smoke,'#bbbbbb',T,T,T,T,T,
      T,T,T,G.silver,G.silver,G.smoke,G.smoke,G.silver,G.silver,G.smoke,G.silver,T,T,T,T,T,
      T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,
      T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,
      T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,
      T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,
      T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,
      T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,
    ],
  },
  {
    label: "on a walk",
    pixels: [
      T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,
      T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,
      T,T,T,T,T,'#d8d8d8','#d8d8d8',T,T,T,T,T,T,T,T,T,
      T,T,T,T,'#d8d8d8','#eeeeee','#eeeeee','#d8d8d8',T,T,T,T,T,T,T,T,
      T,T,T,T,'#d8d8d8','#eeeeee','#eeeeee','#d8d8d8',T,T,T,T,T,T,T,T,
      T,T,T,T,T,'#d8d8d8','#d8d8d8',T,T,T,T,T,T,T,T,T,
      T,T,T,T,T,'#bbbbbb','#bbbbbb',T,T,T,T,T,T,T,T,T,
      T,T,T,'#bbbbbb','#bbbbbb','#bbbbbb','#bbbbbb','#bbbbbb',T,T,T,T,T,T,T,T,
      T,T,T,T,T,'#bbbbbb',T,'#bbbbbb',T,T,T,T,T,T,T,T,
      T,T,T,T,'#bbbbbb',T,T,T,'#bbbbbb',T,T,T,T,T,T,T,
      T,T,T,T,G.silver,T,T,T,G.silver,T,T,T,T,T,T,T,
      T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,
      T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,
      T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,
      T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,
      T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,
    ],
  },
  {
    label: "designing",
    pixels: [
      T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,
      T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,
      T,T,G.mid,G.mid,G.mid,G.mid,G.mid,G.mid,G.mid,G.mid,G.mid,T,T,T,T,T,
      T,T,G.mid,'#d8d8d8','#bbbbbb','#bbbbbb',G.silver,'#d8d8d8','#bbbbbb',G.silver,G.mid,T,T,T,T,T,
      T,T,G.mid,'#d8d8d8','#bbbbbb',G.smoke,G.silver,'#d8d8d8','#bbbbbb','#d8d8d8',G.mid,T,T,T,T,T,
      T,T,G.mid,G.silver,'#d8d8d8','#bbbbbb',G.silver,G.silver,G.smoke,G.silver,G.mid,T,T,T,T,T,
      T,T,G.mid,G.mid,G.mid,G.mid,G.mid,G.mid,G.mid,G.mid,G.mid,T,T,T,T,T,
      T,'#333333','#333333','#333333','#333333','#333333','#333333','#333333','#333333','#333333','#333333','#333333',T,T,T,T,
      T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,
      T,T,T,T,T,T,T,T,T,T,T,'#d8d8d8',T,T,T,T,
      T,T,T,T,T,T,T,T,T,T,'#d8d8d8','#bbbbbb',T,T,T,T,
      T,T,T,T,T,T,T,T,T,'#d8d8d8','#bbbbbb',T,T,T,T,T,
      T,T,T,T,T,T,T,T,'#bbbbbb',T,T,T,T,T,T,T,
      T,T,T,T,T,T,T,G.silver,T,T,T,T,T,T,T,T,
      T,T,T,T,T,T,G.smoke,T,T,T,T,T,T,T,T,T,
      T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,
    ],
  },
];

// ── Social icons ────────────────────────────────────────────────
const D = '#2a2a2a', L = '#aaaaaa';

const igPixels = [
  T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,
  T,T,L,L,L,L,L,L,L,L,L,L,L,L,T,T,
  T,T,L,D,D,D,D,D,D,D,D,D,D,L,T,T,
  T,T,L,D,T,T,T,T,T,T,T,T,D,L,T,T,
  T,T,L,D,T,T,T,D,D,T,T,T,D,L,T,T,
  T,T,L,D,T,T,D,T,T,D,T,T,D,L,T,T,
  T,T,L,D,T,D,T,T,T,T,D,T,D,L,T,T,
  T,T,L,D,T,D,T,T,T,T,D,T,D,L,T,T,
  T,T,L,D,T,D,T,T,T,T,D,T,D,L,T,T,
  T,T,L,D,T,T,D,T,T,D,T,T,D,L,T,T,
  T,T,L,D,T,T,T,D,D,T,T,T,D,L,T,T,
  T,T,L,D,T,T,T,T,T,T,D,D,D,L,T,T,
  T,T,L,D,T,T,T,T,T,T,T,T,D,L,T,T,
  T,T,L,D,D,D,D,D,D,D,D,D,D,L,T,T,
  T,T,L,L,L,L,L,L,L,L,L,L,L,L,T,T,
  T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,
];
const liPixels = [
  T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,
  T,T,L,L,L,L,L,L,L,L,L,L,L,L,T,T,
  T,T,L,D,D,D,D,D,D,D,D,D,D,L,T,T,
  T,T,L,D,T,T,T,T,T,T,T,T,D,L,T,T,
  T,T,L,D,D,D,T,T,T,T,T,T,D,L,T,T,
  T,T,L,D,T,T,T,T,T,T,T,T,D,L,T,T,
  T,T,L,D,D,T,T,D,D,D,T,T,D,L,T,T,
  T,T,L,D,D,T,D,T,T,T,D,T,D,L,T,T,
  T,T,L,D,D,T,D,T,T,T,D,T,D,L,T,T,
  T,T,L,D,D,T,D,T,T,T,D,T,D,L,T,T,
  T,T,L,D,D,T,D,T,T,T,D,T,D,L,T,T,
  T,T,L,D,T,T,T,T,T,T,T,T,D,L,T,T,
  T,T,L,D,T,T,T,T,T,T,T,T,D,L,T,T,
  T,T,L,D,D,D,D,D,D,D,D,D,D,L,T,T,
  T,T,L,L,L,L,L,L,L,L,L,L,L,L,T,T,
  T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,
];
const emailPixels = [
  T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,
  T,T,L,L,L,L,L,L,L,L,L,L,L,L,T,T,
  T,T,L,D,D,D,D,D,D,D,D,D,D,L,T,T,
  T,T,L,D,T,T,T,T,T,T,T,T,D,L,T,T,
  T,T,L,D,D,T,T,T,T,T,T,D,D,L,T,T,
  T,T,L,D,T,D,T,T,T,T,D,T,D,L,T,T,
  T,T,L,D,T,T,D,T,T,D,T,T,D,L,T,T,
  T,T,L,D,T,T,T,D,D,T,T,T,D,L,T,T,
  T,T,L,D,T,T,T,T,T,T,T,T,D,L,T,T,
  T,T,L,D,T,T,T,T,T,T,T,T,D,L,T,T,
  T,T,L,D,T,T,T,T,T,T,T,T,D,L,T,T,
  T,T,L,D,T,T,T,T,T,T,T,T,D,L,T,T,
  T,T,L,D,T,T,T,T,T,T,T,T,D,L,T,T,
  T,T,L,D,D,D,D,D,D,D,D,D,D,L,T,T,
  T,T,L,L,L,L,L,L,L,L,L,L,L,L,T,T,
  T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,
];

function drawPixels(ctx, pixels) {
  ctx.clearRect(0, 0, 16, 16);
  for (let i = 0; i < pixels.length; i++) {
    if (!pixels[i]) continue;
    ctx.fillStyle = pixels[i];
    ctx.fillRect(i % 16, Math.floor(i / 16), 1, 1);
  }
}

function PixelIcon({ pixels, size = 26 }) {
  const ref = useRef(null);
  useEffect(() => {
    const ctx = ref.current?.getContext('2d');
    if (ctx) drawPixels(ctx, pixels);
  }, [pixels]);
  return <canvas ref={ref} width={16} height={16} style={{ width: size, height: size, imageRendering: 'pixelated', flexShrink: 0 }} />;
}

const contacts = [
  { id:'ig', pixels:igPixels,    label:'@amandadrewthat',  href:'https://instagram.com/amandadrewthat' },
  { id:'li', pixels:liPixels,    label:'amandapinero',     href:'https://www.linkedin.com/in/amandapinero/' },
  { id:'em', pixels:emailPixels, label:'hello@amanduh.co', href:'mailto:hello@amanduh.co' },
];

// ── Pixel activity canvas (animated) ───────────────────────────
function ActivityCanvas({ sceneIdx }) {
  const canvasRef = useRef(null);
  const rafRef    = useRef(null);
  const frameRef  = useRef(0);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) drawPixels(ctx, scenes[sceneIdx].pixels);
  }, [sceneIdx]);

  useEffect(() => {
    const go = () => {
      frameRef.current++;
      const s = 1 + Math.sin(frameRef.current * 0.08) * 0.025;
      if (canvasRef.current) canvasRef.current.style.transform = `scale(${s})`;
      rafRef.current = requestAnimationFrame(go);
    };
    rafRef.current = requestAnimationFrame(go);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={16} height={16}
      style={{ width: 32, height: 32, imageRendering: 'pixelated', flexShrink: 0 }}
    />
  );
}

// ── Claude-Code-style loading line ──────────────────────────────
function LoadingLine({ sceneIdx, sceneLabel, elapsed }) {
  const [labelVisible, setLabelVisible] = useState(true);

  useEffect(() => {
    setLabelVisible(false);
    const t = setTimeout(() => setLabelVisible(true), 120);
    return () => clearTimeout(t);
  }, [sceneLabel]);

  const secs = Math.floor(elapsed / 1000);
  const timeStr = secs < 60 ? `${secs}s` : `${Math.floor(secs/60)}m ${secs%60}s`;

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: 8,
      fontFamily: "'Share Tech Mono', monospace",
    }}>
      {/* Main status line: spinner + pixel art + label */}
      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
        <SpinStar />
        <ActivityCanvas sceneIdx={sceneIdx} />
        <div style={{ display:'flex', flexDirection:'column', gap:1 }}>
          <span style={{ color:'#e8855a', fontSize:12, fontWeight:500, lineHeight:1.2 }}>
            Amanda is{' '}
            <span style={{
              opacity: labelVisible ? 1 : 0,
              transition: 'opacity 0.15s ease',
              display: 'inline-block',
            }}>
              {sceneLabel}…
            </span>
          </span>
          <span style={{ color:'#828282', fontSize:10 }}>({timeStr})</span>
        </div>
      </div>
      {/* Tip line */}
      <div style={{ display:'flex', alignItems:'center', gap:6, paddingLeft:2 }}>
        <span style={{ color:'#aaa', fontSize:11 }}>└</span>
        <span style={{ color:'#828282', fontSize:10, fontStyle:'italic' }}>
          Locating contact info…
        </span>
      </div>
    </div>
  );
}

function SpinStar() {
  const frames = ['*', '✦', '·', '✦'];
  const [f, setF] = useState(0);
  useEffect(() => {
    const iv = setInterval(() => setF(p => (p+1)%frames.length), 180);
    return () => clearInterval(iv);
  }, []);
  return <span style={{ color:'#e8855a', fontSize:14, width:14, display:'inline-block', textAlign:'center' }}>{frames[f]}</span>;
}

// ── Main ────────────────────────────────────────────────────────
export default function ContactAmanda() {
  const [phase, setPhase]             = useState('idle');
  const [sceneIdx, setSceneIdx]       = useState(0);
  const [sceneVisible, setSceneVis]   = useState(true);
  const [iconVisible, setIconVisible] = useState([false,false,false]);
  const [contentVisible, setContentVis] = useState(false);
  const [elapsed, setElapsed]         = useState(0);
  const timerRef   = useRef(null);
  const elapsedRef = useRef(null);
  const startRef   = useRef(null);

  const revealContact = () => {
    clearInterval(elapsedRef.current);
    setContentVis(false);
    setTimeout(() => {
      setPhase('contact');
      setContentVis(true);
      [0,1,2].forEach(i => setTimeout(() =>
        setIconVisible(prev => { const n=[...prev]; n[i]=true; return n; })
      , i*150));
    }, 180);
  };

  const handleSend = () => {
    if (phase !== 'idle') return;
    setElapsed(0);
    setSceneIdx(0);
    setPhase('loading');
    setContentVis(true);

    // tick elapsed
    startRef.current = Date.now();
    elapsedRef.current = setInterval(() => {
      setElapsed(Date.now() - startRef.current);
    }, 500);

    // cycle scenes
    const sceneInterval = setInterval(() => {
      setSceneVis(false);
      setTimeout(() => {
        setSceneIdx(prev => (prev+1) % scenes.length);
        setSceneVis(true);
      }, 120);
    }, 2200);

    timerRef.current = setTimeout(() => {
      clearInterval(sceneInterval);
      revealContact();
    }, 6500);
  };

  const handleReset = () => {
    clearTimeout(timerRef.current);
    clearInterval(elapsedRef.current);
    setContentVis(false);
    setIconVisible([false,false,false]);
    setTimeout(() => {
      setPhase('idle');
      setElapsed(0);
    }, 200);
  };

  const currentScene = scenes[sceneIdx];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');

        @keyframes ca-blink { 0%,100%{opacity:0} 50%{opacity:1} }

        .ca-c1 { animation: ca-blink 1.1s step-start infinite; }
        .ca-c2 { animation: ca-blink 1.1s step-start infinite .18s; }
        .ca-c3 { animation: ca-blink 1.1s step-start infinite .36s; }

        .ca-card {
          font-family: 'Share Tech Mono', monospace;
          background: #F2F2F2;
          border: 1px solid #e0e0e0;
          border-radius: 20px;
          display: flex;
          flex-direction: column;
          width: 100%;
          max-width: 480px;
          min-width: 0;
          position: relative;
          box-sizing: border-box;
          overflow: hidden;
          box-shadow: 0 2px 12px rgba(0,0,0,0.07);
        }

        .ca-icon-row {
          display:flex; align-items:center; gap:10px;
          text-decoration:none; padding:4px 0;
          transition: opacity .15s;
        }
        .ca-icon-row:hover { opacity:.55; }

        .ca-send-btn {
          width: 32px; height: 32px;
          border-radius: 50%;
          background: #2a2a2a;
          border: none;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          transition: background .15s, transform .1s;
        }
        .ca-send-btn:hover  { background: #111; }
        .ca-send-btn:active { transform: scale(.93); }
        .ca-send-btn:disabled {
          background: #d8d8d8;
          cursor: default;
        }

        .ca-again {
          font-family: 'Share Tech Mono', monospace;
          font-size: 9px; color: #828282;
          background: none; border: none;
          cursor: pointer; letter-spacing: .1em;
          text-transform: uppercase; padding: 0;
          transition: color .15s; display: inline-block; margin-top: 10px;
        }
        .ca-again:hover { color: #333; }
      `}</style>

      <div className="ca-card">

        {/* ── TOP: content area ── */}
        <div style={{
          minHeight: 120,
          padding: '20px 20px 16px',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: phase === 'idle' ? 'center' : 'flex-start',
          gap: 0,
        }}>

          {/* IDLE STATE */}
          {phase === 'idle' && (
            <div style={{ display:'flex', flexDirection:'column', gap:3 }}>
              <span style={{ fontSize:9, color:'#828282', letterSpacing:'0.16em', textTransform:'uppercase' }}>contact</span>
              <span style={{
                fontSize:22, color:'#1a1a1a', letterSpacing:'-0.02em', lineHeight:1.1,
                fontFamily:'system-ui, sans-serif', fontWeight:500,
              }}>Amanda</span>
              <span style={{ fontSize:9, color:'#828282', letterSpacing:'0.05em', marginTop:2 }}>San Francisco, CA</span>
            </div>
          )}

          {/* LOADING STATE — Claude Code style */}
          {phase === 'loading' && (
            <div style={{
              opacity: contentVisible ? 1 : 0,
              transform: contentVisible ? 'translateY(0)' : 'translateY(4px)',
              transition: 'opacity .2s ease, transform .2s ease',
            }}>
              <LoadingLine
                sceneIdx={sceneIdx}
                sceneLabel={currentScene.label}
                elapsed={elapsed}
              />
            </div>
          )}

          {/* CONTACT STATE */}
          {phase === 'contact' && (
            <div style={{
              opacity: contentVisible ? 1 : 0,
              transform: contentVisible ? 'translateY(0)' : 'translateY(4px)',
              transition: 'opacity .2s ease, transform .2s ease',
              display: 'flex', flexDirection: 'column',
            }}>
              {contacts.map((c, i) => (
                <a
                  key={c.id}
                  href={c.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ca-icon-row"
                  style={{
                    opacity: iconVisible[i] ? 1 : 0,
                    transform: iconVisible[i] ? 'translateY(0)' : 'translateY(6px)',
                    transition: `opacity .3s ease ${i*.13}s, transform .3s ease ${i*.13}s`,
                  }}
                >
                  <PixelIcon pixels={c.pixels} size={24} />
                  <span style={{ fontSize:11, color:'#444', letterSpacing:'0.02em', whiteSpace:'nowrap' }}>
                    {c.label}
                  </span>
                </a>
              ))}
              <button className="ca-again" onClick={handleReset}>↩ ask again</button>
            </div>
          )}

        </div>

        {/* ── DIVIDER ── */}
        <div style={{ height:1, background:'#e8e8e8', margin:'0 0' }} />

        {/* ── BOTTOM: full-width prompt bar ── */}
        <div style={{
          padding: '10px 12px',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          boxSizing: 'border-box',
          background: '#ffffff',
          borderRadius: '0 0 20px 20px',
        }}>

          {/* Input row */}
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <span style={{
              flex:1, fontSize:13, color:'#333333',
              fontFamily:'system-ui, sans-serif',
              letterSpacing:'0.01em',
              padding: '4px 2px',
            }}>
              {phase === 'idle'
                ? 'how do I reach Amanda?'
                : phase === 'loading'
                ? 'searching for Amanda…'
                : 'found her ✓'}
            </span>
            <button className="ca-send-btn" onClick={handleSend} disabled={phase !== 'idle'}>
              <svg width="13" height="13" viewBox="0 0 12 12" fill="none">
                <path d="M6 10V2M6 2L2.5 5.5M6 2L9.5 5.5" stroke="#F2F2F2" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          {/* Action chips */}
          <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
            {[
              { icon:'📷', label:'instagram' },
              { icon:'💼', label:'linkedin'  },
              { icon:'✉️', label:'email'     },
            ].map(chip => (
              <button
                key={chip.label}
                onClick={phase === 'idle' ? handleSend : undefined}
                style={{
                  display:'inline-flex', alignItems:'center', gap:5,
                  fontSize:10, color:'#828282',
                  background:'#f4f4f4', border:'1px solid #e8e8e8',
                  borderRadius:20, padding:'4px 10px',
                  cursor: phase === 'idle' ? 'pointer' : 'default',
                  fontFamily:"'Share Tech Mono', monospace",
                  letterSpacing:'0.04em',
                  transition:'background .12s, color .12s',
                  outline:'none',
                  opacity: phase !== 'idle' ? 0.5 : 1,
                }}
                onMouseEnter={e => { if(phase==='idle') { e.target.style.background='#ececec'; e.target.style.color='#333'; }}}
                onMouseLeave={e => { e.target.style.background='#f4f4f4'; e.target.style.color='#828282'; }}
              >
                <span style={{fontSize:10}}>{chip.icon}</span>
                {chip.label}
              </button>
            ))}
          </div>

        </div>

      </div>
    </>
  );
}
