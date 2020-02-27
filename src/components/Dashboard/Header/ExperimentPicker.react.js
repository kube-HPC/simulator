import { Dropdown, Menu, Tag, Typography } from 'antd';
import { useExperiments } from 'hooks';
import React, { useCallback } from 'react';
import styled from 'styled-components';

const BigTag = styled(Tag)`
  line-height: 30px;
  height: 32px;
  font-size: 14px;
  padding: 0px 10px;
  cursor: pointer;
  margin: unset;
`;

const { Text } = Typography;

const ExperimentPicker = () => {
  const { experiments, value, set: onChange } = useExperiments();

  const onSelect = useCallback(({ key }) => onChange(key), [onChange]);

  const menu = (
    <Menu selectedKeys={[value]} onClick={onSelect}>
      {experiments.map(({ name, description }) => (
        <Menu.Item key={name}>
          <div>
            <Tag>{name}</Tag>
            <Text type="secondary">{description}</Text>
          </div>
        </Menu.Item>
      ))}
    </Menu>
  );

  return (
    <Dropdown overlay={menu}>
      <BigTag>{value}</BigTag>
    </Dropdown>
  );
};

export default ExperimentPicker;
