import { useEffect, useRef } from "react";

interface ShaderBackgroundProps {
  theme: "racing-red" | "emerald-green" | "cosmic-indigo" | "alabaster-gold";
}

export default function ShaderBackground({ theme }: ShaderBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const themeRef = useRef(theme);

  // Sync ref to avoid resetting WebGL setup during state switches
  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let animationFrameId: number;
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl") as WebGLRenderingContext | null;

    if (!gl) {
      console.warn("WebGL not supported, falling back to 2D background canvas.");
      return;
    }

    const vsSource = `
      attribute vec2 a_position;
      varying vec2 v_texCoord;
      void main() {
        v_texCoord = a_position * 0.5 + 0.5;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fsSource = `
      precision highp float;
      uniform float u_time;
      uniform vec2 u_resolution;
      uniform vec2 u_mouse;
      uniform vec3 u_glow_color;
      uniform vec3 u_bg_color;
      varying vec2 v_texCoord;

      void main() {
        vec2 uv = v_texCoord;
        vec2 mouse = u_mouse / u_resolution;
        
        // Liquid movement timing
        float t = u_time * 0.15;
        vec2 movement = vec2(
          sin(uv.y * 8.0 + t) * 0.02,
          cos(uv.x * 8.0 + t) * 0.02
        );
        
        float dist = distance(uv, mouse);
        float mouseInfluence = smoothstep(0.4, 0.0, dist) * 0.08;
        
        vec2 liquidUv = uv + movement + (uv - mouse) * mouseInfluence;
        
        vec3 color = u_bg_color;
        float dynamicGlow = sin(liquidUv.x * 3.0 + t) * cos(liquidUv.y * 2.5 - t);
        
        bool isLight = u_bg_color.r > 0.8;
        if (isLight) {
          // Soft subtractive accent overlay for cream themes
          color -= (vec3(1.0) - u_glow_color) * (dynamicGlow * 0.015 + 0.01);
          color = clamp(color, vec3(0.88), vec3(0.99));
        } else {
          // Neon glow for dark themes
          color += u_glow_color * (dynamicGlow * 0.045 + 0.015);
        }
        
        // Vignette
        float vignette = 1.0 - smoothstep(0.3, 1.4, length(uv - 0.5));
        if (!isLight) {
          color *= vignette;
        }
        
        gl_FragColor = vec4(color, 1.0);
      }
    `;

    const compileShader = (source: string, type: number): WebGLShader | null => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader compile error:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertexShader = compileShader(vsSource, gl.VERTEX_SHADER);
    const fragmentShader = compileShader(fsSource, gl.FRAGMENT_SHADER);
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program link error:", gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = new Float32Array([
      -1.0, -1.0,
       1.0, -1.0,
      -1.0,  1.0,
      -1.0,  1.0,
       1.0, -1.0,
       1.0,  1.0,
    ]);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const positionLoc = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

    const uTimeLoc = gl.getUniformLocation(program, "u_time");
    const uResLoc = gl.getUniformLocation(program, "u_resolution");
    const uMouseLoc = gl.getUniformLocation(program, "u_mouse");
    const uGlowColorLoc = gl.getUniformLocation(program, "u_glow_color");
    const uBgColorLoc = gl.getUniformLocation(program, "u_bg_color");

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width;
      const ny = 1.0 - (e.clientY - rect.top) / rect.height;
      mouseX = nx * canvas.width;
      mouseY = ny * canvas.height;
    };

    window.addEventListener("mousemove", handleMouseMove);

    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    const render = (time: number) => {
      gl.clearColor(0.0, 0.0, 0.0, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.useProgram(program);
      gl.uniform1f(uTimeLoc, time * 0.001);
      gl.uniform2f(uResLoc, canvas.width, canvas.height);
      gl.uniform2f(uMouseLoc, mouseX, mouseY);

      // Determine glow & bg values based on current active theme
      const curTheme = themeRef.current;
      let glowR = 0.89, glowG = 0.11, glowB = 0.14;
      let bgR = 0.03, bgG = 0.03, bgB = 0.03;

      if (curTheme === "emerald-green") {
        glowR = 0.06; glowG = 0.72; glowB = 0.50;
        bgR = 0.01; bgG = 0.03; bgB = 0.02;
      } else if (curTheme === "cosmic-indigo") {
        glowR = 0.39; glowG = 0.40; glowB = 0.95;
        bgR = 0.02; bgG = 0.02; bgB = 0.04;
      } else if (curTheme === "alabaster-gold") {
        glowR = 0.85; glowG = 0.47; glowB = 0.02;
        bgR = 0.98; bgG = 0.98; bgB = 0.96;
      }

      gl.uniform3f(uGlowColorLoc, glowR, glowG, glowB);
      gl.uniform3f(uBgColorLoc, bgR, bgG, bgB);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full -z-10 block pointer-events-none opacity-60 dark:opacity-55"
      id="bg-shader-canvas"
    />
  );
}
