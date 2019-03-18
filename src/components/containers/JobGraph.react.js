import React, { Component } from 'react';
import Graph from './VisGraph.react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { sideBarOpen, sideBarClose } from '../../actions/sideBar.action';
import { getKubernetesLogsData } from '../../actions/kubernetesLog.action';
const options = {
  physics: {
    enabled: false
  },
  layout: {
    hierarchical: {
      enabled: true,
      direction: 'LR',
      sortMethod: 'directed'
    }
  },
  interaction: {
    hover: true
  },
  nodes: {
    shape: 'box',
    size: 40,
    font: {
      size: 14,
      color: 'rgba(0,0,0,0.5)'
    },
    margin: {
      top: 15,
      bottom: 15,
      left: 15,
      right: 15
    },
    borderWidth: 1,
    shadow: true
  },
  edges: {
    width: 2,
    shadow: true,
    length: 200,
    smooth: {
      enabled: true,
      type: 'cubicBezier',
      roundness: 0.7
    }
  },
  groups: {
    batchCompleted: {
      color: { background: '#87d068', border: 'black' }
    },
    batchNotStarted: {
      color: { background: '#FF5441', border: 'black' }
    },
    batchRunning: {
      color: { background: '#eeda13', border: 'rgba(0,0,0,0.5)' }
    },
    notStarted: {
      color: { background: '#FF5441', border: 'rgba(0,0,0,0.5)' }
    },
    completed: { color: '#87d068' },
    source: {
      color: { border: 'white' }
    }
  }
};

class JobGraph extends Component {
  constructor() {
    super();
    this.network = null;
    this.events = {
      select: () => { },
      afterDrawing: () => {
        this.network.fit({
          animation: {
            duration: 400,
            easingFunction: 'linear'
          }
        });
      }
    };
    this._initNetworkInstance = this.initNetworkInstance.bind(this);
  }

  initNetworkInstance(network) {
    this.network = network;
    this.network.on('click', params => {
      if (params && params.nodes[0]) {
        const nodeName = params.nodes[0];
        const nodeData = this.network.body.data.nodes._data[nodeName];
        const node = this.props.pipeline.nodes.find(n => n.nodeName === nodeName);
        const taskId = nodeData.taskId
          ? nodeData.taskId
          : nodeData.batchTasks && nodeData.batchTasks[0].taskId;
        this.props.sideBarOpen({
          payload: {
            taskId,
            algorithmName: nodeData.algorithmName,
            jobId: this.props.graph.jobId,
            nodeName,
            origInput: node && node.input,
            batch: (nodeData.batchTasks && nodeData.batchTasks.slice(0, 10)) || [],
            input: nodeData.input,
            output: nodeData.output,
            error: node && node.error,
            startTime: nodeData.startTime,
            endTime: nodeData.endTime
          }
        });
        this.props.getKubernetesLogsData(taskId);
      }
    });
  }

  formatNode(n) {
    const node = {
      id: n.nodeName,
      label: n.nodeName
    };
    if (n.extra && n.extra.batch) {
      node.label = `${n.nodeName}-${n.extra.batch}`;
    }
    return { ...n, ...node };
  }

  formatEdge(e) {
    const edge = {
      id: `${e.from}->${e.to}`
    };
    if (e.group === 'waitAny' || e.group === 'AlgorithmExecution') {
      edge.dashes = true;
    }
    return { ...e, ...edge };
  }

  render() {
    if (!this.props.graph) {
      return (
        <div style={{ height: '600px' }}>
          <div>Graph is not available</div>
        </div>
      );
    }
    const { nodes, edges } = this.props.graph;
    const adaptedGraph = {
      edges: [],
      nodes: []
    };
    nodes && nodes.forEach(n => adaptedGraph.nodes.push(this.formatNode(n)));
    edges && edges.forEach(e => adaptedGraph.edges.push(this.formatEdge(e)));

    return (
      <div style={{ height: '600px' }}>
        <Graph
          graph={adaptedGraph}
          options={options}
          events={this.events}
          getNetwork={this._initNetworkInstance}
        />
      </div>
    );
  }
}

JobGraph.propTypes = {
  sideBarOpen: PropTypes.func.isRequired,
  getKubernetesLogsData: PropTypes.func.isRequired,
  graph: PropTypes.object,
  jobId: PropTypes.object,
  pipeline: PropTypes.object
};

const mapStateToProps = state => state;

export default connect(
  mapStateToProps,
  { sideBarOpen, sideBarClose, getKubernetesLogsData }
)(JobGraph);
