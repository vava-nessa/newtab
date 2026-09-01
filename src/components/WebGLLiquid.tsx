import React, { useEffect, useRef } from 'react';

const VERTEX_SHADER = `
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER = `
precision highp float;

uniform vec2 u_res;
uniform float u_time;
uniform vec3 u_colorDeep;
uniform vec3 u_colorMid;
uniform vec3 u_colorHighlight;
uniform float u_speed;
uniform float u_flowStrength;
uniform float u_grain;
uniform float u_opacity;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 rot = mat2(0.86, 0.51, -0.51, 0.86);
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p = rot * p * 2.0;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_res;
  float t = u_time * (0.08 * u_speed);
  vec2 aspect = vec2(u_res.x / max(u_res.y, 1.0), 1.0);
  vec2 p = (uv - 0.5) * aspect;

  vec2 flowP = vec2(p.x * 1.2, p.y - t * 0.2);
  float n1 = fbm(flowP * 1.8 + vec2(0.0, t * 0.1));
  float n2 = fbm((flowP + n1 * 0.3) * 2.8 - vec2(0.0, t * 0.18));
  float n3 = fbm((flowP + n2 * 0.25) * 4.0 + vec2(t * 0.08, 0.0));

  float flow = n3 * 0.6 + n2 * 0.4;
  flow += (n1 - 0.5) * 0.2 * u_flowStrength;

  // Smooth dark ocean palette mapping
  float band1 = smoothstep(0.35, 0.65, flow);
  float band2 = smoothstep(0.65, 0.95, flow);

  vec3 col = mix(u_colorDeep, u_colorMid, band1);
  col = mix(col, u_colorHighlight, band2);

  // Subtle silk ribbon glow
  float ribbon = exp(-pow((flow - 0.7) * 4.0, 2.0));
  col += u_colorHighlight * ribbon * 0.35 * u_flowStrength;

  // Vignette to keep edges dark
  float vignette = smoothstep(1.2, 0.3, length(uv - 0.5));
  col *= mix(0.7, 1.0, vignette);

  // Subtle grain
  float dither = (hash(gl_FragCoord.xy + t * 10.0) - 0.5) * u_grain;
  col += dither;

  // Base background: Slate 950 (#020617)
  vec3 bg = vec3(0.008, 0.015, 0.035);
  vec3 finalColor = mix(bg, col, clamp(u_opacity, 0.0, 1.0));

  gl_FragColor = vec4(clamp(finalColor, 0.0, 1.0), 1.0);
}
`;

export interface WebGLLiquidProps {
  speed?: number;
  flowStrength?: number;
  grain?: number;
  opacity?: number;
  className?: string;
}

export const WebGLLiquid: React.FC<WebGLLiquidProps> = ({
  speed = 0.6,
  flowStrength = 0.8,
  grain = 0.02,
  opacity = 0.85,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const hostRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = hostRef.current;
    if (!canvas || !host) return;

    const gl = canvas.getContext('webgl', { antialias: false, alpha: false });
    if (!gl) return;

    const compileShader = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertexShader = compileShader(gl.VERTEX_SHADER, VERTEX_SHADER);
    const fragmentShader = compileShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) {
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      return;
    }

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      return;
    }

    gl.useProgram(program);

    const positionLocation = gl.getAttribLocation(program, 'position');
    const quadBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(program, 'u_res');
    const uTime = gl.getUniformLocation(program, 'u_time');
    const uColorDeep = gl.getUniformLocation(program, 'u_colorDeep');
    const uColorMid = gl.getUniformLocation(program, 'u_colorMid');
    const uColorHighlight = gl.getUniformLocation(program, 'u_colorHighlight');
    const uSpeed = gl.getUniformLocation(program, 'u_speed');
    const uFlowStrength = gl.getUniformLocation(program, 'u_flowStrength');
    const uGrain = gl.getUniformLocation(program, 'u_grain');
    const uOpacity = gl.getUniformLocation(program, 'u_opacity');

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const { width, height } = host.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
      if (uRes) gl.uniform2f(uRes, canvas.width, canvas.height);
    };

    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);

    let rafId = 0;
    let isVisible = true;
    let isPageVisible = !document.hidden;
    const start = performance.now();

    // Palette: Deep obsidian -> Royal Indigo -> Electric Cyan Accent
    const deepRgb = [0.015, 0.025, 0.06]; // #040610
    const midRgb = [0.06, 0.10, 0.28]; // #0f1a47
    const highlightRgb = [0.15, 0.45, 0.85]; // #2673d9 glowing sapphire/sky ribbon

    const render = (now: number) => {
      const elapsedSec = (now - start) / 1000;

      gl.clearColor(0.008, 0.015, 0.035, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      if (uTime) gl.uniform1f(uTime, elapsedSec);
      if (uColorDeep) gl.uniform3f(uColorDeep, deepRgb[0], deepRgb[1], deepRgb[2]);
      if (uColorMid) gl.uniform3f(uColorMid, midRgb[0], midRgb[1], midRgb[2]);
      if (uColorHighlight) gl.uniform3f(uColorHighlight, highlightRgb[0], highlightRgb[1], highlightRgb[2]);
      if (uSpeed) gl.uniform1f(uSpeed, speed);
      if (uFlowStrength) gl.uniform1f(uFlowStrength, flowStrength);
      if (uGrain) gl.uniform1f(uGrain, grain);
      if (uOpacity) gl.uniform1f(uOpacity, opacity);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      if (isVisible && isPageVisible) {
        rafId = requestAnimationFrame(render);
      }
    };

    const tryStart = () => {
      if (isVisible && isPageVisible && rafId === 0) {
        rafId = requestAnimationFrame(render);
      }
    };

    const tryStop = () => {
      if (rafId !== 0) {
        cancelAnimationFrame(rafId);
        rafId = 0;
      }
    };

    const onVisibilityChange = () => {
      isPageVisible = !document.hidden;
      isPageVisible ? tryStart() : tryStop();
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    const io = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        isVisible ? tryStart() : tryStop();
      },
      { threshold: 0 }
    );
    io.observe(host);

    tryStart();

    return () => {
      tryStop();
      document.removeEventListener('visibilitychange', onVisibilityChange);
      io.disconnect();
      resizeObserver.disconnect();
      gl.deleteBuffer(quadBuffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, [speed, flowStrength, grain, opacity]);

  return (
    <div
      ref={hostRef}
      className={`relative h-full w-full overflow-hidden ${className}`.trim()}
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full block"
      />
    </div>
  );
};

export default WebGLLiquid;
