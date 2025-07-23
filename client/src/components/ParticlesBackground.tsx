import React, { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
}

interface ParticlesBackgroundProps {
  particleCount?: number;
  colors?: string[];
  speed?: number;
  size?: { min: number; max: number };
  className?: string;
}

const ParticlesBackground: React.FC<ParticlesBackgroundProps> = ({
  particleCount = 50,
  colors = ["#ff4d4d", "#ffcd07", "#ffffff"],
  speed = 0.5,
  size = { min: 1, max: 3 },
  className = "",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number | null>(null);
  const isInitializedRef = useRef<boolean>(false);

  // Use refs to store the current config values
  const configRef = useRef({ particleCount, colors, speed, size });

  // Update config ref when props change
  useEffect(() => {
    configRef.current = { particleCount, colors, speed, size };
  }, [particleCount, colors, speed, size]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      console.log("ParticlesBackground: Canvas not found");
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      console.log("ParticlesBackground: Context not found");
      return;
    }

    console.log("ParticlesBackground: Initializing...");

    const resizeCanvas = () => {
      const oldWidth = canvas.width || window.innerWidth;
      const oldHeight = canvas.height || window.innerHeight;

      // Always use the full viewport dimensions
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      // Set canvas style to ensure it covers viewport properly
      canvas.style.width = "100vw";
      canvas.style.height = "100vh";

      console.log(
        `ParticlesBackground: Canvas resized to ${canvas.width}x${canvas.height}`
      );

      // Calculate the area ratio to determine if we need more/fewer particles
      const oldArea = oldWidth * oldHeight;
      const newArea = canvas.width * canvas.height;
      const areaRatio = oldArea > 0 ? newArea / oldArea : 1;

      // Adjust particle count based on area change (only if significant change and particles exist)
      if (
        isInitializedRef.current &&
        particlesRef.current.length > 0 &&
        Math.abs(areaRatio - 1) > 0.2
      ) {
        const targetParticleCount = Math.round(
          configRef.current.particleCount * Math.sqrt(areaRatio)
        );
        const currentCount = particlesRef.current.length;

        if (targetParticleCount > currentCount) {
          // Add more particles for larger viewport
          const additionalParticles = Array.from(
            { length: targetParticleCount - currentCount },
            createParticle
          );
          particlesRef.current.push(...additionalParticles);
        } else if (targetParticleCount < currentCount) {
          // Remove particles for smaller viewport
          particlesRef.current = particlesRef.current.slice(
            0,
            targetParticleCount
          );
        }
      }

      // Reposition particles that are now outside the canvas bounds
      particlesRef.current.forEach((particle) => {
        if (particle.x > canvas.width)
          particle.x = Math.random() * canvas.width;
        if (particle.y > canvas.height)
          particle.y = Math.random() * canvas.height;
      });
    };

    const createParticle = (): Particle => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * configRef.current.speed,
      vy: (Math.random() - 0.5) * configRef.current.speed,
      size:
        Math.random() *
          (configRef.current.size.max - configRef.current.size.min) +
        configRef.current.size.min,
      opacity: Math.random() * 0.6 + 0.6, // Increased opacity from 0.8 + 0.2 to 0.6 + 0.6
      color:
        configRef.current.colors[
          Math.floor(Math.random() * configRef.current.colors.length)
        ],
    });

    const initParticles = () => {
      // Initialize particles (can be called multiple times for resize)
      particlesRef.current = Array.from(
        { length: configRef.current.particleCount },
        createParticle
      );
      isInitializedRef.current = true;
      console.log(
        `ParticlesBackground: Initialized ${particlesRef.current.length} particles`
      );
    };

    const updateParticle = (particle: Particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Wrap around edges
      if (particle.x < 0) particle.x = canvas.width;
      if (particle.x > canvas.width) particle.x = 0;
      if (particle.y < 0) particle.y = canvas.height;
      if (particle.y > canvas.height) particle.y = 0;

      // Slight opacity variation for twinkling effect
      particle.opacity += (Math.random() - 0.5) * 0.02;
      particle.opacity = Math.max(0.1, Math.min(0.9, particle.opacity));
    };

    const drawParticle = (particle: Particle) => {
      ctx.save();
      ctx.globalAlpha = particle.opacity;
      ctx.fillStyle = particle.color;

      // Add a stronger glow effect
      ctx.shadowBlur = particle.size * 3;
      ctx.shadowColor = particle.color;

      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();

      // Add an additional brighter inner glow
      ctx.shadowBlur = particle.size * 6;
      ctx.shadowColor = particle.color;
      ctx.fill();

      ctx.restore();
    };

    const drawConnections = () => {
      const connectionDistance = 100;
      const particles = particlesRef.current;

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            const opacity = (1 - distance / connectionDistance) * 0.2;
            ctx.save();
            ctx.globalAlpha = opacity;
            ctx.strokeStyle = "#ffffff";
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
            ctx.restore();
          }
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((particle) => {
        updateParticle(particle);
        drawParticle(particle);
      });

      drawConnections();

      animationRef.current = requestAnimationFrame(animate);
    };

    resizeCanvas();
    initParticles();
    animate();

    const handleResize = () => {
      resizeCanvas();
      // Initialize particles if they haven't been created yet
      if (!isInitializedRef.current) {
        initParticles();
      }
    };

    // Debounced resize handler for better performance
    let resizeTimeout: number;
    const debouncedResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(handleResize, 100);
    };

    // Use ResizeObserver for more accurate viewport tracking
    const resizeObserver = new ResizeObserver(() => {
      debouncedResize();
    });

    resizeObserver.observe(document.documentElement);
    window.addEventListener("resize", debouncedResize);
    window.addEventListener("orientationchange", debouncedResize);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", debouncedResize);
      window.removeEventListener("orientationchange", debouncedResize);
      clearTimeout(resizeTimeout);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`particles-background ${className}`}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        minWidth: "100vw",
        minHeight: "100vh",
        pointerEvents: "none",
        zIndex: -1,
        display: "block",
        backgroundColor: "transparent",
      }}
    />
  );
};

export default ParticlesBackground;
