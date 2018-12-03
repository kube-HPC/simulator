
import react from 'react';
import { Tabs, Card } from 'antd';
import ReactJson from 'react-json-view';
import JobGraph from './JobGraph';
import Trace from 'jaeger-react-trace-component';
const TabSwitcher = ({ record }) => (
  <Tabs defaultActiveKey="1">
    <Tabs.TabPane tab="Graph" key="1">
      <Card>
        <JobGraph graph={record.graph}/>
      </Card>
    </Tabs.TabPane>
    <Tabs.TabPane tab="Trace" key="2">
      <Card>
        {record.jaeger ? 
          <Trace  trace={{ data: record.jaeger[record.key].asMutable() }}/> : null
        }
      </Card>
    </Tabs.TabPane>
    <Tabs.TabPane tab="JSON" key="3">
      <Card>
        <ReactJson src={record.record}/>
      </Card>
    </Tabs.TabPane>
    {/* <Tabs.TabPane tab="Details" key="2">
      <Card >
        <Trace/> */}
    {/* <ReactJson src={record}/> */}
    {/* </Card>
    </Tabs.TabPane> */}
  </Tabs>


);

/*   <Trace trace={{ data: record.jaeger.asMutable() }}/> */

export default TabSwitcher;
