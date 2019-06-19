import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';

import './HKubeLayout.css';

import JobsTable from 'components/UI/tables/Jobs/JobsTable.react';
import WorkersTable from 'components/UI/tables/Workers/WorkersTable.react';
import DebugTable from 'components/UI/tables/Debug/DebugTable.react';
import AlgorithmBuildsTable from 'components/UI/tables/AlgorithmBuilds/AlgorithmBuildsTable.react';
import PipelinesTable from 'components/UI/tables/Pipelines/PipelinesTable.react';
import DriversTable from 'components/UI/tables/Drivers/DriversTable.react';
import AlgorithmsTable from 'components/UI/tables/Algorithms/AlgorithmsTable.react';

import NodeStatistics from 'components/UI/tables/NodeStats/NodeStatistics.react';
import TableAutoComplete from 'components/UI/Layout/TableAutoComplete.react';

import DrawerOperations from 'components/containers/drawer/DrawerOperations.react';

import SidebarOperations from 'components/UI/Layout/SidebarOperations/SidebarOperations.react';
import Sidebar from 'components/UI/Layout/Sidebar/Sidebar.react';
import AddAlgorithmForm from 'components/UI/Layout/SidebarOperations/AddAlgorithmForm.react';
import AddPipeline from 'components/UI/Layout/SidebarOperations/AddPipeliene/AddPipeline.react';
import AddDebug from 'components/UI/Layout/SidebarOperations/AddDebug.react';

import { message, Layout } from 'antd';
import { init, socketInit } from 'actions/config.action.js';
import { HCOLOR } from 'constants/colors';

const LayoutStyled = styled(Layout)`
  height: 100vh;
  * {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }

  .ant-tooltip-inner {
    background-color: white;
    color: black;
  }

  .ant-layout-sider-light .ant-layout-sider-trigger {
    border-right: 1px solid ${HCOLOR.border};
  }
`;

const LayoutMargin = styled(Layout)`
  && {
    background: white;
  }
`;

const HeaderStyled = styled(Layout.Header)`
  background: white;
  border-bottom: 1pt solid ${HCOLOR.darkBorder};
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;

const VersionAlignRight = styled.span`
  position: absolute;
  right: 1%;
  color: ${HCOLOR.darkBorder};
`;

const ContentStyled = styled(Layout.Content)`
  background: white;
  min-height: auto;
  margin: 10px;
  overflow: auto;
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

function HKubeLayout({ init, socketInit, ...props }) {
  const [table, setTable] = useState('Jobs');
  const [operation, setOperation] = useState('AddPipeline');
  const [visible, setVisible] = useState(false);

  const triggerVisible = () => setVisible(!visible);

  const operationSelector = {
    'Add Pipeline': <AddPipeline onSubmit={triggerVisible} />,
    'Add Algorithm': <AddAlgorithmForm onSubmit={triggerVisible} />,
    'Add Debug': <AddDebug onSubmit={triggerVisible} />
  };

  useEffect(
    () => {
      init();
      socketInit();
      message.config({
        duration: 5,
        maxCount: 3
      });
    },
    [init, socketInit]
  );

  return (
    <LayoutStyled>
      <Sidebar {...props} onSelect={setTable} />
      <Layout>
        <HeaderStyled>
          <TableAutoComplete />
          <VersionAlignRight>
            {`${process.env.REACT_APP_VERSION}v`}
          </VersionAlignRight>
        </HeaderStyled>
        <LayoutMargin>
          <ContentStyled>{tableSelector[table]}</ContentStyled>
          <SidebarOperations
            {...props}
            onSelect={op => {
              setOperation(op);
              setVisible(!visible);
            }}
          />
          <DrawerOperations
            visible={visible}
            onClose={triggerVisible}
            operation={operation}
          >
            {operationSelector[operation]}
          </DrawerOperations>
        </LayoutMargin>
      </Layout>
    </LayoutStyled>
  );
}

HKubeLayout.propTypes = {
  init: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  scriptsPath: state.serverSelection.currentSelection.scriptsPath,
  jobsCount: (state.jobsTable.dataSource || []).length,
  driversCount: (state.driverTable.dataSource || []).length,
  algorithmsCount: (state.algorithmTable.dataSource || []).length,
  buildsCount: (state.algorithmBuildsTable.dataSource || []).length,
  pipelinesCount: (state.storedPipeline.dataSource || []).length,
  workersCount: (state.workerTable.stats || { total: 0 }).total,
  debugCount: (state.debugTable.dataSource || []).length
});

export default connect(
  mapStateToProps,
  { init, socketInit }
)(HKubeLayout);
