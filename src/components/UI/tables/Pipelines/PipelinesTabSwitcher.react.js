import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { Tabs } from 'antd';

import MDViewer from 'components/common/md/MDViewer.react';
import JsonView from 'components/common/json/JsonView.react';
import DefaultMarkdown from 'config/template/readme.template.md';

function PipelinesTabSwitcher({ pipelineDetails, readme }) {
  const [defaultReadme, setDefaultReadme] = useState('');
  useEffect(() => {
    fetch(DefaultMarkdown)
      .then(res => res.text())
      .then(text => setDefaultReadme(text));
  }, []);
  return (
    <Tabs defaultActiveKey="1">
      <Tabs.TabPane tab="JSON" key="1">
        <JsonView jsonObject={pipelineDetails} />
      </Tabs.TabPane>
      <Tabs.TabPane tab="Description" key="2">
        <MDViewer
          name={pipelineDetails.name}
          readme={readme || defaultReadme}
          readmeType={'pipeline'}
        />
      </Tabs.TabPane>
    </Tabs>
  );
}

PipelinesTabSwitcher.propTypes = {
  pipelineDetails: PropTypes.object.isRequired,
  readme: PropTypes.string
};

export default PipelinesTabSwitcher;
