import React, { useState, useReducer } from 'react';
import PropTypes from 'prop-types';

import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { storiesOf } from '@storybook/react';
import rootReducer from 'reducers/root.reducer';
import { JsonView } from 'components/common';
import { AddAlgorithm } from 'components/Sidebar/SidebarRight';
import { DrawerOperations } from 'components';
import { Button } from 'antd';

const store = createStore(rootReducer);

const Container = ({ initial }) => {
  const [value, setValue] = useState({ note: 'Submit First' });
  const [isOpen, toggle] = useReducer(prev => !prev, initial);

  return (
    <>
      <Button onClick={toggle}>Open Drawer</Button>
      <JsonView jsonObject={value} />
      <DrawerOperations visible={isOpen} operation={'Add Algorithm'} onClose={toggle}>
        <AddAlgorithm onSubmit={({ payload }) => setValue(payload)} />
      </DrawerOperations>
    </>
  );
};

Container.propTypes = {
  initial: PropTypes.bool
};

Container.defaultProps = {
  initial: false
};

storiesOf('Basics|AddAlgorithm', module).add('In Drawer', () => (
  <Provider store={store}>
    <Container initial={true} />
  </Provider>
));
