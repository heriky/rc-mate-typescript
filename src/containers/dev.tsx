import React, { createElement } from 'react';
// import StoreProvider, { useStore } from './store';
import { useObserver, Observer, useLocalStore } from 'mobx-react-lite';
// import useStore, { user as store } from './store/ctx';
import createStore, { useStore } from './store/createStore';
import Cascader from '../components/cascader';
// import Other from './other.tsx';

interface Type { type: string; age?: number; (): void  }

export default function AppTest () {
    const store = useStore();

    return <Observer>
        {() => {
            return <div onClick={store.inc}>
            外部的计数器: { store?.count }
            <Inner />
            {/* <Other /> */}
            </div>
        }}
        </Observer>
}

function Inner () {
    const store = useStore();
    return useObserver(() => {
        return <h3 onClick={store.inc}>内部的计数器: {store.count}</h3>
    })
    
}
