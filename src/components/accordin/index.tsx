import React, { memo, useState, useLayoutEffect, isValidElement, CSSProperties, ReactElement, ReactNode } from 'react';
import { HGroup } from '../group';
import styles from './style.less';

type ActiveKeyType = string | string[] | undefined;
const defaultProps = {
    onChange: (key: string) => {},
    activeKey: undefined as ActiveKeyType, // 为了完整的Props类型检测，这里要显示的声明undefined
    defaultActiveKey: undefined as ActiveKeyType ,
    multiple: false,
    className: '',
    style: {} as CSSProperties
}

type Props = {
    children: ReactElement | ReactElement[];
} & Partial<typeof defaultProps>;

const paneDefaultProps = {
    style: {} as CSSProperties,
    className: ''
}

type PaneProps = {
    key: string;
    title: ReactNode;
    children: ReactNode;
} & Partial<typeof paneDefaultProps>;

const Accordin = memo((props: Props) => {

    const { children, onChange, activeKey, defaultActiveKey, multiple, className } = props;

    const [activedKey, setActivedKey] = useState<ActiveKeyType>(() => {
        const defaultKey = defaultActiveKey ?? activeKey ?? (Array.isArray(children) ? children[0]?.key+'' : children.key+'');
        if (defaultKey === null || defaultKey === undefined) return multiple ? [] : undefined;

        return multiple ? (Array.isArray(defaultKey) ? defaultKey : [defaultKey]) : defaultKey;
    });

    useLayoutEffect(() => {
        setActivedKey(() => activeKey);
    }, [activeKey]);

    function change (key: string) {
        return () => {
            setActivedKey(active => {
                if (multiple && Array.isArray(active)) {
                    return active.includes(key) ? active.filter(item => item !== key) : [...active, key];
                }
                return key === active ? undefined : key;
            });

            onChange && onChange(key);
        }
    }

    function getActived (key: string) {
        return multiple && Array.isArray(activedKey) ? activedKey.includes(key) : key === activedKey
    }

    const ele = React.Children.map(children, child => {
        if (!isValidElement(child)) return child;

        const key = child.key + '';
        const { title, ...rest } = child.props as PaneProps;
        const isActived = getActived(key);

        return <div key={key} className={styles.titleRoot}>
            <HGroup hAlign="flex-start" className={styles.title} onClick={change(key)}>
                {title}
                {/* <Icon type={isActived ? 'down-solid' : 'up-solid'} className={styles.iconArrow}/> */}
            </HGroup>
            {isActived && React.cloneElement(child, { ...rest, key })}
        </div>;
    });

    const finalClassName = `${styles.accordin} ${className}`;
    return (
        <div className={finalClassName}>
            {ele}
        </div>
    );
});

const Pane = memo((props: PaneProps) => {
    const { className, style, title, ...rest } = props;
    const finalClassName = `${styles.pane} ${className}`;

    return <div className={finalClassName} style={style} {...rest}>
        {props.children}
    </div>
});


export default Object.assign(Accordin, { Pane });
