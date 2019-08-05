import React from 'react';
import styled from 'styled-components';

import { Drawer, Typography } from 'antd';
import { RIGHT_SIDEBAR_NAMES } from 'constants/table-names';
import { COLOR } from 'constants/colors';

const { Title, Paragraph, Text } = Typography;

const width = {
  [RIGHT_SIDEBAR_NAMES.ADD_PIPELINE]: '60%',
  [RIGHT_SIDEBAR_NAMES.ADD_ALGORITHM]: '40%',
  [RIGHT_SIDEBAR_NAMES.ADD_DEBUG]: '20%',
  [RIGHT_SIDEBAR_NAMES.ERROR_LOGS]: '70%'
};
const title = {
  [RIGHT_SIDEBAR_NAMES.ADD_ALGORITHM]: 'Add Algorithm',
  [RIGHT_SIDEBAR_NAMES.ADD_DEBUG]: 'Add Debug',
  [RIGHT_SIDEBAR_NAMES.ADD_PIPELINE]: 'Add Pipeline'
};
const description = {
  [RIGHT_SIDEBAR_NAMES.ADD_PIPELINE]: (
    <>
      Build a <Text strong>pipeline</Text> through <Text code>Wizard</Text> or{' '}
      <Text code>JSON Editor</Text> .
    </>
  ),
  [RIGHT_SIDEBAR_NAMES.ADD_ALGORITHM]: (
    <>
      Algorithm <Text strong>descriptor</Text> to be added to the store.
    </>
  ),
  [RIGHT_SIDEBAR_NAMES.ADD_DEBUG]: 'Add algorithm image for debugging.'
};

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

const DrawerOperations = ({ children, operation, ...props }) => (
  <DrawerCustomScrollbar
    width={width[operation]}
    placement="right"
    closable={false}
    title={
      title[operation] && (
        <Typography>
          <Title level={2}>{title[operation]}</Title>
          <Paragraph>{description[operation]}</Paragraph>
        </Typography>
      )
    }
    {...props}
  >
    {children}
  </DrawerCustomScrollbar>
);

export default DrawerOperations;
