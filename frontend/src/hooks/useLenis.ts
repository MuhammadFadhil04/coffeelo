import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const useLenis = () => {
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let lenis: Lenis | null = null;
    let updateTicker: ((time: number) => void) | null = null;

    const cleanup = () => {
      if (updateTicker) {
        gsap.ticker.remove(updateTicker);
        updateTicker = null;
      }
      if (lenis) {
        lenis.off('scroll', ScrollTrigger.update);
        lenis.destroy();
        lenis = null;
      }
    };

    const init = () => {
      cleanup();
      if (mediaQuery.matches) return;

      lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1.0,
        touchMultiplier: 2.0,
      });

      lenis.on('scroll', ScrollTrigger.update);

      updateTicker = (time: number) => {
        lenis?.raf(time * 1000);
      };

      gsap.ticker.add(updateTicker);
      gsap.ticker.lagSmoothing(0);
    };

    init();
    mediaQuery.addEventListener('change', init);

    return () => {
      mediaQuery.removeEventListener('change', init);
      cleanup();
    };
  }, []);
};
