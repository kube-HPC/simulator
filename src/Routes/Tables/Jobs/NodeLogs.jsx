import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { selectors } from 'reducers';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { notification } from 'utils';
import { logModes, podStatus } from '@hkube/consts';
import { COLOR_TASK_STATUS } from 'styles/colors';
import {
  CopyOutlined,
  LoadingOutlined,
  InfoCircleOutlined,
  LinkOutlined,
  DownOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import { ReactComponent as IconKibana } from 'images/kibana.svg';
import {
  Button,
  Select,
  Tooltip,
  Spin,
  Radio,
  Typography,
  Input,
  Col,
  Row,
  Popover,
  Alert,
} from 'antd';
import { FiltersPanel } from 'styles';
import { FlexBox, CopyToClipboard } from 'components/common';
import LogsViewer from 'components/common/LogsViewer';
import { useLogs } from 'hooks/graphql';
import { useDebounceCallback } from '@react-hook/debounce';
import GRAPH_TYPES from './graphUtils/types';

const Container = styled.div`
  margin-top: 1em;
  height: 78vh;
  flex: 1 1 0%;
  overflow: visible;
`;

const SelectStyle = styled(Select)`
  width: 180px;
`;

const RadioGroupStyle = styled.div`
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

const msgAlertFailedScheduling = (typeText, message) => {
  const lines = message.split('\n');
  const [firstLine, ...remainingLines] = lines;

  return (
    <div>
      <p>
        <strong>
          {typeText} : {firstLine}
        </strong>
      </p>
      {remainingLines?.map(line => (
        <div>{line}</div>
      ))}
    </div>
  );
};

const NodeLogs = ({
  node,
  taskDetails,
  NodeInputOutputTable,
  currentTask,
  setCurrentTask,
  sideCarsDetails,
}) => {
  const [openPopupOverListTasks, setOpenPopupOverListTasks] = useState(false);
  const { kibanaUrl, structuredPrefix } = useSelector(selectors.connection);

  const [logMode, setLogMode] = useState(logModes.ALGORITHM);
  const [containerNames, setContainerNames] = useState([]);
  const [searchWord, setSearchWord] = useState(null);
  const [isLoadLog, setIsLoadLog] = useState(true);
  const [sourceLogs, setSourceLogs] = useState('k8s');
  const [errorMsgImage, setErrorMsgImage] = useState(undefined);
  const [logErrorNode, setLogErrorNode] = useState([]);

  const [isStatusFailedScheduling] = useState(
    node?.status === GRAPH_TYPES.STATUS.FAILED_SCHEDULING || false
  );
  const [isStatusFailedSchedulingTask, setIsStatusFailedSchedulingTask] =
    useState(false);

  const oTask = useMemo(
    () => taskDetails?.find(t => t.taskId === currentTask) || taskDetails[0],
    [currentTask, taskDetails]
  );

  const { taskId, podName } = oTask;

  const { logs, msgPodStatus, downloadLogsAsText } = useLogs({
    taskId: taskId || '',
    podName: podName || '',
    source: sourceLogs,
    nodeKind: node.kind,
    logMode,
    searchWord,
    containerNames,
  });

  /**
   * sync selected task
   */
  useEffect(() => {
    if (currentTask !== taskId) {
      setCurrentTask(taskId);
    }
    setIsLoadLog(false);
    setIsStatusFailedSchedulingTask(
      oTask?.status === GRAPH_TYPES.STATUS.FAILED_SCHEDULING || false
    );
  }, [taskId, oTask?.status, currentTask, setCurrentTask]);

  useEffect(() => {
    if (msgPodStatus === podStatus.ALGORUNNER_NO_IMAGE) {
      setErrorMsgImage('Docker image missing');
    }
  }, [msgPodStatus]);

  const optionsSourceLogs = useMemo(() => {
    const isKubernetesDisabled = msgPodStatus === podStatus.NOT_EXIST;

    return [
      { label: 'online', value: 'k8s', disabled: isKubernetesDisabled },
      { label: 'saved', value: 'es' },
    ];
  }, [msgPodStatus]);

  useEffect(() => {
    if (msgPodStatus === podStatus.NOT_EXIST) {
      setSourceLogs('es');
    }
  }, [msgPodStatus]);

  useEffect(() => {
    const { error, startTime, endTime } = node;

    if (logs.length === 0 && error != null) {
      setLogErrorNode([
        {
          level: 'error',
          timestamp: startTime || endTime || null,
          message: error,
        },
      ]);
    }
  }, [logs.length, node]);

  const linkKibana = useMemo(() => {
    if (!kibanaUrl || !taskId) return '';

    const startTime =
      node.batch?.length > 0
        ? node.batch.filter(x => x.taskId === taskId)[0].startTime
        : node.startTime;
    const time = startTime
      ? new Date(new Date(node.startTime) - 20000).toISOString()
      : new Date(new Date() - 20000).toISOString();
    const cTaskId = currentTask || taskId;
    const word = searchWord || '';
    setSearchWord(word);
    let metaPath = 'meta.internal.taskId';
    if (structuredPrefix) {
      metaPath = `${structuredPrefix}.${metaPath}`;
    }

    return `${kibanaUrl}app/kibana#/discover?_g=(filters:!(),refreshInterval:(pause:!t,value:0),time:(from:'${time}',to:now))&_a=(columns:!(_source),filters:!(('$state':(store:appState),meta:(alias:!n,disabled:!f,index:'37127fd0-9ff3-11ea-b971-21eddb3a470d',key:${metaPath},negate:!f,params:(query:'${cTaskId}'),type:phrase),query:(match:(${metaPath}:(query:'${cTaskId}',type:phrase))))),index:'37127fd0-9ff3-11ea-b971-21eddb3a470d',interval:auto,query:(language:lucene${
      word ? `,query:${word}` : ''
    }),sort:!(!('@timestamp',desc)))`;
  }, [
    kibanaUrl,
    taskId,
    node.batch,
    node.startTime,
    currentTask,
    searchWord,
    structuredPrefix,
  ]);

  const setWord = useCallback(e => {
    const word = e?.target?.value || '';
    setSearchWord(word);
  }, []);

  const handleSearchWord = useDebounceCallback(setWord, 1000, false);

  useEffect(() => {
    setWord();
    setOpenPopupOverListTasks(false);
  }, [currentTask, setWord]);

  const handleChangeSelect = (value, option) => {
    if (option.key === logModes.ALL) {
      setContainerNames(sideCarsDetails?.map(obj => obj.container.name));
      setLogMode(option.key);
    } else {
      const sideCarOption = sideCarsDetails?.find(
        sideCar => option.key === sideCar.container.name
      );

      if (sideCarOption) {
        setContainerNames(sideCarOption.container.name);
        setLogMode(logModes.SIDECAR);
      } else {
        setContainerNames([]);
        setLogMode(option.key);
      }
    }
  };

  return (
    <>
      <FiltersPanel>
        <FlexBox justify="start">
          <Typography.Text style={{ marginLeft: '10px' }}>
            Task ID :
          </Typography.Text>

          <FlexBox.Item>
            <Tooltip title={<>Pod Status : {msgPodStatus}</>}>
              <Popover
                placement="bottomLeft"
                content={NodeInputOutputTable}
                trigger="click"
                open={openPopupOverListTasks}
                onOpenChange={setOpenPopupOverListTasks}>
                <Button
                  style={{
                    width: '150px',
                    justifyContent:
                      taskDetails.length < 2 ? 'start' : 'space-between',
                    color: COLOR_TASK_STATUS[oTask.status || node.status],
                  }}
                  shape="round"
                  icon={taskDetails.length < 2 ? '' : <DownOutlined />}
                  disabled={taskDetails.length < 2}>
                  {currentTask || 'Select an item'}
                </Button>
              </Popover>
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
              Source :
            </Typography.Text>

            <SelectStyle
              disabled={
                isStatusFailedSchedulingTask || isStatusFailedScheduling
              }
              defaultValue={logModes.ALGORITHM}
              onChange={handleChangeSelect}>
              <Select.Option
                key={logModes.ALGORITHM}
                value={logModes.ALGORITHM}>
                Algorithm
              </Select.Option>

              <Select.Option key={logModes.INTERNAL} value={logModes.INTERNAL}>
                System
              </Select.Option>

              {sideCarsDetails?.map(sideCar => (
                <Select.Option
                  key={sideCar.container.name}
                  value={sideCar.container.name}>
                  {sideCar.container.name}
                </Select.Option>
              ))}

              <Select.Option key={logModes.ALL} value={logModes.ALL}>
                All
              </Select.Option>
            </SelectStyle>
          </FlexBox.Item>
        </FlexBox>
      </FiltersPanel>

      <RadioGroupStyle>
        {!isStatusFailedSchedulingTask ? (
          <Row justify="start" align="middle">
            <Col span={7}>
              <Radio.Group
                value={sourceLogs}
                onChange={e => setSourceLogs(e.target.value)}
                optionType="button"
                buttonStyle="solid"
                options={optionsSourceLogs}
              />
            </Col>

            {sourceLogs === 'es' && (
              <>
                <Col>
                  <Input
                    placeholder="Search Logs"
                    onChange={handleSearchWord}
                  />
                </Col>
                <Col span={1}>
                  <LinkOutlined style={{ marginLeft: 7 }} />
                </Col>
                <Col span={2}>
                  <Button
                    title="Search in Kibana"
                    disabled={!linkKibana}
                    onClick={() => window.open(linkKibana)}>
                    <IconKibana />
                  </Button>
                </Col>
              </>
            )}

            <Col style={{ marginLeft: 'auto', marginRight: 20 }}>
              <Button
                disabled={logs.length === 0}
                onClick={() => downloadLogsAsText(`TaskID_${taskId}`)}>
                <DownloadOutlined />
              </Button>
            </Col>
          </Row>
        ) : (
          (node?.warnings?.length > 0 && (
            <Alert
              description={msgAlertFailedScheduling(
                'Warning',
                node.warnings[0]
              )}
              type="warning"
              style={{ whiteSpace: 'pre-line' }}
            />
          )) ||
          (node?.error && (
            <Alert
              description={msgAlertFailedScheduling('Error', node.error)}
              type="error"
              style={{ whiteSpace: 'pre-line' }}
            />
          )) ||
          null
        )}
      </RadioGroupStyle>

      <Typography.Text type="danger">
        {ErrorMsg[msgPodStatus] && <InfoCircleOutlined />}
        {ErrorMsg[msgPodStatus]}
      </Typography.Text>

      <Typography.Text type="danger">
        {errorMsgImage && <InfoCircleOutlined />}
        {errorMsgImage}
      </Typography.Text>

      {!isStatusFailedSchedulingTask && (
        <Container>
          {isLoadLog ? (
            <Spin indicator={<LoadingOutlined />} />
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
      )}
    </>
  );
};

NodeLogs.propTypes = {
  taskDetails: PropTypes.array.isRequired,
  NodeInputOutputTable: PropTypes.node.isRequired,
  node: PropTypes.object.isRequired,
  currentTask: PropTypes.string,
  setCurrentTask: PropTypes.func.isRequired,
  sideCarsDetails: PropTypes.arrayOf(PropTypes.object),
};

export default React.memo(NodeLogs);
