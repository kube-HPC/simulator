import React from 'react';

import { SB_SECTIONS } from 'const';
import { VersionsTable } from '.';

export default {
  title: `${SB_SECTIONS.TABLES.ALGORITHMS}/Versions Table`,
};

export const Default = () => (
  <VersionsTable
    algorithmName="algorithmName"
    currentVersion="ver1"
    isFetch={false}
  />
);
