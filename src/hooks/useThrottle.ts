import { useRef } from "react";

/**
 * Throttle hook that limits function execution to once per specified time period
 * Useful for events that fire continuously (scrolling, resizing, mouse move)
 * 
 * @param callback - The function to throttle
 * @param delay - Time in milliseconds between allowed executions
 * @returns Throttled function
 * 
 * @example
 * const throttledScroll = useThrottle(handleScroll, 100);
 * window.addEventListener('scroll', throttledScroll);
 */
const useThrottle = <T extends (...args: unknown[]) => void>(
    callback: T,
    delay = 300
) => {
    const lastRun = useRef<number>(0);
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

    return (...args: Parameters<T>) => {
        const now = Date.now();
        
        // If enough time has passed since last run, execute immediately
        if (now - lastRun.current >= delay) {
            lastRun.current = now;
            callback(...args);
        } else {
            // Schedule execution for the remaining delay
            if (timer.current) clearTimeout(timer.current);
            timer.current = setTimeout(() => {
                lastRun.current = Date.now();
                callback(...args);
                timer.current = null;
            }, delay - (now - lastRun.current));
        }
    };
};

export default useThrottle;

