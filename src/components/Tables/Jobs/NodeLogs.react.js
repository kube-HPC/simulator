import { getKubernetesLogsData } from 'actions/jobs.action';
import { Button, Select, Tag, Tooltip } from 'antd';
import { FlexBox } from 'components/common';
import LogsViewer from 'components/common/LogsViewer/LogsViewer.react';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { notification } from 'utils';

const SelectFull = styled(Select)`
  width: 100%;
`;

const ItemGrow = styled(FlexBox.Item)`
  flex-grow: 1;
`;

const onCopy = () =>
  notification({ message: 'Task ID Copied to clipboard', type: notification.TYPES.SUCCESS });

const OptionBox = ({ index, taskId }) => (
  <FlexBox>
    <FlexBox.Item>
      <Tag>{index}</Tag>
    </FlexBox.Item>
    <FlexBox.Item>{taskId}</FlexBox.Item>
  </FlexBox>
);

OptionBox.propTypes = {
  index: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  taskId: PropTypes.string.isRequired,
};

const NodeLogs = ({ dataSource, taskDetails }) => {
  const [currentTask, setCurrentTask] = useState(undefined);
  const dispatch = useDispatch();

  useEffect(() => {
    const [task] = taskDetails;
    setCurrentTask(task.taskId);
  }, [taskDetails]);

  const options = taskDetails.map((task, index) => (
    <Select.Option key={index} value={index}>
      <OptionBox index={index + 1} taskId={task.taskId} />
    </Select.Option>
  ));

  return (
    <>
      <FlexBox justify="start">
        <ItemGrow>
          <Tooltip placement="topLeft" title={<OptionBox index="Index" taskId="Task ID" />}>
            <SelectFull
              value={currentTask}
              onSelect={index => {
                const { taskId, podName } = taskDetails[index];
                setCurrentTask(taskId);
                dispatch(getKubernetesLogsData({ taskId, podName }));
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
      <br />
      <LogsViewer dataSource={dataSource} />
    </>
  );
};

NodeLogs.propTypes = {
  dataSource: PropTypes.array.isRequired,
  taskDetails: PropTypes.array.isRequired,
};
export default NodeLogs;
