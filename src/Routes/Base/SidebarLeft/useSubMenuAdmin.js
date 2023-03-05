import React, { useMemo } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import Icon, {
  WarningOutlined,
  ClusterOutlined,
  FundOutlined,
  HddOutlined,
} from '@ant-design/icons';
import { USER_GUIDE, RIGHT_SIDEBAR_NAMES } from 'const';
import { ReactComponent as DriversIcon } from 'images/drivers-icon.svg';
import { ReactComponent as WorkerIcon } from 'images/worker-icon.svg';
import { useStats, useStorage } from 'hooks/graphql';
import { Badge } from 'antd';
import {
  getColorStatus,
  getStorageColorStatus,
  combineStatus,
} from 'utils/warningColorStatus';
import { Name, IconStyle, itemSubMenuStyle } from './MenuStyles';
import { getBottomActions } from './../../SidebarRight/schema';

const useSubMenuAdmin = totalNewWarnings => {
  const { pageName } = useParams();
  const location = useLocation();

  const { cpu, memory, gpu } = useStats();
  const { storage } = useStorage();
  const dataCounters = useMemo(
    () =>
      getBottomActions({
        warnings: totalNewWarnings,
        cpuStatus: getColorStatus(cpu),
        memoryStatus: combineStatus(
          getColorStatus(memory),
          getStorageColorStatus(storage)
        ),
        gpuStatus: getColorStatus(gpu),
      }),

    [cpu, gpu, memory, storage, totalNewWarnings]
  );

  const menuAdminItems = useMemo(() => {
    const itemsMenu = [
      [
        RIGHT_SIDEBAR_NAMES.WORKERS,
        WorkerIcon,
        `/${RIGHT_SIDEBAR_NAMES.WORKERS}`,
      ],
      [
        RIGHT_SIDEBAR_NAMES.DRIVERS,
        DriversIcon,
        `/${RIGHT_SIDEBAR_NAMES.DRIVERS}`,
      ],
      [
        'Error Log',
        WarningOutlined,
        `${pageName}/${RIGHT_SIDEBAR_NAMES.ERROR_LOGS}`,
        totalNewWarnings,
      ],
      [
        RIGHT_SIDEBAR_NAMES.CPU,
        ClusterOutlined,
        `${pageName}/${RIGHT_SIDEBAR_NAMES.CPU}`,
      ],
      [
        'Memory & Storage',
        HddOutlined,
        `${pageName}/${RIGHT_SIDEBAR_NAMES.MEMORY}`,
      ],
    ];

    if (dataCounters?.gpuStatus?.total) {
      itemsMenu.push([
        RIGHT_SIDEBAR_NAMES.GPU,
        FundOutlined,
        `${pageName}/${RIGHT_SIDEBAR_NAMES.GPU}`,
      ]);
    }

    return itemsMenu;
  }, [dataCounters?.gpuStatus?.total, pageName, totalNewWarnings]);

  const menuAdminItemsJson = useMemo(() => {
    const items = [];

    // eslint-disable-next-line no-unused-vars
    menuAdminItems.forEach(([name, component, path, count]) => {
      items.push({
        style: itemSubMenuStyle,
        label: (
          <Link to={{ pathname: path, search: location.search }}>
            <Name>{name}</Name>{' '}
            {count > 0 && (
              <Badge color="red" count={count} style={{ marginLeft: '25px' }} />
            )}
          </Link>
        ),
        key: `left-sidebar-${name}`,
        className: USER_GUIDE.TABLE_SELECT[name],
        icon: (
          <Icon
            type={component}
            component={component}
            className="icon-left"
            style={IconStyle}
          />
        ),
      });
    });

    return items;
  }, [location.search, menuAdminItems]);

  return {
    menuAdminItemsJson,
  };
};

export default useSubMenuAdmin;
