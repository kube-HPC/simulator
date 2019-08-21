import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import { Button, Typography } from 'antd';
import Graph from 'react-graph-vis';

import { getKubernetesLogsData, getCaching } from 'actions/jobs.action';
import graphOptions from 'config/template/graph-options.template';

import { BottomContent } from 'components/common';
import { Drawer } from 'components/Drawer';
import { NodeInfo } from '.';

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

const formatNode = n => {
  const node = {
    id: n.nodeName,
    label: n.nodeName
  };
  if (n.extra && n.extra.batch) {
    node.label = `${n.nodeName}-${n.extra.batch}`;
  }
  return { ...n, ...node };
};

const formatEdge = e => {
  const edge = {
    id: `${e.from}->${e.to}`
  };
  if (e.group === 'waitAny' || e.group === 'AlgorithmExecution') {
    edge.dashes = true;
  }
  return { ...e, ...edge };
};

function JobGraph({ graph, pipeline }) {
  const [visible, setVisible] = useState(false);
  const [payload, setPayload] = useState(undefined);

  const dispatch = useDispatch();

  const toggle = () => setVisible(prev => !prev);

  const events = {
    selectNode: event => {
      const {
        nodes: [nodeName]
      } = event;

      if (!nodeName) return;

      const nodeData = graph.nodes.find(findNodeName(nodeName));
      const node = pipeline.nodes.find(findNodeName(nodeName));
      const jobId = pipeline.jobId;
      const taskId =
        nodeData && nodeData.taskId
          ? nodeData.taskId
          : nodeData.batchTasks && nodeData.batchTasks[0].taskId;

      dispatch(getKubernetesLogsData(nodeData.taskId, nodeData.podName));

      setPayload({
        ...nodeData,
        jobId,
        taskId,
        nodeName,
        origInput: node.input,
        batch: nodeData.batchTasks || []
      });

      toggle();
    }
  };

  // On every render define new Graph!
  // Causes 'id already exists' on trying update the nodes.
  const adaptedGraph = {
    edges: [],
    nodes: []
  };

  const { nodes, edges } = graph;
  nodes && nodes.forEach(n => adaptedGraph.nodes.push(formatNode(n)));
  edges && edges.forEach(e => adaptedGraph.edges.push(formatEdge(e)));

  // const { taskId, podName } = payload;
  // const onRefreshClick = () => dispatch(getKubernetesLogsData({taskId, podName}));

  const onRefreshClick = () => dispatch(getKubernetesLogsData(payload.taskId));
  const onSubmitClick = () => payload && dispatch(getCaching(payload.jobId, payload.nodeName));

  return (
    <>
      <Drawer visible={visible} onClose={toggle} title={title}>
        <NodeInfo payload={payload} />
        <BottomContent
          extra={[
            <Button key="redo" icon="redo" onClick={onRefreshClick}>
              Refresh
            </Button>
          ]}
        >
          <Button type="primary" onClick={onSubmitClick}>
            Get Cache
          </Button>
        </BottomContent>
      </Drawer>
      <GraphContainer>
        <Graph graph={adaptedGraph} options={graphOptions} events={events} />
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
