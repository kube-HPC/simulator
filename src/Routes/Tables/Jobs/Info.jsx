import React, { useCallback, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { RedoOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { JsonSwitch } from 'components/common';
import { useTraceData } from 'hooks';
import { OVERVIEW_JOB_TABS } from 'const';
import { removeNullUndefinedCleanDeep } from 'utils';
import GraphTab from './GraphTab';
import Trace from './Trace';
import usePath from './usePath';
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

  const { key, graph, userPipeline = {}, pipeline } = job;

  const userPipelineView = useMemo(
    () => removeNullUndefinedCleanDeep(userPipeline),
    [userPipeline]
  );
  const pipelineView = useMemo(
    () => removeNullUndefinedCleanDeep(pipeline),
    [pipeline]
  );

  const algorithms = pipeline.nodes.map(n => n.algorithmName);
  const fetchJobTrace = useCallback(
    () => fetch({ jobId: key, algorithms }),
    [fetch, key]
  );

  const refreshButton = currentTab === OVERVIEW_JOB_TABS.TRACE && (
    <Button onClick={fetchJobTrace} icon={<RedoOutlined />}>
      Refresh
    </Button>
  );

  useEffect(() => {
    if (currentTab === OVERVIEW_JOB_TABS.TRACE) fetchJobTrace();
  }, [currentTab, fetchJobTrace]);

  const TabsItemsJson = useMemo(
    () => [
      {
        label: OVERVIEW_JOB_TABS.GRAPH,
        key: OVERVIEW_JOB_TABS.GRAPH,
        children: (
          <GraphTab graph={{ ...graph, jobId: key }} pipeline={pipeline} />
        ),
      },
      {
        label: OVERVIEW_JOB_TABS.TRACE,
        key: OVERVIEW_JOB_TABS.TRACE,
        children: <Trace data={traceData} />,
      },
      {
        label: OVERVIEW_JOB_TABS.INFO,
        key: OVERVIEW_JOB_TABS.INFO,
        children: (
          <JsonSwitch
            tabPosition="top"
            obj={userPipelineView}
            options={options}
            jobId={key}
            jsonViewHeaderNode={
              pipeline.flowInputMetadata && <DownloadFlowinput keyValue={key} />
            }
          />
        ),
      },
      {
        label: OVERVIEW_JOB_TABS.MORE_INFO,
        key: OVERVIEW_JOB_TABS.MORE_INFO,
        children: (
          <JsonSwitch
            tabPosition="top"
            obj={pipelineView}
            options={options}
            jobId={key}
            jsonViewHeaderNode={
              pipeline.flowInputMetadata && <DownloadFlowinput keyValue={key} />
            }
          />
        ),
      },
    ],
    [graph, key, pipeline, pipelineView, traceData, userPipelineView]
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
