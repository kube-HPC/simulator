import React from 'react';
import PropTypes from 'prop-types';

import { HAddButton } from '../style/Styled';
import { Icon } from 'antd';

const AddButton = ({ onVisible }) => (
  <HAddButton type="primary" size="default" shape="circle" onClick={onVisible}>
    <Icon type="plus" style={{ fontSize: 'x-large' }} />
  </HAddButton>
);

AddButton.propTypes = {
  onVisible: PropTypes.func.isRequired
};

export default AddButton;
