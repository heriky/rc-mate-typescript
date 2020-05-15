import React, { useState } from 'react'

const goods = Array(5).fill(0).map((item, index) => ({ id: index, name: `商品${index}`, price: 2 * index }))

type CartItem = { id: number; name: string; price: number };

// 记录当前所有项目的选中状态，方便做全选和反选
type CheckedMap = {
    [id: number]: boolean;
};

type CheckChangeHandler = (item: CartItem, checked: boolean) =>  void;

export default function Cart () {

    const [checkedMap, setCheckedMap] = useState<CheckedMap>({});

    const onCheckedChange: CheckChangeHandler = (cartItem: CartItem, checked: boolean) => {
        const { id } = cartItem;
        const newMap = { ...checkedMap, [id]: checked };
        setCheckedMap(newMap);
    }

    return (
        <div>
            购物车
        </div>
    )
}

function sumPrice (cartItems: CartItem[]) {
    return cartItems.reduce((acc, cur) => acc + cur.price, 0);
}

function filterChecked (checkedMap: CheckedMap, cartList: CartItem[]) {
    return Object.entries(checkedMap).filter(entries => Boolean(entries[1])).map(([checkedId]) => cartList.find(({ id }) => id === Number(checkedId)));
}
