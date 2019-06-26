import React from 'react';
import PropTypes from 'prop-types';

import { Tabs } from 'antd';

// import MDViewer from 'components/common/md/MDViewer.react';
import JsonView from 'components/common/json/JsonView.react';
// import DefaultMarkdown from 'config/template/readme.template.md';

function AlgorithmTabSwitcher({ algorithmDetails, readme }) {
  // const [defaultReadme, setDefaultReadme] = useState('');
  // useEffect(() => {
  //   fetch(DefaultMarkdown)
  //     .then(res => res.text())
  //     .then(text => setDefaultReadme(text));
  // }, []);

  return (
    <Tabs defaultActiveKey="1">
      <Tabs.TabPane tab="JSON" key="1">
        <JsonView jsonObject={algorithmDetails} />
      </Tabs.TabPane>
      {/* <Tabs.TabPane tab="Description" key="2">
        <MDViewer
          name={algorithmDetails.key}
          readme={readme || defaultReadme}
          readmeType={'algorithm'}
        />
      </Tabs.TabPane> */}
    </Tabs>
  );
}

AlgorithmTabSwitcher.propTypes = {
  algorithmDetails: PropTypes.object,
  readme: PropTypes.string
};

export default AlgorithmTabSwitcher;
