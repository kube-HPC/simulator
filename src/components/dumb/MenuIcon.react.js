import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';

const iconStyle = { fontSize: '20px' };

function MenuIcon(props) {
  return typeof props.type === 'string' ? <Icon type={props.type} style={iconStyle} /> : <Icon component={props.type} style={iconStyle} />;
}

export default MenuIcon;

MenuIcon.propTypes = {
  isComponent: PropTypes.bool,
  type: PropTypes.string
};
