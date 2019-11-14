import React from 'react';
import PropTypes from 'prop-types';

import { Typography } from 'antd';
import { rightSidebarContent } from './rightSidebarContent.react';
import { Drawer } from '.';

const { Title, Paragraph } = Typography;

const DrawerOperations = ({ children, operation, ...props }) => {
  const { title, description, width } = rightSidebarContent[operation];
  return (
    <Drawer
      width={width}
      placement="right"
      closable={false}
      title={
        <>
          <Title level={2}>{title}</Title>
          <Paragraph>{description}</Paragraph>
        </>
      }
      {...props}>
      {children}
    </Drawer>
  );
};
export default DrawerOperations;

DrawerOperations.propTypes = {
  operation: PropTypes.string.isRequired,
  ...Drawer.propTypes,
};
