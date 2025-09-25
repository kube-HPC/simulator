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

const useSubMenuAdmin = (totalNewWarnings, dataMoreCount) => {
  // const { pageName } = useParams();
  const { pathname } = useLocation();
  const pageName = pathname.split('/')[1] || '';
  console.log('pageName4', pageName);
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

  const menuAdminItems = useMemo(() => {
    const itemsMenu = [
      [
        RIGHT_SIDEBAR_NAMES.WORKERS,
        WorkerIcon,
        `/${RIGHT_SIDEBAR_NAMES.WORKERS}`,
        dataMoreCount.workers,
      ],
      [
        RIGHT_SIDEBAR_NAMES.DRIVERS,
        DriversIcon,
        `/${RIGHT_SIDEBAR_NAMES.DRIVERS}`,
        dataMoreCount.drivers,
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
  }, [
    dataMoreCount.workers,
    dataMoreCount.drivers,
    pageName,
    totalNewWarnings,
    hasGPU,
  ]);

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
              // <Badge color="red" count={count} style={{ marginLeft: '25px' }} />
              <BadgeStyle offset={[-7, 0]}>
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
  }, [location.search, menuAdminItems]);

  return {
    menuAdminItemsJson,
  };
};

export default useSubMenuAdmin;
