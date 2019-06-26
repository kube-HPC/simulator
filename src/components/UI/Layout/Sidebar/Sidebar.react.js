import React, { useState } from 'react';
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

const addMenuItems = items =>
  items.map(([name, component, count]) => (
    <Menu.Item key={name}>
      {setMenuItem(
        <Icon
          type={component}
          component={component}
          style={{ fontSize: '20px' }}
        />,
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

export default function Sidebar({ onSelect }) {
  const [collapsed, setCollapsed] = useState(true);

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
    ['Workers', WorkerIcon, dataCount.workersCount],
    ['Drivers', DriversIcon, dataCount.driversCount],
    ['Algorithms', AlgorithmIcon, dataCount.algorithmsCount],
    ['Debug', DebugIcon, dataCount.debugCount],
    ['Builds', 'build', dataCount.buildsCount]
  ];

  return (
    <SiderLight
      theme="light"
      collapsible
      onCollapse={() => setCollapsed(!collapsed)}
      collapsed={collapsed}
    >
      <FlexBox>
        <IconLogo component={LogoFish} />
        {!collapsed && <AnimatedTitle />}
      </FlexBox>
      <Menu
        onSelect={i => onSelect(i.key)}
        defaultSelectedKeys={[menuItems[0][0]]}
      >
        {addMenuItems(menuItems)}
        <Menu.SubMenu
          title={setMenuItem(
            <Icon type={'pie-chart'} style={{ fontSize: '20px' }} />,
            'Cluster Stats'
          )}
        >
          {addMenuItems([['CPU', 'heat-map'], ['Memory', 'hdd']])}
        </Menu.SubMenu>
      </Menu>
    </SiderLight>
  );
}

Sidebar.propTypes = {
  onSelect: PropTypes.func.isRequired
};
