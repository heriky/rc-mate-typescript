
// type UnWrap<T> = T extends Array<infer R> ? R : T;

type Ref<T = any> = { value: T };

// T 是基础类型，或者对象类型
type UnwrapRef<T> = {
    ref: T extends Ref<infer R> ? R : T;
    object: { [K in keyof T]: UnwrapRef<T[K]> };
    other: T;
}[T extends Ref<T> ? 'ref' : T extends object ? 'object' : 'other'];


type RType<T> = T extends (...args: any[]) => infer R ? R : T; 

type ConstructorParams<T extends new (...args: any) => any> = T extends new (...args: infer R) => any ? R : T;
type Instance<T extends new (...args: any) => any> = T extends new (...args: any) => infer R ? R : T; 

export {};