import React, { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { RedoOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { JsonSwitch } from 'components/common';
import { useTraceData } from 'hooks';
import GraphTab from './GraphTab';
import Trace from './Trace';
import usePath, { OVERVIEW_TABS as TABS } from './usePath';
import { Tabs, PaneRow, PanePadding } from './styles';
import DownloadFlowinput from './DownloadFlowinput';

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
    fetch,
    key,
  ]);

  const refreshButton = currentTab === TABS.TRACE && (
    <Button onClick={fetchJobTrace} icon={<RedoOutlined />}>
      Refresh
    </Button>
  );

  useEffect(() => {
    if (currentTab === TABS.TRACE) fetchJobTrace();
  }, [currentTab, fetchJobTrace]);

  return (
    <Tabs
      tabPosition="left"
      animated={tabsAnimation}
      activeKey={currentTab}
      tabBarExtraContent={refreshButton}
      onChange={setCurrentTab}>
      <PaneRow tab={TABS.GRAPH} key={TABS.GRAPH}>
        <GraphTab graph={{ ...graph, jobId: key }} pipeline={pipeline} />
      </PaneRow>
      <PanePadding tab={TABS.TRACE} key={TABS.TRACE}>
        <Trace data={traceData} />
      </PanePadding>
      <PanePadding tab={TABS.INFO} key={TABS.INFO}>
        <JsonSwitch
          tabPosition="top"
          obj={userPipeline}
          options={options}
          jobId={key}
          jsonViewHeaderNode={<DownloadFlowinput keyValue={key} />}
        />
      </PanePadding>
      <PanePadding tab={TABS.MORE_INFO} key={TABS.MORE_INFO}>
        <JsonSwitch
          tabPosition="top"
          obj={pipeline}
          options={options}
          jobId={key}
          jsonViewHeaderNode={<DownloadFlowinput keyValue={key} />}
        />
      </PanePadding>
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
