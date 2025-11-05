import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';

interface ParticleOverlayProps {
    effect: string;
    intensity: number;
    speed?: number;
    direction?: number;
    spread?: number;
}

export interface ParticleOverlayRef {
  getCanvas: () => HTMLCanvasElement | null;
}

const ParticleOverlay = forwardRef<ParticleOverlayRef, ParticleOverlayProps>(({ effect, intensity, speed, direction, spread }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const shakeTimeoutRef = useRef<number | null>(null);
    const mousePos = useRef<{x: number, y: number} | null>(null);

    useImperativeHandle(ref, () => ({
        getCanvas: () => canvasRef.current,
    }));

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        const canvasParent = canvas.parentElement;
        if (!canvasParent) return;

        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mousePos.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
        };
        const handleTouchMove = (e: TouchEvent) => {
             const rect = canvas.getBoundingClientRect();
             if (e.touches[0]) {
                mousePos.current = { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
             }
        };
        const handleMouseLeave = () => { mousePos.current = null; };

        let animationFrameId: number;
        let particles: any[] = [];
        let frame = 0;

        canvas.width = canvasParent.offsetWidth;
        canvas.height = canvasParent.offsetHeight;

        const resizeObserver = new ResizeObserver(entries => {
            for (const entry of entries) {
                canvas.width = entry.contentRect.width;
                canvas.height = entry.contentRect.height;
                particles = [];
            }
        });
        resizeObserver.observe(canvasParent);

        const speedMultiplier = (speed ?? 0.5) * 1.5 + 0.5; // Maps 0-1 to a 0.5-2 range
        const angleRad = (direction ?? 0) * Math.PI / 180;
        const sizeMultiplier = (spread ?? 0.5) * 2; // Maps 0-1 to a 0-2 range, default 1.


        const createParticle = (x?: number, y?: number, type?: string) => {
            const effectType = type || effect;
            switch (effectType) {
                case 'confetti':
                    return {
                        type: 'confetti',
                        x: Math.random() * canvas.width,
                        y: -10,
                        w: (5 + Math.random() * 10) * sizeMultiplier,
                        h: (5 + Math.random() * 10) * sizeMultiplier,
                        speedY: (1 + Math.random() * 2 * intensity) * speedMultiplier,
                        speedX: (Math.random() - 0.5) * speedMultiplier,
                        rotation: Math.random() * 360,
                        rotationSpeed: (Math.random() - 0.5) * 4,
                        color: `hsl(${Math.random() * 360}, 90%, 70%)`
                    };
                case 'particles':
                    return {
                        type: 'particles',
                        x: Math.random() * canvas.width,
                        y: -10,
                        radius: (1 + Math.random() * 2) * sizeMultiplier,
                        speedY: (0.5 + Math.random() * 1.5 * intensity) * speedMultiplier,
                        speedX: ((Math.random() - 0.5) * 0.5) * speedMultiplier,
                        opacity: 0.8 + Math.random() * 0.2,
                        color: `hsl(${Math.random() * 360}, 90%, 75%)`
                    };
                case 'rain': {
                    const r = (1.5 + Math.random() * 3.5) * (0.5 + intensity * 0.5) * sizeMultiplier;
                    const baseSpeed = 2 + r * 0.2;
                    const spawnWidth = canvas.width * 1.5;
                    const spawnX = Math.random() * spawnWidth - (spawnWidth - canvas.width) / 2;
                    return {
                        type: 'rain',
                        x: x || spawnX,
                        y: y || -20,
                        r: r,
                        vy: baseSpeed * Math.cos(angleRad),
                        vx: baseSpeed * Math.sin(angleRad),
                        opacity: 0.4 + Math.random() * 0.5,
                    };
                }
                case 'snow':
                     const baseSpeed = (0.5 + Math.random() * 1 * intensity) * speedMultiplier;
                     return {
                        type: 'snow',
                        x: Math.random() * canvas.width,
                        y: -10,
                        radius: (1 + Math.random() * 3 * intensity) * sizeMultiplier,
                        speedY: baseSpeed * Math.cos(angleRad),
                        speedX: ((Math.random() - 0.5) * 0.5) + (baseSpeed * Math.sin(angleRad)),
                        opacity: 0.5 + Math.random() * 0.5,
                     };
                case 'sparkle':
                    return { type: 'sparkle', x: Math.random() * canvas.width, y: Math.random() * canvas.height, size: (1 + Math.random() * 2) * sizeMultiplier, life: 50 + Math.random() * 50, maxLife: 50 + Math.random() * 50, };
                case 'bubbles':
                    return { type: 'bubbles', x: Math.random() * canvas.width, y: canvas.height + Math.random() * 50, r: (5 + Math.random() * 15 * intensity) * 0.6 * sizeMultiplier, speedY: (-0.2 - Math.random() * 0.8) * speedMultiplier, life: 200 + Math.random() * 300, maxLife: 200 + Math.random() * 300, sway: Math.random() * Math.PI * 2, swaySpeed: (Math.random() - 0.5) * 0.02, color: `hsl(${Math.random() * 360}, 70%, 80%)`, };
                case 'fireflies':
                    return { type: 'fireflies', x: Math.random() * canvas.width, y: Math.random() * canvas.height, radius: (1 + Math.random() * 2) * sizeMultiplier, speedY: ((Math.random() - 0.5) * 0.5) * speedMultiplier, speedX: ((Math.random() - 0.5) * 0.5) * speedMultiplier, life: Math.random() * 200, maxLife: 100 + Math.random() * 100 };
                case 'matrix_rain':
                     return { type: 'matrix_rain', x: Math.floor(Math.random() * canvas.width / 14) * 14, y: -Math.random() * 500, speed: (5 + Math.random() * 10 * intensity) * speedMultiplier, chars: [], maxLength: 10 + Math.random() * 20 };
                case 'light_speed':
                    const angle = Math.random() * Math.PI * 2;
                    return { type: 'light_speed', x: canvas.width / 2, y: canvas.height / 2, px: canvas.width / 2, py: canvas.height / 2, speed: (Math.random() * 5 * intensity + 2) * speedMultiplier, angle: angle, color: `hsl(${180 + Math.random() * 60}, 100%, 80%)` };
                case 'floating_embers':
                     return { type: 'floating_embers', x: Math.random() * canvas.width, y: canvas.height + 10, radius: (1 + Math.random() * 2) * sizeMultiplier, speedY: (-0.5 - Math.random() * 1.5 * intensity) * speedMultiplier, speedX: ((Math.random() - 0.5) * 0.5) * speedMultiplier, opacity: 0.8 + Math.random() * 0.2, life: 0, maxLife: 50 + Math.random() * 100 };
                default:
                    return {};
            }
        };

        const maxParticles = { rain: 520 * intensity, snow: 150 * intensity, sparkle: 150 * intensity, bubbles: 100 * intensity, particles: 150 * intensity, fireflies: 100 * intensity, matrix_rain: 50 * intensity, light_speed: 150 * intensity, floating_embers: 100 * intensity, confetti: 100 * intensity }[effect] || 150 * intensity;

        const draw = () => {
            if (!ctx) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            frame++;
            
            // Non-particle effects
            if (effect === 'scanlines') {
                ctx.save();
                for (let y = 0; y < canvas.height; y += 4) {
                    ctx.fillStyle = `rgba(0, 0, 0, ${0.1 * intensity})`;
                    ctx.fillRect(0, y, canvas.width, 2);
                }
                ctx.restore();
            }
            if (effect === 'tv_static') {
                ctx.save();
                for (let i = 0; i < 2000 * intensity; i++) {
                    ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.2})`;
                    ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 2, 2);
                }
                ctx.restore();
            } else if (effect === 'equalizer') {
                const numBars = 30;
                const barWidth = canvas.width / numBars;
                for (let i = 0; i < numBars; i++) {
                    const height = (Math.sin(frame * 0.1 + i * 0.5) * 0.3 + 0.7) * canvas.height * intensity;
                    const hue = (i / numBars) * 120 + 180; // from cyan to magenta
                    ctx.fillStyle = `hsl(${hue}, 90%, 60%)`;
                    ctx.fillRect(i * barWidth, canvas.height - height, barWidth - 2, height);
                }
            }


            if (particles.length < maxParticles) {
                particles.push(createParticle());
            }

            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];

                switch (p.type) {
                    case 'confetti':
                        p.y += p.speedY;
                        p.x += p.speedX;
                        p.rotation += p.rotationSpeed;
                        ctx.save();
                        ctx.translate(p.x, p.y);
                        ctx.rotate(p.rotation * Math.PI / 180);
                        ctx.fillStyle = p.color;
                        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
                        ctx.restore();
                        if (p.y > canvas.height + p.h) {
                            particles.splice(i, 1);
                        }
                        break;
                    case 'particles':
                        ctx.beginPath();
                        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
                        gradient.addColorStop(0, p.color.replace(')', `, ${p.opacity})`).replace('hsl', 'hsla'));
                        gradient.addColorStop(1, p.color.replace(')', `, 0)`).replace('hsl', 'hsla'));
                        ctx.fillStyle = gradient;
                        ctx.fill();
                        p.y += p.speedY;
                        p.x += p.speedX;
                        if (p.y > canvas.height + p.radius) {
                            particles.splice(i, 1);
                        }
                        break;
                    case 'rain': {
                        const gravity = 0.12 * (0.5 + intensity) * speedMultiplier;
                        p.vy += gravity;
                        p.x += p.vx;
                        p.y += p.vy;

                        // Draw a simple line for the rain streak
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        // The length of the streak is proportional to its speed
                        ctx.lineTo(p.x - p.vx * 2, p.y - p.vy * 2); 
                        ctx.strokeStyle = `rgba(173, 216, 230, ${p.opacity})`;
                        ctx.lineWidth = p.r * 0.5;
                        ctx.lineCap = 'round';
                        ctx.stroke();
                        
                        // If the top of the streak is off the bottom of the screen, recycle it
                        if ((p.y - p.vy * 2) > canvas.height) {
                            particles[i] = createParticle(undefined, undefined, 'rain');
                        }
                        break;
                    }
                    case 'snow':
                        ctx.beginPath(); ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2); ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`; ctx.fill();
                        p.y += p.speedY; p.x += p.speedX; if (p.y > canvas.height) particles.splice(i, 1);
                        break;
                    case 'sparkle':
                        const opacity = p.life / p.maxLife; ctx.fillStyle = `rgba(255, 255, 220, ${opacity})`;
                        ctx.fillRect(p.x, p.y, p.size, p.size); p.life--; if (p.life <= 0) particles.splice(i, 1);
                        break;
                    case 'bubbles':
                        p.y += p.speedY;
                        p.x += Math.sin(p.sway) * 0.5;
                        p.sway += p.swaySpeed;
                        const bubbleOpacity = p.life > 100 ? 1 : p.life / 100;
                        ctx.beginPath();
                        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                        const bubbleGradient = ctx.createRadialGradient(p.x - p.r * 0.2, p.y - p.r * 0.2, 0, p.x, p.y, p.r);
                        bubbleGradient.addColorStop(0, p.color.replace(')', `, ${bubbleOpacity * 0.8})`).replace('hsl', 'hsla'));
                        bubbleGradient.addColorStop(1, p.color.replace(')', `, ${bubbleOpacity * 0.2})`).replace('hsl', 'hsla'));
                        ctx.fillStyle = bubbleGradient;
                        ctx.fill();
                        
                        p.life--;
                        if (p.life <= 0 || p.y < -p.r) {
                            particles.splice(i, 1);
                        }
                        break;
                    case 'fireflies':
                        const glowRatio = Math.sin(p.life / p.maxLife * Math.PI);
                        ctx.beginPath();
                        const fireflyGradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 2);
                        fireflyGradient.addColorStop(0, `rgba(255, 255, 150, ${glowRatio})`);
                        fireflyGradient.addColorStop(1, `rgba(255, 255, 150, 0)`);
                        ctx.fillStyle = fireflyGradient;
                        ctx.arc(p.x, p.y, p.radius * 2, 0, Math.PI * 2);
                        ctx.fill();

                        p.x += p.speedX;
                        p.y += p.speedY;
                        p.life++;
                        if (p.life >= p.maxLife) p.life = 0; // endless cycle

                        if (p.x < 0 || p.x > canvas.width || p.y < 0 || p.y > canvas.height) {
                            particles[i] = createParticle(undefined, undefined, 'fireflies');
                        }
                        break;
                     case 'matrix_rain':
                        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
                        const char = characters.charAt(Math.floor(Math.random() * characters.length));
                        p.chars.push({ char, y: p.y });
                        if(p.chars.length > p.maxLength) {
                            p.chars.shift();
                        }
                        p.y += p.speed;

                        ctx.font = '14px monospace';
                        p.chars.forEach((c: {char: string, y: number}, index: number) => {
                            const isHead = index === p.chars.length - 1;
                            ctx.fillStyle = isHead ? '#afa' : '#0f0';
                            ctx.fillText(c.char, p.x, c.y);
                        });

                        if (p.chars[0] && p.chars[0].y > canvas.height) {
                            particles.splice(i, 1);
                        }
                        break;
                    case 'light_speed':
                        p.px = p.x;
                        p.py = p.y;
                        p.x += Math.cos(p.angle) * p.speed;
                        p.y += Math.sin(p.angle) * p.speed;
                        p.speed *= 1.05;

                        ctx.strokeStyle = p.color;
                        ctx.lineWidth = 1.5;
                        ctx.beginPath();
                        ctx.moveTo(p.px, p.py);
                        ctx.lineTo(p.x, p.y);
                        ctx.stroke();

                        if (p.x < 0 || p.x > canvas.width || p.y < 0 || p.y > canvas.height) {
                            particles.splice(i, 1);
                        }
                        break;
                    case 'floating_embers':
                        const emberLifeRatio = 1 - (p.life / p.maxLife);
                        ctx.beginPath();
                        ctx.arc(p.x, p.y, p.radius * emberLifeRatio, 0, Math.PI * 2);
                        const emberGradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * emberLifeRatio);
                        emberGradient.addColorStop(0, `rgba(255, 180, 50, ${p.opacity * emberLifeRatio})`);
                        emberGradient.addColorStop(1, `rgba(255, 100, 0, 0)`);
                        ctx.fillStyle = emberGradient;
                        ctx.fill();
                        p.y += p.speedY;
                        p.x += p.speedX;
                        p.life++;
                        if (p.y < -p.radius || p.life >= p.maxLife) {
                            particles.splice(i, 1);
                        }
                        break;
                }
            }
            animationFrameId = requestAnimationFrame(draw);
        };
        draw();
        
        return () => {
            cancelAnimationFrame(animationFrameId);
            resizeObserver.disconnect();
        };

    }, [effect, intensity, speed, direction, spread]);
    
    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none z-10"
            aria-hidden="true"
        />
    );
});

export default ParticleOverlay;
