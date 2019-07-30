import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';

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
import { LAYOUT_COLOR } from 'constants/colors';

import UserGuide from './UserGuide.react';
import GlobalStyle from './GlobalStyle.styles';
import { LOCAL_STORAGE_KEYS } from 'constants/states';

const LayoutFullHeight = styled(Layout)`
  height: 100vh;
  background: white;
`;

const HeaderStretch = styled(Layout.Header)`
  background: white;
  border-bottom: 1pt solid ${LAYOUT_COLOR.darkBorder};
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
  Workers: <WorkersTable />,
  Drivers: <DriversTable />,
  Algorithms: <AlgorithmsTable />,
  Debug: <DebugTable />,
  Builds: <AlgorithmBuildsTable />,
  CPU: <NodeStatistics metric="cpu" />,
  Memory: <NodeStatistics metric="mem" />
};

const makeTrigger = setter => () => setter(prev => !prev);

function HKubeLayout() {
  const [table, setTable] = useState('Jobs');
  const [op, setOp] = useState('AddPipeline');
  const [opVisible, setOpVisible] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [runGuide, setRunGuide] = useState(
    localStorage.getItem(LOCAL_STORAGE_KEYS.USER_GUIDE)
  );

  const triggerVisible = makeTrigger(setOpVisible);
  const triggerSideBarVisible = makeTrigger(setSidebarVisible);

  const dispatch = useDispatch();

  const operationSelector = {
    'Add Pipeline': <AddPipeline onSubmit={triggerVisible} />,
    'Add Algorithm': <AddAlgorithmForm onSubmit={triggerVisible} />,
    'Add Debug': <AddDebug onSubmit={triggerVisible} />
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
      <UserGuide run={runGuide} setRun={setRunGuide} />
      <LayoutFullHeight>
        <Sidebar
          className="table-sidebar"
          onSelect={setTable}
          // collapsed means - not visible
          collapsed={!sidebarVisible}
        />
        <Layout>
          <HeaderStretch>
            <RowCenter type="flex" justify="space-between">
              <HoverIcon
                type={sidebarVisible ? 'menu-fold' : 'menu-unfold'}
                style={{ fontSize: 22 }}
                onClick={triggerSideBarVisible}
              />
              <TableAutoComplete table={table} />
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
                    type="question-circle"
                    style={{ fontSize: 22 }}
                    onClick={() => setRunGuide(true)}
                  />
                </Col>
                <Col>{`${process.env.REACT_APP_VERSION}v`}</Col>
              </Row>
            </RowCenter>
          </HeaderStretch>
          <LayoutFullHeight>
            <ContentStyled>{tableSelector[table]}</ContentStyled>
            <SidebarOperations
              className="operations-sidebar"
              onSelect={op => {
                setOp(op);
                setOpVisible(!opVisible);
              }}
            />
            <DrawerOperations
              visible={opVisible}
              onClose={triggerVisible}
              operation={op}
            >
              {operationSelector[op]}
            </DrawerOperations>
          </LayoutFullHeight>
        </Layout>
      </LayoutFullHeight>
    </>
  );
}

export default HKubeLayout;
