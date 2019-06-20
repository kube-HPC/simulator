export default {
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
