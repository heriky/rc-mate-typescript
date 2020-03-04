import React, { useEffect, useState } from 'react';
import { Cascader } from '../components';
import { OriginType } from '../components/cascader/utils';
import axios from 'axios';

export default function Dev2 () {

    const [data, setData] = useState();
    function change (result: OriginType[], item: OriginType, callback: () => {id: string | number; name: string; ids: string; names: string}[]) {
        // console.log(result, item);
        console.log(result, callback());
    }

    useEffect(() => {
        axios.get('https://ual.shuyun.com/shuyun-searchapi/1.0/area?platform=top').then(res => {
            setData(res.data)
        })
    }, []);

    console.log('render');

    return <Cascader checkedIds={[22]} onChange={change}/>
}

//  checkedIds={[111,12]}