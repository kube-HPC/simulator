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

const Descriptions = ({ column, layout = LAYOUT.VERTICAL, children }) => (
  <Wrapper column={column} bordered size="small" colon={false} layout={layout}>
    {children}
  </Wrapper>
);

Descriptions.Item = AntdDescription.Item;
Descriptions.LAYOUT = LAYOUT;

Descriptions.propTypes = {
  layout: PropTypes.string,
  column: PropTypes.number,
  children: PropTypes.node.isRequired,
};

export default Descriptions;
