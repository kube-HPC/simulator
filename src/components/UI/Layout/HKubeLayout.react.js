import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';

import 'components/UI/Layout/HKubeLayout.css';

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
import Sidebar from 'components/UI/Layout/Sidebar/Sidebar.react';
import AddAlgorithmForm from 'components/UI/Layout/SidebarOperations/AddAlgorithmForm.react';
import AddPipeline from 'components/UI/Layout/SidebarOperations/AddPipeliene/AddPipeline.react';
import AddDebug from 'components/UI/Layout/SidebarOperations/AddDebug.react';

import { message, Layout, Col, Icon, Row } from 'antd';
import { init, socketInit } from 'actions/layout.action';
import { COLOR_LAYOUT } from 'constants/colors';

import USER_GUIDE from 'constants/user-guide';
import LOCAL_STORAGE_KEYS from 'constants/local-storage';
import GlobalStyle from './GlobalStyle.styles';
import UserGuide from './UserGuide/UserGuide.react';
import {
  getBooleanLocalStorageItem,
  setLocalStorageItem
} from 'utils/localStorage';
import { triggerUserGuide } from 'actions/userGuide.action';

const LayoutFullHeight = styled(Layout)`
  height: 100vh;
  background: white;
`;

const HeaderStretch = styled(Layout.Header)`
  background: white;
  border-bottom: 1pt solid ${COLOR_LAYOUT.darkBorder};
  padding-left: 10px;
  padding-right: 10px;
`;

const RowCenter = styled(Row)`
  align-items: center;
`;

const ContentStyled = styled(Layout.Content)`
  margin: 5px;
  overflow: auto;
`;

const HoverIcon = styled(Icon)`
  :hover {
    color: black;
  }
`;

const tableSelector = {
  Jobs: <JobsTable />,
  Pipelines: <PipelinesTable />,
  Algorithms: <AlgorithmsTable />,
  Workers: <WorkersTable />,
  Drivers: <DriversTable />,
  Debug: <DebugTable />,
  Builds: <AlgorithmBuildsTable />,
  CPU: <NodeStatistics metric="cpu" />,
  Memory: <NodeStatistics metric="mem" />
};

const makeTrigger = setter => () => setter(prev => !prev);

const leftIsVisibleFromStorage = getBooleanLocalStorageItem(
  LOCAL_STORAGE_KEYS.LEFT_SIDEBAR_IS_VISIBLE
);

function HKubeLayout() {
  // Table sidebar on Left
  const [leftValue, setLeftValue] = useState('Jobs');
  const [leftVisible, setLeftVisible] = useState(leftIsVisibleFromStorage);

  useEffect(
    () => {
      setLocalStorageItem(
        LOCAL_STORAGE_KEYS.LEFT_SIDEBAR_IS_VISIBLE,
        leftVisible
      );
    },
    [leftVisible]
  );

  // Operation Sidebar on Right
  const [rightValue, setRightValue] = useState('AddPipeline');
  const [rightVisible, setRightVisible] = useState(false);

  const triggerLeftVisible = makeTrigger(setLeftVisible);
  const triggerRightVisible = makeTrigger(setRightVisible);

  const dispatch = useDispatch();

  const operationSelector = {
    'Add Pipeline': <AddPipeline onSubmit={triggerRightVisible} />,
    'Add Algorithm': <AddAlgorithmForm onSubmit={triggerRightVisible} />,
    'Add Debug': <AddDebug onSubmit={triggerRightVisible} />
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
      <UserGuide triggerLeftVisible={triggerLeftVisible} />
      <LayoutFullHeight>
        <Sidebar
          className={USER_GUIDE.SIDEBAR_LEFT}
          onSelect={setLeftValue}
          collapsed={!leftVisible}
        />
        <Layout>
          <HeaderStretch>
            <RowCenter type="flex" justify="space-between">
              <HoverIcon
                className={USER_GUIDE.SIDEBAR_LEFT_MENU_BUTTON}
                type={leftVisible ? 'menu-fold' : 'menu-unfold'}
                style={{ fontSize: 22 }}
                onClick={triggerLeftVisible}
              />
              <TableAutoComplete table={leftValue} />
              <div>
                <Row type="flex" gutter={10}>
                  <Col>
                    <HoverIcon
                      type="global"
                      style={{ fontSize: 22 }}
                      onClick={() => window.open('http://hkube.io/')}
                    />
                  </Col>
                  <Col>
                    <HoverIcon
                      type="github"
                      style={{ fontSize: 22 }}
                      onClick={() =>
                        window.open('https://github.com/kube-HPC/hkube')
                      }
                    />
                  </Col>
                  <Col>
                    <HoverIcon
                      className={USER_GUIDE.CONTACT}
                      type="question-circle"
                      style={{ fontSize: 22 }}
                      onClick={() => {
                        dispatch(triggerUserGuide());
                        setLeftVisible(true);
                      }}
                    />
                  </Col>
                  <Col>{`${process.env.REACT_APP_VERSION}v`}</Col>
                </Row>
              </div>
            </RowCenter>
          </HeaderStretch>
          <LayoutFullHeight>
            <ContentStyled>{tableSelector[leftValue]}</ContentStyled>
            <SidebarOperations
              className={USER_GUIDE.SIDEBAR_RIGHT}
              onSelect={op => {
                setRightValue(op);
                setRightVisible(!rightVisible);
              }}
            />
            <DrawerOperations
              visible={rightVisible}
              onClose={triggerRightVisible}
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
