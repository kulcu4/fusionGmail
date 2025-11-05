import React, { useRef, useEffect } from 'react';

const BackgroundParticles: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let particles: any[] = [];
        
        const setCanvasDimensions = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        setCanvasDimensions();

        const resizeObserver = new ResizeObserver(() => {
            setCanvasDimensions();
            particles = []; // Reset particles on resize
        });
        resizeObserver.observe(document.body);

        const createParticle = () => {
            const size = Math.random() * 1.5 + 0.5;
            return {
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.2,
                vy: (Math.random() - 0.5) * 0.2,
                radius: size,
                color: `hsl(${Math.random() * 360}, 80%, 75%)`,
                opacity: 0,
                life: 0,
                maxLife: 100 + Math.random() * 100
            };
        };
        
        const maxParticles = 50;

        const draw = () => {
            if (!ctx) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            if (particles.length < maxParticles) {
                particles.push(createParticle());
            }

            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];

                // Update position
                p.x += p.vx;
                p.y += p.vy;
                p.life++;

                // Fade in and out
                if (p.life < p.maxLife / 2) {
                    p.opacity = (p.life / (p.maxLife / 2));
                } else {
                    p.opacity = ((p.maxLife - p.life) / (p.maxLife / 2));
                }
                
                // Wrap around edges
                if (p.x < -p.radius) p.x = canvas.width + p.radius;
                if (p.x > canvas.width + p.radius) p.x = -p.radius;
                if (p.y < -p.radius) p.y = canvas.height + p.radius;
                if (p.y > canvas.height + p.radius) p.y = -p.radius;

                // Draw particle
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = p.color.replace('hsl', 'hsla').replace(')', `, ${Math.max(0, p.opacity * 0.5)})`);
                ctx.fill();

                if (p.life >= p.maxLife) {
                    particles.splice(i, 1);
                }
            }

            animationFrameId = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            cancelAnimationFrame(animationFrameId);
            resizeObserver.disconnect();
        };
    }, []);

    return (
        <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />
    );
};

export default BackgroundParticles;
