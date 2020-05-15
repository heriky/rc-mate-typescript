import React, { useState, useEffect, useRef, useCallback } from 'react';

export function useMountedRef () {
    const ref = useRef<boolean>(false);
    useEffect(() => {
        ref.current = true;
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


export function useEffectDeep (fn: () => void | (() => void), deps: unknown[]) {
    const ref = useRef(deps);
    if (JSON.stringify(ref.current) !== JSON.stringify(deps)) {
        ref.current = deps;
    }
    useEffect(fn, ref.current);
}


export function useScrollToBottom<T extends HTMLElement> (): [(t: T) => void, boolean] {
    const [isBottom, setIsBottom] = useState<boolean>(false);
    const [node, setNode] = useState<HTMLElement>();

    useEffect(() => {
        let observer: IntersectionObserver;

        if(!node || !node.parentElement) {
            setIsBottom(false);
        } else {
            observer = new IntersectionObserver(entries => {
                setIsBottom(entries[0].isIntersecting);
            });
            observer.observe(node);
        }

        return () => {
            if (observer) observer.disconnect();
        }
        
    }, [node]);

     // 要学会hook的这种形式：在外部去调用setNode，生成node，而并非直接把node参数传进来，
     // 之所以这样考虑，是因为获取node也属于该逻辑的一部分，如果把[node,setNode] = useState放在外部，就会造成，整体逻辑被分离的坏现象
    return [setNode, isBottom];
}

export function useScrollbar (onScroll: (e: Event) => void, onStop: (e: Event) => void) {
    const domRef = useRef<HTMLElement>(null!);
    const timerRef = useRef<any>();
    
    useEffect(() => {
        const dom = domRef.current;
        
        dom?.addEventListener('scroll', (e: Event) => {
            onScroll(e);

            if (timerRef.current) {
                clearTimeout(timerRef.current);
                timerRef.current = null;
            }

            const t1 = dom.scrollTop;
            timerRef.current = setTimeout(() => {
                const t2 = dom.scrollTop;
                if (t1 === t2) {
                    console.log('停止滚动');
                    onStop(e);
                }
            }, 500);
        });
    }, [onScroll, onStop]);

    return [domRef];
}