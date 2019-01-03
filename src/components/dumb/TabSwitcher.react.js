
import React, {  Component } from 'react';
import { Tabs, Card } from 'antd';
import ReactJson from 'react-json-view';
import JobGraph from '../containers/JobGraph.react';
import Trace from 'jaeger-react-trace-component';

class TabSwitcher extends Component {
  constructor() {
    super();
    this.state = {
      context: {}
    }
  }
  render() {
    const { record } = this.props;
    return (
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="Graph" key="1">
          <Card>
            <JobGraph graph={{ ...record.graph, jobId: record.key }} />
          </Card>
        </Tabs.TabPane>
        <Tabs.TabPane tab="Trace" key="2">
          <Card>
            {record.jaeger && record.jaeger && Object.keys(record.jaeger[record.key].asMutable()).length !== 0 ?
              <Trace trace={{ data: record.jaeger[record.key] }} context={this.state.context} /> : null
            }
          </Card>
        </Tabs.TabPane>
        <Tabs.TabPane tab="JSON" key="3">
          <Card>
            <ReactJson src={record.record} displayDataTypes={false} displayObjectSize={false} />
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
  }
}


// const TabSwitcher = ({ record }) => {

//   const [context, setContext] = useState({});
//   return (
//     <Tabs defaultActiveKey="1">
//       <Tabs.TabPane tab="Graph" key="1">
//         <Card>
//           <JobGraph graph={{ ...record.graph, jobId: record.key }} />
//         </Card>
//       </Tabs.TabPane>
//       <Tabs.TabPane tab="Trace" key="2">
//         <Card>
//           {record.jaeger && record.jaeger && Object.keys(record.jaeger[record.key].asMutable()).length !== 0 ?
//             <Trace trace={{ data: record.jaeger[record.key] }} context={context} /> : null
//           }
//         </Card>
//       </Tabs.TabPane>
//       <Tabs.TabPane tab="JSON" key="3">
//         <Card>
//           <ReactJson src={record.record} displayDataTypes={false} displayObjectSize={false} />
//         </Card>
//       </Tabs.TabPane>
//       {/* <Tabs.TabPane tab="Details" key="2">
//       <Card >
//         <Trace/> */}
//       {/* <ReactJson src={record}/> */}
//       {/* </Card>
//     </Tabs.TabPane> */}
//     </Tabs>


//   );
// }

/*   <Trace trace={{ data: record.jaeger.asMutable() }}/> */

export default TabSwitcher;
