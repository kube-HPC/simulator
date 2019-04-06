import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import { Button, Welcome } from '@storybook/react/demo';

import LiveJson from 'components/dumb/JsonEditor.react';
import AddButton from 'components/dumb/AddButton.react';
import addPipelineTemplate from 'config/addPipeline.template.json';
import { stringify } from 'utils';

storiesOf('Welcome', module).add('to Storybook', () => <Welcome showApp={linkTo('Button')} />);

storiesOf('Button', module)
  .add('with text', () => <Button onClick={action('clicked')}>Hello Button</Button>)
  .add('with some emoji', () => (
    <Button onClick={action('clicked')}>
      <span role="img" aria-label="so cool">
        😀 😎 👍 💯
      </span>
    </Button>
  ));

// storiesOf('UI|Layout/Desktop', module).add('SideBar');

storiesOf('Features', module)
  .add('JsonEditor', () => <LiveJson value={stringify(addPipelineTemplate)} onChange={() => {}} />)
  .add('AddButton', () => <AddButton />);
