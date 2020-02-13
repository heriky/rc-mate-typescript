import React, { ReactNode, useState, useEffect, CSSProperties } from 'react';
import styles from './style.less';

const defaultProps = {
    style: {} as CSSProperties,
    className: '',
    defaultChecked: false,
    checked: false,
    children: null as ReactNode,
    indeterminate: false,
    onChange: (checked: boolean, e: React.MouseEvent) => {}
};

type Props = typeof defaultProps;
export default function Checkbox (props: Props) {

    const { defaultChecked, className, style, children, checked, indeterminate, onChange, ...rest } = props;
    const [_checked, setChecked] = useState(defaultChecked ?? checked);

    useEffect(() => {
        setChecked(checked);
    }, [checked])

    function handleChange (e: React.MouseEvent) {
        e.stopPropagation();
        const newChecked = !_checked;
        setChecked(newChecked);
        onChange(newChecked, e);
    }

    const classList = [styles.checkbox, className];
    if (_checked === true) {
        classList.push(styles.checked);
    } else if (indeterminate) {
        classList.push(styles.indeterminate);
    }

    return <label className={styles.checkboxWrapper} onClick={handleChange} {...rest}>
        <span className={classList.join(' ')} style={style}/>
        {typeof children === 'string' ? <span style={{ marginLeft: 7 }}>{children}</span> : children}
    </label>
    
}

Checkbox.defaultProps = defaultProps;