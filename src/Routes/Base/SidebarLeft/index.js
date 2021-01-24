import React from 'react';
import { useSelector } from 'react-redux';
import { animated, useSpring } from 'react-spring';
import styled from 'styled-components';
import isEqual from 'lodash/isEqual';
import { useLeftSidebar } from 'hooks';
import { Icon, Layout, Menu, Tag } from 'antd';
import { Link, useLocation, useParams } from 'react-router-dom';
import { FlexBox } from 'components/common';
import { dataCountMock } from 'config';
import { LEFT_SIDEBAR_NAMES, USER_GUIDE } from 'const';
import { ReactComponent as AlgorithmIcon } from 'images/algorithm-icon.svg';
import { ReactComponent as DebugIcon } from 'images/debug-icon.svg';
import { ReactComponent as DataSourceIcon } from 'images/datasource.svg';
import { ReactComponent as DriversIcon } from 'images/drivers-icon.svg';
import { ReactComponent as JobsIcon } from 'images/jobs-icon.svg';
import { ReactComponent as LogoFish } from 'images/logo-fish.svg';
import { ReactComponent as LogoTitle } from 'images/logo-title.svg';
import { ReactComponent as PipelineIcon } from 'images/pipeline-icon.svg';
import { ReactComponent as WorkerIcon } from 'images/worker-icon.svg';
import { COLOR_LAYOUT } from 'styles';
import { selectors } from 'reducers';

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

const sidebarSelector = state => ({
  [LEFT_SIDEBAR_NAMES.JOBS]: selectors.jobs.count(state),
  [LEFT_SIDEBAR_NAMES.PIPELINES]: selectors.pipelines.collection.count(state),
  [LEFT_SIDEBAR_NAMES.ALGORITHMS]: selectors.algorithms.collection.count(state),
  [LEFT_SIDEBAR_NAMES.WORKERS]: selectors.workers.count(state),
  [LEFT_SIDEBAR_NAMES.DRIVERS]: selectors.drivers.count(state),
  [LEFT_SIDEBAR_NAMES.DEBUG]: selectors.debug.count(state),
  [LEFT_SIDEBAR_NAMES.DATASOURCES]: selectors.dataSources.count(state),
});

const menuItems = [
  [LEFT_SIDEBAR_NAMES.JOBS, JobsIcon, '/jobs'],
  [LEFT_SIDEBAR_NAMES.PIPELINES, PipelineIcon, '/pipelines'],
  [LEFT_SIDEBAR_NAMES.ALGORITHMS, AlgorithmIcon, '/algorithms'],
  [LEFT_SIDEBAR_NAMES.DEBUG, DebugIcon, '/debug'],
  [LEFT_SIDEBAR_NAMES.DATASOURCES, DataSourceIcon, '/datasources'],
  [LEFT_SIDEBAR_NAMES.WORKERS, WorkerIcon, '/workers'],
  [LEFT_SIDEBAR_NAMES.DRIVERS, DriversIcon, '/drivers'],
];

const Name = styled.span`
  text-transform: capitalize;
`;

const SidebarLeft = () => {
  const dataCountSource = useSelector(sidebarSelector, isEqual);
  const { isOn } = useSelector(state => state.userGuide, equalByGuideOn);
  const location = useLocation();
  const dataCount = isOn ? dataCountMock : dataCountSource;
  const { isCollapsed, toggle } = useLeftSidebar();
  const { pageName } = useParams();
  return (
    <Border>
      <Sider
        className={USER_GUIDE.SIDEBAR_LEFT}
        theme="light"
        onCollapse={toggle}
        collapsed={isCollapsed}>
        <LogoContainer>
          <IconLogo component={LogoFish} />
          {!isCollapsed && <AnimatedTitle />}
        </LogoContainer>
        <MenuMargin selectedKeys={[`left-sidebar-${pageName}`]}>
          {menuItems.map(([name, component, path]) => (
            <Menu.Item
              key={`left-sidebar-${name}`}
              className={USER_GUIDE.TABLE_SELECT[name]}>
              <Link to={{ pathname: path, search: location.search }}>
                <FlexBox>
                  <FlexBox.Item>
                    <Icon
                      type={component}
                      component={component}
                      style={IconStyle}
                    />
                    <Name>{name}</Name>
                  </FlexBox.Item>
                  {Number.isInteger(dataCount[name]) && (
                    <FlexBox.Item>
                      <Tag style={tagStyle}>{dataCount[name]}</Tag>
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
