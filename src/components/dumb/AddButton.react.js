import React from 'react';
import PropTypes from 'prop-types';

import './AddButton.scss';
import { Button, Icon } from 'antd';

const AddButton = ({ onVisible }) => (
  <Button className="button" type="primary" size="default" shape="circle" onClick={onVisible}>
    <Icon type="plus" style={{ fontSize: 'x-large' }} />
  </Button>
);

AddButton.propTypes = {
  onVisible: PropTypes.func.isRequired
};

export default AddButton;
