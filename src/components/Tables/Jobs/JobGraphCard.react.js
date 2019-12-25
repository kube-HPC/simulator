import { Fallback, FlexBox, Card } from 'components/common';
import { defaultOptions } from 'config/template/graph-options.template';
import PropTypes from 'prop-types';
import React, { lazy } from 'react';
import styled from 'styled-components';
import { useNodeInfo } from 'hooks';
import { Empty } from 'antd';
import { NodeInfo } from '.';
import { formatNode, formatEdge } from 'utils';

const Graph = lazy(() => import('react-graph-vis'));

const GraphContainer = styled.div`
  pointer-events: ${({ isMinified }) => (!isMinified ? 'all' : 'none')};
  max-width: ${({ isMinified }) => (!isMinified ? `100%` : `40vw`)};
  width: 100%;
  min-height: 120px;
`;

const JobGraphCard = ({
  graph,
  pipeline,
  options = defaultOptions,
  isMinified = false,
  className,
}) => {
  // On every render define new Graph!
  // Causes 'id already exists' on trying update the nodes.
  const adaptedGraph = {
    edges: [],
    nodes: [],
  };

  const { nodes = [], edges = [] } = graph;
  nodes.forEach(n => adaptedGraph.nodes.push(formatNode(n)));
  edges.forEach(e => adaptedGraph.edges.push(formatEdge(e)));

  const { node, events } = useNodeInfo({ graph, pipeline });
  const isValidGraph = adaptedGraph.nodes.length !== 0;

  return (
    <FlexBox direction="column" className={className}>
      <FlexBox.Item>
        <GraphContainer isMinified={isMinified}>
          {isValidGraph ? (
            <Fallback>
              <Graph graph={adaptedGraph} options={options} events={events} />
            </Fallback>
          ) : (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          )}
        </GraphContainer>
      </FlexBox.Item>
      <FlexBox.Item full>
        {!isMinified && isValidGraph && (
          <Card>
            <NodeInfo node={node} />
          </Card>
        )}
      </FlexBox.Item>
    </FlexBox>
  );
};

JobGraphCard.propTypes = {
  graph: PropTypes.object.isRequired,
  pipeline: PropTypes.object.isRequired,
  options: PropTypes.object,
  isMinified: PropTypes.bool,
  className: PropTypes.string,
};

const isSameGraph = (a, b) => (a.graph && b.graph ? a.graph.timestamp === b.graph.timestamp : true);

export default React.memo(JobGraphCard, isSameGraph);
