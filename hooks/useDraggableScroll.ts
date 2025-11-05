import { useState, useEffect, useCallback } from 'react';

export const useDraggableScroll = () => {
    const [el, setEl] = useState<HTMLDivElement | null>(null);

    const ref = useCallback((node: HTMLDivElement | null) => {
        setEl(node);
    }, []);

    useEffect(() => {
        if (!el) return;

        let isDown = false;
        let startX: number;
        let scrollLeft: number;
        let velocity = 0;
        let rafId: number;
        let lastScrollLeft = 0;

        const handleDown = (e: MouseEvent | TouchEvent) => {
            isDown = true;
            const pageX = 'touches' in e ? e.touches[0].pageX : e.pageX;
            startX = pageX - el.offsetLeft;
            scrollLeft = el.scrollLeft;
            lastScrollLeft = el.scrollLeft;
            el.style.cursor = 'grabbing';
            el.style.userSelect = 'none';
            cancelAnimationFrame(rafId);
            velocity = 0;
        };

        const handleUp = () => {
            if (!isDown) return;
            isDown = false;
            el.style.cursor = 'grab';
            el.style.removeProperty('user-select');

            const momentumLoop = () => {
                el.scrollLeft += velocity;
                velocity *= 0.95; // friction
                if (Math.abs(velocity) > 0.5) {
                    rafId = requestAnimationFrame(momentumLoop);
                }
            };
            momentumLoop();
        };

        const handleMove = (e: MouseEvent | TouchEvent) => {
            if (!isDown) return;
            // Prevent default browser action (like page scroll) to enable horizontal swipe.
            if ('touches' in e && e.cancelable) e.preventDefault();
            else if ('preventDefault' in e) e.preventDefault();

            const pageX = 'touches' in e ? e.touches[0].pageX : e.pageX;
            const x = pageX - el.offsetLeft;
            const walk = (x - startX) * 2.5; // Increased sensitivity
            el.scrollLeft = scrollLeft - walk;
            
            velocity = el.scrollLeft - lastScrollLeft;
            lastScrollLeft = el.scrollLeft;
        };
        

        el.addEventListener('mousedown', handleDown as EventListener);
        el.addEventListener('mouseup', handleUp);
        el.addEventListener('mouseleave', handleUp);
        el.addEventListener('mousemove', handleMove as EventListener);
        
        // Use non-passive listeners for touch events to allow `preventDefault`,
        // which is necessary to take control of the scrolling behavior.
        el.addEventListener('touchstart', handleDown as EventListener, { passive: false });
        el.addEventListener('touchend', handleUp);
        el.addEventListener('touchmove', handleMove as EventListener, { passive: false });

        return () => {
            el.removeEventListener('mousedown', handleDown as EventListener);
            el.removeEventListener('mouseup', handleUp);
            el.removeEventListener('mouseleave', handleUp);
            el.removeEventListener('mousemove', handleMove as EventListener);

            el.removeEventListener('touchstart', handleDown as EventListener);
            el.removeEventListener('touchend', handleUp);
            el.removeEventListener('touchmove', handleMove as EventListener);
        };
    }, [el]);

    return ref;
};