/** 链表翻转 */

interface VNode {
    data: unknown;
    next: VNode | null;
}

function assertNotNull<T> (val: T): asserts val is NonNullable<T>{
    if (val === null || val === undefined) {
        throw Error('val is not a string type.');
    }
}

function genLinkList (start: number, end: number) {
    const head: VNode = { data: start, next: null };

    let cur = head; // 当前指针位置
    for (let i = start + 1; i <= end; i += 1 ) {
        const node = { data: i, next: null };
        cur.next = node;
        cur = node;
    }
    return head;
}

// 1. 全量翻转——循环
function reverse (list: VNode) {
    if (!list) return;
    let cur: VNode= list;
    let prev = null;
    while(cur.next) {
        const next = cur.next; // 先保存下一个结点
        cur.next = prev; // next指针指向前一个结点
        prev = cur; // 更新前一个结点
        cur = next; // 指针移动
    }
    return prev;
}

// 2. 全量翻转——递归
function reverseX (node: VNode) {
    function rever (cur: VNode | null, prev: VNode | null) {
        if (!cur) return prev;
        const next = cur.next;
        cur.next = prev;
        rever(next, cur);
    }
    return rever(node, null);
}

//3. 区间翻转-迭代
function reverseBetween (head: VNode, startPos: number, endPos: number) {
    // 要注重四个节点，前结点，后节点，起始节点，终止节点

    const dummyHead = { data: null, next: head };
    let cur: VNode | null = dummyHead; // 第一个节点之前制作一个假节点

    // 1. 找到前结点
    for(let i = 0; i < startPos; i++) {
        if (!cur) return head;
        cur = cur.next;
    }
    // 此时cur停留在前节点
    if (!cur || !cur.next) return head;

    // 2. 开始翻转
    const before = cur;
    const start  = cur.next; // 起始节点
    let prev = null;
    cur = start; // 指针放在起始节点，开始处理
    for (let j = 0; j < endPos - startPos + 1; j++) {
        if (!cur) return head;
        const next: VNode | null = cur.next;
        cur.next = prev;
        prev = cur;
        cur = next;
    }
    // 此时prev停留在终止节点，cur停留在后节点
    before.next = prev;
    start.next = cur;
    
    return head;
}

// 4. 区间翻转-递归 (递归翻转：前面的处理都是一致的，后面的的翻转使用递归进行处理)
function reverseBetweenX () {
    function rever (pre: VNode, cur: VNode) {
        const next = cur.next;
        cur.next = pre;
        if(!next) return pre;
        rever(cur, next);
    }
    // 翻转： 链表
}

// 5. 两个为一组，进行翻转 -- 循环的方式
function reversePair (head: VNode) {
    // 需要明确的是，这种翻转，需要三个节点参与
    if (!head.next) return head;
    const dummyHead = { data: null, next: head };
    let cur: VNode | null = dummyHead; // 只是前结点
    let node1: VNode | null = head;
    let node2: VNode | null = head.next;

    while(node1 && node2) {
        node1.next = node2.next;
        node2.next = node1;
        cur.next = node2;
       
        cur = node1;
        node1 = cur.next;
        node2 = cur.next ? cur.next.next : null;
    }
    return dummyHead.next;
}

// 6. 两个一组，进行翻转 -- 递归的形式
function reversePairX (head: VNode | null) {
    if (!head || !head.next) return head;
    // 这个递归的写法很巧妙，注意理解
    const node1 = head;
    const node2 = head.next;
    node1.next = reversePairX(node2.next);
    node2.next = node1;
    return node2;
}

// 7. K个一组进行翻转 -- 递归的形式比较直观
function reverseK (head: VNode, k: number) {
    // 不足k个，则返回
    let p: VNode | null = head;
    for (let i = 0; i < k; i++) {
        if (!p) return head;
        p = p.next;
    }

    assertNotNull(head);

    // 对k个进行翻转
    let prev = null;
    let cur: VNode = head;
    for (let i = 0; i < k; i++) {
        const next = cur.next;
        cur.next = prev;
        prev = cur;
        cur = next!;
    }
    // 此时cur停留在“后节点”， prev停留在结束节点
    head.next = reverseK(cur, k);
    return prev;
}

//============================分割线，测试区域==================================================
// 启动
function startUp () {
    const linklist = genLinkList(0, 10);
    console.log(reversePairX(linklist));
}


startUp();

export {};