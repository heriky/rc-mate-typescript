import React, { Children, ReactNode, isValidElement } from 'react';

const STYLED_ID = 'styled';

const CSS_MAP = {} as {[key: string]: string};

function camelCase (key: string) {
    return key.replace(/-[a-z]/g, match => match[1].toUpperCase());
}

function dashCase (key: string) {
    return key.replace(/[A-Z]/g, match => `-${match.toLowerCase()}`);
}

function genCss (rs: string, selector: string) {
    const existDOM = document.getElementById(STYLED_ID);

    const styleDOM = existDOM || document.createElement('style');
    styleDOM.setAttribute('type', 'text/css');
    styleDOM.setAttribute('id', STYLED_ID);

    CSS_MAP[selector] = rs;

    let result = '';
     Object.entries(CSS_MAP).forEach(([key, value]) => {
        result += `.${key} {
            ${value}
        }
        `;
    });

    styleDOM.innerHTML = result;

    existDOM || document.head.appendChild(styleDOM);
    return {};
}

function genStyle (rs: string) {
    const lines = rs.split(';');
    const _style = lines.reduce((acc, item) => {
        const [key, value] = item.split(':');
        const _key = camelCase(key.trim());
        return _key ? { ...acc, [_key]: value } : acc;
    }, {});
    return _style;
}

function genStyled (suffix: string | undefined = undefined) {
    return (strs: TemplateStringsArray, ...args: any[]) => {
        let rs = '';
        for (let i = 0; i < strs.length; i++) {
            const str = strs[i];
            let _arg = args[i] || '';
            _arg = typeof _arg === 'function' ? _arg() : _arg;
            rs = `${rs}${str}${_arg}`;
        }

        const _style = suffix ? genCss(rs, suffix) : genStyle(rs);
        
        return (props: { children: ReactNode }) => {
            const { children } = props;
            return Children.map(children, (child, index) => {
                if (!child || !isValidElement(child)) return child;

                const finalStyle = { ...child.props.style, ..._style }; // 没有suffix，设置style
                const finalClassName = child.props.className ? `${ child.props.className} ${suffix}` : suffix; // 有suffix，设置className
                const finalProps = suffix ? { ...child.props, className: finalClassName } : { ...child.props, style: finalStyle };

                return React.cloneElement(child, { key: index, ...finalProps });
            });
        };
    }
}

const styled = genStyled();

export default new Proxy(styled, {
    get (target: {[key: string]: any}, prop: string) {
        return target[prop] || genStyled(prop);
    }
})