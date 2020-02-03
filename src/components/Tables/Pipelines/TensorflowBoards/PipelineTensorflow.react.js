import { Select } from 'antd';
import Text from 'antd/lib/typography/Text';
import { FlexBox } from 'components/common';
import { useBoards } from 'hooks';
import PropTypes from 'prop-types';
import React, { memo, useEffect, useState } from 'react';
import BoardStatus from './BoardStatus.react';

const selectWidth = { width: 400 };

const EMPTY = [];

const getBoards = nodeInfo =>
  (nodeInfo && Object.entries(nodeInfo).filter(([, info]) => info.id)) || EMPTY;

const PipelineTensorflow = ({ name }) => {
  const [selectedNode, setSelectedNode] = useState(null);

  const { nodeMap } = useBoards();

  const nodeInfo = nodeMap[name];
  const boards = getBoards(nodeInfo);

  const hasBoards = boards.length > 0;

  const options = boards.map(([name, node]) => {
    const { id, status } = node;
    return (
      <Select.Option key={id} value={id}>
        <FlexBox.Auto>
          <Text code>{name}</Text>
          <BoardStatus status={status} />
        </FlexBox.Auto>
      </Select.Option>
    );
  });

  useEffect(() => {
    if (!selectedNode) {
      const nodeInfo = nodeMap[name];
      const boards = getBoards(nodeInfo);
      if (boards.length) {
        const [[, first]] = boards;
        setSelectedNode(first.id);
      }
    }
  }, [name, nodeMap, selectedNode]);

  return (
    hasBoards &&
    selectedNode && (
      <FlexBox.Auto>
        <Select value={selectedNode} onSelect={setSelectedNode} style={selectWidth}>
          {options}
        </Select>
        <Text>
          <a href={selectedNode}>Board</a>
        </Text>
      </FlexBox.Auto>
    )
  );
};

PipelineTensorflow.propTypes = {
  name: PropTypes.string.isRequired,
};

export default memo(PipelineTensorflow);
