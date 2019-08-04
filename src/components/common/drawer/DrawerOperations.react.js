import React from 'react';
import { Drawer, Typography } from 'antd';
import { RIGHT_SIDEBAR_NAMES } from 'constants/table-names';

const { Title, Paragraph, Text } = Typography;

const width = {
  'Add Pipeline': '60%',
  'Add Algorithm': '40%',
  'Add Debug': '20%',
  [RIGHT_SIDEBAR_NAMES.ERROR_LOGS]: '60%'
};
const title = {
  'Add Algorithm': 'Add Algorithm',
  'Add Debug': 'Add Debug',
  'Add Pipeline': 'Add Pipeline',
  [RIGHT_SIDEBAR_NAMES.ERROR_LOGS]: 'Error Logs'
};
const description = {
  'Add Pipeline': (
    <>
      Build a <Text strong>pipeline</Text> through <Text code>Wizard</Text> or{' '}
      <Text code>JSON Editor</Text> .
    </>
  ),
  'Add Algorithm': (
    <>
      Algorithm <Text strong>descriptor</Text> to be added to the store.
    </>
  ),
  'Add Debug': 'Add algorithm image for debugging.',
  [RIGHT_SIDEBAR_NAMES.ERROR_LOGS]: 'K8ts errors'
};

const DrawerOperations = ({ children, operation, ...props }) => (
  <Drawer
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
  </Drawer>
);

export default DrawerOperations;
