import { useState } from 'react';
import { LOCAL_STORAGE_KEYS } from 'const';

const useLocalStorageGraphMode = () => {
  const storedGraphMode = localStorage.getItem(
    LOCAL_STORAGE_KEYS.LOCAL_STORAGE_KEY_GRAPHS_STATES
  );
  const [graphMode, setGraphMode] = useState(
    storedGraphMode ? JSON.parse(storedGraphMode) : {}
  );

  const saveLocationNodes = (graphName, dataGraph) => {
    const nodesArray = dataGraph.nodes.map(node => ({
      id: node.id,
      x: node.x,
      y: node.y,
    }));
    const newGraphMode = { ...graphMode };
    if (!newGraphMode[graphName]) {
      newGraphMode[graphName] = [];
    }
    newGraphMode[graphName] = nodesArray;

    if (Object.keys(newGraphMode).length > 10) {
      const oldestGraph = Object.keys(newGraphMode)[0];
      delete newGraphMode[oldestGraph];
    }

    localStorage.setItem(
      LOCAL_STORAGE_KEYS.LOCAL_STORAGE_KEY_GRAPHS_STATES,
      JSON.stringify(newGraphMode)
    );
    setGraphMode(newGraphMode);
  };

  const exportLocationNodes = (graphName, dataGraph) => {
    const nodesArray = graphMode[graphName] || [];
    const exportedNodes = nodesArray.map(({ id, x, y }) => {
      const node = dataGraph.nodes.find(n => n.id === id);
      return { ...node, id, x, y };
    });
    const exportGraph = { ...dataGraph };
    exportGraph.nodes = exportedNodes;

    return exportGraph;
  };

  const deleteLocationNodes = graphName => {
    const newGraphMode = { ...graphMode };
    delete newGraphMode[graphName];
    localStorage.setItem(
      LOCAL_STORAGE_KEYS.LOCAL_STORAGE_KEY_GRAPHS_STATES,
      JSON.stringify(newGraphMode)
    );
    setGraphMode(newGraphMode);
  };

  const hasRecord = graphName => {
    const storeGraph = JSON.parse(storedGraphMode);
    return graphName in storeGraph;
  };

  return {
    hasRecord,
    deleteLocationNodes,
    saveLocationNodes,
    exportLocationNodes,
  };
};

export default useLocalStorageGraphMode;
