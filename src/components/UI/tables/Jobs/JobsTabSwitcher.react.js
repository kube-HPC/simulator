import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Tabs, Card } from 'antd';

import Trace from 'jaeger-react-trace-component';
import JobGraph from 'components/UI/tables/Jobs/JobGraph.react';
import JsonView from 'components/common/json/JsonView.react';

const OverflowedCard = styled(Card)`
  overflow: auto;
  height: 50vh;
`;

const generateTabs = tabs =>
  Object.entries(tabs).map(([key, value]) => (
    <Tabs.TabPane tab={key} key={key}>
      <OverflowedCard size="small">{value}</OverflowedCard>
    </Tabs.TabPane>
  ));

function JobsTabSwitcher({ record }) {
  const tabs = {
    Graph: (
      <JobGraph
        graph={{ ...record.graph, jobId: record.key }}
        pipeline={record.record.pipeline}
      />
    ),
    Trace: record.jaeger &&
      Object.keys(record.jaeger[record.key]).length !== 0 && (
        <Trace trace={{ data: record.jaeger[record.key] }} />
      ),
    JSON: <JsonView jsonObject={record.record} />
  };

  return <Tabs>{generateTabs(tabs)}</Tabs>;
}

JobsTabSwitcher.propTypes = {
  record: PropTypes.object
};

export default JobsTabSwitcher;
