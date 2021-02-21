import { Button, Select, Tag, Tooltip } from 'antd';
import { FlexBox } from 'components/common';
import LogsViewer from 'components/common/LogsViewer/LogsViewer.react';
import { useLogs, useSettings } from 'hooks';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import styled from 'styled-components';
import { notification } from 'utils';

const Container = styled.div`
  margin-top: 1em;
  max-height: 22.5em;
  flex: 1;
  overflow: auto;
`;

const SelectFull = styled(Select)`
  width: 100%;
`;

const ItemGrow = styled(FlexBox.Item)`
  flex-grow: 1;
`;

const onCopy = () =>
  notification({
    message: 'Task ID Copied to clipboard',
    type: notification.TYPES.SUCCESS,
  });

const OptionBox = ({ index, taskId }) => (
  <FlexBox justify="start">
    <FlexBox.Item>
      <Tag>{index}</Tag>
    </FlexBox.Item>
    <FlexBox.Item>{taskId}</FlexBox.Item>
  </FlexBox>
);

OptionBox.propTypes = {
  index: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  taskId: PropTypes.string,
};
OptionBox.defaultProps = {
  taskId: null,
};

const NodeLogs = ({ node, taskDetails, onChange }) => {
  const { logs, getLogs } = useLogs();
  const [currentTask, setCurrentTask] = useState(undefined);
  const { logSource: source, logMode } = useSettings();

  useEffect(() => {
    const task =
      taskDetails.find(t => t.taskId === currentTask) || taskDetails[0];
    const { taskId, podName } = task;
    if (taskId !== currentTask) {
      setCurrentTask(taskId);
      getLogs({ taskId, podName, source, nodeKind: node.kind, logMode });
    }
  }, [currentTask, taskDetails, getLogs, source, node, logMode]);

  const options = taskDetails.map((task, index) => (
    // TODO: implement a better key
    // eslint-disable-next-line
    <Select.Option key={index} value={index}>
      <OptionBox index={index + 1} taskId={task.taskId} />
    </Select.Option>
  ));

  return (
    <>
      <FlexBox justify="start">
        <ItemGrow>
          <Tooltip
            placement="topLeft"
            title={<OptionBox index="Index" taskId="Task ID" />}>
            <SelectFull
              value={currentTask}
              onSelect={index => {
                const { taskId, podName } = taskDetails[index];
                onChange(index);
                setCurrentTask(taskId);
                getLogs({ taskId, podName, source, logMode });
              }}>
              {options}
            </SelectFull>
          </Tooltip>
        </ItemGrow>
        <FlexBox.Item>
          <CopyToClipboard text={currentTask} onCopy={onCopy}>
            <Button icon="copy">Copy Task ID to Clipboard</Button>
          </CopyToClipboard>
        </FlexBox.Item>
      </FlexBox>
      <Container>
        <LogsViewer dataSource={logs} />
      </Container>
    </>
  );
};

NodeLogs.propTypes = {
  // TODO: detail the props
  // eslint-disable-next-line
  taskDetails: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  node: PropTypes.shape({ kind: PropTypes.string }).isRequired,
};
export default React.memo(NodeLogs);
