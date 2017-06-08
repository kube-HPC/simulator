import * as planning from './../actions/planning.action';
import reducer from './../reducers/planning.reducer';
import expect from 'expect';
import { generateMessage, isEquivalent } from './common';
import { createStore } from 'redux';

generateMessage.info('started planning test');

function setMode(){
  console.log('test - setMode started');
  const store = createStore(reducer);

  store.dispatch( planning.setMode('someDecision') );
  expect(store.getState().mode).toEqual('someDecision');

  console.log('test - setMode passed');
}


function setDate(){
  console.log('test - setDate started');
  const store = createStore(reducer);

  const date = new Date();

  store.dispatch( planning.setDate(date) );
  expect(store.getState().date).toEqual(date);

  console.log('test - setDate passed');

  // it's a good chance to test the whole state because we know the date
  console.log(' test- complete state inside setDate function');
  const expectedState = {
    mode: 'statistical',
    date,
    district: null
  };
  expect(store.getState()).toEqual(expectedState);
  console.log(' test- complete state inside setDate function passed');

}

function setDistrict(){
  console.log('test - setDate started');
  const store = createStore(reducer);

  store.dispatch( planning.setDistrict('CA') );
  expect(store.getState().district).toEqual('CA');

  console.log('test - setDate passed');
}


setMode();
setDate();
setDistrict();
generateMessage.success('finished planning test');
