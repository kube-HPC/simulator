import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import AddPipeline from 'components/UI/Layout/SidebarOperations/AddPipeliene/AddPipeline.react';

const content = {
  algorithms: ['a1', 'a2'],
  pipelines: ['p1', 'p2'],
  onSubmit: action('click')
};

function Counter() {
  const [counter, setCounter] = useState(0);
  return (
    <>
      <h1>Not losing focus on open sidebar</h1>
      <p>Total Clicks: {counter}</p>
      <button onClick={() => setCounter(counter + 1)}>Click!</button>
    </>
  );
}

storiesOf('UI|SideBarAddPipeline', module).add('Default', () => (
  <>
    <AddPipeline content={content}>
      <Counter />
    </AddPipeline>
  </>
));
