import React from 'react';
import PropTypes from 'prop-types';

import styled from 'styled-components';
import { Drawer, Typography } from 'antd';
import { COLOR } from 'styles';
import { rightSidebarContent } from './rightSidebarContent.react';

const { Title, Paragraph } = Typography;

const DrawerCustomScrollbar = styled(Drawer)`
  .ant-drawer-wrapper-body {
    ::-webkit-scrollbar-track {
      border: none;
      background-color: none;
    }
    ::-webkit-scrollbar {
      width: 7px;
    }
    ::-webkit-scrollbar-thumb {
      border: 1px solid ${COLOR.grey};
      background-color: ${COLOR.blueLight};
    }
  }
`;

const DrawerOperations = ({ children, operation, ...props }) => {
  const { title, description, width } = rightSidebarContent[operation];
  return (
    <DrawerCustomScrollbar
      width={width}
      placement="right"
      closable={false}
      title={
        <>
          <Title level={2}>{title}</Title>
          <Paragraph>{description}</Paragraph>
        </>
      }
      {...props}
    >
      {children}
    </DrawerCustomScrollbar>
  );
};
export default DrawerOperations;

DrawerOperations.propTypes = {
  operation: PropTypes.string.isRequired,
  ...Drawer.propTypes
};
