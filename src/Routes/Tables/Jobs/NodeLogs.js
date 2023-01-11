import PropTypes from 'prop-types';
import React, { useEffect, useMemo, useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import styled from 'styled-components';
import { notification } from 'utils';
import { logModes, podStatus } from '@hkube/consts';
import {
  CopyOutlined,
  LoadingOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import { Button, Select, Tooltip, Spin, Radio, Typography } from 'antd';
import { FiltersPanel } from 'styles';
import { FlexBox } from 'components/common';
import LogsViewer from 'components/common/LogsViewer';
import { useLogs } from 'hooks/graphql';
import OptionBox from './GraphTab/OptionBox';

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

const ErrorMsg = {
  ERROR: 'Algorithm down',
};

const NodeLogs = ({ node, taskDetails }) => {
  const [currentTask, setCurrentTask] = useState(undefined);
  const [logMode, setLogMode] = useState(logModes.ALGORITHM);
  const [isLoadLog, setIsLoadLog] = useState(true);
  const [sourceLogs, setSourceLogs] = useState('k8s');
  const [errorMsgImage, setErrorMsgImage] = useState(undefined);
  const [logErrorNode, setLogErrorNode] = useState([]);

  const oTask = useMemo(
    () => taskDetails.find(t => t.taskId === currentTask) || taskDetails[0],
    [currentTask, taskDetails]
  );
  const { taskId, podName } = oTask;

  const { logs, msgPodStatus } = useLogs({
    taskId: taskId || '',
    podName: podName || '',
    source: sourceLogs,
    nodeKind: node.kind,
    logMode,
  });

  useEffect(() => {
    setCurrentTask(taskId);
    setIsLoadLog(false);
  }, [taskId]);

  useEffect(() => {
    if (msgPodStatus === podStatus.NO_IMAGE)
      setErrorMsgImage('Docker image missing');
  }, [msgPodStatus]);

  const optionsSourceLogs = useMemo(() => {
    let isKubernetesDisabled = false;
    if (msgPodStatus === podStatus.NOT_EXIST) {
      isKubernetesDisabled = true;
      setSourceLogs('es');
    }

    return [
      { label: 'online', value: 'k8s', disabled: isKubernetesDisabled },
      { label: 'saved', value: 'es' },
    ];
  }, [msgPodStatus]);

  const options = taskDetails.map((task, indexTaskItem) => (
    // TODO: implement a better key
    // eslint-disable-next-line
    <Select.Option key={indexTaskItem} value={indexTaskItem}>
      <OptionBox
        index={indexTaskItem + 1}
        taskId={task.taskId}
        status={task.status}
      />
    </Select.Option>
  ));

  useEffect(() => {
    const { error, startTime, endTime } = node;

    if (logs.length === 0) {
      if (error != null) {
        setLogErrorNode([
          {
            level: 'error',
            timestamp: startTime || endTime || null,
            message: error,
          },
        ]);
      }
    }
  }, [logs, node]);

  return (
    <>
      <FiltersPanel>
        <FlexBox justify="start">
          <Typography.Text style={{ marginLeft: '10px' }}>
            Task ID :{' '}
          </Typography.Text>
          <FlexBox.Item>
            <Tooltip
              placement="topLeft"
              title={
                <>
                  <OptionBox index="Index" taskId="Task ID" />{' '}
                  <>Pod Status : {msgPodStatus}</>
                </>
              }>
              <SelectStyle
                disabled={taskDetails.length < 2}
                value={currentTask}
                onSelect={indexSelected => {
                  setCurrentTask(taskDetails[indexSelected].taskId);
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
            <Typography.Text style={{ marginLeft: '10px' }}>
              Source :{' '}
            </Typography.Text>
            <SelectStyle
              defaultValue={logModes.ALGORITHM}
              onChange={value => setLogMode(value)}>
              <Select.Option
                key={logModes.ALGORITHM}
                value={logModes.ALGORITHM}>
                Algorithm
              </Select.Option>
              <Select.Option key={logModes.INTERNAL} value={logModes.INTERNAL}>
                System
              </Select.Option>
              <Select.Option key={logModes.ALL} value={logModes.ALL}>
                All
              </Select.Option>
            </SelectStyle>
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

      <Typography.Text type="danger">
        {' '}
        {ErrorMsg[msgPodStatus] && <InfoCircleOutlined />}{' '}
        {ErrorMsg[msgPodStatus]}
      </Typography.Text>
      <Typography.Text type="danger">
        {' '}
        {errorMsgImage && <InfoCircleOutlined />} {errorMsgImage}{' '}
      </Typography.Text>

      <Container>
        {isLoadLog ? (
          <Spin indicator={LoadingOutlined} />
        ) : (
          <LogsViewer
            dataSource={logs.length > 0 ? logs : logErrorNode}
            id={node?.nodeName ?? ''}
            emptyDescription={
              logMode === logModes.ALGORITHM
                ? 'No algorithm logs'
                : 'No system logs'
            }
          />
        )}
      </Container>
    </>
  );
};

NodeLogs.propTypes = {
  // TODO: detail the props
  // eslint-disable-next-line
  taskDetails: PropTypes.array.isRequired,

  node: PropTypes.shape({
    kind: PropTypes.string,
    nodeName: PropTypes.string,
    error: PropTypes.string,
    startTime: PropTypes.number,
    endTime: PropTypes.number,
  }).isRequired,
};
export default React.memo(NodeLogs);
