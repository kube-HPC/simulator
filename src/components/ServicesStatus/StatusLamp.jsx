import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Lamp = styled.span`
  width: ${props => props.$size}px;
  height: ${props => props.$size}px;
  border-radius: 50%;
  display: inline-block;
  background-color: ${props => {
    if (props.$isOk === null) {
      return '#bfbfbf';
    }
    return props.$isOk ? '#52c41a' : '#ff4d4f';
  }};
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.05) inset;
  margin-right: 8px;
`;

const StatusLamp = ({ isOk, size = 10 }) => <Lamp $isOk={isOk} $size={size} />;

StatusLamp.propTypes = {
  isOk: PropTypes.oneOfType([PropTypes.bool, PropTypes.oneOf([null])]),
  size: PropTypes.number,
};

export default StatusLamp;
