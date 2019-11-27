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

const Descriptions = ({ column, vertical = false, children }) => (
  <Wrapper
    column={column}
    bordered
    size="small"
    colon={true}
    layout={vertical ? LAYOUT.VERTICAL : LAYOUT.HORIZONTAL}>
    {children}
  </Wrapper>
);

Descriptions.Item = AntdDescription.Item;

Descriptions.propTypes = {
  vertical: PropTypes.string,
  column: PropTypes.number,
  children: PropTypes.node.isRequired,
};

export default Descriptions;
