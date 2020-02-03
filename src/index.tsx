import React, { ComponentType } from 'react';
import ReactDOM from 'react-dom';
import Group from './components/group';
import Accordin from './components/accordin';

const { Pane } = Accordin as typeof Accordin & { Pane: ComponentType<any> };

const App = () => {
    return <Group gap="20">
        韩康我是
        <span>内容哈哈哈</span>
        <span>士大夫就立刻</span>
        <Accordin>
            <Pane key="1" title="测试1">哈哈哈哈</Pane>
        </Accordin>
    </Group>
}

ReactDOM.render(<App />, document.getElementById('root'));