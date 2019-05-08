import React from 'react';

import { storiesOf } from '@storybook/react';

import AddAlgorithmForm from 'components/UI/operations/AddAlgorithm.react';

storiesOf('Basics|AddAlgorithmModal', module).add('Default', () => (
  <AddAlgorithmForm
    visible={true}
    onSubmit={() => {}}
    toggleVisible={() => {}}
  />
));
