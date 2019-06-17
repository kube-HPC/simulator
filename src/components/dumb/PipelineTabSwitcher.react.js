import React, { useEffect, useState } from 'react';
import { Tabs, Card } from 'antd';
import PropTypes from 'prop-types';
import MdViewer from './MdViewer.react';
import DefaultMarkdown from 'config/template/readme.template.md';
import JsonView from './JsonView.react';

function PipelineTabSwitcher({ pipelineDetails, readme }) {
  const [defaultReadme, setDefaultReadme] = useState('');
  useEffect(() => {
    fetch(DefaultMarkdown)
      .then(res => res.text())
      .then(text => setDefaultReadme(text));
  }, []);
  return (
    <Tabs defaultActiveKey="1">
      <Tabs.TabPane tab="Description" key="1">
        <MdViewer
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

PipelineTabSwitcher.propTypes = {
  pipelineDetails: PropTypes.object.isRequired,
  readme: PropTypes.string
};

export default PipelineTabSwitcher;
