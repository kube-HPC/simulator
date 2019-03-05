
import React, { Component } from 'react';
import { Tabs, Card } from 'antd';
import isEqual from 'lodash/isEqual';
import PropTypes from 'prop-types';
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

  shouldComponentUpdate(nextProps) {
    const currentPayload = this.props.record;
    const nextPayload = nextProps.record;
    const payloadChange = !isEqual(currentPayload, nextPayload);
    return payloadChange;
  }

  render() {
    const { record } = this.props;
    return (
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="Graph" key="1">
          <Card>
            <JobGraph graph={{ ...record.graph, jobId: record.key }} pipeline={record.record.pipeline} />
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
            <ReactJson src={record.record} collapsed={2} displayDataTypes={false} displayObjectSize={false} name={false} iconStyle="square" enableClipboard={false} />
          </Card>
        </Tabs.TabPane>
      </Tabs>


    );
  }
}

TabSwitcher.propTypes = {
  record: PropTypes.object
};

export default TabSwitcher;
