import React from 'react';
import Cascader from '../components/cascader';
import { OriginType } from '../components/cascader/utils';

export default function Dev2 () {

    function change (result: OriginType[], item: OriginType) {
        console.log(result, item);
    }

    return <Cascader onChange={change}/>
}