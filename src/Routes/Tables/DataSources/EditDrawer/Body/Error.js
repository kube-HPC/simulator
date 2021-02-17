import React from 'react';
import PropTypes from 'prop-types';
import { Empty as AntdEmpty, Button } from 'antd';
import { ReactComponent as ErrorLogo } from 'assets/errorLogo.svg';
import styled from 'styled-components';
import { COLOR } from 'styles/colors';

const Empty = styled(AntdEmpty)`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const ErrorPage = ({ children, onRetry }) => (
  <Empty
    image={<ErrorLogo style={{ stroke: COLOR.red }} />}
    description={children}>
    {onRetry && (
      <Button type="primary" onClick={onRetry}>
        click here to retry
      </Button>
    )}
  </Empty>
);

ErrorPage.propTypes = {
  onRetry: PropTypes.func,
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]).isRequired,
};
ErrorPage.defaultProps = {
  onRetry: null,
};
export default ErrorPage;
