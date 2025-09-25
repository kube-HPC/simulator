import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { animated, useSpring } from 'react-spring';

import { useSiteThemeMode } from 'hooks';
import Icon, { FilterTwoTone } from '@ant-design/icons';
import { Badge, Tag } from 'antd';
import { Link, useLocation, useParams } from 'react-router-dom';
import { useErrorLogs, useCounters } from 'hooks/graphql';
import { dataCountMock } from 'config';
import { LEFT_SIDEBAR_NAMES, USER_GUIDE } from 'const';
import { ReactComponent as AlgorithmIcon } from 'images/algorithm-icon.svg';
import { ReactComponent as MarketplaceIcon } from 'images/marketplace.svg';
import { ReactComponent as DataSourceIcon } from 'images/datasource.svg';

import { ReactComponent as JobsIcon } from 'images/jobs-icon.svg';
import { ReactComponent as QueueIcon } from 'images/Queue-icon.svg';
import { ReactComponent as LogoFish } from 'images/logo-fish.svg';

import { ReactComponent as PipelineIcon } from 'images/no-fill/add-pipeline.svg';

import { instanceCounterVar, instanceFiltersVar } from 'cache';
import { selectors } from 'reducers';

import { useReactiveVar } from '@apollo/client';

import { isValuesFiltersEmpty } from 'utils';
import {
  Border,
  Sider,
  MenuMargin,
  tagStyle,
  LogoContainer,
  TitleCenter,
  Name,
  BadgeStyle,
  IconStyle,
  IconLogo,
} from './MenuStyles';
import useSubMenuAdmin from './useSubMenuAdmin';

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

const instanceCounterAdapter = obj => ({
  [LEFT_SIDEBAR_NAMES.JOBS]:
    obj.jobsActive > 0 ? `${obj.jobs} / ${obj.jobsActive}` : obj.jobs,
  [LEFT_SIDEBAR_NAMES.QUEUE]: obj.queue || 0,
  [LEFT_SIDEBAR_NAMES.PIPELINES]: obj.pipelines,
  [LEFT_SIDEBAR_NAMES.ALGORITHMS]: obj.algorithms,
  [LEFT_SIDEBAR_NAMES.MARKETPLACE]: 3,
  [LEFT_SIDEBAR_NAMES.DATASOURCES]: obj.dataSources,
  [LEFT_SIDEBAR_NAMES.WORKERS]: obj.workers,
  [LEFT_SIDEBAR_NAMES.DRIVERS]: obj.drivers,
});

const SidebarLeft = () => {
  const { pageName } = useParams();
  const location = useLocation();
  const { totalNewWarnings } = useErrorLogs();

  const { dataSourceIsEnable } = useSelector(selectors.connection);

  const menuMainItems = useMemo(() => {
    const itemsMenu = [
      [LEFT_SIDEBAR_NAMES.JOBS, JobsIcon, '/jobs'],
      [LEFT_SIDEBAR_NAMES.QUEUE, QueueIcon, '/queue'],
      [LEFT_SIDEBAR_NAMES.MARKETPLACE, MarketplaceIcon, '/marketplace'],
      [LEFT_SIDEBAR_NAMES.ALGORITHMS, AlgorithmIcon, '/algorithms'],
      [LEFT_SIDEBAR_NAMES.PIPELINES, PipelineIcon, '/pipelines'],
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

  useCounters();
  const instanceCounter = useReactiveVar(instanceCounterVar);
  const instanceFilters = useReactiveVar(instanceFiltersVar);

  const dataCountSource = instanceCounterAdapter(instanceCounter);

  const { isOn } = useSelector(selectors.userGuide);
  const [isOpenMenuAdministration, setIsOpenMenuAdministration] =
    useState(false);
  const dataCount = isOn ? dataCountMock : dataCountSource;
  const { menuAdminItemsJson } = useSubMenuAdmin(totalNewWarnings, dataCount);
  const { themeName } = useSiteThemeMode();

  const onOpenChangeMenu = openKeys => {
    setIsOpenMenuAdministration(openKeys.includes('admin-link'));
  };

  const menuMainItemsJson = useMemo(() => {
    const items = [];

    menuMainItems.forEach(([name, component, path]) => {
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
            <BadgeStyle
              count={
                (isFilters && (
                  <FilterTwoTone size="small" style={{ fontSize: '10px' }} />
                )) ||
                null
              }
              offset={[-7, 0]}>
              <Tag
                style={tagStyle}
                color={
                  name === 'algorithms' &&
                  instanceCounter.algorithmsUnscheduledReason > 0 &&
                  'error'
                }>
                {dataCount[name]}
              </Tag>
            </BadgeStyle>
          </Link>
        ),
        key: `left-sidebar-${name}`,
        className: USER_GUIDE.TABLE_SELECT[name],
        icon: <Icon type={component} component={component} style={IconStyle} />,
      });
    });

    items.push({
      label: isOpenMenuAdministration ? (
        'Administration'
      ) : (
        <Badge
          size="small"
          count={totalNewWarnings}
          color="red"
          offset={[25, 6]}>
          Administration
        </Badge>
      ),
      key: `admin-link`,

      children: menuAdminItemsJson,
    });

    return items;
  }, [
    dataCount,
    instanceCounter.algorithmsUnscheduledReason,
    instanceFilters,
    isOpenMenuAdministration,
    location.search,
    menuAdminItemsJson,
    menuMainItems,
    totalNewWarnings,
  ]);
  console.log('pageName', pageName);
  return (
    <Border>
      <Sider
        style={{ background: 'unset' }}
        className={USER_GUIDE.SIDEBAR_LEFT}
        theme={themeName}>
        <LogoContainer>
          <IconLogo component={LogoFish} />
          <AnimatedTitle />
        </LogoContainer>
        <MenuMargin
          onOpenChange={onOpenChangeMenu}
          mode="inline"
          items={menuMainItemsJson}
          selectedKeys={[`left-sidebar-${pageName ?? 'jobs'}`]}
        />
      </Sider>
    </Border>
  );
};

export default React.memo(SidebarLeft);
