import { Button } from 'antd';
import { Card, JsonSwitch, Tabs } from 'components/common';
import { useTraceData } from 'hooks';
import PropTypes from 'prop-types';
import React, { memo, useState } from 'react';
import JobGraphCard from './JobGraphCard.react';
import Trace from './Trace.react';
import styled from 'styled-components';

const TABS = { GRAPH: 'Graph', TRACE: 'Trace', JSON: 'JSON' };
const NoCard = [TABS.GRAPH];

const OverflowContainer = styled(Card)`
  height: 80vh;
`;

const generateTabs = tabs =>
  Object.entries(tabs).map(([key, value]) => (
    <Tabs.TabPane tab={key} key={key}>
      {NoCard.includes(key) ? value : <OverflowContainer>{value}</OverflowContainer>}
    </Tabs.TabPane>
  ));

const options = {
  view: {
    collapsed: '1',
  },
};

const FullGraph = styled(JobGraphCard)`
  height: 300px;
`;

const JobInfo = ({ job }) => {
  const { key, graph, pipeline } = job;
  const [currentTab, setCurrentTab] = useState(TABS.GRAPH);
  const { traceData, fetch, reset } = useTraceData();

  const refreshButton = currentTab === TABS.TRACE && (
    <Button onClick={reset} icon="redo">
      Refresh
    </Button>
  );

  const tabs = {
    [TABS.GRAPH]: <FullGraph graph={{ ...graph, jobId: key }} pipeline={pipeline} />,
    [TABS.TRACE]: <Trace data={traceData} />,
    [TABS.JSON]: <JsonSwitch obj={job} options={options} />,
  };

  const onTabClick = tabKey => tabKey === TABS.TRACE && fetch({ jobId: key });

  return (
    <Tabs
      activeKey={currentTab}
      tabBarExtraContent={refreshButton}
      onChange={setCurrentTab}
      onTabClick={onTabClick}>
      {generateTabs(tabs)}
    </Tabs>
  );
};

JobInfo.propTypes = {
  job: PropTypes.object.isRequired,
};

export default memo(JobInfo);
