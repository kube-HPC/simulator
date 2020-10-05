import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Layout, Icon, Menu, Badge } from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { useErrorLogs } from 'hooks';
import useStats from 'hooks/useStats';
import useStorage from 'hooks/useStorage';
import {
  getColorStatus,
  getStorageColorStatus,
  combineStatus,
} from 'utils/warningColorStatus';
import { getBottomActions, topActions } from './schema';

const SiderLight = styled(Layout.Sider)`
  border: none;
`;

const centerIconStyle = { fontSize: '25px', marginLeft: '-14px' };

const topMargin = { marginTop: '20%' };
const noItemSelect = [];

const SidebarRight = ({ isTop, className }) => {
  // const { openDrawer } = useDrawer();
  const { root } = useParams();
  const history = useHistory();

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
  const menuSelect = useCallback(({ key }) => history.push(`/${root}/${key}`), [
    history,
    root,
  ]);

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
          ({ name, type, component, count, status }) => (
            <Menu.Item key={name} title={name}>
              <Badge
                status={status}
                count={count}
                overflowCount={100}
                offset={[0, 11]}>
                <Icon
                  type={type}
                  component={component}
                  style={centerIconStyle}
                />
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

export default React.memo(SidebarRight);
