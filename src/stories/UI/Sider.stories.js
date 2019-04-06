import React, { useState } from 'react';

import { storiesOf } from '@storybook/react';
import { Card, Menu, Sider, Row, Col, Tag, SubMenu, Icon, Layout, Button } from 'antd';
import styled from 'styled-components';

import MenuIcon from 'components/dumb/MenuIcon.react';
import AnimatedHeader from 'components/dumb/AnimatedHeader.react';

import { ReactComponent as LogoSvg } from 'images/logoBordered.svg';
import { ReactComponent as DebugIcon } from 'images/debug-icon.svg';
import { ReactComponent as DriversIcon } from 'images/drivers-icon.svg';
import { ReactComponent as PipelineIcon } from 'images/pipeline-icon.svg';
import { ReactComponent as WorkerIcon } from 'images/worker-icon.svg';
import { ReactComponent as AlgorithmIcon } from 'images/algorithm-icon.svg';

const showHeader = isCollapsed =>
  isCollapsed ? (
    <div />
  ) : (
    <Col span={12} style={{ margin: 'auto' }}>
      <AnimatedHeader />
    </Col>
  );

const setMenuItem = (iconComponent, title, count) => (
  <Row type="flex" justify="start">
    <Col>{iconComponent} </Col>
    <Col span={12}>{title}</Col>
    <Col span={3} offset={3}>
      <Tag className="tag">{count}</Tag>
    </Col>
  </Row>
);

const setMenuItemTitle = (title, count) => (
  <div>
    {title} <Tag className="tag">{count}</Tag>
  </div>
);

function LayoutSider() {
  const [isCollapsed, setIsCollapsed] = useState(true);
  //   const props = {
  //     jobsCount: 0,
  //     pipelineCount: 0,
  //     algorithmCount: 0,
  //     workersCount: 0,
  //     driversCount: 0,
  //     algorithmBuildsCount: 0,
  //     debugCount: 0
  //   };

  const toggleCollapsed = () => setIsCollapsed(!isCollapsed);
  return (
    <Menu className="menu" mode="inline" defaultSelectedKeys={['1']}>
      <Menu.Item key="1" title={setMenuItemTitle('Jobs', 0)}>
        {setMenuItem(<MenuIcon type="area-chart" />, 'Jobs', 0)}
      </Menu.Item>
      <Menu.Item key="3" title={setMenuItemTitle('Workers', 0)}>
        {setMenuItem(<MenuIcon type={WorkerIcon} />, 'Workers', 0)}
      </Menu.Item>
    </Menu>
  );
}

storiesOf('UI|Sider', module).add('Default', () => <LayoutSider />);
