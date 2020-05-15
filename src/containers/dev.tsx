import React, { PureComponent, ComponentClass } from 'react'
import log from '../utils/hoc/hoc-decorator';

import { autorun, observable } from '../utils/observable';


const obj = observable({ name: 'hankang' });

autorun(() => {
    console.log('变化了a', obj, obj.name);
});

@log('')
export default class Dev extends PureComponent {

    count = 0;

   change = () => {
    obj.name = obj.name + this.count ++;
   }

    render () {
        return (
           <label htmlFor="a">
               哈哈哈：
               <button onClick={this.change}>变化</button>
               <input type="text"/>
           </label>
        )
    }
}