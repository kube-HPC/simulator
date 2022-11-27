import React from 'react';
import { useSelector } from 'react-redux';
import { animated, useSpring } from 'react-spring';
import styled from 'styled-components';
// import isEqual from 'lodash/isEqual';
import { useLeftSidebar, useSiteThemeMode } from 'hooks';
import Icon from '@ant-design/icons';
import { Layout, Menu, Tag, Badge } from 'antd';
import { Link, useLocation, useParams } from 'react-router-dom';
import { FlexBox } from 'components/common';
import { dataCountMock } from 'config';
import { LEFT_SIDEBAR_NAMES, USER_GUIDE } from 'const';
import { ReactComponent as AlgorithmIcon } from 'images/algorithm-icon.svg';
import { ReactComponent as DataSourceIcon } from 'images/datasource.svg';

import { ReactComponent as JobsIcon } from 'images/jobs-icon.svg';
import { ReactComponent as QueueIcon } from 'images/Queue-icon.svg';
import { ReactComponent as LogoFish } from 'images/logo-fish.svg';
import { ReactComponent as LogoTitle } from 'images/logo-title.svg';
import { ReactComponent as PipelineIcon } from 'images/pipeline-icon.svg';

import { instanceCounterVar, instanceFiltersVar } from 'cache';
import { Theme, COLOR_LAYOUT } from 'styles';
import { selectors } from 'reducers';
// import { useDiscovery } from 'hooks/graphql';
import { useReactiveVar } from '@apollo/client';

import { useCounters } from 'hooks/graphql';

import { isValuesFiltersEmpty } from 'utils';

// import { orderApi } from '../../../Routes/Tables/QueueOrderJobs/useQueueOrderJobs';

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

const tagStyle = { color: Theme.Styles.SidebarLeft.colorTagNumber };

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
/*
const sidebarSelector = state => ({
  [LEFT_SIDEBAR_NAMES.JOBS]: selectors.jobs.count(state),
  [LEFT_SIDEBAR_NAMES.QUEUE]: selectors.queue.count(state) || 0,
  [LEFT_SIDEBAR_NAMES.PIPELINES]: selectors.pipelines.collection.count(state),
  [LEFT_SIDEBAR_NAMES.ALGORITHMS]: selectors.algorithms.collection.count(state),
  [LEFT_SIDEBAR_NAMES.WORKERS]: selectors.workers.count(state),
  [LEFT_SIDEBAR_NAMES.DRIVERS]: selectors.drivers.count(state),
  [LEFT_SIDEBAR_NAMES.DATASOURCES]: selectors.dataSources.count(state),
});
*/

const instanceCounterAdapter = obj => ({
  [LEFT_SIDEBAR_NAMES.JOBS]:
    obj.jobsActive > 0 ? `${obj.jobs} / ${obj.jobsActive}` : obj.jobs,
  [LEFT_SIDEBAR_NAMES.QUEUE]: obj.queue || 0,
  [LEFT_SIDEBAR_NAMES.PIPELINES]: obj.pipelines,
  [LEFT_SIDEBAR_NAMES.ALGORITHMS]: obj.algorithms,
  // [LEFT_SIDEBAR_NAMES.WORKERS]: obj.workers,
  // [LEFT_SIDEBAR_NAMES.DRIVERS]: obj.drivers,
  [LEFT_SIDEBAR_NAMES.DATASOURCES]: obj.dataSources,
});

const menuItems = [
  [LEFT_SIDEBAR_NAMES.JOBS, JobsIcon, '/jobs'],
  [LEFT_SIDEBAR_NAMES.QUEUE, QueueIcon, '/queue'],
  [LEFT_SIDEBAR_NAMES.PIPELINES, PipelineIcon, '/pipelines'],
  [LEFT_SIDEBAR_NAMES.ALGORITHMS, AlgorithmIcon, '/algorithms'],
  [LEFT_SIDEBAR_NAMES.DATASOURCES, DataSourceIcon, '/datasources'],

  //  [LEFT_SIDEBAR_NAMES.WORKERS, WorkerIcon, '/workers'],
  //  [LEFT_SIDEBAR_NAMES.DRIVERS, DriversIcon, '/drivers'],
];

const Name = styled.span`
  text-transform: capitalize;
`;

const SidebarLeft = () => {
  // useDiscovery();
  const { counters } = useCounters();
  instanceCounterVar({
    ...instanceCounterVar(),
    ...counters,
  });

  const instanceCounter = useReactiveVar(instanceCounterVar);
  const instanceFilters = useReactiveVar(instanceFiltersVar);
  // const dataCountSource = useSelector(sidebarSelector, isEqual);

  const dataCountSource = instanceCounterAdapter(instanceCounter);
  const { isOn } = useSelector(selectors.userGuide);
  const location = useLocation();
  const dataCount = isOn ? dataCountMock : dataCountSource;
  const { isCollapsed, toggle } = useLeftSidebar();
  const { pageName } = useParams();
  const { themeName } = useSiteThemeMode();

  return (
    <Border>
      <Sider
        className={USER_GUIDE.SIDEBAR_LEFT}
        theme={themeName}
        onCollapse={toggle}
        collapsed={isCollapsed}>
        <LogoContainer>
          <IconLogo component={LogoFish} />
          {!isCollapsed && <AnimatedTitle />}
        </LogoContainer>
        <MenuMargin selectedKeys={[`left-sidebar-${pageName}`]}>
          {menuItems.map(([name, component, path]) => {
            const filterList = { ...instanceFilters[name] };

            if (name === 'jobs') {
              delete filterList.datesRange; // not show filter when select time
              delete filterList.experimentName;
            }

            const isFilters = isValuesFiltersEmpty(filterList);

            return (
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

                    <FlexBox.Item>
                      <Badge dot={isFilters} offset={[-7, 0]}>
                        <Tag style={tagStyle}>{dataCount[name]}</Tag>
                      </Badge>
                    </FlexBox.Item>
                  </FlexBox>
                </Link>
              </Menu.Item>
            );
          })}
        </MenuMargin>
      </Sider>
    </Border>
  );
};

export default React.memo(SidebarLeft);
