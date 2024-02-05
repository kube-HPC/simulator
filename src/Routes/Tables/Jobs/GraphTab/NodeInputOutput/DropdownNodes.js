import React, { useMemo, useState } from 'react';
import { DownOutlined } from '@ant-design/icons';
import { Dropdown, Typography, Button, Space } from 'antd';
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

const DropdownStyle = styled(Dropdown)`
   {
    margin-left: 10px;
    margin-top: 10px;
    &&.textSelect {
      border-color: #4096ff;
    }
  }
`;
const SelectText = styled(Typography.Text)`
   {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-content: center;
    justify-content: space-between;
    align-items: baseline;
    width: 150px;
  }
`;

const DropDownNodes = ({ nodes, selectNode, setSelectNode }) => {
  const [isOpenDropdown, setIsOpenDropdown] = useState(false);

  const LabelStatusCount = node => {
    const stNode = node && countByKey(node, 'status');

    const name = node.nodeName;
    const onClickSelectNode = nodeName => {
      setSelectNode(nodeName);
    };
    return (
      <SelectText onClick={() => onClickSelectNode(name)}>
        {name} {TitleStatus(stNode, false, true)}
      </SelectText>
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
    <BgStyle>
      <DropdownStyle
        menu={{ items }}
        trigger="click"
        onOpenChange={() => setIsOpenDropdown(prev => !prev)}
        className={isOpenDropdown ? 'textSelect' : ''}>
        <Button>
          <Space>
            {selectNode}
            <DownOutlined />
          </Space>
        </Button>
      </DropdownStyle>
    </BgStyle>
  );
};

DropDownNodes.propTypes = {
  nodes: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  selectNode: PropTypes.string.isRequired,
  setSelectNode: PropTypes.func.isRequired,
};

export default DropDownNodes;
