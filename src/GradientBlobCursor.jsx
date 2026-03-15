import { useEffect, useRef } from "react";

// ─── Config ────────────────────────────────────────────────────────────────
// Tweak these values to match what you dialed in with the controls.

const CONFIG = {
  blobSize: 90,       // radius of the leading blob (px)
  numTrail: 18,       // number of blobs in the trail
  shrinkPerStep: 2.5, // how much each blob shrinks (px)
  leadSmoothing: 0.12,// how quickly the lead follows the cursor (0–1)
  lagPerStep: 0.022,  // how much extra lag each successive blob gets
  alpha: 0.32,        // opacity of the leading blob
  fadePerStep: 0.01,  // how much opacity fades per blob in trail

  // Gradient color stops — edit or add more hex values
  colorStops: [
    "#C4622A", // Ember
    "#C46E4B", // Terracotta
    "#B5706A", // Clay rose
    "#9E6E82", // Dusty mauve
    "#7B6A8A", // Muted violet
    "#5E6380", // Slate dusk
  ],
};

// ─── Helpers ────────────────────────────────────────────────────────────────

function hexToRgb(hex) {
  return {
    r: parseInt(hex.slice(1, 3), 16),
    g: parseInt(hex.slice(3, 5), 16),
    b: parseInt(hex.slice(5, 7), 16),
  };
}

function lerpColor(a, b, t) {
  return {
    r: Math.round(a.r + (b.r - a.r) * t),
    g: Math.round(a.g + (b.g - a.g) * t),
    b: Math.round(a.b + (b.b - a.b) * t),
  };
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function buildPoints(config) {
  const rgbs = config.colorStops.map(hexToRgb);
  return Array.from({ length: config.numTrail }, (_, i) => {
    const t = i / Math.max(config.numTrail - 1, 1);
    const si = t * (rgbs.length - 1);
    const lo = Math.floor(si);
    const hi = Math.min(lo + 1, rgbs.length - 1);
    const color = lerpColor(rgbs[lo], rgbs[hi], si - lo);
    return {
      x: -300,
      y: -300,
      ...color,
      size: config.blobSize - i * config.shrinkPerStep,
      lag: 0.08 + i * config.lagPerStep,
    };
  });
}

// ─── Hook ───────────────────────────────────────────────────────────────────

function useGradientBlob(canvasRef, config = CONFIG) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const points = buildPoints(config);
    const mouse = { x: -300, y: -300 };
    const smooth = { x: -300, y: -300 };

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    function onMouseMove(e) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    }
    window.addEventListener("mousemove", onMouseMove);

    let rafId;
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      smooth.x = lerp(smooth.x, mouse.x, config.leadSmoothing);
      smooth.y = lerp(smooth.y, mouse.y, config.leadSmoothing);

      points.forEach((p, i) => {
        const tx = i === 0 ? smooth.x : points[i - 1].x;
        const ty = i === 0 ? smooth.y : points[i - 1].y;
        p.x = lerp(p.x, tx, p.lag);
        p.y = lerp(p.y, ty, p.lag);

        const a = Math.max(0, config.alpha - i * config.fadePerStep);
        const sz = Math.max(2, p.size);

        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, sz);
        grad.addColorStop(0, `rgba(${p.r},${p.g},${p.b},${a})`);
        grad.addColorStop(1, `rgba(${p.r},${p.g},${p.b},0)`);

        ctx.beginPath();
        ctx.arc(p.x, p.y, sz, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      });

      rafId = requestAnimationFrame(draw);
    }
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, [canvasRef, config]);
}

// ─── Component ──────────────────────────────────────────────────────────────

/**
 * Drop <GradientBlobCursor /> anywhere in your app — ideally near the root.
 * It renders a fixed, full-screen canvas that sits on top of everything
 * with pointer-events: none so it never blocks clicks.
 *
 * Pass a custom `config` prop to override any of the defaults above.
 *
 * Example usage in your layout / App.jsx:
 *
 *   import GradientBlobCursor from "./GradientBlobCursor";
 *
 *   export default function App() {
 *     return (
 *       <>
 *         <GradientBlobCursor />
 *         <YourPortfolioContent />
 *       </>
 *     );
 *   }
 */
export default function GradientBlobCursor({ config = CONFIG }) {
  const canvasRef = useRef(null);
  useGradientBlob(canvasRef, config);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 9999,
      }}
    />
  );
}
