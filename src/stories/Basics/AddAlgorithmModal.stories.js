import React from 'react';

import { storiesOf } from '@storybook/react';

import AddAlgorithmModal from 'components/dumb/AddAlgorithmModal.react';

storiesOf('Basics|AddAlgorithmModal', module).add('Default', () => (
  <AddAlgorithmModal visible={true} onSubmit={() => {}} toggleVisible={() => {}} />
));
