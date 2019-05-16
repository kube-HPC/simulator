import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import { storiesOf } from '@storybook/react';

import AddAlgorithmForm from 'components/UI/operations/AddAlgorithmForm.react';
import rootReducer from 'reducers/root.reducer';

const store = createStore(rootReducer);

storiesOf('Basics|AddAlgorithmModal', module).add('Default', () => (
  <Provider store={store}>
    <AddAlgorithmForm
      visible={true}
      onSubmit={() => {}}
      toggleVisible={() => {}}
    />
  </Provider>
));
