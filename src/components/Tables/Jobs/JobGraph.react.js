import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import { Button, Typography } from 'antd';
import Graph from 'react-graph-vis';

import { getKubernetesLogsData, getCaching } from 'actions/jobs.action';
import graphOptions from 'config/template/graph-options.template';

import { BottomContent, Card } from 'components/common';
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
    label: n.extra && n.extra.batch ? `${n.nodeName}-${n.extra.batch}` : n.nodeName
  };
  return { ...n, ...node };
};

const formatEdge = e => {
  const edge = {
    id: `${e.from}->${e.to}`,
    dashes: e.group === 'waitAny' || e.group === 'AlgorithmExecution'
  };
  return { ...e, ...edge };
};

function JobGraph({ graph, pipeline }) {
  const [visible, setVisible] = useState(false);
  const [payload, setPayload] = useState({ taskId: undefined });

  const dispatch = useDispatch();
  const getLogs = ({ taskId, podName }) => dispatch(getKubernetesLogsData({ taskId, podName }));
  const toggleVisible = () => setVisible(prev => !prev);

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
      const podName =
        nodeData && nodeData.podName
          ? nodeData.podName
          : nodeData.batchTasks && nodeData.batchTasks[0].podName;

      getLogs({ taskId, podName });

      setPayload({
        ...nodeData,
        jobId,
        taskId,
        nodeName,
        podName,
        origInput: node.input,
        batch: nodeData.batchTasks || []
      });

      toggleVisible();
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

  const { taskId, podName, jobId, nodeName } = payload;
  const onRefreshClick = () => getLogs({ taskId, podName });
  const onSubmitClick = () => payload && dispatch(getCaching({ jobId, nodeName }));

  return (
    <>
      <Drawer visible={visible} onClose={toggleVisible} title={title} destroyOnClose>
        <Card>
          <NodeInfo payload={payload} />
        </Card>
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
