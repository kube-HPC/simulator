import React from 'react';
import { Drawer, Typography } from 'antd';

const { Title, Paragraph, Text } = Typography;

const width = {
  'Add Pipeline': '60%',
  'Add Algorithm': '40%',
  'Add Debug': '20%'
};
const title = {
  'Add Algorithm': 'Add Algorithm',
  'Add Debug': 'Add Debug',
  'Add Pipeline': 'Add Pipeline'
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
  'Build Pipeline': '50vh'
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
