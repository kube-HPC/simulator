import React, { useEffect, useState } from 'react';
import { List, Select, Tag } from 'antd';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { useDispatch } from 'react-redux';
import { getKubernetesLogsData } from 'actions/jobs.action';

const SelectFull = styled(Select)`
  width: 100%;
`;

const NodeLogs = ({ dataSource, ...props }) => {
  const [currentTaskId, setCurrentTaskId] = useState(undefined);

  const dispatch = useDispatch();

  useEffect(() => {
    setCurrentTaskId(props.taskDetails[0].taskId);
  }, [props.taskDetails]);

  const options =
    props &&
    props.taskDetails &&
    props.taskDetails.map((task, index) => (
      <Select.Option key={index} value={task.taskId}>
        <Tag>{`${index + 1}`}</Tag> {task.taskId}
      </Select.Option>
    ));

  const renderItem = log => (
    <List.Item>
      <List.Item.Meta description={log.message} />
    </List.Item>
  );

  const header = (
    <SelectFull
      value={currentTaskId}
      onSelect={taskId => {
        setCurrentTaskId(taskId);
        dispatch(getKubernetesLogsData(taskId));
      }}
    >
      {options}
    </SelectFull>
  );

  return <List dataSource={dataSource} renderItem={renderItem} header={header} />;
};

NodeLogs.propTypes = {
  dataSource: PropTypes.array.isRequired,
  taskDetails: PropTypes.array.isRequired
};
export default NodeLogs;
