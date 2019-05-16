import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { Button } from 'antd';

import AddPipeline from 'components/UI/operations/AddPipeline.react';
import DrawerContainer from 'components/dumb/DrawerContainer.react';

const content = {
  algorithms: ['a1', 'a2'],
  pipelines: ['p1', 'p2'],
  onSubmit: action('click')
};

function DrawerAddPipeline() {
  const [visible, setVisible] = useState(false);
  return (
    <>
      <Button onClick={() => setVisible(!visible)}>Open Drawer</Button>
      <DrawerContainer visible={visible} onClose={() => setVisible(!visible)}>
        <AddPipeline {...content} />
      </DrawerContainer>
    </>
  );
}

storiesOf('UI|DrawerContainer', module).add('Default', () => (
  <DrawerAddPipeline />
));
