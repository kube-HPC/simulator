import React, { Component } from 'react';
import Graph from './VisGraph';
import { connect } from 'react-redux';
import { sideBarOpen,sideBarClose } from "../actions/sideBar.action";
import { getKubernetesLogsData} from "../actions/kubernetesLog.action";
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
    shape: 'box',
    size: 40,
    font: {
      size: 14,
      color: 'rgba(0,0,0,0.5)'
    },
    margin:{
      top:15,
      bottom:15,
      left:15,
      right:15
    },
    borderWidth: 1,
    shadow:true,
    // widthConstraint: {
    //   maximum: 100,
    //   minimum: 100
    // }
  },
  edges: {
    width: 2,
    shadow:true,
    length:500,
    smooth: {
      enabled: true,
      type: "cubicBezier",
      roundness: 0.7
    },
  },
  groups: {
    batchCompleted: {
      color: { background: '#87d068', border: 'black' },
     
    },
    batchNotStarted: {
      color: { background: '#FF5441', border: 'black' },
      // font:{
      //   color:"white"
      // }
   


    },
    batchRunning: {
      color: { background: '#eeda13', border: 'rgba(0,0,0,0.5)' },
      
    },
    notStarted: {
      
      color: { background: '#FF5441', border: 'rgba(0,0,0,0.5)' },
      // font:{
      //   color:"white"
      // }
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
      select: (event) => {
        const { nodes, edges } = event;
      },
      afterDrawing: (e) => {
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
    this.network.on("click",  (params) => {
      if(params.nodes[0]){
        const nodeData = this.network.body.data.nodes._data[params.nodes[0]];
        const taskId =nodeData.taskId?nodeData.taskId:nodeData.batchTasks[0].taskId;
        this.props.sideBarOpen({payload:{taskId,algorithmName:nodeData.algorithmName}});
    //   alert(this.network.body.data.nodes._data[params.nodes[0]].taskId?this.network.body.data.nodes._data[params.nodes[0]].taskId:this.network.body.data.nodes._data[params.nodes[0]].batchTasks[0].taskId); 
        this.props.getKubernetesLogsData(taskId);
      }
  });
  }
  render() {
    if (!this.props.graph) {
      return (<div style={{ height: '600px' }}>
        <div>Graph is not available</div>
      </div>);
    }
    const { nodes, edges,jobId } = this.props.graph;
    const adaptedGraph = {
      edges: [],
      nodes: []

    };
    nodes&&nodes.forEach((n) => adaptedGraph.nodes.push({ ...n, label: n.extra.batch ? `${n.label}-${n.extra.batch}` : n.label }));
    edges&&edges.forEach((e) => adaptedGraph.edges.push({ ...e, dashes: e.group === 'waitAny' }));

    return (<div style={{ height: '600px' }}>
      <Graph graph={adaptedGraph} options={options} events={this.events} getNetwork={this._initNetworkInstance} />
    </div>);
  }
}




const mapStateToProps = (state) => state;

export default connect(mapStateToProps,  { sideBarOpen,sideBarClose,getKubernetesLogsData })(JobGraph);


