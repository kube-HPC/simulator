import React, { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon, {
  WarningOutlined,
  ClusterOutlined,
  FundOutlined,
  HddOutlined,
} from '@ant-design/icons';
import { USER_GUIDE, RIGHT_SIDEBAR_NAMES } from 'const';
import { ReactComponent as DriversIcon } from 'images/drivers-icon.svg';
import { ReactComponent as WorkerIcon } from 'images/worker-icon.svg';
import { useStats } from 'hooks/graphql';
import { Tag } from 'antd';

import {
  Name,
  IconStyle,
  itemSubMenuStyle,
  BadgeStyle,
  tagStyle,
} from './MenuStyles';

const useSubMenus = (totalNewWarnings, dataMoreCount) => {
  const { pathname } = useLocation();
  const pageName = pathname.split('/')[1] || '';
  const location = useLocation();
  const { gpu } = useStats();

  const hasGPU = useMemo(
    () =>
      gpu?.results
        ? gpu.results.some(server =>
            server.algorithmsData.some(algo => algo.size > 0)
          )
        : false,
    [gpu?.results]
  );

  // ADMINISTRATION MENU (Admin only - Drivers ONLY)
  const menuAdminItems = useMemo(
    () => [
      [
        RIGHT_SIDEBAR_NAMES.DRIVERS,
        DriversIcon,
        `/${RIGHT_SIDEBAR_NAMES.DRIVERS}`,
        dataMoreCount.drivers,
      ],
    ],
    [dataMoreCount.drivers]
  );

  // OBSERVABILITY MENU (All users - Workers + monitoring)
  const menuObservabilityItems = useMemo(() => {
    const itemsMenu = [
      [
        RIGHT_SIDEBAR_NAMES.WORKERS,
        WorkerIcon,
        `/${RIGHT_SIDEBAR_NAMES.WORKERS}`,
        dataMoreCount.workers,
      ],
      [
        'Error Log',
        WarningOutlined,
        `/${pageName}/${RIGHT_SIDEBAR_NAMES.ERROR_LOGS}`,
        totalNewWarnings,
      ],
      [
        RIGHT_SIDEBAR_NAMES.CPU,
        ClusterOutlined,
        `/${pageName}/${RIGHT_SIDEBAR_NAMES.CPU}`,
      ],
      [
        'Memory & Storage',
        HddOutlined,
        `/${pageName}/${RIGHT_SIDEBAR_NAMES.MEMORY}`,
      ],
    ];

    if (hasGPU) {
      itemsMenu.push([
        RIGHT_SIDEBAR_NAMES.GPU,
        FundOutlined,
        `${pageName}/${RIGHT_SIDEBAR_NAMES.GPU}`,
      ]);
    }

    return itemsMenu;
  }, [dataMoreCount.workers, pageName, totalNewWarnings, hasGPU]);

  // Convert Admin items to JSON
  const menuAdminItemsJson = useMemo(() => {
    const items = [];
    menuAdminItems.forEach(([name, component, path, count]) => {
      items.push({
        style: itemSubMenuStyle,
        label: (
          <Link to={{ pathname: path, search: location.search }}>
            <Name>{name}</Name>{' '}
            {count > 0 && (
              <BadgeStyle offset={[-7, 0]}>
                <Tag color="" style={tagStyle}>
                  {count}
                </Tag>
              </BadgeStyle>
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

  // Convert Observability items to JSON
  const menuObservabilityItemsJson = useMemo(() => {
    const items = [];
    menuObservabilityItems.forEach(([name, component, path, count]) => {
      items.push({
        style: itemSubMenuStyle,
        label: (
          <Link to={{ pathname: path, search: location.search }}>
            <Name>{name}</Name>{' '}
            {count > 0 && (
              <BadgeStyle offset={[-10, 0]}>
                <Tag color={name === 'Error Log' ? 'red' : ''} style={tagStyle}>
                  {count}
                </Tag>
              </BadgeStyle>
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
  }, [location.search, menuObservabilityItems]);

  return {
    menuAdminItemsJson,
    menuObservabilityItemsJson,
  };
};

export default useSubMenus;
