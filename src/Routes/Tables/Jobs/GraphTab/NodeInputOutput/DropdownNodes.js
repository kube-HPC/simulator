import React, { useMemo } from 'react';
import { DownOutlined } from '@ant-design/icons';
import { Dropdown, Space } from 'antd';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { TitleStatus } from './getColumns';

function countByKey(array, nameKey) {
  const result = {};

  array.forEach(obj => {
    const key = obj[nameKey];
    if (!result[key]) {
      result[key] = 1;
    } else {
      result[key]++;
    }
  });

  if (result.succeed > 0) {
    if (result?.completed) {
      result.completed += result.succeed;
    } else {
      result.completed = result.succeed;
    }
  }
  return result;
}

const DropStyle = styled.div`
  font-size: 18px;
  font-weight: bold;

  border-bottom: 1px solid #e6e7e8;
  padding: 10px;
  width: 30%;
  font-size: 20px;
  border-bottom: 1px solid #e6e7e8;
  padding: 10px;

  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-content: center;
  justify-content: space-between;
  align-items: center;
  margin-left: 15px;
`;

const DropDownNodes = ({ nodes, selectNode, setSelectNode }) => {
  const LabelStatusCount = node => {
    const stNode = node?.batch && countByKey(node.batch, 'status');
    const name = node.nodeName;
    const onClickSelectNode = nodeName => {
      setSelectNode(nodeName);
    };
    return (
      <Space onClick={() => onClickSelectNode(name)}>
        {name} {TitleStatus(stNode, false, true)}
      </Space>
    );
  };

  const items = useMemo(
    () =>
      nodes.map(node => ({
        key: node.nodeName,
        label: LabelStatusCount(node),
      })),
    [nodes]
  );

  return (
    <Dropdown menu={{ items }} overlayStyle={{ width: '200px' }}>
      <DropStyle>
        <span>{selectNode}</span> <DownOutlined style={{ fontSize: '16px' }} />
      </DropStyle>
    </Dropdown>
  );
};

DropDownNodes.propTypes = {
  nodes: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  selectNode: PropTypes.string.isRequired,
  setSelectNode: PropTypes.func.isRequired,
};

export default DropDownNodes;
