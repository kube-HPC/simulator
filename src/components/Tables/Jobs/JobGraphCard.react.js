import { Fallback } from 'components/common';
import { cardOptions } from 'config/template/graph-options.template';
import PropTypes from 'prop-types';
import React, { lazy } from 'react';
import styled from 'styled-components';
import { GraphType } from '.';

const Graph = lazy(() => import('react-graph-vis'));

const GraphContainer = styled.div`
  height: 400px;
`;

const singleStatus = s => {
  if (s === GraphType.STATUS.SKIPPED) {
    return GraphType.STATUS.SKIPPED;
  }
  if (s === GraphType.STATUS.SUCCEED) {
    return GraphType.STATUS.COMPLETED;
  }
  if (s === GraphType.STATUS.FAILED) {
    return GraphType.STATUS.FAILED;
  }
  if (s === GraphType.STATUS.CREATING || s === GraphType.STATUS.PENDING) {
    return GraphType.STATUS.NOT_STARTED;
  }
  return GraphType.STATUS.RUNNING;
};

const handleSingle = n => {
  const node = { ...n };
  node.group = singleStatus(n.status);
  return node;
};

const handleBatch = n => {
  const calculatedNode = {
    nodeName: n.nodeName,
    algorithmName: n.algorithmName,
    extra: {},
    group: GraphType.BATCH.NOT_STARTED,
  };
  let completed = 0;
  let group = null;
  if (n.batchInfo.completed === n.batchInfo.total) {
    completed = n.batchInfo.total;
    group = GraphType.BATCH.COMPLETED;
  } else if (n.batchInfo.idle === n.batchInfo.total) {
    completed = 0;
    group = GraphType.BATCH.NOT_STARTED;
  } else {
    completed = n.batchInfo.running + n.batchInfo.completed;
    group = GraphType.BATCH.RUNNING;
  }
  if (n.batchInfo.errors > 0) {
    group = GraphType.BATCH.ERRORS;
  }
  calculatedNode.extra.batch = `${completed}/${n.batchInfo.total}`;
  calculatedNode.group = group;
  return calculatedNode;
};

const handleNode = n => {
  if (!n.batchInfo) {
    return handleSingle(n);
  }
  return handleBatch(n);
};

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
  const group = edges[0];
  const edge = {
    id: `${e.from}->${e.to}`,
    dashes: group === 'waitAny' || group === 'AlgorithmExecution',
  };
  return { ...rest, ...edge, group };
};

const JobGraphCard = ({ graph }) => {
  // On every render define new Graph!
  // Causes 'id already exists' on trying update the nodes.
  const adaptedGraph = {
    edges: [],
    nodes: [],
  };

  const { nodes, edges } = graph;
  nodes && nodes.forEach(n => adaptedGraph.nodes.push(formatNode(n)));
  edges && edges.forEach(e => adaptedGraph.edges.push(formatEdge(e)));

  return (
    <GraphContainer>
      <Fallback>
        <Graph graph={adaptedGraph} options={cardOptions} />
      </Fallback>
    </GraphContainer>
  );
};

JobGraphCard.propTypes = {
  graph: PropTypes.object.isRequired,
  pipeline: PropTypes.object.isRequired,
};

const isSameGraph = (a, b) => a.graph.timestamp === b.graph.timestamp;

export default React.memo(JobGraphCard, isSameGraph);
