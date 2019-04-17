import React, { useState } from 'react';
import Sidebar from 'react-sidebar';
import PropTypes from 'prop-types';

import AddPipelineSteps from 'components/dumb/AddPipelineSteps.react';
import FloatingAddButton from 'components/dumb/FloatingAddButton.react';

import JsonEditor from 'components/dumb/JsonEditor.react';

import addPipelineTemplate from 'config/addPipeline.template.json';
import { stringify } from 'utils';

import { Tabs, Card, Button } from 'antd';

export default function AddPipelineContainer({ content }) {
  const [json, setJson] = useState(stringify(addPipelineTemplate));

  const Component = (
    <Tabs>
      <Tabs.TabPane tab="Wizard" key="1">
        <AddPipelineSteps {...content} style={{ width: '120vh' }} />
      </Tabs.TabPane>
      <Tabs.TabPane tab="Json Editor" key="3">
        <Card
          style={{ width: '50%', margin: '0 auto' }}
          actions={[
            <Button
              type="primary"
              key="submit"
              onClick={() => {
                content.onSubmit(JSON.parse(json));
              }}
            >
              Submit
            </Button>
          ]}
        >
          <JsonEditor value={json} onChange={setJson} />
        </Card>
      </Tabs.TabPane>
    </Tabs>
  );

  return Component;
}

AddPipelineContainer.propTypes = {
  style: PropTypes.object
};
