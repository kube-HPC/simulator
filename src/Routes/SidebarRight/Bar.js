import React, { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectors } from 'reducers';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Icon from '@ant-design/icons';
import { Layout, Menu, Badge } from 'antd';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useErrorLogs, useStats, useStorage } from 'hooks/graphql';
import { RIGHT_SIDEBAR_NAMES } from 'const';
// import useStorage from 'hooks/useStorage';
import {
  getColorStatus,
  getStorageColorStatus,
  combineStatus,
} from 'utils/warningColorStatus';

import { getBottomActions, topActions } from './schema';

const SiderLight = styled(Layout.Sider)`
  border: none;
  .ant-menu.ant-menu-inline-collapsed > .ant-menu-item .anticon svg {
    font-size: 25px;

    margin-left: -4px;
    margin-top: 8px;
  }

  .ant-menu.ant-menu-inline-collapsed .anticon svg {
    font-size: 25px;
    margin-left: -4px;
    margin-top: 8px;
  }
`;

const topMargin = { marginTop: '20%' };
const noItemSelect = [];

const SidebarRight = ({ isTop, className }) => {
  // add datasources when this enable

  const { dataSourceIsEnable } = useSelector(selectors.connection);
  const { root } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const { totalNewWarnings } = useErrorLogs();
  const { cpu, memory, gpu } = useStats();
  const { storage } = useStorage();
  const { top, bottom } = useMemo(
    () => ({
      top: dataSourceIsEnable
        ? topActions
        : topActions.filter(x => x.name !== RIGHT_SIDEBAR_NAMES.ADD_DATASOURCE),
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
      navigate(`/${root}/${key}${location.search}`);
    },
    [navigate, root, location]
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
          title: `${name}`,
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
