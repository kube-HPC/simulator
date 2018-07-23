import { Component } from 'react';
import Graph from 'react-graph-vis';

const options = {
  animation: false,
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


const JobGraph = ({ graph }) => {
  const network = null;
  const events = {
    select: (event) => {
      const { nodes, edges } = event;
    },
    afterDrawing: (e) => {
      console.log(e);
    }
  };
    
  const initNetworkInstance = (network) => {
    network.once('afterDrawing', (e) => {
      network.fit({
        animation: {
          duration: 1,
          easingFunction: 'linear'
        }
      });
    });
  };
  const adaptedGraph = {
    edges: [],
    nodes: []

  };
  graph.nodes.forEach((n) => adaptedGraph.nodes.push({ ...n, label: n.extra.batch ? `${n.label} - ${n.extra.batch}` : n.label }));
  graph.edges.forEach((e) => adaptedGraph.edges.push({ ...e, dashes: e.group === 'waitAny' }));

  return (<div style={{ height: '600px' }}>
    <Graph graph={adaptedGraph} options={options} events={events} getNetwork={initNetworkInstance}/>
  </div>)
        ;
};


export default JobGraph;
