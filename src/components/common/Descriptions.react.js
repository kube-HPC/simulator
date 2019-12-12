import React from 'react';
import PropTypes from 'prop-types';
import { Descriptions as AntdDescription } from 'antd';
import styled from 'styled-components';

const Wrapper = styled(AntdDescription)`
  .ant-descriptions-view {
    overflow: auto;
  }
`;

const LAYOUT = {
  VERTICAL: 'vertical',
  HORIZONTAL: 'horizontal',
};

const Descriptions = ({ column, vertical = false, children, className, ...props }) => (
  <Wrapper
    className={className}
    column={column}
    bordered
    size="small"
    colon={true}
    layout={vertical ? LAYOUT.VERTICAL : LAYOUT.HORIZONTAL}
    {...props}>
    {children}
  </Wrapper>
);

Descriptions.Item = AntdDescription.Item;

Descriptions.propTypes = {
  className: PropTypes.string,
  vertical: PropTypes.bool,
  column: PropTypes.number,
  children: PropTypes.node.isRequired,
};

export default Descriptions;
