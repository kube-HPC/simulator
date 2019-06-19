import React, { useEffect, useState } from 'react';
import { Tabs, Card } from 'antd';
import PropTypes from 'prop-types';
import MDViewer from '../../../containers/md/MDViewer.react';
import DefaultMarkdown from 'config/template/readme.template.md';
import JsonView from '../../../containers/json/JsonView.react';

function PipelinesTabSwitcher({ pipelineDetails, readme }) {
  const [defaultReadme, setDefaultReadme] = useState('');
  useEffect(() => {
    fetch(DefaultMarkdown)
      .then(res => res.text())
      .then(text => setDefaultReadme(text));
  }, []);
  return (
    <Tabs defaultActiveKey="1">
      <Tabs.TabPane tab="Description" key="1">
        <MDViewer
          name={pipelineDetails.name}
          readme={readme || defaultReadme}
          readmeType={'pipeline'}
        />
      </Tabs.TabPane>
      <Tabs.TabPane tab="JSON" key="2">
        <Card title="Descriptor">
          <JsonView jsonObject={pipelineDetails} />
        </Card>
      </Tabs.TabPane>
    </Tabs>
  );
}

PipelinesTabSwitcher.propTypes = {
  pipelineDetails: PropTypes.object.isRequired,
  readme: PropTypes.string
};

export default PipelinesTabSwitcher;
