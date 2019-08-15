import React, { useState, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { useSpring, animated } from 'react-spring';

import { ReactComponent as LogoFish } from 'images/logo-fish.svg';
import { ReactComponent as LogoTitle } from 'images/logo-title.svg';
import { ReactComponent as DriversIcon } from 'images/drivers-icon.svg';
import { ReactComponent as DebugIcon } from 'images/debug-icon.svg';
import { ReactComponent as PipelineIcon } from 'images/pipeline-icon.svg';
import { ReactComponent as WorkerIcon } from 'images/worker-icon.svg';
import { ReactComponent as AlgorithmIcon } from 'images/algorithm-icon.svg';
import { ReactComponent as JobsIcon } from 'images/jobs-icon.svg';

import { isEqual } from 'lodash';

import { Col, Tag, Layout, Icon, Menu } from 'antd';
import { COLOR_LAYOUT } from 'styles';
import { USER_GUIDE, LEFT_SIDEBAR_NAMES } from 'const';
import { dataCountMock } from 'config';
import { FlexRow } from 'components/common';

const Border = styled.div`
  border-right: 1px solid ${COLOR_LAYOUT.border};
`;

const Sider = styled(Layout.Sider)`
  .ant-menu-inline,
  .ant-menu-vertical,
  .ant-menu-vertical-left {
    border-right: none;
  }
`;

const MenuMargin = styled(Menu)`
  margin-top: 10px;
`;

const tagStyle = { color: COLOR_LAYOUT.colorPrimary };

const setMenuItem = (component, title, count) => (
  <FlexRow>
    <Col>
      {component}
      <span>{title}</span>
    </Col>
    {!isNaN(count) && (
      <Col>
        <Tag style={tagStyle}>{count}</Tag>
      </Col>
    )}
  </FlexRow>
);

const IconStyle = {
  fontSize: 22,
  marginTop: 2
};

const MenuItemMemo = React.memo(Menu.Item);
const MemoIcon = React.memo(Icon);

const addMenuItems = items =>
  items.map(([name, component, count]) => (
    <MenuItemMemo key={name} className={USER_GUIDE.TABLE_SELECT[name]}>
      {setMenuItem(
        <MemoIcon type={component} component={component} style={IconStyle} />,
        name,
        count
      )}
    </MenuItemMemo>
  ));

const AnimatedTitle = () => {
  const styledProps = useSpring({
    from: { opacity: 0 },
    opacity: 1
  });
  return (
    <animated.div style={styledProps}>
      <TitleCenter width="110px" />
    </animated.div>
  );
};

const FlexBox = styled.div`
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

const IconLogo = styled(Icon)`
  && {
    margin-bottom: 5px;
    margin-left: 5px;
    font-size: 75px;
  }
`;
const TitleCenter = styled(LogoTitle)`
  align-self: flex-start;
`;

const equalByGuideOn = (a, b) => a.isOn === b.isOn;

const DEFAULT_VALUE = [];
const EMPTY_WORKERS = { total: 0 };

const SidebarMemo = React.memo(Sider);
const MenuMemo = React.memo(MenuMargin);

const SidebarLeft = ({ onSelect, selectedKeys, ...props }) => {
  const [collapsed, setCollapsed] = useState(true);

  useEffect(() => {
    setCollapsed(props.collapsed);
  }, [props.collapsed, setCollapsed]);

  const dataCountSource = useSelector(
    state => ({
      jobsCount: (state.jobsTable.dataSource || DEFAULT_VALUE).length,
      driversCount: (state.driverTable.dataSource || DEFAULT_VALUE).length,
      algorithmsCount: (state.algorithmTable.dataSource || DEFAULT_VALUE).length,
      buildsCount: (state.algorithmBuildsTable.dataSource || DEFAULT_VALUE).length,
      pipelinesCount: (state.pipelineTable.dataSource || DEFAULT_VALUE).length,
      workersCount: (state.workerTable.stats || EMPTY_WORKERS).total,
      debugCount: (state.debugTable.dataSource || DEFAULT_VALUE).length
    }),
    isEqual
  );

  const { isOn } = useSelector(state => state.userGuide, equalByGuideOn);

  const dataCount = isOn ? dataCountMock : dataCountSource;

  const menuItems = [
    [LEFT_SIDEBAR_NAMES.JOBS, JobsIcon, dataCount.jobsCount],
    [LEFT_SIDEBAR_NAMES.PIPELINES, PipelineIcon, dataCount.pipelinesCount],
    [LEFT_SIDEBAR_NAMES.ALGORITHMS, AlgorithmIcon, dataCount.algorithmsCount],
    [LEFT_SIDEBAR_NAMES.WORKERS, WorkerIcon, dataCount.workersCount],
    [LEFT_SIDEBAR_NAMES.DRIVERS, DriversIcon, dataCount.driversCount],
    [LEFT_SIDEBAR_NAMES.DEBUG, DebugIcon, dataCount.debugCount],
    [LEFT_SIDEBAR_NAMES.BUILDS, 'build', dataCount.buildsCount]
  ];

  const onMenuSelect = useCallback(({ key }) => onSelect(key), [onSelect]);
  const items = useMemo(() => addMenuItems(menuItems), [menuItems]);
  const onCollapse = useCallback(() => setCollapsed(p => !p), [setCollapsed]);

  return (
    <Border>
      <SidebarMemo {...props} theme="light" onCollapse={onCollapse} collapsed={collapsed}>
        <FlexBox>
          <IconLogo component={LogoFish} />
          {!collapsed && <AnimatedTitle />}
        </FlexBox>
        <MenuMemo onSelect={onMenuSelect} selectedKeys={selectedKeys}>
          {items}
        </MenuMemo>
      </SidebarMemo>
    </Border>
  );
};

export default React.memo(SidebarLeft);

SidebarLeft.propTypes = {
  onSelect: PropTypes.func.isRequired
};
