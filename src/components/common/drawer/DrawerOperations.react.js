import React from 'react';
import styled from 'styled-components';
import { Drawer, Typography } from 'antd';
import { COLOR } from 'styles';
import { drawerContent } from './DrawerContent.react';

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
  const { title, description, width } = drawerContent[operation];
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
