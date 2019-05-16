import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Tabs, Card, Button } from 'antd';
import styled from 'styled-components';

import AddPipelineSteps from 'components/dumb/AddPipeline/AddPipelineSteps.react';
import JsonEditor from 'components/dumb/JsonEditor.react';
import template from 'config/template/addPipeline.template';
import { stringify } from 'utils/string';
import { addPipeline } from 'actions/addPipeline.action';

const CardCenter = styled(Card)`
  width: 100%;
  margin: 0 auto;
`;

function AddPipeline({ onSubmit, addPipeline }) {
  const [json, setJson] = useState(stringify(template));

  return (
    <Tabs>
      <Tabs.TabPane tab="Wizard" key="1">
        <AddPipelineSteps onSubmit={onSubmit} />
      </Tabs.TabPane>
      <Tabs.TabPane tab="Json Editor" key="2">
        <CardCenter
          actions={[
            <Button
              type="primary"
              key="submit"
              onClick={() => {
                addPipeline(JSON.parse(json));
                onSubmit();
              }}
            >
              Submit
            </Button>
          ]}
        >
          <JsonEditor
            width={'100%'}
            height={'60vh'}
            value={json}
            onChange={setJson}
          />
        </CardCenter>
      </Tabs.TabPane>
    </Tabs>
  );
}

AddPipeline.propTypes = {
  addPipeline: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
};

export default connect(
  () => {},
  { addPipeline }
)(AddPipeline);
