
import React from 'react';
import { useLocalStore } from 'mobx-react-lite';
class Store {
    count = 0;
    
    inc () {
        this.count += 1;
    }
}

export default function createStore () {
    return {
        count: 0,
        
        inc () {
            this.count += 1;
        }
    }
}

export function useStore () {
    return useLocalStore(createStore);
}

export type TStore = ReturnType<typeof createStore>