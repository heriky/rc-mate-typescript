export {};

interface Mix {
    (words: string): void;
    other: string[] | number[];
}

const a: Mix = ((word: string) => console.log(word)) as Mix;
a.other = ['hankang'];

//
interface Parent {
    // new(age: number): any;
    say(word: string): void;
}

class Person {
    constructor (private readonly other: string) {
        console.log(this.other);
    }
}
const p = new Person('hankang');

const obj = {
    name: 'hankang---------',
    say () {
        // console.log(this.name);
    }
};

const say = obj.say;
say();

enum Color {
    Red = 1,
    Blue = 'test',
    Green = 'a'
}

console.log(Color.Red);
console.log('reverse:', Color[Color.Red]);

interface A<T> {
    <T>(args: string): void;
}

interface B {
    name: string;
    age: number;
}
interface D {
    name: string;
    gender: string;
}
// const d: D = { name: 'hankang', gender: 'male', ui: 1 };
// const b: B = d;
