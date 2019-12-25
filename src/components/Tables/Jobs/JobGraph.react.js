import { Button, Typography } from 'antd';
import { Card, Fallback } from 'components/common';
import { defaultOptions } from 'config/template/graph-options.template';
import PropTypes from 'prop-types';
import React, { lazy } from 'react';
import styled from 'styled-components';
import { NodeInfo } from '.';
import { useActions } from 'hooks';
import { findNodeName, formatNode, formatEdge } from 'utils';

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

const JobGraph = ({ graph, pipeline }) => {
  const { drawerOpen, getKubernetesLogsData: getLogs, getCaching } = useActions();

  const events = {
    click: ({ nodes }) => {
      const [nodeName] = nodes;
      if (!nodeName) {
        return;
      }

      const nodeData = graph.nodes.find(findNodeName(nodeName));
      const node = pipeline.nodes.find(findNodeName(nodeName));
      const jobId = pipeline.jobId;
      const taskId =
        nodeData && nodeData.taskId ? nodeData.taskId : nodeData.batch && nodeData.batch[0].taskId;
      const podName =
        nodeData && nodeData.podName
          ? nodeData.podName
          : nodeData.batch && nodeData.batch[0].podName;

      getLogs({ taskId, podName });

      const payload = {
        ...nodeData,
        jobId,
        taskId,
        nodeName,
        podName,
        origInput: node.input,
        batch: nodeData.batch || [],
      };

      const body = (
        <Card>
          <NodeInfo payload={payload} />
        </Card>
      );

      const onRefreshClick = () => getLogs({ taskId, podName });
      const onSubmitClick = () => payload && getCaching({ jobId, nodeName });

      const footer = {
        body: (
          <Button type="primary" onClick={onSubmitClick}>
            Get Cache
          </Button>
        ),
        extra: [
          <Button key="redo" icon="redo" onClick={onRefreshClick}>
            Refresh
          </Button>,
        ],
      };

      drawerOpen({ title, body, footer });
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

  return (
    <GraphContainer>
      <Fallback>
        <Graph graph={adaptedGraph} options={defaultOptions} events={events} />
      </Fallback>
    </GraphContainer>
  );
};

JobGraph.propTypes = {
  graph: PropTypes.object.isRequired,
  pipeline: PropTypes.object.isRequired,
};

const isSameGraph = (a, b) => a.graph.timestamp === b.graph.timestamp;
export default React.memo(JobGraph, isSameGraph);
