import React, { ReactChild, cloneElement, isValidElement } from 'react';

enum gapProps {
    h = 'marginRight',
    v = 'marginBottom'
}

type ChildrenType = ReactChild | ReactChild[];

// 这里需要注意的是section、footer这些都是HTMLElment类型的，不需要出现在联合类型声明中
type TagType = 'div' | 'p' | 'span' | 'ul' | 'li' | 'footer' | 'header' | 'section' | 'aside';
export type TagElement = HTMLDivElement & HTMLParagraphElement & HTMLSpanElement & HTMLUListElement & HTMLLIElement;

export const defaultProps = {
    hAlign: 'center',
    vAlign: 'center',
    gap: 0 as string | number , // 为了不让typeof认为此项是number
    tag: 'div' as TagType, // 为了不让typeof认为此项是string
    style: {},
    className: '',
    whole: false
}

export type Props = {
    children: ChildrenType;
     // 注意这里如果使用React.HTMLProps则默认包含了ref, 或者ComponentPropsWithRef
} & Omit<React.HTMLProps<HTMLElement>, 'children' | 'ref'> & Partial<typeof defaultProps>;

export function withGap (children: ChildrenType, gap: string | number, type: 'h' | 'v' = 'h') {
    const _gap = typeof gap === 'number' || !gap.endsWith('px') ? `${gap}px` : gap;
    if (!Array.isArray(children)) return children;

    const elements = children.flatMap((child, index): ReactChild[] => {
        if (!isValidElement(child)) return [child]; // 为了要统一类型，这里使用Fragment

        const gapStyle = { [gapProps[type]] : _gap };
        const _key = child.key ?? index;
        return [cloneElement(child, { key: _key }), <s style={gapStyle} key={`${_key}_spacer`}/>];
    });
    return elements.slice(0, -1);
}