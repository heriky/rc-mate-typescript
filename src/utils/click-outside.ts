enum eventNames {
    CLICK = 'click',
    TOUCH = 'touch'
}

const a = '';

export default function (el: HTMLElement, callback: (e: Event) => void) {
    // 防止touch注册一次，click又注册一次
    let isTouch = false;
    function handler (e: Event) {
        if (e.type === eventNames.TOUCH) isTouch = true;
        if (isTouch && e.type === eventNames.CLICK) return; // 如果当前是click，但是注册过了touch，则不用再重复注册了
        if (!el.contains(e.target as HTMLElement)) {
            callback(e);
        }
    }

    [eventNames.CLICK, eventNames.TOUCH].forEach(eventName => {
        document.addEventListener(eventName, handler);
    });

    return () => {
        [eventNames.CLICK, eventNames.TOUCH].forEach(eventName => {
            document.removeEventListener(eventName, handler);
        });
    };
}