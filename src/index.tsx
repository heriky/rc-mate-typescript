import React, { ComponentType } from 'react';
import ReactDOM from 'react-dom';
import Group from './components/group';
import Accordin from './components/accordin';
import { DevContainer } from './containers';
import Other from './containers/other';
import Dev2Container from './containers/dev2';

const { Pane } = Accordin as typeof Accordin & { Pane: ComponentType<any> };

const App = () => {
    return <Group gap="20">
        <Dev2Container />
        <Other />
    </Group>
}

ReactDOM.render(<App />, document.getElementById('root'));