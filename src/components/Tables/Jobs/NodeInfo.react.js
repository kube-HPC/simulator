import React from 'react';
import PropTypes from 'prop-types';

import { useSelector, useDispatch } from 'react-redux';
import { JsonView, Tabs, Card } from 'components/common';
import { getKubernetesLogsData } from 'actions/jobs.action';
import { NodeLogs, NodeInputOutput } from '.';

const DEFAULT_ALGORITHM = {};

const NodeInfo = ({ payload }) => {
  const dataSource = useSelector(state =>
    state.jobsKubernetesLogs.dataSource.map((value, key) => ({ key, ...value }))
  );
  const algorithmTable = useSelector(state => state.algorithmTable.dataSource);

  const algorithmDetails =
    algorithmTable.find(a => a.name === payload.algorithmName) || DEFAULT_ALGORITHM;

  const dispatch = useDispatch();

  return (
    <Tabs defaultActiveKey="1">
      <Tabs.TabPane tab="Logs" key="1">
        <Card>
          <NodeLogs
            dataSource={dataSource}
            taskDetails={
              payload
                ? payload.batch && payload.batch.length
                  ? payload.batch
                  : [{ taskId: payload.taskId }]
                : null
            }
            rerunLogs={(taskId = payload.taskId) => dispatch(getKubernetesLogsData(taskId))}
          />
        </Card>
      </Tabs.TabPane>
      <Tabs.TabPane tab="Algorithm Details" key="2">
        <Card>
          <JsonView jsonObject={algorithmDetails} />
        </Card>
      </Tabs.TabPane>
      <Tabs.TabPane tab="Input Output Details" key="3">
        <NodeInputOutput payload={payload} />
      </Tabs.TabPane>
    </Tabs>
  );
};

NodeInfo.propTypes = {
  payload: PropTypes.object.isRequired
};

export default NodeInfo;
