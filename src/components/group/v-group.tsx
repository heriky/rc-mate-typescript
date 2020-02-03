import React, { CSSProperties } from 'react';
import styles from './style.less';
import { TagElement, Props, defaultProps, withGap } from './utils';

const VGroup = React.forwardRef<TagElement, Props>((props, ref) => {
    const { hAlign, vAlign, gap = 0, tag: Compo = 'div', style, className, children, whole, ...rest } = props;

    const finalClassName = `${className} ${styles.vGroup}`;
    const finalStyle = { justifyContent: vAlign, alignItems: hAlign, ...style } as CSSProperties;
    if (whole) {
        finalStyle.height = '100%';
    }
    const views = withGap(children, gap, 'v');

    return <Compo ref={ref} className={finalClassName} style={finalStyle} {...rest}>{views}</Compo>
});

VGroup.defaultProps = defaultProps;
// Group.propTypes = {
//     hAlign: PropTypes.string,
//     vAlign: PropTypes.string,
//     gap: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
//     tag: PropTypes.oneOf(['div', 'p', 'span', 'ul', 'li', 'footer', 'header', 'section']),
//     style: PropTypes.object,
//     className: PropTypes.string,
//     children: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
//     whole: PropTypes.bool
// }

export default React.memo(VGroup);