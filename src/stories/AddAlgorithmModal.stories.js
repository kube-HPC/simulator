import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { storiesOf } from '@storybook/react';
import rootReducer from 'reducers/root.reducer';
import { JsonView } from 'components/common';
import { AddAlgorithm } from 'components/Sidebar/SidebarRight';
import { DrawerOperations } from 'components';

const store = createStore(rootReducer);

const Container = () => {
  const [value, setValue] = useState({ note: 'Submit First' });

  return (
    <>
      <JsonView jsonObject={value} />
      <DrawerOperations visible={true} operation={'Add Algorithm'}>
        <AddAlgorithm onSubmit={({ payload }) => setValue(payload)} />
      </DrawerOperations>
    </>
  );
};

storiesOf('Basics|AddAlgorithmModal', module).add('In Drawer', () => (
  <Provider store={store}>
    <Container />
  </Provider>
));
