import { Empty } from 'antd';
import { Card, FlexBox } from 'components/common';
import { defaultOptions } from 'config/template/graph-options.template';
import { useNodeInfo } from 'hooks';
import PropTypes from 'prop-types';
import React from 'react';
import Graph from 'react-graph-vis';
import styled from 'styled-components';
import { formatEdge, formatNode } from 'utils';
import { NodeInfo } from '.';

const GraphContainer = styled.div`
  pointer-events: ${({ isMinified }) => (!isMinified ? 'all' : 'none')};
  max-width: ${({ isMinified }) => (!isMinified ? `100%` : `40vw`)};
  width: 100%;
`;

const EmptyHeight = styled(Empty)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 136px;
`;

const JobGraph = ({ graph, pipeline, options = defaultOptions, isMinified = false, className }) => {
  // On every render define new Graph!
  // Causes 'id already exists' on trying update the nodes.
  const adaptedGraph = {
    edges: [],
    nodes: [],
  };

  const { nodes = [], edges = [] } = graph;
  nodes.forEach(n => adaptedGraph.nodes.push(formatNode(n)));
  edges.forEach(e => adaptedGraph.edges.push(formatEdge(e)));

  const isValidGraph = adaptedGraph.nodes.length !== 0;

  const { node, events } = useNodeInfo({ graph, pipeline });

  return (
    <FlexBox direction="column" className={className}>
      <FlexBox.Item full>
        <GraphContainer isMinified={isMinified}>
          {isValidGraph ? (
            <Graph graph={adaptedGraph} options={options} events={events} />
          ) : (
            <EmptyHeight image={Empty.PRESENTED_IMAGE_SIMPLE} />
          )}
        </GraphContainer>
      </FlexBox.Item>
      <FlexBox.Item full>
        {!isMinified && isValidGraph && (
          <Card>
            <NodeInfo node={node} jobId={graph.jobId} />
          </Card>
        )}
      </FlexBox.Item>
    </FlexBox>
  );
};

JobGraph.propTypes = {
  graph: PropTypes.object.isRequired,
  pipeline: PropTypes.object.isRequired,
  options: PropTypes.object,
  isMinified: PropTypes.bool,
  className: PropTypes.string,
};

const isSameGraph = (a, b) => (a.graph && b.graph ? a.graph.timestamp === b.graph.timestamp : true);

export default React.memo(JobGraph, isSameGraph);
