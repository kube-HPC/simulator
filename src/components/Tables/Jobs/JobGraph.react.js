import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import { Button, Typography } from 'antd';
import { getKubernetesLogsData, getCaching } from 'actions/jobs.action';

import Drawer from 'components/Drawer/Drawer.react';
import NodeInfo from 'components/Tables/Jobs/NodeInfo.react';
import graphOptions from 'config/template/graph-options.template';
import Graph from 'react-graph-vis';

const { Text } = Typography;

const GraphContainer = styled.div`
  height: 500px;
`;

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

function JobGraph({ graph, ...props }) {
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
      const node = props.pipeline.nodes.find(findNodeName(nodeName));
      const jobId = props.pipeline.jobId;
      const taskId =
        nodeData && nodeData.taskId
          ? nodeData.taskId
          : nodeData.batchTasks && nodeData.batchTasks[0].taskId;

      dispatch(getKubernetesLogsData(nodeData.taskId));

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

  return (
    <>
      <Drawer
        visible={visible}
        onClose={toggle}
        submitText={'Get Cache'}
        onSubmit={() => payload && dispatch(getCaching(payload.jobId, payload.nodeName))}
        title={'Node Information'}
        description={
          <>
            Check current node <Text code>Logs</Text>,<Text code>Algorithm Details</Text> and
            <Text code>Input Output Info</Text>
          </>
        }
        extra={[
          <Button
            key="redo"
            icon="redo"
            onClick={() => dispatch(getKubernetesLogsData(payload.taskId))}
          >
            Refresh
          </Button>
        ]}
      >
        <NodeInfo payload={payload} />
      </Drawer>
      <GraphContainer>
        <Graph graph={adaptedGraph} options={graphOptions} events={events} />
      </GraphContainer>
    </>
  );
}

export default JobGraph;
