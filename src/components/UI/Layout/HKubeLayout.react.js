import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';

import 'styles/GlobalStyle.css';

import JobsTable from 'components/UI/tables/Jobs/JobsTable.react';
import WorkersTable from 'components/UI/tables/Workers/WorkersTable.react';
import DebugTable from 'components/UI/tables/Debug/DebugTable.react';
import AlgorithmBuildsTable from 'components/UI/tables/AlgorithmBuilds/AlgorithmBuildsTable.react';
import PipelinesTable from 'components/UI/tables/Pipelines/PipelinesTable.react';
import DriversTable from 'components/UI/tables/Drivers/DriversTable.react';
import AlgorithmsTable from 'components/UI/tables/Algorithms/AlgorithmsTable.react';
import NodeStatistics from 'components/UI/tables/NodeStats/NodeStatistics.react';
import TableAutoComplete from 'components/UI/Layout/TableAutoComplete.react';
import DrawerOperations from 'components/common/drawer/DrawerOperations.react';
import SidebarOperations from 'components/UI/Layout/SidebarOperations/SidebarOperations.react';
import SidebarLeft from 'components/UI/Layout/SidebarMainTables/SidebarLeft.react';
import AddAlgorithmForm from 'components/UI/Layout/SidebarOperations/AddAlgorithmForm.react';
import AddPipeline from 'components/UI/Layout/SidebarOperations/AddPipeliene/AddPipeline.react';
import AddDebug from 'components/UI/Layout/SidebarOperations/AddDebug.react';
import ErrorLogsTable from 'components/UI/tables/ErrorLogs/ErrorLogsTable.react';

import { message, Layout, Col, Icon, Row, Typography } from 'antd';
import { init, socketInit } from 'actions/layout.action';
import { COLOR_LAYOUT } from 'constants/colors';

import USER_GUIDE from 'constants/user-guide';
import LOCAL_STORAGE_KEYS from 'constants/local-storage';
import GlobalStyle from '../../../styles/GlobalStyle.styles';
import UserGuide from './UserGuide/UserGuide.react';
import {
  getBooleanLocalStorageItem,
  setLocalStorageItem
} from 'utils/localStorage';
import { triggerUserGuide } from 'actions/userGuide.action';
import {
  LEFT_SIDEBAR_NAMES,
  RIGHT_TOP_SIDEBAR_NAMES,
  RIGHT_BOTTOM_SIDEBAR_NAMES
} from 'constants/table-names';
import SidebarBottomRight from './SidebarBottomRight/SidebarBottomRight.react';

const LayoutFullHeight = styled(Layout)`
  height: 100vh;
  background: white;
`;

const HeaderStretch = styled(Layout.Header)`
  background: white;
  border-bottom: 1pt solid ${COLOR_LAYOUT.border};
  padding-left: 10px;
  padding-right: 10px;
`;

const RowCenter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ContentMargin = styled(Layout.Content)`
  padding: 8px;
  overflow: auto;
`;

const HoverIcon = styled(Icon)`
  color: ${COLOR_LAYOUT.darkBorder};
  :hover {
    color: black;
  }
`;

const RightSidebarsFlex = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  border-left: 1px solid ${COLOR_LAYOUT.border};
`;

const HeaderText = styled(Typography.Text)`
  color: ${COLOR_LAYOUT.darkBorder};
`;

const HelpBarFlex = styled.div`
  display: flex;
  justify-items: center;
  align-items: center;
  > ${HoverIcon}, ${HeaderText} {
    margin-left: 10px;
  }
