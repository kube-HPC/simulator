import PropTypes from 'prop-types';
import React, { useEffect, useMemo, useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import styled from 'styled-components';
import { notification } from 'utils';
import { logModes } from '@hkube/consts';
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

  const oTask = useMemo(
    () => taskDetails.find(t => t.taskId === currentTask) || taskDetails[0],
    [currentTask, taskDetails]
  );
  const { taskId, podName } = oTask;

  const { logs, podStatus } = useLogs({
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
    if (podStatus === 'NO_IMAGE') setErrorMsgImage('Docker image missing');
  }, [podStatus]);

  const optionsSourceLogs = useMemo(() => {
    let isKubernetesDisabled = false;
    if (podStatus === 'NOT_EXIST') {
      isKubernetesDisabled = true;
      setSourceLogs('es');
    }

    return [
      { label: 'online', value: 'k8s', disabled: isKubernetesDisabled },
      { label: 'saved', value: 'es' },
    ];
  }, [podStatus]);

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
                  <>Pod Status : {podStatus}</>
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
        {ErrorMsg[podStatus] && <InfoCircleOutlined />} {ErrorMsg[podStatus]}
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
            dataSource={logs}
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
  }).isRequired,
};
export default React.memo(NodeLogs);
