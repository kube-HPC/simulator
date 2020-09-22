import expect from 'expect';
import { createStore } from 'redux';
import * as filters from './../actions/filter.action';
import reducer from './../reducers/filter.reducer';
// eslint-disable-next-line
import { generateMessage } from './common';

generateMessage.info('started filters test');
function initialize() {
  console.info('test - initialize started');
  const store = createStore(reducer);
  const expectedState = [];
  expect(store.getState().length).toEqual(0);
  expect(store.getState()).toEqual(expectedState);
  console.info('test - initialize passed');
}

function addFilter() {
  console.info('test - addFilter started');
  const store = createStore(reducer);

  store.dispatch(filters.addFilter(8, 'someDecision'));
  expect(store.getState().length).toEqual(1);

  const expectedState = [{ id: 8, selection: 'someDecision' }];

  expect(store.getState()).toEqual(expectedState);
  console.info('test - addFilter passed');
}
function removeFilter() {
  console.info('test - removefilter started');

  const store = createStore(reducer);
  expect(store.getState().length).toEqual(0);

  store.dispatch(filters.addFilter(8, 'someDecision'));
  expect(store.getState().length).toEqual(1);

  store.dispatch(filters.removeFilter(12));
  expect(store.getState().length).toEqual(1);

  store.dispatch(filters.removeFilter(8));

  expect(store.getState().length).toEqual(0);

  console.info('test - removeFilter passed');
}

initialize();
addFilter();
removeFilter();
generateMessage.success('finished filters test');
