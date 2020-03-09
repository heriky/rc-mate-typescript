import React, { useState, useMemo, ComponentType, ComponentProps, useEffect, MouseEvent, useCallback } from 'react';
import { traverse, OriginType, countLayer, RsType, genResult, checkOther, handleInitData, checkChildren, disableItem, getLayerResult } from './utils'
import { VGroup, HGroup } from '../group';
import Checkbox from './checkbox';
import styles from './style.less';
import rawData from './data';

const defaultProps = {
    theme: {
        layerClassName: '',
        layerItemClassName: '',
    },
    className: '',
    data: rawData,
    disabledIds: [] as (string | number)[],
    checkedIds: [] as (string | number)[],
    onChange: (result: OriginType[], item: OriginType, formattedResult: (layer?: number) => RsType) => { },
    checkbox: Checkbox as ComponentType<Partial<ComponentProps<typeof Checkbox>>> // 这里，因为Checkbox的所有属性都是可选的，如果没有Partial则ts会报错
};

// TODO: 这里处理一下
type Props = typeof defaultProps;

// FIXME： 测hi这里
const STATE_KEY = 'layerId';

export default function Cascader (props: Props) {
    const { data: rawData, checkbox: Compo, checkedIds, onChange, theme, className, disabledIds } = props;

    const data = useMemo(() => handleInitData(rawData), [rawData]);
    const layerCount = useMemo(() => countLayer(data), [data]);

    const [state, setState] = useState<{ [key: string]: OriginType['id'] }>({});
    // source是控制内部值，data是经过处理的数据源
    const [source, setSource] = useState<OriginType[]>(data);

    // 设置外部传入的已选项目。如果对于复杂需求，应该使用useEffect对result进行响应，对result中每个项都进行状态的判定
    useEffect(() => {
        function checkItems () {
            if (!checkedIds.length && !disabledIds.length) return;
            const newSource = traverse.bottom2Top(data, item => {
                if (disabledIds.includes(item.id)) {
                    disableItem(item);
                }

                if (checkedIds.includes(item.id)) {
                    item.checked = true;
                    checkChildren(item, true);
                    return item;
                }
                return checkOther(item);
            });

            setSource(newSource);
        }
        checkItems();
    }, [checkedIds, data, disabledIds]);

    function itemClick (id: OriginType['id'], layer: number) {
        return () => {
            const newState = { ...state, [STATE_KEY + layer]: id };

            // 重复点击同一层，则不触发
            if (newState[STATE_KEY + layer] === state[STATE_KEY + layer]) return;
            setState(newState);
        }
    }

    function itemCheck (_item: OriginType) {
        return (v: boolean) => {
            const newSource = traverse.bottom2Top(source, item => {
                // 1. 本体赋值
                if (item.id === _item.id) {
                    item.checked = v;
                    item.indeterminate = undefined;

                    // 2. 子孙孩子同步。这里可以放心使用，不会出现性能问题，因为有限定条件，收益在每一次点击的时候，实际上这个遍历只执行一次
                    return checkChildren(item, v);
                    // TODO:3. 优化： _item的当前层级就不需要再处理了
                }

                // 3.其余结点计算
                return checkOther(item);
            });

            setSource(newSource);
            onChange(newSource, _item, (layer?: number) => {
                return layer === undefined ? genResult(newSource) : getLayerResult(newSource, layer);
            });
        }
    }

    const preventClick = useCallback((e: MouseEvent<HTMLElement>) => {
        e.stopPropagation();
        e.nativeEvent.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
    }, []);

    // 逐层获取数据
    function getLayerData (layer: number): OriginType[] {
        if (layer === 1) return source;

        let tmp: OriginType[] = source;
        for (let i = 2; i <= layer; i += 1) {
            const target = tmp.find(item => item.id === state[STATE_KEY + (i - 1)]); // 第二层的数据由第一层的id获得
            if (!target || !target.children?.length) return []; // 上一层未找到，则返回
            if (i === layer) return target.children; // 找到当前层则返回

            tmp = target.children;
        }
        return tmp;
    }

    function renderLayer (list: OriginType[], layer: number) {
        return <VGroup key={layer} hAlign="flex-start" vAlign="flex-start" tag="ul" className={`${styles.layer} ${theme.layerClassName}`}>
            {list.map((item: OriginType) => {
                const classList = [styles.layerItem, theme.layerItemClassName];
                state[STATE_KEY + layer] === item.id && (classList.push(styles.active));
                item.children?.length && (classList.push(styles.indicator));
                const onClick = item.children?.length ? itemClick(item.id, layer) : () => { };

                return <li className={classList.join(' ')} key={item.id} onClick={onClick}>
                    <Compo disabled={item.disabled} checked={item.checked} indeterminate={item.indeterminate} onChange={itemCheck(item)} />
                    <span style={{ marginLeft: 7, verticalAlign: 3 }}>{item.name}</span>
                </li>
            })}
        </VGroup>
    }

    console.log('render cascader ---------');

    return <HGroup className={`${styles.cascader} ${className}`} hAlign="flex-start" vAlign="flex-start" onClick={preventClick}>
        {
            Array(layerCount).fill(1).map((a, i) => {
                const layer = i + 1;
                const layerData = getLayerData(layer);
                return (layerData.length > 0 && renderLayer(layerData, layer)) as JSX.Element;
            })
        }
    </HGroup>
}

Cascader.defaultProps = defaultProps;