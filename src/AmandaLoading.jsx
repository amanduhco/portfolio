import { useState, useEffect, useRef } from "react";

const T = null;
const G = {
  vdark:  '#eeeeee',
  dark:   '#d0d0d0',
  mid:    '#aaaaaa',
  smoke:  '#888888',
  silver: '#666666',
  light:  '#444444',
  bright: '#282828',
  white:  '#111111',
};

const scenes = [
  {
    label: "is sipping coffee",
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
    label: "is reading a book",
    pixels: [
      T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,
      T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,
      T,T,T,T,G.bright,G.bright,G.bright,T,G.light,G.light,G.light,T,T,T,T,T,
      T,T,T,T,G.bright,G.dark,G.bright,T,G.light,G.dark,G.light,T,T,T,T,T,
      T,T,T,T,G.bright,G.dark,G.bright,T,G.light,G.dark,G.light,T,T,T,T,T,
      T,T,T,T,G.bright,G.dark,G.bright,T,G.light,G.dark,G.light,T,T,T,T,T,
      T,T,T,T,G.bright,G.bright,G.bright,T,G.light,G.light,G.light,T,T,T,T,T,
      T,T,T,G.silver,G.silver,G.silver,G.silver,G.silver,G.silver,G.silver,G.silver,T,T,T,T,T,
      T,T,T,G.smoke,G.bright,G.bright,G.smoke,G.light,G.light,G.light,G.smoke,T,T,T,T,T,
      T,T,T,G.smoke,G.bright,G.bright,G.smoke,G.light,G.light,G.light,G.smoke,T,T,T,T,T,
      T,T,T,G.silver,G.silver,G.silver,G.silver,G.silver,G.silver,G.silver,G.silver,T,T,T,T,T,
      T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,
      T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,
      T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,
      T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,
      T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,
    ],
  },
  {
    label: "is hanging with her pup",
    pixels: [
      T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,
      T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,
      T,T,G.silver,G.silver,T,T,T,G.silver,G.silver,T,T,T,T,T,T,T,
      T,T,G.silver,G.silver,G.silver,G.silver,G.silver,G.silver,G.silver,T,T,T,T,T,T,T,
      T,T,T,G.silver,G.dark,G.silver,G.silver,G.dark,G.silver,T,T,T,T,T,T,T,
      T,T,T,G.silver,G.silver,G.silver,G.silver,G.silver,G.silver,T,T,T,T,T,T,T,
      T,T,T,T,G.light,G.light,G.light,G.light,T,T,T,T,T,T,T,T,
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
    label: "is throwing pottery",
    pixels: [
      T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,
      T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,
      T,T,T,T,T,G.light,G.light,T,T,T,T,T,T,T,T,T,
      T,T,T,T,G.light,G.silver,G.silver,G.light,T,T,T,T,T,T,T,T,
      T,T,T,G.light,G.silver,G.silver,G.silver,G.silver,G.light,T,T,T,T,T,T,T,
      T,T,T,G.light,G.silver,G.mid,G.mid,G.silver,G.light,T,T,T,T,T,T,T,
      T,T,T,T,G.light,G.silver,G.silver,G.light,T,T,T,T,T,T,T,T,
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
    label: "is tending her plants",
    pixels: [
      T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,
      T,T,T,T,T,G.mid,T,T,T,T,T,T,T,T,T,T,
      T,T,T,T,G.mid,G.mid,G.mid,T,T,G.mid,T,T,T,T,T,T,
      T,T,T,G.silver,G.silver,G.silver,G.silver,G.silver,T,G.silver,G.silver,T,T,T,T,T,
      T,T,T,T,G.silver,G.silver,G.silver,T,T,T,G.silver,T,T,T,T,T,
      T,T,T,T,T,G.silver,G.silver,T,T,T,T,T,T,T,T,T,
      T,T,T,T,T,G.smoke,G.smoke,T,T,T,G.smoke,T,T,T,T,T,
      T,T,T,G.light,G.light,G.smoke,G.smoke,G.light,G.light,G.smoke,G.light,T,T,T,T,T,
      T,T,T,G.light,G.light,G.smoke,G.smoke,G.light,G.light,G.smoke,G.light,T,T,T,T,T,
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
    label: "is on a walk",
    pixels: [
      T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,
      T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,
      T,T,T,T,T,G.bright,G.bright,T,T,T,T,T,T,T,T,T,
      T,T,T,T,G.bright,G.white,G.white,G.bright,T,T,T,T,T,T,T,T,
      T,T,T,T,G.bright,G.white,G.white,G.bright,T,T,T,T,T,T,T,T,
      T,T,T,T,T,G.bright,G.bright,T,T,T,T,T,T,T,T,T,
      T,T,T,T,T,G.light,G.light,T,T,T,T,T,T,T,T,T,
      T,T,T,G.light,G.light,G.light,G.light,G.light,T,T,T,T,T,T,T,T,
      T,T,T,T,T,G.light,T,G.light,T,T,T,T,T,T,T,T,
      T,T,T,T,G.light,T,T,T,G.light,T,T,T,T,T,T,T,
      T,T,T,T,G.silver,T,T,T,G.silver,T,T,T,T,T,T,T,
      T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,
      T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,
      T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,
      T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,
      T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,
    ],
  },
  {
    label: "is designing",
    pixels: [
      T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,
      T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,
      T,T,G.mid,G.mid,G.mid,G.mid,G.mid,G.mid,G.mid,G.mid,G.mid,T,T,T,T,T,
      T,T,G.mid,G.bright,G.light,G.light,G.silver,G.bright,G.light,G.silver,G.mid,T,T,T,T,T,
      T,T,G.mid,G.bright,G.light,G.smoke,G.silver,G.bright,G.light,G.bright,G.mid,T,T,T,T,T,
      T,T,G.mid,G.silver,G.bright,G.light,G.silver,G.silver,G.smoke,G.silver,G.mid,T,T,T,T,T,
      T,T,G.mid,G.mid,G.mid,G.mid,G.mid,G.mid,G.mid,G.mid,G.mid,T,T,T,T,T,
      T,G.dark,G.dark,G.dark,G.dark,G.dark,G.dark,G.dark,G.dark,G.dark,G.dark,G.dark,T,T,T,T,
      T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,
      T,T,T,T,T,T,T,T,T,T,T,G.bright,T,T,T,T,
      T,T,T,T,T,T,T,T,T,T,G.bright,G.light,T,T,T,T,
      T,T,T,T,T,T,T,T,T,G.bright,G.light,T,T,T,T,T,
      T,T,T,T,T,T,T,T,G.light,T,T,T,T,T,T,T,
      T,T,T,T,T,T,T,G.silver,T,T,T,T,T,T,T,T,
      T,T,T,T,T,T,G.smoke,T,T,T,T,T,T,T,T,T,
      T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,
    ],
  },
];

function drawPixels(ctx, pixels) {
  ctx.clearRect(0, 0, 16, 16);
  for (let i = 0; i < pixels.length; i++) {
    if (pixels[i] === null) continue;
    ctx.fillStyle = pixels[i];
    ctx.fillRect(i % 16, Math.floor(i / 16), 1, 1);
  }
}

export default function AmandaLoading() {
  const canvasRef = useRef(null);
  const frameRef = useRef(0);
  const rafRef = useRef(null);
  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(true);

  // Draw initial scene
  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) drawPixels(ctx, scenes[0].pixels);
  }, []);

  // Cycle scenes
  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setCurrent(prev => {
          const next = (prev + 1) % scenes.length;
          const ctx = canvasRef.current?.getContext('2d');
          if (ctx) drawPixels(ctx, scenes[next].pixels);
          return next;
        });
        setVisible(true);
      }, 220);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  // Canvas pulse animation
  useEffect(() => {
    const animate = () => {
      frameRef.current++;
      const scale = 1 + Math.sin(frameRef.current * 0.08) * 0.03;
      if (canvasRef.current) {
        canvasRef.current.style.transform = `scale(${scale})`;
      }
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');

        @keyframes shimmer {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.7; }
        }
        @keyframes blink {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }
        .amanda-ghost { animation: shimmer 1.8s infinite; }
        .amanda-ghost-2 { animation: shimmer 1.8s infinite 0.3s; }
        .amanda-ghost-3 { animation: shimmer 1.8s infinite 0.6s; }
        .amanda-cursor-1 { animation: blink 1.1s step-start infinite; }
        .amanda-cursor-2 { animation: blink 1.1s step-start infinite 0.18s; }
        .amanda-cursor-3 { animation: blink 1.1s step-start infinite 0.36s; }
        .amanda-label { transition: opacity 0.35s ease, transform 0.35s ease; }
      `}</style>

      <div style={{
        width: 245,
        height: 140,
        background: '#F2F2F2',
        border: '1px solid #d0cdc8',
        borderRadius: 2,
        fontFamily: "'Share Tech Mono', monospace",
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '14px 16px',
        gap: 10,
        position: 'relative',
        boxSizing: 'border-box',
        backgroundImage: 'repeating-linear-gradient(to bottom, transparent 0px, transparent 3px, rgba(0,0,0,0.012) 3px, rgba(0,0,0,0.012) 4px)',
      }}>
        {/* Corner brackets */}
        <div style={{ position:'absolute', top:-1, left:-1, width:8, height:8, borderTop:'2px solid #999', borderLeft:'2px solid #999' }} />
        <div style={{ position:'absolute', bottom:-1, right:-1, width:8, height:8, borderBottom:'2px solid #999', borderRight:'2px solid #999' }} />

        {/* Ghost lines */}
        <div style={{ display:'flex', flexDirection:'column', gap:5 }}>
          <div className="amanda-ghost" style={{ height:6, width:'88%', background:'#d0cdc8' }} />
          <div className="amanda-ghost-2" style={{ height:6, width:'65%', background:'#d0cdc8' }} />
          <div className="amanda-ghost-3" style={{ height:6, width:'40%', background:'#d0cdc8' }} />
        </div>

        {/* Loading row */}
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          {/* Pixel canvas — no circle */}
          <div style={{ width:28, height:28, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <canvas
              ref={canvasRef}
              width={16}
              height={16}
              style={{ width:28, height:28, imageRendering:'pixelated' }}
            />
          </div>

          {/* Text */}
          <div style={{ display:'flex', flexDirection:'column', gap:2 }}>
            <span style={{ fontSize:9, color:'#999', letterSpacing:'0.16em', textTransform:'uppercase' }}>
              Amanda
            </span>
            <div style={{ display:'flex', alignItems:'center', gap:6 }}>
              <span
                className="amanda-label"
                style={{
                  fontSize: 12,
                  color: '#444444',
                  letterSpacing: '0.03em',
                  opacity: visible ? 1 : 0,
                  transform: visible ? 'translateX(0)' : 'translateX(-5px)',
                  whiteSpace: 'nowrap',
                }}
              >
                {scenes[current].label}
              </span>
              <span style={{ display:'inline-flex', gap:2, alignItems:'center' }}>
                <span className="amanda-cursor-1" style={{ display:'inline-block', width:4, height:8, background:'#888888' }} />
                <span className="amanda-cursor-2" style={{ display:'inline-block', width:4, height:8, background:'#888888' }} />
                <span className="amanda-cursor-3" style={{ display:'inline-block', width:4, height:8, background:'#888888' }} />
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
