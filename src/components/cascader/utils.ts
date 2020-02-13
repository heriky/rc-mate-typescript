export interface OriginType {
    id: string | number;
    name: string;
    children?: OriginType[];
    parent?: OriginType;
    checked?: boolean;
    indeterminate?: boolean;
}

function bottom2Top (origin: OriginType[], handler: (current: OriginType) => OriginType): OriginType[] {

    const result = [];
    for (let i = 0; i < origin.length; i += 1) {
        const item = origin[i];
        if (Array.isArray(item.children) && item.children.length > 0) {
            const newChildren = bottom2Top(item.children, handler);
            result.push(handler({ ...item, children: newChildren })); // 这里都是生成一个新的对象，性能优化的时候，这里可以不用这样子。直接赋值？！
        } else {
            result.push(handler({ ...item }));  // 这里都是生成一个新的对象，性能优化的时候，这里可以不用这样子。直接赋值？！
        }
    }
    return result;
}

function top2Bottom (origin: OriginType[], handler?: (a: OriginType) => OriginType, parent?: OriginType): OriginType[] {
    
    const result = [];
    for (let i = 0; i < origin.length; i += 1) {
        const item = origin[i];
        const newItem = handler ? handler(item) : item;
        if (Array.isArray(item.children) && item.children.length > 0) {
            newItem.children = top2Bottom(item.children, handler, item);
        }
        newItem.parent = parent;
        result.push(newItem);
    }
    return result;
}

export function countLayer (origin: OriginType[], deep = 1): number {

    let maxDeep = deep;

    for(let i = 0; i < origin.length; i += 1) {
        const { children } = origin[i];
        if (Array.isArray(children) && children.length > 0) {
            const _deep = countLayer(children, deep + 1);
            if (_deep > deep) maxDeep = _deep;
        }
    }

    return maxDeep;
}

export const traverse = {
    top2Bottom,
    bottom2Top
}