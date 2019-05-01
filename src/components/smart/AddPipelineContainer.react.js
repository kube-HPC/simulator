import React, { useState } from 'react';
import PropTypes from 'prop-types';

import AddPipelineSteps from 'components/dumb/AddPipeline/AddPipelineSteps.react';
import JsonEditor from 'components/dumb/JsonEditor.react';

import template from 'config/template/addPipeline.template';

import { stringify } from 'utils/string';
import { Tabs, Card, Button } from 'antd';

export default function AddPipelineContainer({ content }) {
  const [json, setJson] = useState(stringify(template));

  const Component = (
    <Tabs>
      <Tabs.TabPane tab="Wizard" key="1">
        <AddPipelineSteps {...content} style={{ width: '120vh' }} />
      </Tabs.TabPane>
      <Tabs.TabPane tab="Json Editor" key="3">
        <Card
          style={{ width: '90%', margin: '0 auto' }}
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
          <JsonEditor value={json} onChange={setJson} style={{ height: '80vh' }} />
        </Card>
      </Tabs.TabPane>
    </Tabs>
  );

  return Component;
}

AddPipelineContainer.propTypes = {
  style: PropTypes.object
};
