import React, { useEffect, useMemo } from 'react';
import { Typography, Select } from 'antd';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { TitleStatus } from './getColumns';

function countByKey(node, nameKey) {
  const result = {};
  if (node.batch) {
    node.batch.forEach(obj => {
      const key = obj[nameKey];
      if (!result[key]) {
        result[key] = 1;
      } else {
        result[key]++;
      }
    });
  } else {
    result[node.status] = 1;
  }

  if (result.succeed > 0) {
    if (result?.completed) {
      result.completed += result.succeed;
    } else {
      result.completed = result.succeed;
    }
  }
  return result;
}

const BgStyle = styled.div`
  background: #fbfbfb;
  height: 50px;
`;

const DropdownStyle = styled(Select)`
   {
    margin-left: 10px;
    margin-top: 10px;
    width: 180px;
  }
`;
const SelectText = styled(Typography.Text)`
   {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;

    justify-content: space-between;
    line-height: inherit;
  }
`;
const TextTitleStatus = styled(Typography.Text)`
  width: 50px;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: flex-end;
  align-items: center;
`;

const DropDownNodes = ({ nodes, selectNode, setSelectNode }) => {
  const LabelStatusCount = node => {
    const stNode = node && countByKey(node, 'status');
    const name = node.nodeName;

    return (
      <SelectText>
        <span>{name}</span>{' '}
        <TextTitleStatus>{TitleStatus(stNode, false, true)}</TextTitleStatus>
      </SelectText>
    );
  };

  const items = useMemo(
    () =>
      nodes.map(node => ({
        value: node.nodeName,
        label: LabelStatusCount(node),
      })),
    [nodes]
  );
  const onClickSelectNode = nodeName => {
    setSelectNode(nodeName);
  };
  const filterOption = (input, option) =>
    (option?.value ?? '').toLowerCase().includes(input.toLowerCase());

  useEffect(() => {});

  return (
    <BgStyle>
      <DropdownStyle
        onChange={onClickSelectNode}
        value={selectNode[0]}
        showSearch
        options={items}
        filterOption={filterOption}
      />
    </BgStyle>
  );
};

DropDownNodes.propTypes = {
  nodes: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  selectNode: PropTypes.string.isRequired,
  setSelectNode: PropTypes.func.isRequired,
};

export default DropDownNodes;
