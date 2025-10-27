import { useRef, useCallback } from "react";


const useDebounce = <T extends (...args: any[]) => any>(
    callback: T,
    delay = 300
) => {
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

    return useCallback((...args: Parameters<T>) => {
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(() => {
            callback(...args);
            timer.current = null;
        }, delay);
    }, [callback, delay]) as T;
};


export default useDebounce;