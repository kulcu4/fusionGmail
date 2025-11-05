import React, { useRef, useEffect } from 'react';
import { ColorSettings } from '../types';
import ColorBends from './ColorBends';

interface DynamicBackgroundProps {
    animationId: string;
    isPaused?: boolean;
    colorSettings: ColorSettings;
}

const generateColorBendsPalette = (h: number, s: number, l: number): string[] => {
    const toHex = (c: number) => {
        const hex = Math.round(c * 255).toString(16);
        return hex.length === 1 ? "0" + hex : hex;
    };

    const hslToRgb = (h: number, s: number, l: number): [number, number, number] => {
        s /= 100;
        l /= 100;
        const k = (n: number) => (n + h / 30) % 12;
        const a = s * Math.min(l, 1 - l);
        const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1));
        return [f(0), f(8), f(4)];
    };
    
    const rgbToHex = (r: number, g: number, b: number) => `#${toHex(r)}${toHex(g)}${toHex(b)}`;

    const baseHue = h;
    return [
        rgbToHex(...hslToRgb((baseHue) % 360, s, l)),
        rgbToHex(...hslToRgb((baseHue + 60) % 360, s, l)),
        rgbToHex(...hslToRgb((baseHue + 120) % 360, s, l)),
    ];
};

const CanvasLegacyBackground: React.FC<DynamicBackgroundProps> = ({ animationId, isPaused = false, colorSettings }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationFrameId = useRef<number | null>(null);
    const isPausedRef = useRef(isPaused);
    const { h, s, l } = colorSettings;
    const effectiveAnimationId = animationId;

    useEffect(() => {
        isPausedRef.current = isPaused;
    }, [isPaused]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d', { alpha: false });
        if (!ctx) return;

        let particles: any[] = [];
        let stars: any[] = [];
        let points: any[] = [];
        let matrixColumns: any[] = [];
        let darkVeils: any[] = [];
        let lightRays: any[] = [];
        let pixelBlasts: any[] = [];
        let auroraLines: any[] = [];
        let galaxyStars: any[] = [];
        let hyperspeedStars: any[] = [];
        let frame = 0;

        const setCanvasDimensions = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        setCanvasDimensions();
        const resizeObserver = new ResizeObserver((entries) => {
            setCanvasDimensions();
            init();
        });
        resizeObserver.observe(document.body);

        const init = () => {
            particles = [];
            stars = [];
            points = [];
            matrixColumns = [];
            darkVeils = [];
            lightRays = [];
            pixelBlasts = [];
            auroraLines = [];
            galaxyStars = [];
            hyperspeedStars = [];
            frame = 0;

            if (effectiveAnimationId === 'nebula') {
                for (let i = 0; i < 200; i++) { // More stars
                    stars.push({
                        x: Math.random() * canvas.width,
                        y: Math.random() * canvas.height,
                        radius: Math.random() * 1.2,
                        opacity: 0.3 + Math.random() * 0.5,
                        vx: (Math.random() - 0.5) * 0.05, // Parallax effect
                        vy: (Math.random() - 0.5) * 0.05,
                    });
                }
            } else if (effectiveAnimationId === 'geometric') {
                for (let i = 0; i < 70; i++) {
                    points.push({
                        x: Math.random() * canvas.width,
                        y: Math.random() * canvas.height,
                        vx: (Math.random() - 0.5) * 0.3,
                        vy: (Math.random() - 0.5) * 0.3,
                        radius: 1.5,
                    });
                }
            } else if (effectiveAnimationId === 'starlight') {
                for (let i = 0; i < 300; i++) {
                    stars.push({
                        x: Math.random() * canvas.width,
                        y: Math.random() * canvas.height,
                        radius: Math.random() * 0.8,
                        opacity: 0.2 + Math.random() * 0.4,
                    });
                }
            } else if (effectiveAnimationId === 'light-rays') {
                for (let i = 0; i < 8; i++) {
                    lightRays.push({
                        angle: (i / 8) * Math.PI * 2,
                        speed: (0.0005 + Math.random() * 0.0005),
                        alpha: 0.05 + Math.random() * 0.1
                    });
                }
            } else if (effectiveAnimationId === 'aurora') {
                for (let i = 0; i < 5; i++) {
                    auroraLines.push({
                        y: canvas.height * (0.2 + Math.random() * 0.6),
                        phase: Math.random() * Math.PI * 2,
                        amplitude: canvas.height * (0.1 + Math.random() * 0.2),
                        frequency: 0.005 + Math.random() * 0.005,
                        thickness: 20 + Math.random() * 30,
                        color: `hsla(${140 + Math.random() * 80}, 80%, 70%, 0.05)`
                    });
                }
            } else if (effectiveAnimationId === 'galaxy') {
                for (let i = 0; i < 500; i++) {
                    const angle = Math.random() * 20;
                    const distance = Math.random() * (canvas.width / 2);
                    galaxyStars.push({
                        angle: angle,
                        distance: distance,
                        radius: Math.random() * 1.5,
                        speed: 0.0001 + (1 - (distance / (canvas.width/2))) * 0.001
                    });
                }
            } else if (effectiveAnimationId === 'hyperspeed') {
                 for (let i = 0; i < 200; i++) {
                    hyperspeedStars.push({
                        x: Math.random() * canvas.width - canvas.width / 2,
                        y: Math.random() * canvas.height - canvas.height / 2,
                        z: Math.random() * canvas.width,
                    });
                }
            }
        };

        init();

        const animate = () => {
            animationFrameId.current = requestAnimationFrame(animate);

            if (isPausedRef.current) {
                return;
            }

            let baseFillStyle = `hsla(${h}, ${s}%, ${l}%, 0.8)`;
            if (effectiveAnimationId === 'matrix' || effectiveAnimationId === 'soft-lines' || effectiveAnimationId === 'aurora' || effectiveAnimationId === 'hyperspeed') {
                 baseFillStyle = `hsla(${h}, ${s}%, ${l}%, 0.1)`;
            }
            ctx.fillStyle = baseFillStyle;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            frame++;

            switch (effectiveAnimationId) {
                case 'starlight':
                    stars.forEach(star => {
                        ctx.beginPath();
                        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
                        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity * (0.7 + Math.sin(frame * 0.005 + star.x) * 0.3)})`; // slow twinkle
                        ctx.fill();
                    });
                    break;
                case 'soft-lines':
                    const t = frame * 0.001;
                    ctx.lineWidth = 1;
                    for(let i=0; i<5; i++) {
                        const startY = canvas.height * (0.1 + i * 0.2);
                        ctx.strokeStyle = `hsla(${180 + i*30}, 80%, 70%, 0.1)`;
                        ctx.beginPath();
                        ctx.moveTo(-100, startY + Math.sin(t + i*2) * 100);
                        for(let x=0; x < canvas.width + 100; x+=10) {
                            const y = startY + Math.sin(x*0.01 + t + i*2) * (50 + i * 20) + Math.cos(x*0.005 + t + i*3) * 30;
                            ctx.lineTo(x, y);
                        }
                        ctx.stroke();
                    }
                    break;
                case 'particles':
                    if (particles.length < 50) {
                        particles.push({
                            x: Math.random() * canvas.width, y: Math.random() * canvas.height,
                            vx: (Math.random() - 0.5) * 0.2, vy: (Math.random() - 0.5) * 0.2,
                            radius: Math.random() * 1.5 + 0.5, color: `hsl(${Math.random() * 360}, 80%, 75%)`,
                            life: 0, maxLife: 100 + Math.random() * 100
                        });
                    }
                    particles.forEach((p, i) => {
                        p.x += p.vx; p.y += p.vy; p.life++;
                        let opacity = 0;
                        if (p.life < p.maxLife / 2) opacity = p.life / (p.maxLife / 2);
                        else opacity = (p.maxLife - p.life) / (p.maxLife / 2);

                        if (p.x < 0 || p.x > canvas.width || p.y < 0 || p.y > canvas.height || p.life >= p.maxLife) {
                            particles.splice(i, 1);
                        } else {
                            ctx.beginPath();
                            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                            ctx.fillStyle = p.color.replace('hsl', 'hsla').replace(')', `, ${Math.max(0, opacity * 0.5)})`);
                            ctx.fill();
                        }
                    });
                    break;

                case 'nebula':
                     stars.forEach(star => {
                        star.x += star.vx;
                        star.y += star.vy;
                        if (star.x < 0 || star.x > canvas.width) star.vx *= -1;
                        if (star.y < 0 || star.y > canvas.height) star.vy *= -1;

                        ctx.beginPath();
                        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
                        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity * (0.5 + Math.sin(frame * 0.01 + star.x) * 0.5)})`;
                        ctx.fill();
                    });

                    const time = frame * 0.0005;
                    const createNebula = (color: string, size: number, speed: number, offsetX: number, offsetY: number, composite: GlobalCompositeOperation = 'lighter') => {
                        ctx.globalCompositeOperation = composite;
                        const x = canvas.width / 2 + Math.sin(time * speed) * (canvas.width / 8) + offsetX;
                        const y = canvas.height / 2 + Math.cos(time * speed) * (canvas.height / 8) + offsetY;
                        const grad = ctx.createRadialGradient(x, y, 0, x, y, size);
                        grad.addColorStop(0, color);
                        grad.addColorStop(1, 'transparent');
                        ctx.fillStyle = grad;
                        ctx.fillRect(0, 0, canvas.width, canvas.height);
                        ctx.globalCompositeOperation = 'source-over';
                    };
                    
                    createNebula('rgba(0, 150, 255, 0.025)', canvas.width * 0.7, 0.7, 50, -50);
                    createNebula('rgba(255, 50, 150, 0.025)', canvas.width * 0.6, 0.5, -50, 50);
                    createNebula('rgba(100, 255, 200, 0.015)', canvas.width * 0.8, 0.6, 0, 0);
                    createNebula('rgba(50, 0, 80, 0.04)', canvas.width * 0.5, 0.4, 100, 100, 'source-over');
                    break;
                
                case 'geometric':
                    points.forEach(p => {
                        p.x += p.vx;
                        p.y += p.vy;

                        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
                        
                        ctx.beginPath();
                        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
                        ctx.fill();

                        points.forEach(otherPoint => {
                            if (p === otherPoint) return;
                            const distance = Math.hypot(p.x - otherPoint.x, p.y - otherPoint.y);
                            if (distance < 120) {
                                ctx.beginPath();
                                ctx.moveTo(p.x, p.y);
                                ctx.lineTo(otherPoint.x, otherPoint.y);
                                ctx.strokeStyle = `rgba(255, 255, 255, ${Math.max(0, 0.5 - distance / 120)})`;
                                ctx.lineWidth = 0.5;
                                ctx.stroke();
                            }
                        });
                    });
                    break;

                case 'light-rays':
                    const centerX = canvas.width / 2;
                    const centerY = 0;
                    lightRays.forEach(ray => {
                        ray.angle += ray.speed;
                        ctx.save();
                        ctx.translate(centerX, centerY);
                        ctx.rotate(ray.angle);
                        const grad = ctx.createLinearGradient(0, 0, 0, canvas.height * 1.5);
                        grad.addColorStop(0, `hsla(${h}, ${s}%, ${l+20}%, ${ray.alpha})`);
                        grad.addColorStop(0.5, `hsla(${h}, ${s}%, ${l+5}%, 0)`);
                        ctx.fillStyle = grad;
                        ctx.fillRect(-50, 0, 100, canvas.height * 1.5);
                        ctx.restore();
                    });
                    break;

                case 'pixel-blast':
                    if (frame % 120 === 0) { // New blast every 2 seconds
                        const blastX = Math.random() * canvas.width;
                        const blastY = Math.random() * canvas.height;
                        for (let i = 0; i < 50; i++) {
                            const angle = Math.random() * Math.PI * 2;
                            pixelBlasts.push({
                                x: blastX,
                                y: blastY,
                                vx: Math.cos(angle) * (2 + Math.random() * 3),
                                vy: Math.sin(angle) * (2 + Math.random() * 3),
                                size: 5 + Math.random() * 5,
                                life: 60 + Math.random() * 30,
                                color: `hsl(${Math.random() * 360}, 90%, 70%)`
                            });
                        }
                    }
                    for (let i = pixelBlasts.length - 1; i >= 0; i--) {
                        const p = pixelBlasts[i];
                        p.x += p.vx;
                        p.y += p.vy;
                        p.life--;
                        p.size *= 0.98;
                        ctx.fillStyle = p.color;
                        ctx.fillRect(p.x, p.y, p.size, p.size);
                        if (p.life <= 0) {
                            pixelBlasts.splice(i, 1);
                        }
                    }
                    break;
                case 'aurora':
                    ctx.globalCompositeOperation = 'lighter';
                    auroraLines.forEach(line => {
                        ctx.beginPath();
                        ctx.moveTo(0, canvas.height);
                        let y = line.y + Math.sin(frame * 0.001 + line.phase) * line.amplitude * 0.2;
                        for (let x = 0; x < canvas.width; x++) {
                            const newY = y + Math.sin((x * line.frequency) + (frame * 0.005) + line.phase) * line.amplitude;
                            ctx.lineTo(x, newY);
                        }
                        ctx.lineTo(canvas.width, canvas.height);
                        const grad = ctx.createLinearGradient(0, y - line.amplitude, 0, y + line.amplitude);
                        grad.addColorStop(0, 'transparent');
                        grad.addColorStop(0.5, line.color);
                        grad.addColorStop(1, 'transparent');
                        ctx.fillStyle = grad;
                        ctx.fill();
                    });
                    ctx.globalCompositeOperation = 'source-over';
                    break;

                case 'galaxy':
                    ctx.save();
                    ctx.translate(canvas.width / 2, canvas.height / 2);
                    ctx.rotate(frame * 0.0002);
                    galaxyStars.forEach(star => {
                        star.angle += star.speed;
                        const x = Math.cos(star.angle) * star.distance;
                        const y = Math.sin(star.angle) * star.distance;
                        ctx.beginPath();
                        ctx.arc(x, y, star.radius, 0, Math.PI * 2);
                        ctx.fillStyle = `rgba(255, 255, 255, ${0.5 + (star.distance / canvas.width)})`;
                        ctx.fill();
                    });
                    ctx.restore();
                    break;
                
                case 'hyperspeed':
                    const speed = 5;
                    ctx.save();
                    ctx.translate(canvas.width / 2, canvas.height / 2);
                    hyperspeedStars.forEach(star => {
                        star.z -= speed;
                        if (star.z <= 0) {
                            star.z = canvas.width;
                            star.x = Math.random() * canvas.width - canvas.width / 2;
                            star.y = Math.random() * canvas.height - canvas.height / 2;
                        }
                        const sx = star.x / star.z * canvas.width;
                        const sy = star.y / star.z * canvas.height;
                        
                        const px = star.x / (star.z + speed) * canvas.width;
                        const py = star.y / (star.z + speed) * canvas.height;
                        
                        ctx.beginPath();
                        ctx.moveTo(px, py);
                        ctx.lineTo(sx, sy);
                        ctx.lineWidth = (1 - star.z / canvas.width) * 4;
                        ctx.strokeStyle = `rgba(255,255,255,0.8)`;
                        ctx.stroke();
                    });
                    ctx.restore();
                    break;
            }
        };

        animate();

        return () => {
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
                animationFrameId.current = null;
            }
            resizeObserver.disconnect();
            const currentCtx = canvas.getContext('2d');
            if (currentCtx) {
                currentCtx.clearRect(0, 0, canvas.width, canvas.height);
            }
        };
    }, [effectiveAnimationId, h, s, l, isPaused]);

    return (
        <canvas 
            ref={canvasRef} 
            className="fixed inset-0 z-0" 
        />
    );
};

const DynamicBackground: React.FC<DynamicBackgroundProps> = ({ animationId, isPaused = false, colorSettings }) => {
    if (animationId === 'none') {
        return null;
    }

    const { h, s, l } = colorSettings;
    const effectiveAnimationId = animationId;

    if (effectiveAnimationId === 'color-bends') {
        const bendColors = generateColorBendsPalette(h, s, l);
        return (
            <ColorBends
                isPaused={isPaused}
                colors={bendColors}
                speed={0.2}
                scale={1.5}
                frequency={1.2}
                warpStrength={1.2}
                mouseInfluence={0.5}
                parallax={0.2}
                noise={0.05}
            />
        );
    }

    return <CanvasLegacyBackground animationId={effectiveAnimationId} isPaused={isPaused} colorSettings={colorSettings} />;
};

export default DynamicBackground;
