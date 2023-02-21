import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { animated, useSpring } from 'react-spring';
import styled from 'styled-components';
// import isEqual from 'lodash/isEqual';
import { useSiteThemeMode } from 'hooks';
import Icon from '@ant-design/icons';
import { Layout, Menu, Tag, Badge } from 'antd';
import { Link, useLocation, useParams } from 'react-router-dom';

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

const Name = styled.span`
  text-transform: capitalize;
`;
const BadgeStyle = styled(Badge)`
  margin-top: 9px;
  right: 16px;
  position: absolute;
`;

const SidebarLeft = () => {
  // add datasources when this enable

  const { dataSourceIsEnable } = useSelector(selectors.connection);

  const menuItems = useMemo(() => {
    const itemsMenu = [
      [LEFT_SIDEBAR_NAMES.JOBS, JobsIcon, '/jobs'],
      [LEFT_SIDEBAR_NAMES.QUEUE, QueueIcon, '/queue'],
      [LEFT_SIDEBAR_NAMES.PIPELINES, PipelineIcon, '/pipelines'],
      [LEFT_SIDEBAR_NAMES.ALGORITHMS, AlgorithmIcon, '/algorithms'],
      //  [LEFT_SIDEBAR_NAMES.WORKERS, WorkerIcon, '/workers'],
      //  [LEFT_SIDEBAR_NAMES.DRIVERS, DriversIcon, '/drivers'],
    ];
    if (dataSourceIsEnable) {
      itemsMenu.push([
        LEFT_SIDEBAR_NAMES.DATASOURCES,
        DataSourceIcon,
        '/datasources',
      ]);
    }

    return itemsMenu;
  }, []);

  // useDiscovery();
  useCounters();

  const instanceCounter = useReactiveVar(instanceCounterVar);
  const instanceFilters = useReactiveVar(instanceFiltersVar);
  // const dataCountSource = useSelector(sidebarSelector, isEqual);
  const location = useLocation();
  const dataCountSource = instanceCounterAdapter(instanceCounter);
  const { isOn } = useSelector(selectors.userGuide);
  const dataCount = isOn ? dataCountMock : dataCountSource;
  const { pageName } = useParams();
  const { themeName } = useSiteThemeMode();

  const menuItemsJson = useMemo(() => {
    const items = [];

    menuItems.forEach(([name, component, path]) => {
      const objectsFilters = { ...instanceFilters[name] };

      if (name === 'jobs') {
        delete objectsFilters.experimentName;
        delete objectsFilters.datesRange;
      }

      const isFilters = isValuesFiltersEmpty(objectsFilters);

      items.push({
        label: (
          <Link to={{ pathname: path, search: location.search }}>
            <Name>{name}</Name>{' '}
            <BadgeStyle dot={isFilters} offset={[-7, 0]}>
              <Tag style={tagStyle}>{dataCount[name]}</Tag>
            </BadgeStyle>
          </Link>
        ),
        key: `left-sidebar-${name}`,
        className: USER_GUIDE.TABLE_SELECT[name],
        icon: <Icon type={component} component={component} style={IconStyle} />,
      });
    });

    return items;
  }, [dataCount, instanceFilters, location.search]);

  return (
    <Border>
      <Sider className={USER_GUIDE.SIDEBAR_LEFT} theme={themeName}>
        <LogoContainer>
          <IconLogo component={LogoFish} />
          <AnimatedTitle />
        </LogoContainer>
        <MenuMargin
          items={menuItemsJson}
          selectedKeys={[`left-sidebar-${pageName}`]}
        />
      </Sider>
    </Border>
  );
};

export default React.memo(SidebarLeft);
