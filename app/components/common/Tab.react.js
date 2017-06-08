import React from 'react';
import icons from './../../stylesheets/ionicons.scss';

export default ({value, onSelect, onRemove, cls}) =>
  <span className={`tab ${cls}`}
    onClick={ (e)=> onSelect(value) }>
    <span >{value}</span>
    <span onClick={ (e) => {
        e.stopPropagation()
        return onRemove(value)}
      }
      className="tab-x"><i className="icon ion-close-round"></i></span>
  </span>
