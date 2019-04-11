import React, { useState } from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { Modal } from 'antd';

import FloatingAddButton from 'components/dumb/FloatingAddButton.react';

function CardWithState() {
  const [isVisible, setVisible] = useState(false);
  const triggerVisible = () => setVisible(!isVisible);

  return (
    <div>
      <FloatingAddButton onClick={triggerVisible} />
      <Modal visible={isVisible} onOk={triggerVisible} onCancel={triggerVisible} />
    </div>
  );
}

storiesOf('Basics|FloatingAddButton', module)
  .add('Default', () => <FloatingAddButton onClick={action('clicked')} />)
  .add('Show card on click', () => <CardWithState />);
