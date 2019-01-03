import React, { Component } from 'react';
import Graph from './VisGraph.react';

const options = {
  physics: {
    stabilization: true
  },
  layout: {
    hierarchical: {
      enabled: true,
      direction: 'LR',
      sortMethod: 'directed'
    }
  },
  nodes: {
    shape: 'dot',
    size: 40,
    font: {
      size: 15,
      color: 'black'
    },
    borderWidth: 2
  },
  edges: {
    width: 2
  },
  groups: {
    batchCompleted: {
      color: { background: 'green', border: 'black' },
      shape: 'diamond'
    },
    batchNotStarted: {
      color: { background: 'red', border: 'black' },
      shape: 'diamond'


    },
    batchRunning: {
      color: { background: 'yellow', border: 'black' },
      shape: 'diamond'
    },
    notStarted: {
      shape: 'dot',
      color: { background: 'red', border: 'black' }
    },
    completed: { color: 'rgb(0,255,140)' },
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
      select: () => {},
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
  }
  render() {
    if (!this.props.graph) {
      return (<div style={{ height: '600px' }}>
        <div>Graph is not available</div>
      </div>);
    }
    const { nodes, edges } = this.props.graph;
    const adaptedGraph = {
      edges: [],
      nodes: []

    };
    nodes.forEach((n) => adaptedGraph.nodes.push({ ...n, label: n.extra.batch ? `${n.label} - ${n.extra.batch}` : n.label }));
    edges.forEach((e) => adaptedGraph.edges.push({ ...e, dashes: e.group === 'waitAny' }));

    return (<div style={{ height: '600px' }}>
      <Graph graph={adaptedGraph} options={options} events={this.events} getNetwork={this._initNetworkInstance} />
    </div>);
  }
}


export default JobGraph;
