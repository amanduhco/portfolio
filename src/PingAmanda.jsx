import { useState, useEffect, useRef } from "react";
import { trackContactAction } from './analytics';

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
  const visibleRef = useRef(false);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) drawPixels(ctx, scenes[sceneIdx].pixels);
  }, [sceneIdx]);

  useEffect(() => {
    const go = () => {
      if (visibleRef.current) {
        frameRef.current++;
        const s = 1 + Math.sin(frameRef.current * 0.08) * 0.025;
        if (canvasRef.current) canvasRef.current.style.transform = `scale(${s})`;
      }
      rafRef.current = requestAnimationFrame(go);
    };

    const observer = new IntersectionObserver(
      ([entry]) => { visibleRef.current = entry.isIntersecting; },
      { threshold: 0 }
    );
    if (canvasRef.current) observer.observe(canvasRef.current);

    rafRef.current = requestAnimationFrame(go);
    return () => {
      cancelAnimationFrame(rafRef.current);
      observer.disconnect();
    };
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
    trackContactAction('reveal_start', 'ping_amanda');
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
    trackContactAction('reset', 'ping_amanda');
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
    <div className="ca-card">

      {/* ── TOP: content area ── */}
      <div className={`ca-content-area${phase === 'idle' ? ' ca-content-area--center' : ''}`}>

        {/* IDLE STATE */}
        {phase === 'idle' && (
          <div className="ca-idle">
            <span className="ca-idle-label">contact</span>
            <span className="ca-idle-name">Amanda</span>
            <span className="ca-idle-location">San Francisco, CA</span>
          </div>
        )}

        {/* LOADING STATE */}
        {phase === 'loading' && (
          <div className={`ca-fade${contentVisible ? ' ca-fade--visible' : ''}`}>
            <LoadingLine
              sceneIdx={sceneIdx}
              sceneLabel={currentScene.label}
              elapsed={elapsed}
            />
          </div>
        )}

        {/* CONTACT STATE */}
        {phase === 'contact' && (
          <div className={`ca-fade ca-contact-list${contentVisible ? ' ca-fade--visible' : ''}`}>
            {contacts.map((c, i) => (
              <a
                key={c.id}
                href={c.href}
                target="_blank"
                rel="noopener noreferrer"
                className="ca-icon-row"
                onClick={() => trackContactAction('contact_link', c.id)}
                style={{
                  opacity: iconVisible[i] ? 1 : 0,
                  transform: iconVisible[i] ? 'translateY(0)' : 'translateY(6px)',
                  transition: `opacity .3s ease ${i * 0.13}s, transform .3s ease ${i * 0.13}s`,
                }}
              >
                <PixelIcon pixels={c.pixels} size={24} />
                <span className="ca-icon-label">{c.label}</span>
              </a>
            ))}
            <button className="ca-again" onClick={handleReset}>↩ ask again</button>
          </div>
        )}

      </div>

      {/* ── DIVIDER ── */}
      <div className="ca-divider" />

      {/* ── BOTTOM: full-width prompt bar ── */}
      <div className="ca-prompt-bar">

        {/* Input row */}
        <div className="ca-input-row">
          <span className="ca-input-text">
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
        <div className="ca-chips">
          {[
            { icon:'📷', label:'instagram' },
            { icon:'💼', label:'linkedin'  },
            { icon:'✉️', label:'email'     },
          ].map(chip => (
            <button
              key={chip.label}
              className="ca-chip"
              onClick={phase === 'idle' ? handleSend : undefined}
              disabled={phase !== 'idle'}
            >
              {chip.icon} {chip.label}
            </button>
          ))}
        </div>

      </div>

    </div>
  );
}
