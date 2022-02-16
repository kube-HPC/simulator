import React, { memo, useCallback, useState } from 'react';
import styled from 'styled-components';
import { ifProp } from 'styled-tools';
import { Button, Dropdown, Input, Menu, Tag, Typography } from 'antd';
import { FlexBox, Icons } from 'components/common';
import { useExperiments } from 'hooks';
import { schema } from 'hooks/useExperiments';
import { COLOR, COLOR_EXPERIMENTS } from 'styles/colors';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';

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

const overflow = { maxHeight: `30rem`, overflowY: `auto` };
const NOOP = () => {};

const { Text } = Typography;

const ExperimentPicker = () => {
  const {
    experiments,
    set: onChange,
    add,
    remove,
    setExperiment,
    experimentId,
  } = useExperiments();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const onAdd = useCallback(() => add({ name, description }), [
    add,
    description,
    name,
  ]);

  const onNameChange = useCallback(e => setName(e.target.value), [setName]);
  const onDescriptionChange = useCallback(e => setDescription(e.target.value), [
    setDescription,
  ]);

  const onShowAll = useCallback(() => setExperiment(schema.SHOW_ALL), [
    setExperiment,
  ]);

  const menu = (
    <MenuDisabledItems selectedKeys={[experimentId]} subMenuCloseDelay={0.5}>
      {
        // eslint-disable-next-line
        experiments.map(({ name, description }, index) => {
          const onRemove = () => {
            remove(name);
            if (name === experimentId) {
              onChange(schema.SHOW_ALL);
            }
          };
          const onSelect = () => setExperiment(name);
          const isDisabled = name === experimentId;

          return (
            <Menu.Item key={name} disabled={isDisabled}>
              <ItemDisabled disabled={isDisabled}>
                <Grow onClick={isDisabled ? NOOP : onSelect}>
                  <Tag
                    color={COLOR_EXPERIMENTS[index % COLOR_EXPERIMENTS.length]}>
                    {name}
                  </Tag>
                  <Text type="secondary">{description}</Text>
                </Grow>
                <FlexBox.Item>
                  <Icons.Hover onClick={onRemove} type={<MinusOutlined />} />
                </FlexBox.Item>
              </ItemDisabled>
            </Menu.Item>
          );
        })
      }
      <Menu.Divider />
      <Menu.Item disabled>
        <FlexBox.Auto>
          <Input onChange={onNameChange} placeholder="Experiment Name" />
          <Input onChange={onDescriptionChange} placeholder="Description" />
          <Icons.Hover onClick={onAdd} type={<PlusOutlined />} />
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
      // eslint-disable-next-line
      experiments.findIndex(({ name }) => name === experimentId) %
        COLOR_EXPERIMENTS.length
    ] || COLOR.blueLight;

  return (
    <Dropdown overlay={menu} overlayStyle={overflow}>
      <BigTag color={tagColor}>{experimentId}</BigTag>
    </Dropdown>
  );
};

export default memo(ExperimentPicker);
