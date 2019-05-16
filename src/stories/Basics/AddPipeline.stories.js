import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import Sidebar from 'react-sidebar';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import AddPipelineSteps from 'components/dumb/AddPipeline/AddPipelineSteps.react';
import AddPipelineForm from 'components/dumb/AddPipeline/AddPipelineForm.react';
import addPipelineTemplate from 'config/template/addPipeline.template';

import rootReducer from 'reducers/root.reducer';
import DrawerContainer from 'components/dumb/DrawerContainer.react';
import AddPipelineReact from 'components/UI/operations/AddPipeline.react';

const store = createStore(rootReducer);

function AddPipelineContainer({ style }) {
  return (
    <AddPipelineSteps
      algorithms={['a1', 'a2']}
      pipelines={['p1', 'p2']}
      onSubmit={action('click')}
      style={style}
    />
  );
}

function Container() {
  const [current, setCurrent] = useState(0);
  const [formData, setFormData] = useState(addPipelineTemplate);

  return (
    <AddPipelineForm
      formData={formData}
      algorithms={['a1', 'a2']}
      pipelines={['p1', 'p2']}
      onSubmit={action('click')}
      onChange={setFormData}
      onStep={setCurrent}
      step={current}
    />
  );
}

storiesOf('Basics|AddPipeline', module).add('Default', () => (
  <Provider store={store}>
    <DrawerContainer visible={true} operation={'Add Pipeline'}>
      <AddPipelineReact onSubmit={() => {}} />
    </DrawerContainer>
  </Provider>
));

storiesOf('Basics|AddPipeline/Form', module).add('Default', () => (
  <Provider store={store}>
    <Container />
  </Provider>
));

storiesOf('Basics|AddPipeline/Steps', module)
  .add('Default', () => (
    <Provider store={store}>
      <AddPipelineContainer />
    </Provider>
  ))
  .add('Sidebar', () => (
    <Provider store={store}>
      <DrawerContainer visible={true} operation={'Add Pipeline'}>
        <AddPipelineContainer />
      </DrawerContainer>
    </Provider>
  ));

AddPipelineContainer.propTypes = {
  style: PropTypes.object
};
