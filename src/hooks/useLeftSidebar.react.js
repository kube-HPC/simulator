import {
  AlgorithmsTable,
  DebugTable,
  DriversTable,
  PipelinesTable,
  WorkersTable,
} from 'components/Tables';
import { LEFT_SIDEBAR_NAMES, LOCAL_STORAGE_KEYS } from 'const';
import { useLocalStorage } from 'hooks';
import React, { useReducer, useState } from 'react';
import { createStore } from 'reusable';
import { getBooleanLSItem } from 'utils';

const tableSelector = {
  [LEFT_SIDEBAR_NAMES.PIPELINES]: <PipelinesTable />,
  [LEFT_SIDEBAR_NAMES.ALGORITHMS]: <AlgorithmsTable />,
  [LEFT_SIDEBAR_NAMES.WORKERS]: <WorkersTable />,
  [LEFT_SIDEBAR_NAMES.DRIVERS]: <DriversTable />,
  [LEFT_SIDEBAR_NAMES.DEBUG]: <DebugTable />,
};

const leftCollapsedInitial =
  getBooleanLSItem(LOCAL_STORAGE_KEYS.LEFT_SIDEBAR_IS_VISIBLE) ||
  getBooleanLSItem(LOCAL_STORAGE_KEYS.USER_GUIDE_STATUS);

const useLeftSidebar = () => {
  const [value, setValue] = useState(LEFT_SIDEBAR_NAMES.JOBS);
  const [isCollapsed, toggle] = useReducer(p => !p, leftCollapsedInitial);

  useLocalStorage({
    value: isCollapsed,
    key: LOCAL_STORAGE_KEYS.LEFT_SIDEBAR_IS_VISIBLE,
  });

  return {
    value: [value, setValue],
    isCollapsed: [isCollapsed, toggle],
    selector: tableSelector,
  };
};

export default createStore(useLeftSidebar);
