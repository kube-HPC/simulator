import React from 'react';
import PropTypes from 'prop-types';

import { Button, Icon } from 'antd';

import styled from 'styled-components';

const StyledButton = styled(Button)`
  position: fixed;
  width: 56px;
  height: 56px;
  right: 3%;
  bottom: 3%;
  box-shadow: 0 8px 10px 1px rgba(0, 0, 0, 0.14), 0 3px 14px 2px rgba(0, 0, 0, 0.12),
    0 5px 5px -3px rgba(0, 0, 0, 0.2);
`;

const FloatingAddButton = ({ onClick }) => (
  <StyledButton className="button" type="primary" size="default" shape="circle" onClick={onClick}>
    <Icon type="plus" style={{ fontSize: 'x-large' }} />
  </StyledButton>
);

FloatingAddButton.propTypes = {
  onClick: PropTypes.func.isRequired
};

export default FloatingAddButton;
