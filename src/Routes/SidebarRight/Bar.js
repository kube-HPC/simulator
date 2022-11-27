import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Icon from '@ant-design/icons';
import { Layout, Menu, Badge } from 'antd';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { useErrorLogs, useStats, useStorage } from 'hooks/graphql';
// import useStorage from 'hooks/useStorage';
import {
  getColorStatus,
  getStorageColorStatus,
  combineStatus,
} from 'utils/warningColorStatus';

import { getBottomActions, topActions } from './schema';

const SiderLight = styled(Layout.Sider)`
  border: none;
  .ant-menu.ant-menu-inline-collapsed > .ant-menu-item .anticon {
    font-size: 25px;
  }

  .ant-menu.ant-menu-inline-collapsed .anticon {
    font-size: 25px;
  }
`;

const topMargin = { marginTop: '20%' };
const noItemSelect = [];

const SidebarRight = ({ isTop, className }) => {
  const { root } = useParams();
  const history = useHistory();
  const location = useLocation();

  const { totalNewWarnings } = useErrorLogs();
  const { cpu, memory, gpu } = useStats();
  const { storage } = useStorage();
  const { top, bottom } = useMemo(
    () => ({
      top: topActions,
      bottom: getBottomActions({
        warnings: totalNewWarnings,
        cpuStatus: getColorStatus(cpu),
        memoryStatus: combineStatus(
          getColorStatus(memory),
          getStorageColorStatus(storage)
        ),
        gpuStatus: getColorStatus(gpu),
      }),
    }),
    [cpu, gpu, memory, storage, totalNewWarnings]
  );

  // const menuSelect = useCallback(({ key }) => openDrawer(key), [openDrawer]);

  const menuSelect = useCallback(
    ({ key }) => {
      history.push(`/${root}/${key}${location.search}`);
    },
    [history, root, location]
  );

  const menuItemsJson = useMemo(() => {
    const items = [];

    (isTop ? top : bottom).forEach(
      ({ name, type, component, count, status }) => {
        items.push({
          label: (
            <Badge
              status={status}
              count={count}
              overflowCount={100}
              offset={[0, 11]}>
              <Icon type={type} component={component} />
            </Badge>
          ),
          key: `${name}`,
        });
      }
    );

    return items;
  }, [bottom, isTop, top]);

  return (
    <SiderLight
      className={className}
      theme="light"
      collapsedWidth={60}
      collapsed>
      <Menu
        items={menuItemsJson}
        style={topMargin}
        mode="vertical"
        onSelect={menuSelect}
        selectedKeys={noItemSelect}
      />
    </SiderLight>
  );
};

SidebarRight.propTypes = {
  isTop: PropTypes.bool,
  className: PropTypes.string,
  ...Layout.Sider.propTypes,
};

SidebarRight.defaultProps = {
  isTop: false,
  className: '',
};

export default SidebarRight;
