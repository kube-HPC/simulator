
import React, { Component } from 'react';
import { Tabs, Card } from 'antd';
import ReactJson from 'react-json-view';
import PropTypes from 'prop-types';
import MdViewer from "./MdViewer";
  
class PipelineTabSwitcher extends Component {
    constructor() {
        super();
        this.state = {
            context: {}
        }
        
    }

 default =` 
 # [ Name ]
  ## Description
  ### a short description that explains about the Pipelines 
  
  ## API Description
  \`\`\`([input a],[input b]) \`\`\` Pipeline api description about the expected input and outputs
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
  `
    render() {
        const { pipelineDetails,readme } = this.props;
        return (
          <Tabs defaultActiveKey="1">
            <Tabs.TabPane tab="Description" key="1">
              <MdViewer name ={pipelineDetails.name} readme={readme||this.default} readmeType={'pipeline'}/>
            </Tabs.TabPane>
            <Tabs.TabPane tab="JSON" key="3">
            <Card title="Descriptor">
              <ReactJson
                name={false}
                src={pipelineDetails}
                displayDataTypes={false}
                displayObjectSize={false}
                iconStyle="triangle"
                indentWidth="4"
                collapsed="2"
                enableClipboard={false}
              />
            </Card>
            </Tabs.TabPane>

          </Tabs>


        );
    }
}
PipelineTabSwitcher.propTypes = {
    pipelineDetails: PropTypes.object.isRequired,
    readme: PropTypes.string

};


export default PipelineTabSwitcher;
