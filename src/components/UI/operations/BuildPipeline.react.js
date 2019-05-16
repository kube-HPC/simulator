import React from 'react';
import PropTypes from 'prop-types';

import GGEditor, { Flow, Item, ItemPanel } from 'gg-editor';

import { ReactComponent as IconNode } from 'images/build-pipeline/node.svg';

import { COLOR } from 'constants/colors';
import { Card } from 'antd';

const data = {
  nodes: [
    {
      type: 'node',
      size: '70*70',
      shape: 'flow-circle',
      color: COLOR.blueLight,
      label: 'test-alg',
      x: 55,
      y: 55,
      id: 'ea1184e8',
      index: 0
    },
    {
      type: 'node',
      size: '70*70',
      shape: 'flow-circle',
      color: COLOR.blueLight,
      label: 'eval-alg',
      x: 55,
      y: 255,
      id: '481fbb1a',
      index: 2
    }
  ],
  edges: [
    {
      source: 'ea1184e8',
      sourceAnchor: 2,
      target: '481fbb1a',
      targetAnchor: 0,
      id: '7989ac70',
      index: 1
    }
  ]
};

function BuildPipeline({ onSubmit, addPipeline }) {
  return (
    <GGEditor>
      <ItemPanel>
        <Item
          type="node"
          size="72*72"
          shape="flow-circle"
          model={{
            type: 'node',
            size: '70*70',
            shape: 'flow-circle',
            color: COLOR.blueLight,
            label: 'test-alg'
          }}
          src="https://gw.alipayobjects.com/zos/rmsportal/ZnPxbVjKYADMYxkTQXRi.svg"
        />
      </ItemPanel>
      <Card>
        <Flow style={{ width: 500, height: 500 }} data={data} />
      </Card>
    </GGEditor>
  );
}

BuildPipeline.propTypes = {
  addPipeline: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
};

export default BuildPipeline;
