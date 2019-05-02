import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useSpring, animated, config } from 'react-spring';

import { ReactComponent as LogoSvg } from 'images/logoBordered.svg';
import { ReactComponent as DebugIcon } from 'images/debug-icon.svg';
import { ReactComponent as DriversIcon } from 'images/drivers-icon.svg';
import { ReactComponent as PipelineIcon } from 'images/pipeline-icon.svg';
import { ReactComponent as WorkerIcon } from 'images/worker-icon.svg';
import { ReactComponent as AlgorithmIcon } from 'images/algorithm-icon.svg';

import { Row, Col, Tag, Layout, Icon, Menu } from 'antd';

import { HCOLOR } from 'constants/colors';

const IconLogo = styled(Icon)`
  margin: 16px;
  text-align: center;
  font-size: 55px;
  color: transparent;
  width: -webkit-fill-available;
`;

const SiderLight = styled(Layout.Sider)`
  background: ${HCOLOR.colorAccent};
  .ant-menu {
    background-color: ${HCOLOR.colorAccent};
  }
  .ant-layout-sider-trigger {
    color: #777777;
    background: ${HCOLOR.colorAccent};
    font-size: 20px;
  }
`;

const MenuStyled = styled(Menu)`
  background: ${HCOLOR.colorAccent};
`;

const RowCentered = styled(Row)`
  text-align: center;
`;

const TitleBig = styled.span`
  text-transform: uppercase;
  color: ${HCOLOR.colorPrimary};
  font-size: 30px;
  font-weight: bold;
`;

const ColCentered = styled(Col)`
  display: flex;
  flex-direction: column;
  text-align: center;
  justify-content: center;
`;

const setMenuItem = (iconComponent, title, count) => (
  <Row type="flex" justify="start" gutter={10}>
    <Col style={{ textAlign: 'start' }}>{iconComponent}</Col>
    <Col span={11} style={{ textAlign: 'start' }}>
      {title}
    </Col>
    {count && (
      <Col span={4} offset={2}>
        <Tag style={{ color: HCOLOR.colorPrimary }}>{count}</Tag>
      </Col>
    )}
  </Row>
);

const setMenuItems = (items, isCollapsed) =>
  items.map(([name, component, count]) => (
    <Menu.Item key={name}>
      {setMenuItem(
        <Icon type={component} component={component} style={{ fontSize: '20px' }} />,
        name,
        count
      )}
    </Menu.Item>
  ));

function Animated() {
  const styledProps = useSpring({ config: config.slow, opacity: 1, from: { opacity: 0 } });
  return (
    <animated.div style={styledProps}>
      <TitleBig>Hkube</TitleBig>
    </animated.div>
  );
}

export default function Sider({ onSelect, ...props }) {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <SiderLight collapsible onCollapse={() => setCollapsed(!collapsed)} collapsed={collapsed}>
      <RowCentered type="flex">
        <ColCentered span={9}>
          <IconLogo component={LogoSvg} />
        </ColCentered>

        {collapsed ? (
          <div />
        ) : (
          <ColCentered span={14}>
            <Animated />
          </ColCentered>
        )}
      </RowCentered>

      <MenuStyled mode="inline" onSelect={i => onSelect(i.key)} defaultSelectedKeys={['Jobs']}>
        {setMenuItems([
          ['Jobs', 'area-chart', props.jobsCount],
          ['Pipelines', PipelineIcon, props.pipelinesCount],
          ['Workers', WorkerIcon, props.workersCount],
          ['Drivers', DriversIcon, props.driversCount],
          ['Algorithms', AlgorithmIcon, props.algorithmsCount],
          ['Debug', DebugIcon, props.debugCount],
          ['Builds', 'build', props.buildsCount],
          ['CPU', 'heat-map', undefined],
          ['Memory', 'hdd', undefined]
        ])}
      </MenuStyled>
    </SiderLight>
  );
}

Sider.propTypes = {
  jobsCount: PropTypes.number,
  pipelinesCount: PropTypes.number,
  workersCount: PropTypes.number,
  driversCount: PropTypes.number,
  algorithmsCount: PropTypes.number,
  debugCount: PropTypes.number,
  buildsCount: PropTypes.number,
  onSelect: PropTypes.func.isRequired
};
