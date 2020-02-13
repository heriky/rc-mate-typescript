import React, { useState, useMemo, ReactElement, ReactNode, useRef } from 'react';
import { traverse, OriginType, countLayer } from './utils'
import { VGroup, HGroup } from '../group';
import Checkbox from './checkbox';
import styles from './style.less';
import rawData from './data';

const defaultProps = {
    data: rawData,
    checkedIds: [] as string[] | number[],
    onChange: (result: OriginType[], a: OriginType) => {}
};

type Props = typeof defaultProps;

const STATE_KEY = 'layerId';

function flatten (data: OriginType) {
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

function merge (result: OriginType[]): OriginType[] {
    const parentIds = Array.from(new Set(result.map(rs => rs.parent?.id)));

    const _parentId = parentIds.find(parentId => {
        if (parentId === undefined || result[0] === undefined) return false;
        const current = result.filter(item => item.parent?.id === parentId);
        return current.length === result[0].parent?.children?.length;
    });

    let rs = result;
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

export default function Cascader (props: Props) {
    const { data, checkedIds, onChange } = props;

    const resultRef = useRef<OriginType[]>([]);
    const layerCount = useMemo(() => countLayer(data), [data])

    const [state, setState] = useState<{[key: string]: OriginType['id']}>({});
    const [source, setSource] = useState<OriginType[]>(() => {
        return traverse.top2Bottom(data, item => {
            item.checked = false;
            return item;
        });
    });

    function layerClick (id: OriginType['id'] ,layer: number) {
        return () => {
            const newState = { ...state, [STATE_KEY + layer]: id };
            setState(newState);
        }
    }

    function itemCheck (_item: OriginType) {
        return (v: boolean) => {
            const newSource = traverse.bottom2Top(source, item => {
                // 1. 本体赋值
                if (item.id === _item.id) {
                    item.checked = v;

                     // 2. 子孙孩子同步。这里可以放心使用，不会出现性能问题，因为有限定条件，收益在每一次点击的时候，实际上这个遍历只执行一次
                    item.children = traverse.top2Bottom(item.children ?? [], it => {
                        it.checked = v;
                        return it;
                    });

                    return item;
                }
               

                // 3.其余结点计算
                // 如果有children则处理当前结点状态
                if (item.children?.length) {
                    if (item.children.every(child => child.checked)) {
                        item.checked = true;
                    } else if (item.children.every(child => child.checked === false)) {
                        item.checked = false;
                    } else {
                        item.checked = undefined;
                        item.indeterminate = true;
                    }
                }
                
                return item;
            });

            setSource(newSource);
            
            // 计算结果
            if (v) {
                resultRef.current.push(_item);
            } else {
                resultRef.current = resultRef.current.filter(item => item.id !== _item.id);
            }

            const result = merge(resultRef.current);
            console.log(result);

            onChange(result.map(flatten), _item);
        }
    }

    // 逐层获取数据
    function getLayerData (layer: number): OriginType[] {
        if (layer === 1) return source;
        
        let tmp: OriginType[] = source;
        for (let i = 2; i <= layer; i += 1) {
            const target = tmp.find(item => item.id === state[STATE_KEY+ (i - 1)]); // 第二层的数据由第一层的id获得
            const targetList = target && target.children ? target.children : [];
            
            if(i === layer || !targetList.length) return targetList;
            tmp = targetList;
        }
        return tmp;
    }

    function renderLayer (list: OriginType[], layer: number) {
        return <VGroup hAlign="flex-start" vAlign="flex-start" tag="ul" className={styles.layer}>
            {list.map((item: OriginType) =>{
                return <li className={styles.layerItem} key={item.id} onClick={layerClick(item.id, layer)}>
                    <Checkbox checked={item.checked} indeterminate={item.indeterminate} onChange={itemCheck(item)} />
                    <span style={{ marginLeft: 7, verticalAlign: 3 }}>{item.name}</span>
                </li>
            })}
        </VGroup>
    }

    return <HGroup>
        {
            Array(layerCount).fill(1).map((a, i) => {
                const layer = i + 1;
                const layerData = getLayerData(layer);
                return (layerData.length > 0 && 
                    <section key={layer} className={styles.cascader}>
                        {renderLayer(layerData, layer)}
                    </section>) as JSX.Element;
            })
        }
    </HGroup> 
}

Cascader.defaultProps = defaultProps;