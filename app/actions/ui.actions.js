import actions from '../constants/actions';

export function toggleHidden(to) {
  return { type: actions.TOGGLE_HIDDEN };
}

export function selectLayer(layer){
  return {
    type: actions.SELECT_LAYER,
    payload: layer
  };
}
