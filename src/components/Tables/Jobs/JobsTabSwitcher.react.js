import React from 'react';
import PropTypes from 'prop-types';
import Trace from 'jaeger-react-trace-component';
import { Tabs, Card, JsonView } from 'components/common';
import { JobGraph } from '.';

const generateTabs = tabs =>
  Object.entries(tabs).map(([key, value]) => (
    <Tabs.TabPane tab={key} key={key}>
      <Card>{value}</Card>
    </Tabs.TabPane>
  ));

const tabsAnimation = { inkBar: true, tabPane: false };

const JobsTabSwitcher = ({ record }) => {
  const tabs = {
    Graph: (
      <JobGraph graph={{ ...record.graph, jobId: record.key }} pipeline={record.record.pipeline} />
    ),
    Trace: record.jaeger && Object.keys(record.jaeger[record.key]).length !== 0 && (
      <Trace trace={{ data: record.jaeger[record.key] }} />
    ),
    JSON: <JsonView jsonObject={record.record} />
  };

  return <Tabs animated={tabsAnimation}>{generateTabs(tabs)}</Tabs>;
};

JobsTabSwitcher.propTypes = {
  record: PropTypes.object.isRequired
};

export default JobsTabSwitcher;
