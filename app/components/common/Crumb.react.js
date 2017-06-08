import React from 'react';
import icons from './../../stylesheets/ionicons.scss';
export default ({layer, value, handleClick}) =>
  <span className="Crumbs">
    {value}
    <span onClick={() => handleClick(layer, value)} className="Crumb-X"><i className="icon ion-close-round"></i></span>
  </span>
