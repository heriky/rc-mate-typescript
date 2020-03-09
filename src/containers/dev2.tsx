import React, { useEffect, useState } from 'react';
import { Cascader } from '../components';
import { OriginType } from '../components/cascader/utils';
import axios from 'axios';

type ResultType = {
    id: string | number; name: string; ids: (string | number)[]; names: string[];
};

export default function Dev2 () {

    const [data, setData] = useState();
    const [result, setResult] = useState<ResultType[]>([]);

    function change (result: OriginType[], item: OriginType, callback: (layer?: number) => ResultType[]) {
        // console.log(result, item);
        const rs = callback(3);
        console.log('result', rs);
        setResult(rs);
    }

    // useEffect(() => {
    //     axios.get('https://ual.shuyun.com/shuyun-searchapi/1.0/area?platform=top').then(res => {
    //         setData(res.data);
    //     })
    // }, []);

    console.log('render');

    return <Cascader checkedIds={result.map(item => item.id)} disabledIds={result.length === 2 ? [1, 2] : []} onChange={change}/>
}

//  checkedIds={[111,12]}