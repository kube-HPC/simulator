import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { animated, useSpring } from 'react-spring';
import styled from 'styled-components';
import isEqual from 'lodash/isEqual';
import { useLeftSidebar } from 'hooks';
import { Icon, Layout, Menu, Tag } from 'antd';
import { Link } from 'react-router-dom';
import { FlexBox } from 'components/common';
import { dataCountMock } from 'config';
import { LEFT_SIDEBAR_NAMES, USER_GUIDE } from 'const';
import { ReactComponent as AlgorithmIcon } from 'images/algorithm-icon.svg';
import { ReactComponent as DebugIcon } from 'images/debug-icon.svg';
import { ReactComponent as DriversIcon } from 'images/drivers-icon.svg';
import { ReactComponent as JobsIcon } from 'images/jobs-icon.svg';
import { ReactComponent as LogoFish } from 'images/logo-fish.svg';
import { ReactComponent as LogoTitle } from 'images/logo-title.svg';
import { ReactComponent as PipelineIcon } from 'images/pipeline-icon.svg';
import { ReactComponent as WorkerIcon } from 'images/worker-icon.svg';
import { COLOR_LAYOUT } from 'styles';

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

const IconStyle = {
  fontSize: 22,
  marginTop: 2,
};

const AnimatedTitle = () => {
  const styledProps = useSpring({
    from: { opacity: 0 },
    opacity: 1,
  });
  return (
    <animated.div style={styledProps}>
      <TitleCenter width="110px" />
    </animated.div>
  );
};

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

const LogoContainer = styled.div`
  margin-top: 10px;
  display: flex;
`;

const equalByGuideOn = (a, b) => a.isOn === b.isOn;

const DEFAULT_VALUE = [];
const EMPTY_WORKERS = { total: 0 };

const sidebarSelector = state => ({
  jobsCount: (state.jobsTable.dataSource || DEFAULT_VALUE).length,
  driversCount: (state.driverTable.dataSource || DEFAULT_VALUE).length,
  algorithmsCount: (state.algorithmTable.dataSource || DEFAULT_VALUE).length,
  pipelinesCount: (state.pipelineTable.dataSource || DEFAULT_VALUE).length,
  workersCount: (state.workerTable.stats || EMPTY_WORKERS).total,
  debugCount: (state.debugTable.dataSource || DEFAULT_VALUE).length,
});

// TODO: cleanup the menu items collection
const SidebarLeft = ({ className }) => {
  const dataCountSource = useSelector(sidebarSelector, isEqual);
  const { isOn } = useSelector(state => state.userGuide, equalByGuideOn);
  const dataCount = isOn ? dataCountMock : dataCountSource;
  const { isCollapsed, toggle } = useLeftSidebar();

  const menuItems = [
    [LEFT_SIDEBAR_NAMES.JOBS, JobsIcon, dataCount.jobsCount, '/jobs'],
    [
      LEFT_SIDEBAR_NAMES.PIPELINES,
      PipelineIcon,
      dataCount.pipelinesCount,
      '/pipelines',
    ],
    [
      LEFT_SIDEBAR_NAMES.ALGORITHMS,
      AlgorithmIcon,
      dataCount.algorithmsCount,
      '/algorithms',
    ],
    [
      LEFT_SIDEBAR_NAMES.WORKERS,
      WorkerIcon,
      dataCount.workersCount,
      '/workers',
    ],
    [
      LEFT_SIDEBAR_NAMES.DRIVERS,
      DriversIcon,
      dataCount.driversCount,
      '/drivers',
    ],
    [LEFT_SIDEBAR_NAMES.DEBUG, DebugIcon, dataCount.debugCount, '/debug'],
  ];

  return (
    <Border>
      <Sider
        className={className}
        theme="light"
        onCollapse={toggle}
        collapsed={isCollapsed}>
        <LogoContainer>
          <IconLogo component={LogoFish} />
          {!isCollapsed && <AnimatedTitle />}
        </LogoContainer>
        <MenuMargin>
          {menuItems.map(([name, component, count, path]) => (
            <Menu.Item key={name} className={USER_GUIDE.TABLE_SELECT[name]}>
              <Link to={path}>
                <FlexBox>
                  <FlexBox.Item>
                    <Icon
                      type={component}
                      component={
                        typeof component === 'string' ? null : component
                      }
                      style={IconStyle}
                    />
                    <span>{name}</span>
                  </FlexBox.Item>
                  {!Number.isNaN(count) && (
                    <FlexBox.Item>
                      <Tag style={tagStyle}>{count}</Tag>
                    </FlexBox.Item>
                  )}
                </FlexBox>
              </Link>
            </Menu.Item>
          ))}
        </MenuMargin>
      </Sider>
    </Border>
  );
};

export default React.memo(SidebarLeft);

SidebarLeft.propTypes = {
  className: PropTypes.string.isRequired,
};
