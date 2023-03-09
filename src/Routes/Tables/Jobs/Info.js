import React, { useCallback, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { RedoOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { JsonSwitch } from 'components/common';
import { useTraceData } from 'hooks';
import GraphTab from './GraphTab';
import Trace from './Trace';
import usePath, { OVERVIEW_TABS as TABS } from './usePath';
import { Tabs } from './styles';
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
  console.log('job', job);
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

  const TabsItemsJson = useMemo(
    () => [
      {
        label: TABS.GRAPH,
        key: TABS.GRAPH,
        children: (
          <GraphTab graph={{ ...graph, jobId: key }} pipeline={pipeline} />
        ),
      },
      {
        label: TABS.TRACE,
        key: TABS.TRACE,
        children: <Trace data={traceData} />,
      },
      {
        label: TABS.INFO,
        key: TABS.INFO,
        children: (
          <JsonSwitch
            tabPosition="top"
            obj={userPipeline}
            options={options}
            jobId={key}
            jsonViewHeaderNode={
              pipeline.flowInputMetadata && <DownloadFlowinput keyValue={key} />
            }
          />
        ),
      },
      {
        label: TABS.MORE_INFO,
        key: TABS.MORE_INFO,
        children: (
          <JsonSwitch
            tabPosition="top"
            obj={pipeline}
            options={options}
            jobId={key}
            jsonViewHeaderNode={
              pipeline.flowInputMetadata && <DownloadFlowinput keyValue={key} />
            }
          />
        ),
      },
    ],
    [graph, key, pipeline, traceData, userPipeline]
  );

  return (
    <Tabs
      items={TabsItemsJson}
      tabPosition="left"
      animated={tabsAnimation}
      activeKey={currentTab}
      tabBarExtraContent={refreshButton}
      onChange={setCurrentTab}
    />
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
