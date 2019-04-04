import React from 'react';
import PropTypes from 'prop-types';

import './AddButton.scss';
import { Button, Icon } from 'antd';

const AddButton = ({ onClick }) => (
  <Button className="button" type="primary" size="default" shape="circle" onClick={onClick}>
    <Icon type="plus" style={{ fontSize: 'x-large' }} />
  </Button>
);

AddButton.propTypes = {
  onClick: PropTypes.func.isRequired
};

export default AddButton;
