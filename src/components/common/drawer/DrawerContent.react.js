import React from 'react';
import { Typography } from 'antd';

import { RIGHT_SIDEBAR_NAMES } from 'constants/sidebar-names';

const { Text } = Typography;

export const drawerContent = {
  [RIGHT_SIDEBAR_NAMES.ADD_PIPELINE]: {
    width: '60%',
    title: RIGHT_SIDEBAR_NAMES.ADD_PIPELINE,
    description: (
      <>
        Build a <Text strong>pipeline</Text> through <Text code>Wizard</Text> or{' '}
        <Text code>JSON Editor</Text> .
      </>
    )
  },
  [RIGHT_SIDEBAR_NAMES.ADD_ALGORITHM]: {
    width: '40%',
    title: RIGHT_SIDEBAR_NAMES.ADD_ALGORITHM,
    description: (
      <>
        Algorithm <Text strong>descriptor</Text> to be added to the store.
      </>
    )
  },
  [RIGHT_SIDEBAR_NAMES.ADD_DEBUG]: {
    width: '20%',
    title: RIGHT_SIDEBAR_NAMES.ADD_DEBUG,
    description: <>Add algorithm image for debugging.</>
  },
  [RIGHT_SIDEBAR_NAMES.ERROR_LOGS]: {
    width: '70%',
    title: 'Cluster Error Logs',
    description: (
      <>
        Build a <Text strong>pipeline</Text> through <Text code>Wizard</Text> or{' '}
        <Text code>JSON Editor</Text> .
      </>
    )
  },
  [RIGHT_SIDEBAR_NAMES.RUN_RAW_PIPELINE]: {
    width: '50%',
    title: 'Run raw pipeline',
    description: (
      <>
        Start pipeline execution with <Text strong>raw</Text> input, visit{' '}
        <a
          href="http://hkube.io/spec/#tag/Execution/paths/~1exec~1raw/post"
          target="_blank"
          rel="noopener noreferrer"
        >
          HKube Spec
        </a>{' '}
        for additional information.
      </>
    )
  },
  [RIGHT_SIDEBAR_NAMES.CPU]: {
    width: '60%',
    title: 'Cluster CPU Usage',
    description: (
      <>
        Hover the <Text code>Nodes</Text> for an additional information.
      </>
    )
  },
  [RIGHT_SIDEBAR_NAMES.MEMORY]: {
    width: '60%',
    title: 'Cluster Memory Usage',
    description: (
      <>
        Hover the <Text code>Nodes</Text> for an additional information.
      </>
    )
  }
};
