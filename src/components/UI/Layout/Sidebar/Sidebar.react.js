import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { useSpring, animated, config } from 'react-spring';

import { ReactComponent as LogoFish } from 'images/logo-fish.svg';
import { ReactComponent as LogoTitle } from 'images/logo-title.svg';
import { ReactComponent as DebugIcon } from 'images/debug-icon.svg';
import { ReactComponent as DriversIcon } from 'images/drivers-icon.svg';
import { ReactComponent as PipelineIcon } from 'images/pipeline-icon.svg';
import { ReactComponent as WorkerIcon } from 'images/worker-icon.svg';
import { ReactComponent as AlgorithmIcon } from 'images/algorithm-icon.svg';
import { ReactComponent as JobsIcon } from 'images/jobs-icon.svg';

import { Row, Col, Tag, Layout, Icon, Menu } from 'antd';

import { LAYOUT_COLOR } from 'constants/colors';

const SiderLight = styled(Layout.Sider)`
  border-right: 1px solid ${LAYOUT_COLOR.border};
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
        <Tag style={{ color: LAYOUT_COLOR.colorPrimary }}>{count}</Tag>
      </Col>
    )}
  </Row>
);

const IconStyle = {
  fontSize: 22,
  marginLeft: -2,
  marginRight: 20,
  marginTop: 2
};

const addMenuItems = items =>
  items.map(([name, component, count]) => (
    <Menu.Item key={name}>
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
    margin-bottom: 10px;
    font-size: 81px;
  }
`;
const TitleCenter = styled(LogoTitle)`
  align-self: flex-start;
`;

export default function Sidebar({ onSelect, ...props }) {
  const [collapsed, setCollapsed] = useState(true);

  useEffect(
    () => {
      setCollapsed(props.collapsed);
    },
    [props.collapsed, setCollapsed]
  );

  const dataCount = useSelector(state => ({
    jobsCount: (state.jobsTable.dataSource || []).length,
    driversCount: (state.driverTable.dataSource || []).length,
    algorithmsCount: (state.algorithmTable.dataSource || []).length,
    buildsCount: (state.algorithmBuildsTable.dataSource || []).length,
    pipelinesCount: (state.pipelineTable.dataSource || []).length,
    workersCount: (state.workerTable.stats || { total: 0 }).total,
    debugCount: (state.debugTable.dataSource || []).length
  }));

  const menuItems = [
    ['Jobs', JobsIcon, dataCount.jobsCount],
    ['Pipelines', PipelineIcon, dataCount.pipelinesCount],
    ['Algorithms', AlgorithmIcon, dataCount.algorithmsCount],
    ['Workers', WorkerIcon, dataCount.workersCount],
    ['Drivers', DriversIcon, dataCount.driversCount],
    ['Debug', DebugIcon, dataCount.debugCount],
    ['Builds', 'build', dataCount.buildsCount]
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
        onSelect={i => onSelect(i.key)}
        defaultSelectedKeys={[menuItems[0][0]]}
      >
        {addMenuItems(menuItems)}
        <Menu.SubMenu
          title={setMenuItem(
            <Icon type={'pie-chart'} style={IconStyle} />,
            'Cluster Stats'
          )}
        >
          {addMenuItems([['CPU', 'heat-map'], ['Memory', 'hdd']])}
        </Menu.SubMenu>
      </MenuMargin>
    </SiderLight>
  );
}

Sidebar.propTypes = {
  onSelect: PropTypes.func.isRequired
};
