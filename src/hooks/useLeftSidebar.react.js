import React, { useState, useEffect } from 'react';
import {
  JobsTable,
  PipelinesTable,
  AlgorithmsTable,
  WorkersTable,
  DriversTable,
  DebugTable,
  AlgorithmBuildsTable
} from 'components/UI/tables';

import { LEFT_SIDEBAR_NAMES } from 'constants/sidebar-names';
import { getBooleanLSItem, setLSItem } from 'utils/localStorage';
import LOCAL_STORAGE_KEYS from 'constants/local-storage';
import { makeToggle } from 'utils/hooks';

const tableSelector = {
  [LEFT_SIDEBAR_NAMES.JOBS]: <JobsTable />,
  [LEFT_SIDEBAR_NAMES.PIPELINES]: <PipelinesTable />,
  [LEFT_SIDEBAR_NAMES.ALGORITHMS]: <AlgorithmsTable />,
  [LEFT_SIDEBAR_NAMES.WORKERS]: <WorkersTable />,
  [LEFT_SIDEBAR_NAMES.DRIVERS]: <DriversTable />,
  [LEFT_SIDEBAR_NAMES.DEBUG]: <DebugTable />,
  [LEFT_SIDEBAR_NAMES.BUILDS]: <AlgorithmBuildsTable />
};

const leftCollapsedInitial = getBooleanLSItem(
  LOCAL_STORAGE_KEYS.LEFT_SIDEBAR_IS_VISIBLE
);

const useLeftSidebar = () => {
  const [value, setValue] = useState(LEFT_SIDEBAR_NAMES.JOBS);
  const [isCollapsed, setIsCollapsed] = useState(leftCollapsedInitial);

  useEffect(
    () => {
      setLSItem(LOCAL_STORAGE_KEYS.LEFT_SIDEBAR_IS_VISIBLE, isCollapsed);
    },
    [isCollapsed]
  );

  return {
    value: [value, setValue],
    isCollapsed: [isCollapsed, setIsCollapsed],
    selector: tableSelector,
    toggle: makeToggle(setIsCollapsed)
  };
};

export default useLeftSidebar;
