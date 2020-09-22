import React from 'react';
import { Typography } from 'antd';

import { RIGHT_SIDEBAR_NAMES } from 'const/sidebar-names';
import { DRAWER_SIZE } from 'const';

const { Text } = Typography;

const rightSidebarContent = {
  [RIGHT_SIDEBAR_NAMES.ADD_PIPELINE]: {
    width: DRAWER_SIZE.ADD_PIPELINE,
    title: RIGHT_SIDEBAR_NAMES.ADD_PIPELINE,
    description: (
      <>
        Build a <Text strong>pipeline</Text> through <Text code>Wizard</Text> or{' '}
        <Text code>JSON Editor</Text> .
      </>
    ),
  },
  [RIGHT_SIDEBAR_NAMES.ADD_ALGORITHM]: {
    width: DRAWER_SIZE.ADD_ALGORITHM,
    title: RIGHT_SIDEBAR_NAMES.ADD_ALGORITHM,
    description: (
      <>
        Algorithm <Text strong>descriptor</Text> to be added to the store.
      </>
    ),
  },
  [RIGHT_SIDEBAR_NAMES.ADD_DEBUG]: {
    width: DRAWER_SIZE.ADD_DEBUG,
    title: RIGHT_SIDEBAR_NAMES.ADD_DEBUG,
    description: <>Add algorithm image for debugging.</>,
  },
  [RIGHT_SIDEBAR_NAMES.ERROR_LOGS]: {
    width: DRAWER_SIZE.ERROR_LOGS,
    title: 'Cluster Error Logs',
    description: (
      <>
        Build a <Text strong>pipeline</Text> through <Text code>Wizard</Text> or{' '}
        <Text code>JSON Editor</Text> .
      </>
    ),
  },
  [RIGHT_SIDEBAR_NAMES.RUN_RAW_PIPELINE]: {
    width: DRAWER_SIZE.RUN_RAW_PIPELINE,
    title: RIGHT_SIDEBAR_NAMES.RUN_RAW_PIPELINE,
    description: (
      <>
        Start pipeline execution with <Text strong>raw</Text> input, visit{' '}
        <a
          href="http://hkube.io/spec/#tag/Execution/paths/~1exec~1raw/post"
          target="_blank"
          rel="noopener noreferrer">
          HKube Spec
        </a>{' '}
        for additional information.
      </>
    ),
  },
  [RIGHT_SIDEBAR_NAMES.STORAGE]: {
    width: DRAWER_SIZE.STORAGE,
    title: 'Hkube STORAGE Usage',
    description: (
      <>
        Hover the <Text code>Nodes</Text> for an additional information.
      </>
    ),
  },
  [RIGHT_SIDEBAR_NAMES.CPU]: {
    width: DRAWER_SIZE.CPU,
    title: 'Cluster CPU Usage',
    description: (
      <>
        Hover the <Text code>Nodes</Text> for an additional information.
      </>
    ),
  },
  [RIGHT_SIDEBAR_NAMES.MEMORY]: {
    width: DRAWER_SIZE.MEMORY,
    title: 'Cluster Memory Usage',
    description: (
      <>
        Hover the <Text code>Nodes</Text> for an additional information.
      </>
    ),
  },
  [RIGHT_SIDEBAR_NAMES.GPU]: {
    width: DRAWER_SIZE.GPU,
    title: 'Cluster GPU Usage',
    description: (
      <>
        Hover the <Text code>Nodes</Text> for an additional information.
      </>
    ),
  },
};

export default rightSidebarContent;
