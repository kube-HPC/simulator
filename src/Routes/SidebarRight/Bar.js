import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Icon from '@ant-design/icons';
import { Layout, Menu, Badge } from 'antd';
import { useHistory, useLocation, useParams, Link } from 'react-router-dom';
import { useErrorLogs, useStats, useStorage } from 'hooks/graphql';
// import useStorage from 'hooks/useStorage';
import {
  getColorStatus,
  getStorageColorStatus,
  combineStatus,
} from 'utils/warningColorStatus';
import { RIGHT_SIDEBAR_NAMES } from 'const';
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
  const cancelClickMenu = [
    RIGHT_SIDEBAR_NAMES.WORKERS,
    RIGHT_SIDEBAR_NAMES.DRIVERS,
  ];
  const menuSelect = useCallback(
    ({ key }) => {
      !cancelClickMenu.includes(key)
        ? history.push(`/${root}/${key}${location.search}`)
        : false;
    },
    [history, root, location]
  );

  return (
    <SiderLight
      className={className}
      theme="light"
      collapsedWidth={60}
      collapsed>
      <Menu
        mode="vertical"
        onSelect={menuSelect}
        style={topMargin}
        selectedKeys={noItemSelect}>
        {(isTop ? top : bottom).map(
          ({ name, isTypeLink, type, component, count, status }) => (
            <Menu.Item key={name} title={name}>
              <Badge
                status={status}
                count={count}
                overflowCount={100}
                offset={[0, 11]}>
                {!isTypeLink ? (
                  <Icon type={type} component={component} />
                ) : (
                  <Link to={{ pathname: `/${name}`, search: location.search }}>
                    <Icon type={type} component={component} />
                  </Link>
                )}
              </Badge>
            </Menu.Item>
          )
        )}
      </Menu>
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
