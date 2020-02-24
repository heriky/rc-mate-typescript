class Store<T extends object>{

    source: T;
    
    copy: T;

    modified: boolean;

    constructor (state: T) {
        this.source = state;
        this.copy = state;
        this.modified = false;
    }

    set (k: keyof T, v: any) {
        if (!this.modified) {
            this.modified = true;
            // 这里需要使用deepClone来实现
            this.copy = deepClone(v);
        }
        return this.copy[k] = v;
    }

    get (k: keyof T) {
        return this.modified ? this.copy[k] : this.source[k];
    }

}

function deepClone<T> (origin: T) {
    return JSON.parse(JSON.stringify(origin));
}

const PROXY_FLAG = '@@PROXY_TARGET'

export function produce<T extends object> (state: T, producer: (draft: T) => void ) {

    // 1. 第一步生成新的对象
    const store = new Store<T>(state);

    // 2. 第二步生成该对象的代理，拦截值的读写
    const proxy = new Proxy(store, {
        set (target, key, value) {
            target.set(key as keyof T, value);
            return true;
        },
        get (target, key: keyof T) {
            if(key === PROXY_FLAG) return target;
            return target.get(key as keyof T);
        }
    });

    const newState = (proxy as typeof proxy & {[k: string]: any})[PROXY_FLAG];
    if (newState.modified) return proxy.copy;
    return proxy.source;
}