import React, { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import { JsonSwitch } from 'components/common';
import { useTraceData } from 'hooks';
import GraphTab from './GraphTab';
import Trace from './Trace';
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
  const { key, graph, userPipeline = {}, pipeline } = job;
  const algorithms = pipeline.nodes.map(n => n.algorithmName);
  const fetchJobTrace = useCallback(() => fetch({ jobId: key, algorithms }), [
    algorithms,
    fetch,
    key,
  ]);

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
      <Tabs.TabPane tab={TABS.TRACE} key={TABS.TRACE}>
        <Trace data={traceData} />
      </Tabs.TabPane>
      <Tabs.TabPane tab={TABS.INFO} key={TABS.INFO}>
        <JsonSwitch obj={userPipeline} options={options} jobId={key} />
      </Tabs.TabPane>
      <Tabs.TabPane tab={TABS.MORE_INFO} key={TABS.MORE_INFO}>
        <JsonSwitch obj={pipeline} options={options} jobId={key} />
      </Tabs.TabPane>
    </Tabs>
  );
};

JobInfo.propTypes = {
  job: PropTypes.shape({
    key: PropTypes.string.isRequired,
    // TODO:: fill missing props
    /* eslint-disable */
    graph: PropTypes.any,
    userPipeline: PropTypes.object,
    pipeline: PropTypes.any,
    /* eslint-enable */
  }).isRequired,
};

export default React.memo(JobInfo);
