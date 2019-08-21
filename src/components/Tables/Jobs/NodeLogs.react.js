import React, { useEffect, useState } from 'react';
import { List, Select, Tag, Tooltip } from 'antd';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { useDispatch } from 'react-redux';
import { getKubernetesLogsData } from 'actions/jobs.action';
import { FlexBox } from 'components/common';
import { COLOR } from 'styles';

const SelectFull = styled(Select)`
  width: 100%;
`;

const OptionBox = ({ index, taskId }) => (
  <FlexBox justify="start">
    <FlexBox.Item>
      <Tag>{index}</Tag>
    </FlexBox.Item>
    <FlexBox.Item>
      <Tag color={COLOR.blueLight}>{taskId}</Tag>
    </FlexBox.Item>
  </FlexBox>
);

OptionBox.propTypes = {
  index: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  taskId: PropTypes.string.isRequired
};

const NodeLogs = ({ dataSource, taskDetails, ...props }) => {
  const [currentTask, setCurrentTask] = useState(undefined);

  const dispatch = useDispatch();

  useEffect(() => {
    const [task] = taskDetails;
    setCurrentTask(task.taskId);
  }, [taskDetails]);

  const options = taskDetails.map((task, index) => (
    <Select.Option key={index} value={task.taskId}>
      <OptionBox index={index + 1} taskId={task.taskId} />
    </Select.Option>
  ));

  const renderItem = log => (
    <List.Item>
      <List.Item.Meta title={log.meta} description={log.message} />
    </List.Item>
  );

  const header = (
    <Tooltip placement="topLeft" title={<OptionBox index="Index" taskId="Task ID" />}>
      <SelectFull
        value={currentTask}
        onSelect={task => {
          setCurrentTask(task);
          dispatch(getKubernetesLogsData(task));
        }}
      >
        {options}
      </SelectFull>
    </Tooltip>
  );

  return <List dataSource={dataSource} renderItem={renderItem} header={header} />;
};

NodeLogs.propTypes = {
  dataSource: PropTypes.array.isRequired,
  taskDetails: PropTypes.array.isRequired
};
export default NodeLogs;
