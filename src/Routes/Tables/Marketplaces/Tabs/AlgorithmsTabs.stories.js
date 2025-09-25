import React from 'react';

import { SB_SECTIONS } from 'const';
import AlgorithmsTabs from '.';

export default {
  title: `${SB_SECTIONS.TABLES.ALGORITHMS}/Tabs`,
};

export const Default = () => (
  <AlgorithmsTabs
    algorithm={{ name: 'algorithmName', builds: [], version: 'version1' }}
  />
);
