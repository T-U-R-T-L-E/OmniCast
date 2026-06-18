import React, { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  size: number;
  color: string;
  speedX: number;
  speedY: number;
  rotation: number;
  rotationSpeed: number;
  shape: "circle" | "square" | "triangle";
  opacity: number;
  fadeSpeed: number;
}

export const Confetti: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const colors = [
      "#3b82f6", // Vibrating Blue
      "#ef4444", // Coral Red
      "#10b981", // Emerald Green
      "#f59e0b", // Sunny Amber
      "#ec4899", // Festive Pink
      "#8b5cf6", // Imperial Purple
      "#06b6d4", // Electric Cyan
      "#f43f5e", // Rose Red
      "#14b8a6"  // Teal
    ];

    const shapes: ("circle" | "square" | "triangle")[] = ["circle", "square", "triangle"];
    const particles: Particle[] = [];

    // Left cannon
    for (let i = 0; i < 90; i++) {
      particles.push({
        x: -10,
        y: height * 0.85,
        size: Math.random() * 9 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedX: Math.random() * 12 + 6,
        speedY: -(Math.random() * 14 + 11),
        rotation: Math.random() * 360,
        rotationSpeed: Math.random() * 6 - 3,
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        opacity: 1,
        fadeSpeed: Math.random() * 0.005 + 0.003
      });
    }

    // Right cannon
    for (let i = 0; i < 90; i++) {
      particles.push({
        x: width + 10,
        y: height * 0.85,
        size: Math.random() * 9 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedX: -(Math.random() * 12 + 6),
        speedY: -(Math.random() * 14 + 11),
        rotation: Math.random() * 360,
        rotationSpeed: Math.random() * 6 - 3,
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        opacity: 1,
        fadeSpeed: Math.random() * 0.005 + 0.003
      });
    }

    const drawParticle = (p: Particle) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      
      // Convert hex color to rgba to apply opacity
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.opacity;

      if (p.shape === "circle") {
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.shape === "triangle") {
        ctx.beginPath();
        ctx.moveTo(0, -p.size / 2);
        ctx.lineTo(p.size / 2, p.size / 2);
        ctx.lineTo(-p.size / 2, p.size / 2);
        ctx.closePath();
        ctx.fill();
      } else {
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      }
      ctx.restore();
    };

    const gravity = 0.35;
    const airResistance = 0.985;

    const update = () => {
      ctx.clearRect(0, 0, width, height);

      let activeParticles = 0;

      particles.forEach((p) => {
        p.speedX *= airResistance;
        p.speedY += gravity;
        p.x += p.speedX;
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;

        // Visual fade out as they age or fall
        if (p.y > height * 0.4) {
          p.opacity = Math.max(0, p.opacity - p.fadeSpeed);
        }

        if (p.opacity > 0 && p.y < height + 30 && p.x > -50 && p.x < width + 50) {
          activeParticles++;
          drawParticle(p);
        }
      });

      if (activeParticles > 0) {
        animationId = requestAnimationFrame(update);
      }
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);
    update();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-screen h-screen pointer-events-none z-[2000]"
    />
  );
};
