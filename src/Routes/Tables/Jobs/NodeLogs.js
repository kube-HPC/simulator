import BaseTag from 'components/BaseTag';
import { COLOR_TASK_STATUS } from 'styles/colors';
import { CopyOutlined, LoadingOutlined } from '@ant-design/icons';
import { Button, Select, Tag, Tooltip, Spin, Radio } from 'antd';
import { FiltersPanel } from 'styles';
import { FlexBox } from 'components/common';
import LogsViewer from 'components/common/LogsViewer';
import { useLazyLogs } from 'hooks/graphql';
import PropTypes from 'prop-types';
import React, { useEffect, useMemo, useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import styled from 'styled-components';
import { notification } from 'utils';
import { logModes } from '@hkube/consts';

const Container = styled.div`
  margin-top: 1em;
  height: 78vh;
  flex: 1 1 0%;
  overflow: visible;
`;

const SelectStyle = styled(Select)`
  width: 150px;
`;

const RadioGroupStyle = styled(Radio.Group)`
  margin-top: 10px;
`;

const onCopy = () =>
  notification({
    message: 'Task ID Copied to clipboard',
    type: notification.TYPES.SUCCESS,
  });

const OptionBox = ({ index, taskId, status }) => (
  <FlexBox justify="start">
    <FlexBox.Item>
      <Tag>{index}</Tag>
    </FlexBox.Item>
    <FlexBox.Item>{taskId}</FlexBox.Item>
    <BaseTag status={status} colorMap={COLOR_TASK_STATUS}>
      {status}
    </BaseTag>
  </FlexBox>
);

OptionBox.propTypes = {
  index: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  taskId: PropTypes.string,
  status: PropTypes.string,
};
OptionBox.defaultProps = {
  taskId: null,
  status: null,
};

const NodeLogs = ({
  node,
  taskDetails,
  onChange,
  logs,
  setLogs,
  setPodStatus,
  podStatus,
}) => {
  const { getLogsLazyQuery } = useLazyLogs();

  const [currentTask, setCurrentTask] = useState(undefined);

  const [logMode, setLogMode] = useState(logModes.ALGORITHM);
  const [isLoadLog, setIsLoadLog] = useState(true);

  const [sourceLogs, setSourceLogs] = useState('k8s');

  const optionsSourceLogs = useMemo(() => {
    let isKubernetesDisabled = false;
    if (podStatus === 'NOT_EXIST') {
      isKubernetesDisabled = true;
      setSourceLogs('es');
    }

    return [
      { label: 'Kubernetes', value: 'k8s', disabled: isKubernetesDisabled },
      { label: 'Elastic Search', value: 'es' },
    ];
  }, [podStatus]);

  useEffect(() => {
    const task =
      taskDetails.find(t => t.taskId === currentTask) || taskDetails[0];

    const { taskId, podName } = task;

    //  if (taskId !== currentTask) {
    setCurrentTask(taskId);
    getLogsLazyQuery({
      variables: {
        taskId: taskId || '',
        podName: podName || '',
        source: sourceLogs, //  source || 'k8s',
        nodeKind: node.kind,
        logMode,
      },
    }).then(resLogs => {
      setLogs(resLogs.data.logsByQuery.logs);
      setPodStatus(resLogs.data.logsByQuery.podStatus);
      setIsLoadLog(false);
    });
    // }
  }, [
    currentTask,
    taskDetails,
    getLogsLazyQuery,
    node,
    logMode,
    setLogs,
    setPodStatus,
    sourceLogs,
  ]);

  const options = taskDetails.map((task, index) => (
    // TODO: implement a better key
    // eslint-disable-next-line
    <Select.Option key={index} value={index}>
      <OptionBox index={index + 1} taskId={task.taskId} status={task.status} />
    </Select.Option>
  ));

  return (
    <>
      <FiltersPanel>
        <FlexBox justify="start">
          <FlexBox.Item>
            <Tooltip
              placement="topLeft"
              title={
                <>
                  <OptionBox index="Index" taskId="Task ID" />{' '}
                  <>Pod Status : {podStatus}</>
                </>
              }>
              <SelectStyle
                disabled={taskDetails.length < 2}
                value={currentTask}
                onSelect={index => {
                  const { taskId, podName } = taskDetails[index];
                  onChange(index);
                  setCurrentTask(taskId);
                  getLogsLazyQuery({
                    variables: {
                      taskId: taskId || '',
                      podName: podName || '',
                      source: sourceLogs, // || 'k8s',
                      logMode,
                    },
                  }).then(resLogs => {
                    setLogs(resLogs.data.logsByQuery.logs);
                    setIsLoadLog(false);
                  });
                }}>
                {options}
              </SelectStyle>
            </Tooltip>
          </FlexBox.Item>
          <FlexBox.Item>
            <CopyToClipboard text={currentTask} onCopy={onCopy}>
              <Tooltip title="Copy Task ID to Clipboard">
                <Button icon={<CopyOutlined />} />
              </Tooltip>
            </CopyToClipboard>
          </FlexBox.Item>
          <FlexBox.Item>
            <Tooltip title="select log mode">
              <SelectStyle
                defaultValue={logModes.ALGORITHM}
                onChange={value => setLogMode(value)}>
                <Select.Option
                  key={logModes.ALGORITHM}
                  value={logModes.ALGORITHM}>
                  Algorithm
                </Select.Option>
                <Select.Option
                  key={logModes.INTERNAL}
                  value={logModes.INTERNAL}>
                  Internal
                </Select.Option>
                <Select.Option key={logModes.ALL} value={logModes.ALL}>
                  All
                </Select.Option>
              </SelectStyle>
            </Tooltip>
          </FlexBox.Item>
        </FlexBox>
      </FiltersPanel>

      <RadioGroupStyle
        value={sourceLogs}
        onChange={e => setSourceLogs(e.target.value)}
        optionType="button"
        buttonStyle="solid"
        options={optionsSourceLogs}
      />

      <Container>
        {isLoadLog ? (
          <Spin indicator={LoadingOutlined} />
        ) : (
          <LogsViewer dataSource={logs} id={node?.nodeName ?? ''} />
        )}
      </Container>
    </>
  );
};

NodeLogs.propTypes = {
  // TODO: detail the props
  // eslint-disable-next-line
  taskDetails: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  node: PropTypes.shape({
    kind: PropTypes.string,
    nodeName: PropTypes.string,
  }).isRequired,
  logs: PropTypes.arrayOf(PropTypes.object).isRequired,
  setLogs: PropTypes.func.isRequired,
  podStatus: PropTypes.string.isRequired,
  setPodStatus: PropTypes.func.isRequired,
};
export default React.memo(NodeLogs);
