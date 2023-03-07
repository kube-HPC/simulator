import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { selectors } from 'reducers';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import styled from 'styled-components';
import { notification } from 'utils';
import { logModes, podStatus } from '@hkube/consts';
import {
  CopyOutlined,
  LoadingOutlined,
  InfoCircleOutlined,
  LinkOutlined,
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
} from 'antd';
import { FiltersPanel } from 'styles';
import { FlexBox } from 'components/common';
import LogsViewer from 'components/common/LogsViewer';
import { useLogs } from 'hooks/graphql';
import { useDebounceCallback } from '@react-hook/debounce';
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

const NodeLogs = ({ node, taskDetails }) => {
  const { kibanaUrl } = useSelector(selectors.connection);
  const [currentTask, setCurrentTask] = useState(undefined);
  const [logMode, setLogMode] = useState(logModes.ALGORITHM);
  const [searchWord, setSearchWord] = useState(null);
  const [isLoadLog, setIsLoadLog] = useState(true);
  const [sourceLogs, setSourceLogs] = useState('k8s');
  const [errorMsgImage, setErrorMsgImage] = useState(undefined);
  const [logErrorNode, setLogErrorNode] = useState([]);
  const [linkKibana, setLinkKibana] = useState();

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
    searchWord,
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
    console.log(logs, node);
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

  const setWord = useCallback(
    e => {
      const time = node.startTime
        ? new Date(new Date(node.startTime) - 20000).toISOString()
        : new Date(new Date() - 20000).toISOString();
      const cTaskId = currentTask || taskId;
      const word = e?.target?.value || '';
      setSearchWord(word);
      setLinkKibana(
        `${kibanaUrl}app/kibana#/discover?_g=(filters:!(),refreshInterval:(pause:!t,value:0),time:(from:'${time}',to:now))&_a=(columns:!(_source),filters:!(('$state':(store:appState),meta:(alias:!n,disabled:!f,index:'37127fd0-9ff3-11ea-b971-21eddb3a470d',key:meta.internal.taskId,negate:!f,params:(query:${cTaskId}),type:phrase),query:(match:(meta.internal.taskId:(query:${cTaskId},type:phrase))))),index:'37127fd0-9ff3-11ea-b971-21eddb3a470d',interval:auto,query:(language:lucene${
          word ? `,query:${word}` : ''
        }),sort:!(!('@timestamp',desc)))`
      );
    },
    [currentTask, kibanaUrl, node.startTime, taskId]
  );

  const handleSearchWord = useDebounceCallback(setWord, 1000, false);

  useEffect(() => {
    setWord();
  }, [currentTask, setWord]);

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
      <RadioGroupStyle>
        <Row justify="start" align="middle">
          <Col span={5}>
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
                <Input placeholder="Search Logs" onChange={handleSearchWord} />
              </Col>
              <Col span={1}>
                <LinkOutlined style={{ marginLeft: '7px' }} />
              </Col>
              <Col span={1}>
                <Button title="Search in Kibana">
                  <IconKibana onClick={() => window.open(linkKibana)} />
                </Button>
              </Col>
            </>
          )}
        </Row>
      </RadioGroupStyle>

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
