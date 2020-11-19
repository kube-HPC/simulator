import React, { useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { Button } from 'antd';
import { JsonSwitch, Tabs } from 'components/common';
import { useJobs, useTraceData } from 'hooks';
import JobGraph from './JobGraph.react';
import Trace from './Trace.react';
import usePath, { OVERVIEW_TABS as TABS } from './usePath';

const options = {
  view: {
    collapsed: '1',
  },
};

const FullGraph = styled(JobGraph)`
  width: 100%;
`;

const JobInfo = () => {
  const { tabKey: currentTab, goTo, jobId } = usePath();
  const { traceData, fetch } = useTraceData();
  const setCurrentTab = useCallback(
    nextTabKey => goTo.overview({ nextTabKey }),
    [goTo]
  );
  const { dataSource } = useJobs();
  const job = dataSource.find(({ key }) => jobId === key);
  const { key, graph, pipeline } = job;

  const fetchJobTrace = useCallback(() => fetch({ jobId: key }), [fetch, key]);

  const refreshButton = currentTab === TABS.TRACE && (
    <Button onClick={fetchJobTrace} icon="redo">
      Refresh
    </Button>
  );

  useEffect(() => {
    if (currentTab === TABS.TRACE) fetchJobTrace();
  }, [currentTab, fetchJobTrace]);

  return (
    <Tabs
      activeKey={currentTab}
      tabBarExtraContent={refreshButton}
      onChange={setCurrentTab}>
      <Tabs.TabPane tab={TABS.GRAPH} key={TABS.GRAPH}>
        <FullGraph graph={{ ...graph, jobId: key }} pipeline={pipeline} />
      </Tabs.TabPane>
      <Tabs.TabPane tab={TABS.TRACE} key={TABS.TRACE}>
        <Trace data={traceData} />
      </Tabs.TabPane>
      <Tabs.TabPane tab={TABS.INFO} key={TABS.INFO}>
        <JsonSwitch obj={pipeline} options={options} />
      </Tabs.TabPane>
    </Tabs>
  );
};

export default React.memo(JobInfo);
