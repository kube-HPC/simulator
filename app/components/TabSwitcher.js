
import react from 'react';
import { Tabs, Card } from 'antd';
import ReactJson from 'react-json-view';
import JobGraph from './JobGraph';
const TabSwitcher = ({ record }) => (
  <Tabs
        defaultActiveKey="1">
    <Tabs.TabPane tab="Graph" key="1">
      <Card>
        <JobGraph graph={record.graph}/>
      </Card>
    </Tabs.TabPane>
    <Tabs.TabPane tab="Details" key="2">
      <Card >
        <ReactJson src={record}/>
      </Card>
    </Tabs.TabPane>

  </Tabs>
);


export default TabSwitcher;
