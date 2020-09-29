import { Button } from 'antd';
import { JsonSwitch, Tabs } from 'components/common';
import { useJobs, useTraceData } from 'hooks';
import PropTypes from 'prop-types';
import React, { memo, useState } from 'react';
import styled from 'styled-components';
import JobGraph from './JobGraph.react';
import Trace from './Trace.react';

const TABS = { GRAPH: 'Graph', TRACE: 'Trace', INFO: 'Information' };

const options = {
  view: {
    collapsed: '1',
  },
};

const FullGraph = styled(JobGraph)`
  width: 100%;
`;

const JobInfo = ({ jobId }) => {
  const [currentTab, setCurrentTab] = useState(TABS.GRAPH);
  const { traceData, fetch } = useTraceData();

  const { dataSource } = useJobs();
  const job = dataSource.find(({ key }) => jobId === key);
  const { key, graph, pipeline } = job;

  const refreshButton = currentTab === TABS.TRACE && (
    <Button onClick={() => fetch({ jobId: key })} icon="redo">
      Refresh
    </Button>
  );

  const onTabClick = tabKey => tabKey === TABS.TRACE && fetch({ jobId: key });

  return (
    <Tabs
      activeKey={currentTab}
      tabBarExtraContent={refreshButton}
      onChange={setCurrentTab}
      onTabClick={onTabClick}>
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

JobInfo.propTypes = {
  jobId: PropTypes.string.isRequired,
};

export default memo(JobInfo);
