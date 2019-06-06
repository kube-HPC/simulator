import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
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

import { HCOLOR } from 'constants/colors';

const SiderLight = styled(Layout.Sider)`
  border-right: 1px solid ${HCOLOR.border};
`;

const setMenuItem = (component, title, count) => (
  <Row type="flex" justify="space-between" gutter={10}>
    <Col>
      {component}
      <span>{title}</span>
    </Col>
    {!isNaN(count) && (
      <Col>
        <Tag style={{ color: HCOLOR.colorPrimary }}>{count}</Tag>
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

export default function Sidebar({ onSelect, ...props }) {
  const [collapsed, setCollapsed] = useState(true);

  const menuItems = [
    ['Jobs', JobsIcon, props.jobsCount],
    ['Pipelines', PipelineIcon, props.pipelinesCount],
    ['Workers', WorkerIcon, props.workersCount],
    ['Drivers', DriversIcon, props.driversCount],
    ['Algorithms', AlgorithmIcon, props.algorithmsCount],
    ['Debug', DebugIcon, props.debugCount],
    ['Builds', 'build', props.buildsCount]
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
  jobsCount: PropTypes.number,
  pipelinesCount: PropTypes.number,
  workersCount: PropTypes.number,
  driversCount: PropTypes.number,
  algorithmsCount: PropTypes.number,
  debugCount: PropTypes.number,
  buildsCount: PropTypes.number,
  onSelect: PropTypes.func.isRequired
};
