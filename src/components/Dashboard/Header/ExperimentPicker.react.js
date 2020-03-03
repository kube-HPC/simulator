import { Button, Dropdown, Input, Menu, Tag, Typography } from 'antd';
import { FlexBox, Icons } from 'components/common';
import { experimentsSchema } from 'config';
import { useExperiments } from 'hooks';
import React, { memo, useCallback, useState } from 'react';
import styled from 'styled-components';
import { ifProp } from 'styled-tools';
import { COLOR, COLOR_EXPERIMENTS } from 'styles/colors';

const BigTag = styled(Tag)`
  line-height: 30px;
  height: 32px;
  font-size: 14px;
  padding: 0px 10px;
  cursor: pointer;
  margin: unset;
`;

const MenuDisabledItems = styled(Menu)`
  .ant-dropdown-menu-item-disabled {
    cursor: default;
  }
`;

const ItemDisabled = styled(FlexBox)`
  cursor: ${ifProp(`disabled`, `not-allowed`, `pointer`)};
`;

const Grow = styled(FlexBox.Item)`
  flex-grow: 1;
`;

const overflow = { height: 500, overflow: `auto` };
const NOOP = () => {};

const { Text } = Typography;

const ExperimentPicker = () => {
  const { experiments, value, set: onChange, add, remove } = useExperiments();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const onAdd = useCallback(() => add({ name, description }), [add, description, name]);

  const onNameChange = useCallback(({ target: { value } }) => setName(value), []);
  const onDescriptionChange = useCallback(({ target: { value } }) => setDescription(value), []);
  const onShowAll = useCallback(() => onChange(experimentsSchema.showAll), [onChange]);

  const menu = (
    <MenuDisabledItems selectedKeys={[value]} subMenuCloseDelay={0.5}>
      {experiments.map(({ name, description }, index) => {
        const onRemove = () => {
          remove(name);
          if (name === value) {
            onChange(experimentsSchema.showAll);
          }
        };
        const onSelect = () => onChange(name);
        const isDisabled = name === value;

        return (
          <Menu.Item key={name} disabled={isDisabled}>
            <ItemDisabled disabled={isDisabled}>
              <Grow onClick={isDisabled ? NOOP : onSelect}>
                <Tag color={COLOR_EXPERIMENTS[index % COLOR_EXPERIMENTS.length]}>{name}</Tag>
                <Text type="secondary">{description}</Text>
              </Grow>
              <FlexBox.Item>
                <Icons.Hover onClick={onRemove} type="minus" />
              </FlexBox.Item>
            </ItemDisabled>
          </Menu.Item>
        );
      })}
      <Menu.Divider />
      <Menu.Item disabled>
        <FlexBox.Auto>
          <Input onChange={onNameChange} placeholder="Experiment Name" />
          <Input onChange={onDescriptionChange} placeholder="Description" />
          <Icons.Hover onClick={onAdd} type="plus" />
        </FlexBox.Auto>
      </Menu.Item>
      <Menu.Item>
        <Button onClick={onShowAll} block size="small" type="primary">
          Show All
        </Button>
      </Menu.Item>
    </MenuDisabledItems>
  );

  const tagColor =
    COLOR_EXPERIMENTS[
      experiments.findIndex(({ name }) => name === value) % COLOR_EXPERIMENTS.length
    ] || COLOR.blueLight;

  return (
    <Dropdown overlay={menu} overlayStyle={overflow}>
      <BigTag color={tagColor}>{value}</BigTag>
    </Dropdown>
  );
};

export default memo(ExperimentPicker);
