import { createSelector } from 'reselect';

const stateSelector = sourceName => state => state[sourceName];
const selector = sourceName =>
  createSelector(stateSelector(sourceName), state => state);

export default selector;
