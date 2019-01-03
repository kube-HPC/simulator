
import React,{useState} from 'react';
import { Tabs, Card } from 'antd';
import ReactJson from 'react-json-view';
import JobGraph from '../containers/JobGraph.react';
import Trace from 'jaeger-react-trace-component';

const TabSwitcher = ({ record }) => {
  
  const [context, setContext] = useState({ });
  return(
    <Tabs defaultActiveKey="1">
      <Tabs.TabPane tab="Graph" key="1">
        <Card>
          <JobGraph graph={record.graph}/>
        </Card>
      </Tabs.TabPane>
      <Tabs.TabPane tab="Trace" key="2">
        <Card>
          {record.jaeger&&record.jaeger && Object.keys(record.jaeger[record.key].asMutable()).length !== 0  ? 
            <Trace  trace={{ data: record.jaeger[record.key] }} context ={context} /> : null
          }
        </Card>
      </Tabs.TabPane>
      <Tabs.TabPane tab="JSON" key="3">
        <Card>
          <ReactJson src={record.record} displayDataTypes={false} displayObjectSize={false}/>
        </Card>
      </Tabs.TabPane>
    </Tabs>
  );};

export default TabSwitcher;
