import { Empty } from 'antd';
import { Card, Fallback, FallbackComponent, FlexBox } from 'components/common';
import { setOptions as defaultSetOptions } from 'config/template/graph-options.template';
import { useNodeInfo, useSettings } from 'hooks';
import PropTypes from 'prop-types';
import React, { lazy, useEffect, useReducer } from 'react';
import styled from 'styled-components';
import { formatEdge, formatNode } from 'utils';
import NodeInfo from './NodeInfo.react';

const Graph = lazy(() => import(`react-graph-vis`));

const GraphContainer = styled.div`
  pointer-events: ${({ isMinified }) => (!isMinified ? `all` : `none`)};
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

const JobGraph = ({
  graph,
  pipeline,
  setOptions = defaultSetOptions,
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

  const isValidGraph = adaptedGraph.nodes.length !== 0;

  const { node, events } = useNodeInfo({ graph, pipeline });
  const { graphDirection: direction } = useSettings();

  const [showGraph, toggleForceUpdate] = useReducer(p => !p, true);

  useEffect(() => {
    toggleForceUpdate();
    setTimeout(() => {
      toggleForceUpdate();
    }, 500);
  }, [direction]);

  return (
    <FlexBox direction="column" className={className}>
      <FlexBox.Item full>
        <GraphContainer isMinified={isMinified}>
          {isValidGraph ? (
            showGraph ? (
              <Fallback>
                <Graph
                  graph={adaptedGraph}
                  options={setOptions({ direction })}
                  events={events}
                />
              </Fallback>
            ) : (
              <FallbackComponent />
            )
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
  // TODO: fix those props
  /* eslint-disable */
  graph: PropTypes.object.isRequired,
  pipeline: PropTypes.object,
  setOptions: PropTypes.func,
  isMinified: PropTypes.bool,
  className: PropTypes.string,
  /* eslint-enable */
};

const isSameGraph = (a, b) =>
  a.graph && b.graph ? a.graph.timestamp === b.graph.timestamp : true;

export default React.memo(JobGraph, isSameGraph);
