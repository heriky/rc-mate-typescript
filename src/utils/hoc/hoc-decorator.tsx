import React, { ComponentClass } from 'react';

export default function log (args: any) {

    let logs = '默认内容';

    if (typeof args === 'function') {
        logs = args;
        return decorator;
    }

    return decorator;

    function decorator (target: ComponentClass) {
        console.log('aaaaaaaaaaaaaaaaaaaa');
        // return class extends target {
        //     render () {
        //         return <>
        //             <span>当前打印的日志是: {logs}</span>
        //             {super.render()}
        //         </>
        //     }
        // }
    }

}