export interface OriginType {
    id: string | number;
    name: string;
    children?: OriginType[];
    parent?: OriginType;
    checked?: boolean;
    indeterminate?: boolean;
    disabled?: boolean;
    layer?: number; // 从1开始
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

function top2Bottom (origin: OriginType[], handler?: (a: OriginType) => OriginType, parent?: OriginType, layer = 1): OriginType[] {
    
    const result = [];
    for (let i = 0; i < origin.length; i += 1) {
        const item = origin[i];
        const newItem = handler ? handler(item) : item;
        newItem.parent = parent;
        newItem.layer = layer;

        if (Array.isArray(item.children) && item.children.length > 0) {
            newItem.children = top2Bottom(item.children, handler, item, newItem.layer + 1);
        }
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

//==================== 组件特定纯函数
export function flatten (data: OriginType) {
    let tmp: OriginType | undefined = data;
    const names = [];
    const ids = [];
    while(tmp) {
        names.unshift(tmp.name);
        ids.unshift(tmp.id);
        tmp = tmp.parent;
    }
    return { id: ids.join(','), name: names.join(',') } 
}

export function merge (result: OriginType[]): OriginType[] {
    const parentIds = Array.from(new Set(result.map(rs => rs.parent?.id)));

    // 将用于合并的parentId
    const _parentId = parentIds.find(parentId => {
        if (parentId === undefined || result[0] === undefined) return false;
        const current = result.filter(item => item.parent?.id === parentId);
        return current.length === result[0].parent?.children?.length;
    });

    let rs = result;

    // 1. 去重, 如果父亲和孩子同时存在，则移除孩子
    rs = rs.flatMap(item => {
        if (rs.find(r => r.id === item.parent?.id)) return [];
        return item;
    });

    // 2. 合并。当前数组中，同一个父亲的数量等于父亲孩子的总数，则合并
    if (_parentId) {
        // 移除当前，添加父亲
        let parent;
        rs = rs.filter(item => {
            if (item?.parent?.id === _parentId) {
                parent = item.parent;
                return false;
            }
            return true;
        });
        parent && rs.push(parent);
        rs = merge(rs);
    }

    return rs;
}

// 添加父节点、初始化checked状态、添加layer属性（用于优化）
export function handleInitData (data: OriginType[]) {
    return traverse.top2Bottom(data, item => (item.checked = false, item)); // 逗号运算符
}

export function checkOther (item: OriginType) {
    // 如果有children则处理当前结点状态
    if (item.children?.length) {
       if (item.children.every(child => child.checked)) {
           item.checked = true;
           item.indeterminate = undefined;
       } else if (item.children.every(child => child.checked === false)) {
           item.checked = false;
           item.indeterminate = undefined;
       } else {
           item.checked = undefined;
           item.indeterminate = true;
       }
   }
   return item;
}

export function checkChildren (item: OriginType, checked: boolean): OriginType {
    if (!item.children?.length) {
        return item;
    }
    item.children = traverse.top2Bottom(item.children ?? [], it => {
        it.checked = checked;
        it.indeterminate = undefined;
        return it;
    }, item, (item.layer ?? 1) + 1);
    return item;
}

export function disableItem (item: OriginType, disabled = true) {
    item.disabled = item.checked === false ? disabled: false; // 这里处理的是，只有未选中的，才会被disabled
    if (item.children?.length) {
        item.children.forEach(child => {
            disableItem(child);
        });
    }
}

export type RsType = {
    id: string | number;
    name: string;
    ids: (string | number)[];
    names: string[];
}[];

export function genResult (source: OriginType[]): RsType {
    const result: RsType = [];
    traverse.top2Bottom(source, item => {
        if (!item.checked) return item;
        // 顶层则直接输出
        if (!item.parent) {
            result.push({ id: item.id, ids: [item.id] , name: item.name, names: [item.name] });
            return item;
        }

        const names = [item.name];
        const ids = [item.id];
        let cusor: OriginType | undefined = item.parent;
        let shouldRecord = true;
        while(cusor) {
            const { id, name } = cusor;
            if (shouldRecord) {
                shouldRecord = !result.find(rs => rs.id === id); // 某一个层级的父节点id，已存在于result中，则不添加
            }
            names.unshift(name);
            ids.unshift(id);
            cusor = cusor.parent;
        }
        if (shouldRecord) {
            result.push({ id: item.id, name: item.name, ids, names });
        }
        return item;
    });
    return result;
}


export function getLayerResult (data: OriginType[], layer: number): RsType {
    // 深入到底部，把底部的id全部加入
    const result: RsType = [];
    bottom2Top(data, item => {
        if (item.checked && item.layer === layer) {
            const ids = [];
            const names = [];
            let cur: OriginType | undefined = item;
            while(cur) {
                const { id, name } = cur;
                ids.unshift(id);
                names.unshift(name);
                cur = cur.parent;
            }
            result.push({ id: item.id, name: item.name, ids, names });
        }
        return item;
    });
    return result;
}

export const traverse = {
    top2Bottom,
    bottom2Top
}