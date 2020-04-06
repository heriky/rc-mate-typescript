import React, { ComponentType } from 'react';
import ReactDOM from 'react-dom';
import Group from './components/group';
import Accordin from './components/accordin';
import { DevContainer } from './containers';
import Other from './containers/other';
import Dev2Container from './containers/dev2';
import Cascader from './components/cascader';
import './test';

// 算法测试
import '../algorithm/link-list';

const { Pane } = Accordin as typeof Accordin & { Pane: ComponentType<any> };

const App = () => {
    return <Group gap="20">
        <DevContainer />
    </Group>
}

const a = '12313';

ReactDOM.render(<App />, document.getElementById('root'));