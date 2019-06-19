import React, { Component } from 'react';
import { Tabs, Card } from 'antd';
import PropTypes from 'prop-types';
import MDViewer from '../../../containers/md/MDViewer.react';
import JsonView from '../../../containers/json/JsonView.react';

class AlgorithmTabSwitcher extends Component {
  constructor() {
    super();
    this.state = {
      context: {}
    };
  }

  default = `
 # [ Name ]
  ## Description
  ### a short description that explains about the algorithms

  ## API Description
  \`\`\`([input a],[input b]) \`\`\` algorithm api description about the expected input and outputs
   - \`[input a]([type])\` - description about input a
   - \`[input b]([type])\` - description about input b
     ### Example
  ### input
  \`([1],[2])\`
  ### output
  \`\`\`
  res:{
      a:5,
      b:6
  }
  \`\`\`\`
  `;
  render() {
    const { algorithmDetails, readme } = this.props;
    return (
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="Description" key="1">
          <MDViewer
            name={algorithmDetails.key}
            readme={readme || this.default}
            readmeType={'algorithm'}
          />
        </Tabs.TabPane>
        <Tabs.TabPane tab="JSON" key="3">
          <Card>
            <JsonView jsonObject={algorithmDetails} />
          </Card>
        </Tabs.TabPane>
      </Tabs>
    );
  }
}
AlgorithmTabSwitcher.propTypes = {
  algorithmDetails: PropTypes.object,
  readme: PropTypes.string
};

export default AlgorithmTabSwitcher;
