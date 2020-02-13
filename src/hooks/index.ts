import { useState, useEffect, useRef, useCallback } from 'react';

export function useMounted () {
    const ref = useRef<boolean>(true);
    useEffect(() => {
        ref.current = false;
    }, []);
    return ref.current;
}

export function useLoading (fn: (argv?: unknown, ...args: unknown[]) => Promise<unknown>) {
    const [loading, setLoading] = useState<boolean>();
    async function asyncFn (argv?: unknown, ...args: unknown[]) {
        setLoading(true);
        const rs = await fn(argv, ...args); 
        setLoading(false);
        return rs;
    }
    return [loading, asyncFn];
}

export function usePrevious (argv: unknown) {
    const ref = useRef(argv);
    useEffect(() => {
        ref.current = argv;
    });
    return ref.current;
}

export function useForceUpdate () {
    const [, setValue] = useState(0);
    return useCallback(() => {
        setValue(c => (c + 1) % Number.MAX_SAFE_INTEGER);
    }, []);
}

