import { observable, action } from 'mobx'
import { createContext, useContext } from 'react';

class User {
    @observable
    count = 1;

    @action.bound
    inc () {
        console.log('99999999999999');
        this.count += 1;
    }
}

export const user = new User();

const AppContext = createContext<User>(new User());

export default function useStore () {
    return useContext(AppContext);
}
