import Group, { HGroup, VGroup } from './group';
import Accordin from './accordin';
import Cascader from './cascader';

// import path from 'path';

export {
    Group,
    HGroup,
    VGroup,
    Accordin,
    Cascader
};

// const allComponents = {};
// function importAll (compoList) {
//     return compoList.keys().forEach(fileName => {
//         const target = compoList(fileName);
//         let defaultCompoName = path.dirname(fileName.replace('./', ''));
//         defaultCompoName = defaultCompoName[0].toUpperCase() + defaultCompoName.slice(1)
//         // 单独组件需要处理export default 和 export两种情况
//         Object.entries(target).forEach(([key, value]) => {
//             if (key === 'default') return allComponents[defaultCompoName] = value;
//             allComponents[key] = value;
//         });
//     });
// }

// importAll(require.context('./', true, /index\.tsx/));
// console.log(allComponents);


