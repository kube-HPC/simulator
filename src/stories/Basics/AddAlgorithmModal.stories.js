import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import { storiesOf } from '@storybook/react';

import AddAlgorithmForm from 'components/UI/operations/AddAlgorithmForm.react';
import rootReducer from 'reducers/root.reducer';
import DrawerContainer from 'components/dumb/DrawerContainer.react';

const store = createStore(rootReducer);

storiesOf('Basics|AddAlgorithmModal', module)
  .add('Default', () => (
    <Provider store={store}>
      <AddAlgorithmForm
        visible={true}
        onSubmit={() => {}}
        toggleVisible={() => {}}
      />
    </Provider>
  ))
  .add('In Drawer', () => (
    <Provider store={store}>
      <DrawerContainer visible={true} operation={'Add Algorithm'}>
        <AddAlgorithmForm />
      </DrawerContainer>
    </Provider>
  ));
