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

export function handleInitData (data: OriginType[]) {
    // return traverse.top2Bottom(data, item => {
    //     // 添加parent属性，添加checked属性
    //     item.checked = false;
    //     return item;
    // });
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

export const traverse = {
    top2Bottom,
    bottom2Top
}