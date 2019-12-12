import React, { useState, lazy } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { Button, Typography } from 'antd';
import { getKubernetesLogsData, getCaching } from 'actions/jobs.action';
import graphOptions from 'config/template/graph-options.template';
import { Card, Fallback } from 'components/common';
import { Drawer } from 'components/Drawer';
import { NodeInfo, GraphType } from '.';

const Graph = lazy(() => import('react-graph-vis'));

const { Text, Title, Paragraph } = Typography;

const GraphContainer = styled.div`
  height: 500px;
`;

const title = (
  <>
    <Title>Node Information</Title>
    <Paragraph>
      Check current node <Text code>Logs</Text>,<Text code>Algorithm Details</Text> and
      <Text code>Input Output Info</Text>
    </Paragraph>
  </>
);

const findNodeName = nodeName => node => node.nodeName === nodeName;

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
  }
  else if (n.batchInfo.idle === n.batchInfo.total) {
    completed = 0;
    group = GraphType.BATCH.NOT_STARTED;
  }
  else {
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

function JobGraph({ graph, pipeline }) {
  const [visible, setVisible] = useState(false);
  const [payload, setPayload] = useState({ taskId: undefined });

  const dispatch = useDispatch();
  const getLogs = ({ taskId, podName }) => dispatch(getKubernetesLogsData({ taskId, podName }));
  const toggleVisible = () => setVisible(prev => !prev);

  const events = {
    click: ({ nodes }) => {
      const [nodeName] = nodes;
      if (!nodeName) return;

      const nodeData = graph.nodes.find(findNodeName(nodeName));
      const node = pipeline.nodes.find(findNodeName(nodeName));
      const jobId = pipeline.jobId;
      const taskId =
        nodeData && nodeData.taskId
          ? nodeData.taskId
          : nodeData.batch && nodeData.batch[0].taskId;
      const podName =
        nodeData && nodeData.podName
          ? nodeData.podName
          : nodeData.batch && nodeData.batch[0].podName;

      getLogs({ taskId, podName });

      setPayload({
        ...nodeData,
        jobId,
        taskId,
        nodeName,
        podName,
        origInput: node.input,
        batch: nodeData.batch || [],
      });

      toggleVisible();
    },
  };

  // On every render define new Graph!
  // Causes 'id already exists' on trying update the nodes.
  const adaptedGraph = {
    edges: [],
    nodes: [],
  };

  const { nodes, edges } = graph;
  nodes && nodes.forEach(n => adaptedGraph.nodes.push(formatNode(n)));
  edges && edges.forEach(e => adaptedGraph.edges.push(formatEdge(e)));

  const { taskId, podName, jobId, nodeName } = payload;
  const onRefreshClick = () => getLogs({ taskId, podName });
  const onSubmitClick = () => payload && dispatch(getCaching({ jobId, nodeName }));

  const bottomContent = {
    body: (
      <Button type="primary" onClick={onSubmitClick}>
        Get Cache
      </Button>
    ),
    extra: [
      <Button key="redo" icon="redo" onClick={onRefreshClick}>
        Refresh
      </Button>
    ]
  };

  return (
    <>
      <Drawer
        visible={visible}
        onClose={toggleVisible}
        title={title}
        destroyOnClose
        bottomContent={bottomContent}
      >
        <Card>
          <NodeInfo payload={payload} />
        </Card>
      </Drawer>
      <GraphContainer>
        <Fallback>
          <Graph graph={adaptedGraph} options={graphOptions} events={events} />
        </Fallback>
      </GraphContainer>
    </>
  );
}

JobGraph.propTypes = {
  graph: PropTypes.object.isRequired,
  pipeline: PropTypes.object.isRequired
};

const isSameGraph = (a, b) => a.graph.timestamp === b.graph.timestamp;
export default React.memo(JobGraph, isSameGraph);
