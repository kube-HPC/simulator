import React, { memo, useCallback, useState, useMemo } from 'react';
import styled from 'styled-components';
import { ifProp } from 'styled-tools';
import { Button, Popover, Input, Menu, Tag, Typography } from 'antd';
import { FlexBox, Icons } from 'components/common';
import { useExperiments } from 'hooks/graphql';
import { schema } from 'hooks/graphql/useExperiments';
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
    getLazyExperiments,
    experiments,
    set: onChange,
    add,
    remove,
    setExperiment,
    experimentId,
  } = useExperiments();
  const [nameExperiment, setNameExperiment] = useState('');
  const [descriptionExperiment, setDescriptionExperiment] = useState('');

  const onAdd = useCallback(
    () =>
      add(nameExperiment, descriptionExperiment, () => {
        getLazyExperiments();
      }),
    [add, descriptionExperiment, getLazyExperiments, nameExperiment]
  );

  const onNameChange = useCallback(
    e => setNameExperiment(e.target.value),
    [setNameExperiment]
  );
  const onDescriptionChange = useCallback(
    e => setDescriptionExperiment(e.target.value),
    [setDescriptionExperiment]
  );

  const onShowAll = useCallback(
    () => setExperiment(schema.SHOW_ALL),
    [setExperiment]
  );

  const menuJson = useMemo(() => {
    const items = [];

    experiments.forEach(({ name, description }, index) => {
      const onRemove = () => {
        remove(name, () => {
          getLazyExperiments();
        });
        if (name === experimentId) {
          onChange(schema.SHOW_ALL);
        }
      };
      const onSelect = () => setExperiment(name);
      const isDisabled = name === experimentId;

      items.push({
        label: (
          <ItemDisabled disabled={isDisabled}>
            <Grow onClick={isDisabled ? NOOP : onSelect}>
              <Tag color={COLOR_EXPERIMENTS[index % COLOR_EXPERIMENTS.length]}>
                {name}
              </Tag>
              <Text type="secondary">{description}</Text>
            </Grow>
            <FlexBox.Item>
              <Icons.Hover onClick={onRemove} type={<MinusOutlined />} />
            </FlexBox.Item>
          </ItemDisabled>
        ),
        key: name,
        disabled: isDisabled,
      });
    });

    items.push({
      label: (
        <FlexBox.Auto>
          <Input onChange={onNameChange} placeholder="Experiment Name" />
          <Input onChange={onDescriptionChange} placeholder="Description" />
          <Icons.Hover onClick={onAdd} type={<PlusOutlined />} />
        </FlexBox.Auto>
      ),
      key: 'DescriptionChange',
      disabled: true,
    });

    items.push({
      label: (
        <Button onClick={onShowAll} block size="small" type="primary">
          Show All
        </Button>
      ),
      key: 'ShowAll',
      disabled: true,
    });

    return items;
  }, [
    experimentId,
    experiments,
    onAdd,
    onChange,
    onDescriptionChange,
    onNameChange,
    onShowAll,
    remove,
    setExperiment,
  ]);

  const menu = (
    <MenuDisabledItems
      items={menuJson}
      selectedKeys={[experimentId]}
      subMenuCloseDelay={0.5}
    />
  );

  const tagColor =
    COLOR_EXPERIMENTS[
      // eslint-disable-next-line
      experiments.findIndex(({ name }) => name === experimentId) %
        COLOR_EXPERIMENTS.length
    ] || COLOR.blueLight;

  return (
    <Popover content={menu} overlayStyle={overflow} placement="bottomRight">
      <BigTag color={tagColor}>{experimentId}</BigTag>
    </Popover>
  );
};

export default memo(ExperimentPicker);
