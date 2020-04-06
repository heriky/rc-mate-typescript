import React, { PureComponent, ComponentClass } from 'react'
import log from '../utils/hoc/hoc-decorator';

@log('')
export default class Dev extends PureComponent {

    render () {
        return (
           <label htmlFor="a">
               哈哈哈：
               <input type="text"/>
           </label>
        )
    }
}