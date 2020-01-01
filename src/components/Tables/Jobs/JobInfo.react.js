import { Button, Empty } from 'antd';
import { Card, JsonSwitch, Tabs } from 'components/common';
import { useDrawer, useTraceData, useJobs } from 'hooks';
import PropTypes from 'prop-types';
import React, { memo, useState } from 'react';
import styled from 'styled-components';
import JobGraph from './JobGraph.react';
import Trace from './Trace.react';

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

const FullGraph = styled(JobGraph)`
  width: 100%;
`;

const JobInfo = ({ jobId }) => {
  const { dataSource } = useJobs();

  const job = dataSource.find(({ key }) => jobId === key);

  const { key, graph, pipeline, ...rest } = job;
  const [currentTab, setCurrentTab] = useState(TABS.GRAPH);
  const { traceData, fetch } = useTraceData();
  const { isVisible } = useDrawer();

  const refreshButton = currentTab === TABS.TRACE && (
    <Button onClick={() => fetch({ jobId: key })} icon="redo">
      Refresh
    </Button>
  );

  const json = { pipeline, ...rest };

  const tabs = {
    [TABS.GRAPH]: graph ? (
      isVisible && <FullGraph graph={{ ...graph, jobId: key }} pipeline={pipeline} />
    ) : (
      <Card>
        <Empty />
      </Card>
    ),
    [TABS.TRACE]: <Trace data={traceData} />,
    [TABS.JSON]: <JsonSwitch obj={json} options={options} />,
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
  jobId: PropTypes.string.isRequired,
};

export default memo(JobInfo);
