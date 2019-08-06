import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { useSpring, animated, config } from 'react-spring';

import { ReactComponent as LogoFish } from 'images/logo-fish.svg';
import { ReactComponent as LogoTitle } from 'images/logo-title.svg';
import { ReactComponent as DriversIcon } from 'images/drivers-icon.svg';
import { ReactComponent as PipelineIcon } from 'images/pipeline-icon.svg';
import { ReactComponent as WorkerIcon } from 'images/worker-icon.svg';
import { ReactComponent as AlgorithmIcon } from 'images/algorithm-icon.svg';
import { ReactComponent as JobsIcon } from 'images/jobs-icon.svg';

import { Row, Col, Tag, Layout, Icon, Menu } from 'antd';

import { COLOR_LAYOUT } from 'styles/colors';
import USER_GUIDE from 'constants/user-guide';
import { LEFT_SIDEBAR_NAMES } from 'constants/sidebar-names';
import { dataCountMock } from 'config/template/user-guide.template';

const SiderLight = styled(Layout.Sider)`
  border-right: 1px solid ${COLOR_LAYOUT.border};
`;

const MenuMargin = styled(Menu)`
  margin-top: 10px;
`;

const setMenuItem = (component, title, count) => (
  <Row type="flex" justify="space-between" gutter={10}>
    <Col>
      {component}
      <span>{title}</span>
    </Col>
    {!isNaN(count) && (
      <Col>
        <Tag style={{ color: COLOR_LAYOUT.colorPrimary }}>{count}</Tag>
      </Col>
    )}
  </Row>
);

const IconStyle = {
  fontSize: 22,
  marginTop: 2
};

const addMenuItems = items =>
  items.map(([name, component, count]) => (
    <Menu.Item key={name} className={USER_GUIDE.TABLE_SELECT[name]}>
      {setMenuItem(
        <Icon type={component} component={component} style={IconStyle} />,
        name,
        count
      )}
    </Menu.Item>
  ));

function AnimatedTitle() {
  const styledProps = useSpring({
    config: config.slow,
    from: { opacity: 0 },
    opacity: 1
  });
  return (
    <animated.div style={styledProps}>
      <TitleCenter width="110px" />
    </animated.div>
  );
}

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

export default function SidebarLeft({ onSelect, selectedKeys, ...props }) {
  const [collapsed, setCollapsed] = useState(true);

  useEffect(
    () => {
      setCollapsed(props.collapsed);
    },
    [props.collapsed, setCollapsed]
  );

  const dataCountSource = useSelector(state => ({
    jobsCount: (state.jobsTable.dataSource || []).length,
    driversCount: (state.driverTable.dataSource || []).length,
    algorithmsCount: (state.algorithmTable.dataSource || []).length,
    buildsCount: (state.algorithmBuildsTable.dataSource || []).length,
    pipelinesCount: (state.pipelineTable.dataSource || []).length,
    workersCount: (state.workerTable.stats || { total: 0 }).total,
    debugCount: (state.debugTable.dataSource || []).length
  }));

  const { isOn: isGuideOn } = useSelector(state => state.userGuide);

  const dataCount = isGuideOn ? dataCountMock : dataCountSource;

  const menuItems = [
    [LEFT_SIDEBAR_NAMES.JOBS, JobsIcon, dataCount.jobsCount],
    [LEFT_SIDEBAR_NAMES.PIPELINES, PipelineIcon, dataCount.pipelinesCount],
    [LEFT_SIDEBAR_NAMES.ALGORITHMS, AlgorithmIcon, dataCount.algorithmsCount],
    [LEFT_SIDEBAR_NAMES.WORKERS, WorkerIcon, dataCount.workersCount],
    [LEFT_SIDEBAR_NAMES.DRIVERS, DriversIcon, dataCount.driversCount],
    [LEFT_SIDEBAR_NAMES.BUILDS, 'build', dataCount.buildsCount]
  ];

  return (
    <SiderLight
      {...props}
      theme="light"
      onCollapse={() => setCollapsed(!collapsed)}
      collapsed={collapsed}
    >
      <FlexBox>
        <IconLogo component={LogoFish} />
        {!collapsed && <AnimatedTitle />}
      </FlexBox>
      <MenuMargin
        onSelect={({ key }) => onSelect(key)}
        selectedKeys={selectedKeys}
      >
        {addMenuItems(menuItems)}
      </MenuMargin>
    </SiderLight>
  );
}

SidebarLeft.propTypes = {
  onSelect: PropTypes.func.isRequired
};
