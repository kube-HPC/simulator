import * as filters from './../actions/filters.action';
import reducer from './../reducers/filters.reducer';
import expect from 'expect';
import { generateMessage, isEquivalent } from './common';
import { createStore } from 'redux';

generateMessage.info('started filters test');
function initialize(){
  console.log('test - initialize started');
  const store = createStore(reducer);
	const expectedState = [];
	expect(store.getState().length).toEqual(0);
	expect(store.getState()).toEqual(expectedState);
  console.log('test - initialize passed');
}

function addFilter(){
  console.log('test - addFilter started');
  const store = createStore(reducer);

  store.dispatch(
    filters.addFilter(8, 'someDecision')
  );
  expect(store.getState().length).toEqual(1);

  const expectedState = [{id: 8, selection: 'someDecision'}];

  expect(store.getState()).toEqual(expectedState);
  console.log('test - addFilter passed');
}
function removeFilter(){
  console.log('test - removefilter started');

  const store = createStore(reducer);
  expect(store.getState().length).toEqual(0);

  store.dispatch( filters.addFilter(8, 'someDecision') );
  expect(store.getState().length).toEqual(1);

  store.dispatch( filters.removeFilter(12) );
  expect( store.getState().length ).toEqual(1);

  store.dispatch( filters.removeFilter(8) );

  expect( store.getState().length ).toEqual(0);

  console.log('test - removeFilter passed');
}


initialize();
addFilter();
removeFilter();
generateMessage.success('finished filters test');
