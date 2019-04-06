import React, { useState } from 'react';

import { storiesOf } from '@storybook/react';
import { Button } from 'antd';

import AddAlgorithmModal from 'components/dumb/AddAlgorithmModal.react';

function ModalOnClick() {
  const [isVisible, setVisible] = useState(false);
  const toggleVisible = () => setVisible(!isVisible);
  return (
    <div>
      <Button type="primary" onClick={toggleVisible} icon="plus" />
      <AddAlgorithmModal visible={isVisible} onSubmit={() => {}} toggleVisible={toggleVisible} />
    </div>
  );
}

storiesOf('Basics|AddAlgorithmModal', module)
  .add('Default', () => (
    <AddAlgorithmModal visible={true} onSubmit={() => {}} toggleVisible={() => {}} />
  ))
  .add('Show on button click', () => <ModalOnClick />);
