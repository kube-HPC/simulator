import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import { Button, Typography } from 'antd';

import { getKubernetesLogsData, getCaching } from 'actions/jobs.action';

import DrawerContainer from 'components/common/drawer/DrawerContainer.react';
import NodeInfo from 'components/tables/Jobs/NodeInfo.react';
import VisGraph from 'components/tables/Jobs/VisGraph.react';
import graphOptions from 'config/template/graph-options.template';

const { Text } = Typography;

function JobGraph(props) {
  const [visible, setVisible] = useState(false);
  const [payload, setPayload] = useState(undefined);

  const dispatch = useDispatch();

  const toggle = () => setVisible(prev => !prev);
  const initNetworkInstance = network => {
    network.on('click', params => {
      if (params && params.nodes[0]) {
        const nodeName = params.nodes[0];
        const nodeData = network.body.data.nodes._data[nodeName];
        const node = props.pipeline.nodes.find(n => n.nodeName === nodeName);
        const jobId = props.pipeline.jobId;
        const taskId = nodeData.taskId
          ? nodeData.taskId
          : nodeData.batchTasks && nodeData.batchTasks[0].taskId;
        setPayload({
          ...nodeData,
          jobId,
          taskId,
          nodeName,
          origInput: node.input,
          batch: nodeData.batchTasks || []
        });
        toggle();
        dispatch(getKubernetesLogsData(taskId));
      }
    });
  };

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

  const { nodes, edges } = props.graph;
  const adaptedGraph = {
    edges: [],
    nodes: []
  };
  nodes && nodes.forEach(n => adaptedGraph.nodes.push(formatNode(n)));
  edges && edges.forEach(e => adaptedGraph.edges.push(formatEdge(e)));

  return (
    <>
      <DrawerContainer
        visible={visible}
        onClose={toggle}
        submitText={'Cache'}
        onSubmit={() =>
          payload && dispatch(getCaching(payload.jobId, payload.nodeName))
        }
        title={'Node Information'}
        description={
          <>
            Check current node <Text code>Logs</Text>,
            <Text code>Algorithm Details</Text> and
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
      </DrawerContainer>
      <div style={{ height: '600px' }}>
        {props.graph ? (
          <VisGraph
            graph={adaptedGraph}
            options={graphOptions}
            getNetwork={initNetworkInstance}
          />
        ) : (
          'Graph is not available'
        )}
      </div>
    </>
  );
}

export default JobGraph;
