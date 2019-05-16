import React from 'react';
import { storiesOf } from '@storybook/react';

import { Provider } from 'react-redux';
import { createStore } from 'redux';
import AddDebugReact from 'components/UI/operations/AddDebug.react';
import rootReducer from 'reducers/root.reducer';
import DrawerContainer from 'components/dumb/DrawerContainer.react';

const store = createStore(rootReducer);

storiesOf('Basics|AddDebug', module).add('In Drawer', () => (
  <Provider store={store}>
    <DrawerContainer visible={true} operation={'Add Debug'}>
      <AddDebugReact />
    </DrawerContainer>
  </Provider>
));
