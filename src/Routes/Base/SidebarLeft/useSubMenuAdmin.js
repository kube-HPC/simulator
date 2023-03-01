import React, { useMemo } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import {
  WarningOutlined,
  ClusterOutlined,
  FundOutlined,
  HddOutlined,
} from '@ant-design/icons';
import { USER_GUIDE, RIGHT_SIDEBAR_NAMES } from 'const';
import { ReactComponent as DriversIcon } from 'images/drivers-icon.svg';
import { ReactComponent as WorkerIcon } from 'images/worker-icon.svg';
import { useErrorLogs, useStats, useStorage } from 'hooks/graphql';
import { Tag } from 'antd';
import {
  getColorStatus,
  getStorageColorStatus,
  combineStatus,
} from 'utils/warningColorStatus';
import { tagStyle, Name, BadgeStyle } from './MenuStyles';
import { getBottomActions } from './../../SidebarRight/schema';

const useSubMenuAdmin = () => {
  const { pageName } = useParams();
  const location = useLocation();

  const { totalNewWarnings } = useErrorLogs();
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
        label: (
          <Link to={{ pathname: path, search: location.search }}>
            <Name>{name}</Name>{' '}
            {count > 0 && (
              <BadgeStyle offset={[-7, 0]}>
                <Tag style={tagStyle}>{count}</Tag>
              </BadgeStyle>
            )}
          </Link>
        ),
        key: `left-sidebar-${name}`,
        className: USER_GUIDE.TABLE_SELECT[name],
        // icon: <Icon type={component} component={component} style={IconStyle} />,
      });
    });

    return items;
  }, [location.search, menuAdminItems]);

  return {
    menuAdminItemsJson,
  };
};

export default useSubMenuAdmin;
