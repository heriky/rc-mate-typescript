import React, { useEffect, useState } from 'react';
import { Cascader } from '../components';
import { OriginType } from '../components/cascader/utils';
import axios from 'axios';

interface ResultType {
    id: string | number; name: string; ids: string; names: string;
}

export default function Dev2 () {

    const [data, setData] = useState();
    const [result, setResult] = useState<ResultType[]>([]);

    function change (result: OriginType[], item: OriginType, callback: () => ResultType[]) {
        // console.log(result, item);
        console.log(result, callback());
        setResult(callback());
    }

    useEffect(() => {
        axios.get('https://ual.shuyun.com/shuyun-searchapi/1.0/area?platform=top').then(res => {
            setData(res.data);
        })
    }, []);

    console.log('render');

    return <Cascader checkedIds={result.map(item => item.id)} disabledIds={[1]} onChange={change}/>
}

//  checkedIds={[111,12]}