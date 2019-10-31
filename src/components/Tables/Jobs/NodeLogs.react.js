import React, { useEffect, useState } from 'react';
import { List, Select, Tag, Tooltip, Button } from 'antd';
import Moment from 'react-moment';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { useDispatch } from 'react-redux';
import { getKubernetesLogsData } from 'actions/jobs.action';
import { FlexBox } from 'components/common';
import { COLOR_LOGGER } from 'styles/colors';
import { toUpperCaseFirstLetter, notification } from 'utils';

import { CopyToClipboard } from 'react-copy-to-clipboard';

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
  taskId: PropTypes.string.isRequired
};

const renderItem = log => {
  const description = (
    <FlexBox justify="start">
      {log.timestamp && (
        <FlexBox.Item>
          <Moment format="DD/MM/YY HH:mm:ss">{log.timestamp}</Moment>
        </FlexBox.Item>
      )}
      <FlexBox.Item>{log.message}</FlexBox.Item>
    </FlexBox>
  );

  return (
    <List.Item>
      <List.Item.Meta description={description} />
      {log.timestamp && (
        <Tag color={COLOR_LOGGER[log.level]}>{toUpperCaseFirstLetter(log.level)}</Tag>
      )}
    </List.Item>
  );
};

const NodeLogs = ({ dataSource, taskDetails, ...props }) => {
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

  const header = (
    <FlexBox justify="start">
      <ItemGrow>
        <Tooltip placement="topLeft" title={<OptionBox index="Index" taskId="Task ID" />}>
          <SelectFull
            value={currentTask}
            onSelect={index => {
              const { taskId, podName } = taskDetails[index];
              setCurrentTask(taskId);
              dispatch(getKubernetesLogsData({ taskId, podName }));
            }}
          >
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
  );

  return <List dataSource={dataSource} renderItem={renderItem} header={header} />;
};

NodeLogs.propTypes = {
  dataSource: PropTypes.array.isRequired,
  taskDetails: PropTypes.array.isRequired
};
export default NodeLogs;
