import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Window = styled.div`
  position: fixed;
  left: ${props => !props.right && 0};
  right: ${props => props.right && 0};
  top: ${props => props.top && 0};
  bottom: ${props => !props.top && 0};
  background: white;
  max-height: 100vh;
  overflow: auto;
`;

const DebugWindow = ({ params, children, top, right }) => (
  <Window top={top} right={right}>
    {Object.entries(params).map(([name, value]) => (
      <pre key={`debug-${name}`}>
        {name}: {JSON.stringify(value, null, 2)}
      </pre>
    ))}
    {children}
  </Window>
);

DebugWindow.propTypes = {
  params: PropTypes.objectOf(PropTypes.any).isRequired,
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.oneOfType),
  ]),
  right: PropTypes.bool,
  top: PropTypes.bool,
};

DebugWindow.defaultProps = {
  children: null,
  top: false,
  right: false,
};
export default DebugWindow;