`;

const tableSelector = {
  [LEFT_SIDEBAR_NAMES.JOBS]: <JobsTable />,
  [LEFT_SIDEBAR_NAMES.PIPELINES]: <PipelinesTable />,
  [LEFT_SIDEBAR_NAMES.ALGORITHMS]: <AlgorithmsTable />,
  [LEFT_SIDEBAR_NAMES.WORKERS]: <WorkersTable />,
  [LEFT_SIDEBAR_NAMES.DRIVERS]: <DriversTable />,
  [LEFT_SIDEBAR_NAMES.DEBUG]: <DebugTable />,
  [LEFT_SIDEBAR_NAMES.BUILDS]: <AlgorithmBuildsTable />,
  [RIGHT_BOTTOM_SIDEBAR_NAMES.ERROR_LOGS]: <ErrorLogsTable />,
  [LEFT_SIDEBAR_NAMES.CLUSTER_STATS.CPU]: <NodeStatistics metric="cpu" />,
  [LEFT_SIDEBAR_NAMES.CLUSTER_STATS.MEMORY]: <NodeStatistics metric="mem" />
};

const makeTrigger = setter => () => setter(prev => !prev);

const leftCollapsedInitial = getBooleanLocalStorageItem(
  LOCAL_STORAGE_KEYS.LEFT_SIDEBAR_IS_VISIBLE
);

function HKubeLayout() {
  // Table sidebar on Left
  const [tableValue, setTableValue] = useState(LEFT_SIDEBAR_NAMES.JOBS);
  const [leftIsCollapsed, setLeftIsCollapsed] = useState(leftCollapsedInitial);

  useEffect(
    () => {
      setLocalStorageItem(
        LOCAL_STORAGE_KEYS.LEFT_SIDEBAR_IS_VISIBLE,
        leftIsCollapsed
      );
    },
    [leftIsCollapsed]
  );

  // Operation Sidebar on Right
  const [rightValue, setRightValue] = useState(
    RIGHT_TOP_SIDEBAR_NAMES.ADD_ALGORITHM
  );

  const [rightTopVisible, setRightTopVisible] = useState(false);

  const triggerLeftVisible = makeTrigger(setLeftIsCollapsed);
  const triggerRightTopVisible = makeTrigger(setRightTopVisible);

  const dispatch = useDispatch();

  const operationSelector = {
    'Add Pipeline': <AddPipeline onSubmit={triggerRightTopVisible} />,
    'Add Algorithm': <AddAlgorithmForm onSubmit={triggerRightTopVisible} />,
    'Add Debug': <AddDebug onSubmit={triggerRightTopVisible} />
  };

  useEffect(
    () => {
      dispatch(init());
      dispatch(socketInit());
      message.config({
        duration: 5,
        maxCount: 3
      });
    },
    [dispatch]
  );

  return (
    <>
      <GlobalStyle />
      <UserGuide
        triggerLeftVisible={triggerLeftVisible}
        setLeftValue={setTableValue}
      />
      <LayoutFullHeight>
        <SidebarLeft
          className={USER_GUIDE.SIDEBAR_LEFT}
          selectedKeys={[tableValue]}
          onSelect={setTableValue}
          collapsed={!leftIsCollapsed}
        />
        <Layout>
          <HeaderStretch>
            <RowCenter type="flex" justify="space-between">
              <HoverIcon
                className={USER_GUIDE.SIDEBAR_LEFT_MENU_BUTTON}
                type={leftIsCollapsed ? 'menu-fold' : 'menu-unfold'}
                style={{ fontSize: 22 }}
                onClick={triggerLeftVisible}
              />
              <TableAutoComplete table={tableValue} />
              <HelpBarFlex>
                <HoverIcon
                  type="global"
                  style={{ fontSize: 22 }}
                  onClick={() => window.open('http://hkube.io/')}
                />
                <HoverIcon
                  type="github"
                  style={{ fontSize: 22 }}
                  onClick={() =>
                    window.open('https://github.com/kube-HPC/hkube')
                  }
                />
                <HoverIcon
                  className={USER_GUIDE.WELCOME}
                  type="question-circle"
                  style={{ fontSize: 22 }}
                  onClick={() => {
                    dispatch(triggerUserGuide());
                    setTableValue(LEFT_SIDEBAR_NAMES.JOBS);
                    setLeftIsCollapsed(true);
                  }}
                />
                <HeaderText>{`${process.env.REACT_APP_VERSION}v`}</HeaderText>
              </HelpBarFlex>
            </RowCenter>
          </HeaderStretch>
          <LayoutFullHeight>
            <ContentMargin>{tableSelector[tableValue]}</ContentMargin>
            <RightSidebarsFlex>
              <SidebarOperations
                className={USER_GUIDE.SIDEBAR_RIGHT}
                selectedKeys={[tableValue]}
                onSelect={op => {
                  setRightValue(op);
                  setRightTopVisible(!rightTopVisible);
                }}
              />
              <SidebarBottomRight
                selectedKeys={[tableValue]}
                onSelect={selection => {
                  setTableValue(selection);
                }}
              />
            </RightSidebarsFlex>
            <DrawerOperations
              visible={rightTopVisible}
              onClose={triggerRightTopVisible}
              operation={rightValue}
            >
              {operationSelector[rightValue]}
            </DrawerOperations>
          </LayoutFullHeight>
        </Layout>
      </LayoutFullHeight>
    </>
  );
}

export default HKubeLayout;
