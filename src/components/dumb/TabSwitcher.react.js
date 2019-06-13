import React from 'react';
import { Tabs, Card } from 'antd';
import PropTypes from 'prop-types';
import JobGraph from 'components/smart/JobGraph.react';
import JsonView from 'components/dumb/JsonView.react';
import Trace from 'jaeger-react-trace-component';
import styled from 'styled-components';

const OverflowedCard = styled(Card)`
  overflow: auto;
  height: 50vh;
`;

const generateTabs = tabs =>
  Object.entries(tabs).map(([key, value]) => (
    <Tabs.TabPane tab={key} key={key}>
      <OverflowedCard>{value}</OverflowedCard>
    </Tabs.TabPane>
  ));

function TabSwitcher({ record }) {
  const tabs = {
    Graph: (
      <JobGraph
        graph={{ ...record.graph, jobId: record.key }}
        pipeline={record.record.pipeline}
      />
    ),
    Trace: record.jaeger &&
      Object.keys(record.jaeger[record.key].asMutable()).length !== 0 && (
        <Trace trace={{ data: record.jaeger[record.key] }} />
      ),
    JSON: <JsonView jsonObject={record.record} collapsed={2} />
  };

  return <Tabs defaultActiveKey="1">{generateTabs(tabs)}</Tabs>;
}

TabSwitcher.propTypes = {
  record: PropTypes.object
};

export default TabSwitcher;
