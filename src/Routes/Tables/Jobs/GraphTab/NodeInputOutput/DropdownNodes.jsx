import React, { useEffect, useMemo } from 'react';
import { Select } from 'antd';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { TitleStatus } from './getColumns';

const countByKey = (node, nameKey) => {
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
};

const BgStyle = styled.div`
  background: ${props => props.theme.Styles.jobsGraph.backgroundBarNodesColor};
  height: 50px;
`;

const DropdownStyle = styled(Select)`
  margin-left: 10px;
  margin-top: 10px;
  width: 220px;
`;

const SelectText = styled.span`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  line-height: inherit;
  color: inherit;
`;

const TextTitleStatus = styled.span`
  width: 50px;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: flex-end;
  align-items: center;
`;

const LabelStatusCount = ({ node }) => {
  const stNode = node && countByKey(node, 'status');
  const name = node.nodeName;

  return (
    <SelectText>
      <span>{name}</span>{' '}
      <TextTitleStatus>
        {TitleStatus(stNode, false, true, !!node?.error)}
      </TextTitleStatus>
    </SelectText>
  );
};

const DropDownNodes = ({ nodes, selectNode, setSelectNode }) => {
  const items = useMemo(
    () =>
      nodes.map(node => ({
        value: node.nodeName,
        label: <LabelStatusCount key={node.nodeName} node={node} />,
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
        listHeight={700}
        virtual={false}
      />
    </BgStyle>
  );
};

LabelStatusCount.propTypes = {
  node: PropTypes.object.isRequired,
};

DropDownNodes.propTypes = {
  nodes: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  selectNode: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  setSelectNode: PropTypes.func.isRequired,
};

export default DropDownNodes;
