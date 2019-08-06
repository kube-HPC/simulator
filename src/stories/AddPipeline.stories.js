import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import AddPipeline from 'components/UI/Layout/SidebarRight/AddPipeline/AddPipeline.react';

import rootReducer from 'reducers/root.reducer';
import DrawerOperations from 'components/common/drawer/DrawerOperations.react';
import AddPipelineReact from 'components/UI/Layout/SidebarRight/AddPipeline/AddPipeline.react';

const store = createStore(rootReducer);

function AddPipelineContainer({ style }) {
  return (
    <AddPipeline
      algorithms={['a1', 'a2']}
      pipelines={['p1', 'p2']}
      onSubmit={action('click')}
      style={style}
    />
  );
}

storiesOf('Basics|AddPipeline', module).add('Default', () => (
  <Provider store={store}>
    <DrawerOperations visible={true} operation={'Add Pipeline'}>
      <AddPipelineReact onSubmit={() => {}} />
    </DrawerOperations>
  </Provider>
));

AddPipelineContainer.propTypes = {
  style: PropTypes.object
};
