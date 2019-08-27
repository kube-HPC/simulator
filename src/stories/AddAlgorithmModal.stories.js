import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import { storiesOf } from '@storybook/react';

import AddAlgorithm from 'components/Sidebar/SidebarRight/AddAlgorithm.react';
import rootReducer from 'reducers/root.reducer';
import DrawerOperations from 'components/Drawer/DrawerOperations.react';

const store = createStore(rootReducer);

storiesOf('Basics|AddAlgorithmModal', module).add('In Drawer', () => (
  <Provider store={store}>
    <DrawerOperations visible={true} operation={'Add Algorithm'}>
      <AddAlgorithm onSubmit={() => console.info('Submitted')} />
    </DrawerOperations>
  </Provider>
));
