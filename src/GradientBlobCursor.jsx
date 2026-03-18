import { useEffect, useRef } from "react";

// ─── Config ────────────────────────────────────────────────────────────────
const CONFIG = {
  blobSize:    0.05,  // radius of the blob (0–1 normalized)
  edgeSoft:    0.30,  // how soft the edge falloff is (0 = hard, 1 = very soft)
  swirlSpeed:  0.60,  // speed of internal color swirl
  cursorLag:   0.10,  // how quickly the lead blob follows the cursor
  opacity:     0.75,  // peak opacity of the lead blob
  brightnessLift: 0.85, // gamma — lower = brighter/more luminous

  trailLength: 10,    // number of trail blobs behind the lead
  trailLag:    0.18,  // how loosely each trail blob follows the one before
  trailFade:   0.07,  // how quickly trail blobs fade out

  // Color nodes — the mesh interpolates between all of these
  colors: [
    "#FF8C70", // peach
    "#F569A0", // pink
    "#CB60E0", // violet
    "#8099FA", // periwinkle
    "#5DCDEE", // cyan
  ],
};

// ─── Helpers ────────────────────────────────────────────────────────────────
function hexToRgbF(hex) {
  return [
    parseInt(hex.slice(1, 3), 16) / 255,
    parseInt(hex.slice(3, 5), 16) / 255,
    parseInt(hex.slice(5, 7), 16) / 255,
  ];
}

function lerp(a, b, t) { return a + (b - a) * t; }

function buildFragShader(colors, blobR, edgeSoft, speed, gamma) {
  const colLines = colors
    .map((c, i) => `cols[${i}]=vec3(${c[0].toFixed(3)},${c[1].toFixed(3)},${c[2].toFixed(3)});`)
    .join("\n  ");

  return `
precision mediump float;
uniform vec2  u_res;
uniform vec2  u_pos;
uniform float u_time;
uniform float u_alpha;

void main(){
  vec2 uv    = gl_FragCoord.xy / u_res;
  vec2 pos   = u_pos / u_res;
  pos.y      = 1.0 - pos.y;
  vec2 delta = uv - pos;
  float ar   = u_res.x / u_res.y;
  float dist = length(delta * vec2(ar, 1.0));

  float blobR = ${blobR.toFixed(3)};
  float edge  = smoothstep(blobR, blobR * ${(1.0 - edgeSoft).toFixed(3)}, dist);
  if (edge < 0.001) { gl_FragColor = vec4(0.0); return; }

  vec2  local = delta / blobR * 0.5 + 0.5;
  float t     = u_time * ${speed.toFixed(3)};

  vec3 cols[5];
  ${colLines}

  vec2 nodes[5];
  nodes[0] = vec2(0.5 + cos(t*0.91)*0.40,     0.5 + sin(t*0.78)*0.40);
  nodes[1] = vec2(0.5 + cos(t*0.73+1.0)*0.38, 0.5 + sin(t*0.65+0.8)*0.38);
  nodes[2] = vec2(0.5 + cos(t*0.61+2.1)*0.42, 0.5 + sin(t*0.55+1.5)*0.42);
  nodes[3] = vec2(0.5 + cos(t*0.83+3.2)*0.36, 0.5 + sin(t*0.70+2.3)*0.36);
  nodes[4] = vec2(0.5 + cos(t*0.67+4.3)*0.40, 0.5 + sin(t*0.59+3.1)*0.40);

  vec3  color  = vec3(0.0);
  float totalW = 0.0;
  for (int i = 0; i < 5; i++) {
    vec2  nd = local - nodes[i];
    float w  = 1.0 / (dot(nd, nd) + 0.02);
    color   += cols[i] * w;
    totalW  += w;
  }
  color /= totalW;
  color  = pow(color, vec3(${gamma.toFixed(3)}));

  float a = edge * u_alpha;
  gl_FragColor = vec4(color * a, a);
}`;
}

const VERT_SHADER = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

// ─── Hook ───────────────────────────────────────────────────────────────────
function useMeshBlobCursor(canvasRef, config = CONFIG) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl");
    if (!gl) return;

    const rgbColors = config.colors.map(hexToRgbF);

    // Build shader program
    function compile(type, src) {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    }

    const prog = gl.createProgram();
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT_SHADER));
    gl.attachShader(
      prog,
      compile(
        gl.FRAGMENT_SHADER,
        buildFragShader(
          rgbColors,
          config.blobSize,
          config.edgeSoft,
          config.swirlSpeed,
          config.brightnessLift
        )
      )
    );
    gl.linkProgram(prog);
    gl.useProgram(prog);

    // Full-screen quad
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );
    const loc = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const uRes   = gl.getUniformLocation(prog, "u_res");
    const uPos   = gl.getUniformLocation(prog, "u_pos");
    const uTime  = gl.getUniformLocation(prog, "u_time");
    const uAlpha = gl.getUniformLocation(prog, "u_alpha");

    // Resize
    let W = 0, H = 0;
    function resize() {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
      gl.viewport(0, 0, W, H);
    }
    resize();
    window.addEventListener("resize", resize);

    // Mouse tracking
    const mouse = { x: -9999, y: -9999 };
    function onMouseMove(e) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    }
    function onMouseLeave() {
      mouse.x = -9999;
      mouse.y = -9999;
    }
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseleave", onMouseLeave);

    // Trail points: index 0 = lead, rest = tail
    const trailCount = config.trailLength + 1;
    const trail = Array.from({ length: trailCount }, () => ({
      x: -9999,
      y: -9999,
    }));

    const start = performance.now();
    let rafId;

    function draw() {
      const now = (performance.now() - start) * 0.001;

      // Update trail chain
      trail[0].x = lerp(trail[0].x, mouse.x, config.cursorLag);
      trail[0].y = lerp(trail[0].y, mouse.y, config.cursorLag);
      for (let i = 1; i < trail.length; i++) {
        trail[i].x = lerp(trail[i].x, trail[i - 1].x, config.trailLag);
        trail[i].y = lerp(trail[i].y, trail[i - 1].y, config.trailLag);
      }

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform2f(uRes, W, H);
      gl.uniform1f(uTime, now);

      // Draw tail-to-head so lead renders on top
      for (let i = trail.length - 1; i >= 0; i--) {
        const p = trail[i];
        if (p.x < -100) continue;

        const t = i / Math.max(trail.length - 1, 1);
        const a = config.opacity * (1.0 - t * config.trailFade * config.trailLength);
        if (a <= 0) continue;

        gl.uniform2f(uPos, p.x, p.y);
        gl.uniform1f(uAlpha, Math.max(0, a));
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      }

      rafId = requestAnimationFrame(draw);
    }
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
      cancelAnimationFrame(rafId);
      gl.deleteProgram(prog);
    };
  }, [canvasRef]);
}

// ─── Component ──────────────────────────────────────────────────────────────
/**
 * Drop <GradientBlobCursor /> once near the root of your app.
 * Renders a fixed full-screen WebGL canvas with pointer-events: none
 * so it never blocks clicks or interactions.
 *
 * Example:
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
  useMeshBlobCursor(canvasRef, config);

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
