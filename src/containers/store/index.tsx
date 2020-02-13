import React, { createContext, ReactNode, useContext } from 'react';
import { useLocalStore } from 'mobx-react-lite';

import createStore, { TStore } from './createStore';

const storeContext = createContext<TStore | null>(null);

const StoreProvider = ({ children }: { children: ReactNode }) => {
    const store = useLocalStore(createStore);
    return <storeContext.Provider value={store}>
        { children }
    </storeContext.Provider>
}

export default StoreProvider;

export function useStore () {
    const store = useContext(storeContext);
    if (!store) throw Error('wrong store');
    return store;
}
