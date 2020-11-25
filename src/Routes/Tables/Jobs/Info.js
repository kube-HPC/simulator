import React, { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import { JsonSwitch } from 'components/common';
import { useTraceData } from 'hooks';
import GraphTab from './GraphTab';
import Trace from './Trace.react';
import usePath, { OVERVIEW_TABS as TABS } from './usePath';
import { Tabs, Pane } from './styles';

const options = {
  view: {
    collapsed: '1',
  },
};

const tabsAnimation = { inkBar: false, tabPane: false };

const JobInfo = ({ job }) => {
  const { tabKey: currentTab, goTo } = usePath();
  const { traceData, fetch } = useTraceData();
  const setCurrentTab = useCallback(
    nextTabKey => goTo.overview({ nextTabKey }),
    [goTo]
  );
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
      animated={tabsAnimation}
      activeKey={currentTab}
      tabBarExtraContent={refreshButton}
      onChange={setCurrentTab}>
      <Pane tab={TABS.GRAPH} key={TABS.GRAPH}>
        <GraphTab graph={{ ...graph, jobId: key }} pipeline={pipeline} />
      </Pane>
      <Pane tab={TABS.TRACE} key={TABS.TRACE}>
        <Trace data={traceData} />
      </Pane>
      <Pane tab={TABS.INFO} key={TABS.INFO}>
        <JsonSwitch obj={pipeline} options={options} />
      </Pane>
    </Tabs>
  );
};

JobInfo.propTypes = {
  job: PropTypes.shape({
    key: PropTypes.string.isRequired,
    // TODO:: fill missing props
    // eslint-disable-next-line
    graph: PropTypes.any,
    // eslint-disable-next-line
    pipeline: PropTypes.any,
  }).isRequired,
};

export default React.memo(JobInfo);
