import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Tabs, Card } from 'antd';

import { getKubernetesLogsData } from 'actions/jobs.action';

import JsonView from 'components/containers/json/JsonView.react';
import NodeLogs from './NodeLogs.react';
import NodeInputOutput from './NodeInputOutput.react';

function NodeInfo(props) {
  const { payload } = props;

  const algorithmDetails =
    props.algorithmTable.find(a => a.name === payload.algorithmName) || {};

  return (
    <Tabs defaultActiveKey="1">
      <Tabs.TabPane tab="Logs" key="1">
        <NodeLogs
          log={props.logs.dataSource.asMutable()}
          taskDetails={
            payload
              ? payload.batch && payload.batch.length
                ? payload.batch
                : [{ taskId: payload.taskId }]
              : null
          }
          rerunLogs={(taskId = payload.taskId) =>
            props.getKubernetesLogsData(taskId)
          }
        />
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
}

NodeInfo.propTypes = {
  logs: PropTypes.object,
  algorithmTable: PropTypes.array
};

const mapStateToProps = state => ({
  logs: state.kubernetesLogs,
  algorithmTable: state.algorithmTable.dataSource
});

export default connect(
  mapStateToProps,
  { getKubernetesLogsData }
)(NodeInfo);
