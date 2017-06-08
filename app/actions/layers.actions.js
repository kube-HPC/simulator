import actions from '../constants/actions';

export function setCharts(layer, charts) {
  return {
    type: actions.SET_CHARTS,
    payload: {layer, charts}
  };
}

export function addLayer(layer, charts){
  return {
    type: actions.ADD_LAYER,
    payload: {layer, charts}
  };
}

export function removeLayer(layers, layerToRemove, selectedLayer){
  let nextSelected = selectedLayer;
  if ( layerToRemove === selectedLayer ){
    let index = layers.indexOf(layerToRemove);
    nextSelected = (index === 0) ? layers[1] : layers[index -1];
  }
  return {
    type: actions.REMOVE_LAYER,
    payload: { layerToRemove, nextSelected }
  };
}
