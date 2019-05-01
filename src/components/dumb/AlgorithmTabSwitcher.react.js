import React, { Component } from 'react';
import { Tabs, Card } from 'antd';
import ReactJson from 'react-json-view';
import PropTypes from 'prop-types';
import MdViewer from './MdViewer.react';

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
          <MdViewer
            name={algorithmDetails.key}
            readme={readme || this.default}
            readmeType={'algorithm'}
          />
        </Tabs.TabPane>
        <Tabs.TabPane tab="JSON" key="3">
          <Card>
            <ReactJson
              src={algorithmDetails}
              iconStyle="square"
              displayDataTypes={false}
              displayObjectSize={false}
              enableClipboard={false}
            />
          </Card>
        </Tabs.TabPane>
      </Tabs>
    );
  }
}
AlgorithmTabSwitcher.propTypes = {
  algorithmDetails: PropTypes.string.isRequired,
  readme: PropTypes.string.isRequired
};

export default AlgorithmTabSwitcher;
