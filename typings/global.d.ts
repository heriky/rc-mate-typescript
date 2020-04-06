declare module 'abc' {

}

declare const __DEV__: string;
declare const __RUNTIME__: string;

// 命名空间的声明，其实相当于一个对象了
declare namespace MyPlugins {
    const m: string;
    const n: string;
}

declare function sayHello(name: string);

interface String {
    humb(input: string): void;
}