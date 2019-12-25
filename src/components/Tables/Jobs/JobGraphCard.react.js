import { Fallback, FlexBox, Card } from 'components/common';
import { defaultOptions } from 'config/template/graph-options.template';
import PropTypes from 'prop-types';
import React, { lazy } from 'react';
import styled from 'styled-components';
import GraphType from './graphType';
import { NodeInfo } from '.';
import { useNodeInfo } from 'hooks';
import { Empty } from 'antd';

const Graph = lazy(() => import('react-graph-vis'));

const GraphContainer = styled.div`
  pointer-events: ${({ isMinified }) => (!isMinified ? 'all' : 'none')};
  max-width: ${({ isMinified }) => (!isMinified ? `100%` : `40vw`)};
  min-height: 120px;
`;

const { STATUS } = GraphType;

const sameStatus = [STATUS.SKIPPED, STATUS.FAILED];
const completedStatus = [STATUS.SUCCEED];
const notStartedStatus = [STATUS.CREATING, STATUS.PENDING];

const toStatus = status =>
  completedStatus.includes(status)
    ? STATUS.COMPLETED
    : notStartedStatus.includes(status)
      ? STATUS.NOT_STARTED
      : sameStatus.includes(status)
        ? status
        : STATUS.RUNNING;

const handleSingle = node => ({ ...node, group: toStatus(node.status) });

const handleBatch = ({ nodeName, algorithmName, batchInfo }) => {
  const { completed, total, idle, running, errors } = batchInfo;
  let _completed = 0;
  let group = null;
  if (completed === total) {
    _completed = total;
    group = GraphType.BATCH.COMPLETED;
  } else if (idle === total) {
    _completed = 0;
    group = GraphType.BATCH.NOT_STARTED;
  } else {
    _completed = running + completed;
    group = GraphType.BATCH.RUNNING;
  }
  if (errors > 0) {
    group = GraphType.BATCH.ERRORS;
  }
  return {
    nodeName,
    algorithmName,
    extra: {
      batch: `${_completed}/${total}`,
    },
    group,
  };
};

const handleNode = n => (!n.batchInfo ? handleSingle(n) : handleBatch(n));

const formatNode = n => {
  const fn = handleNode(n);
  const node = {
    id: fn.nodeName,
    label: fn.extra && fn.extra.batch ? `${fn.nodeName}-${fn.extra.batch}` : fn.nodeName,
  };
  return { ...fn, ...node };
};

const formatEdge = e => {
  const { edges, ...rest } = e;
  const [group] = edges;
  const edge = {
    id: `${e.from}->${e.to}`,
    dashes: group === 'waitAny' || group === 'AlgorithmExecution',
  };
  return { ...rest, ...edge, group };
};

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

  return (
    <FlexBox direction="column">
      <FlexBox.Item>
        <GraphContainer isMinified={isMinified} className={className}>
          {adaptedGraph.nodes.length === 0 ? (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          ) : (
            <Fallback>
              <Graph graph={adaptedGraph} options={options} events={events} />
            </Fallback>
          )}
        </GraphContainer>
      </FlexBox.Item>
      <FlexBox.Item full>
        {!isMinified && (
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
