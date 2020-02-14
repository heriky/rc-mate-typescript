import React, { useEffect, useState } from 'react';
import Cascader from '../components/cascader';
import { OriginType } from '../components/cascader/utils';
import axios from 'axios';

export default function Dev2 () {

    const [data, setData] = useState();
    function change (result: OriginType[], item: OriginType) {
        console.log(result.map(item => item.name));
    }

    useEffect(() => {
        axios.get('https://ual.shuyun.com/shuyun-searchapi/1.0/area?platform=top').then(res => {
            setData(res.data)
        })
    }, []);

    console.log('render');

    return <Cascader data={data} onChange={change}/>
}