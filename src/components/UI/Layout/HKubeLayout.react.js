import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';

import 'antd/dist/antd.css';
import './HKubeLayout.css';

import JobsTable from 'components/UI/tables/JobsTable.react';
import WorkersTable from 'components/UI/tables/WorkersTable.react';
import DebugTable from 'components/UI/tables/DebugTable.react';
import AlgorithmBuildsTable from 'components/UI/tables/AlgorithmBuildsTable.react';
import PipelinesTable from 'components/UI/tables/PipelinesTable.react';
import DriversTable from 'components/UI/tables/DriversTable.react';
import AlgorithmsTable from 'components/UI/tables/AlgorithmsTable.react';

import NodeStatistics from 'components/smart/NodeStatistics.react';
import TableAutoComplete from 'components/dumb/TableAutoComplete.react';

import SideBarContainer from 'components/smart/SideBarContainer.react';
import DrawerContainer from 'components/dumb/DrawerContainer.react';

import SidebarOperations from 'components/UI/Layout/SidebarOperations.react';
import Sidebar from 'components/UI/Layout/Sidebar.react';
import AddAlgorithmForm from 'components/UI/operations/AddAlgorithmForm.react';
import AddPipeline from 'components/UI/operations/AddPipeline.react';
import AddDebug from 'components/UI/operations/AddDebug.react';

import { message, Layout } from 'antd';
import { init } from 'actions/config.action.js';
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
  && {
    background: white;
    border-bottom: 1pt solid ${HCOLOR.darkBorder};
    text-align: center;
  }
`;

const ContentStyled = styled(Layout.Content)`
  background: white;
  min-height: auto;
  margin: 10px;
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

function HKubeLayout({ init, ...props }) {
  const [table, setTable] = useState('Jobs');
  const [operation, setOperation] = useState('AddPipeline');
  const [visible, setVisible] = useState(false);

  const triggerVisible = () => setVisible(!visible);

  const operationSelector = {
    'Add Pipeline': <AddPipeline onSubmit={triggerVisible} />,
    'Add Algorithm': <AddAlgorithmForm onSubmit={triggerVisible} />,
    'Add Debug': <AddDebug onSubmit={triggerVisible} />
  };

  useEffect(() => {
    init();
    message.config({
      duration: 5,
      maxCount: 3
    });
  }, [init]);

  return (
    <LayoutStyled>
      <SideBarContainer open={false} />
      <Sidebar {...props} onSelect={setTable} />
      <Layout>
        <HeaderStyled>
          <TableAutoComplete />
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
          <DrawerContainer
            visible={visible}
            onClose={triggerVisible}
            operation={operation}
          >
            {operationSelector[operation]}
          </DrawerContainer>
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
  jobsCount: (state.containerTable.dataSource || []).length,
  driversCount: (state.driverTable.dataSource || []).length,
  algorithmsCount: (state.algorithmTable.dataSource || []).length,
  buildsCount: (state.algorithmBuildsTable.dataSource || []).length,
  pipelinesCount: (state.storedPipeline.dataSource || []).length,
  workersCount: (state.workerTable.stats || { total: 0 }).total,
  debugCount: (state.debugTable.dataSource || []).length
});

export default connect(
  mapStateToProps,
  { init }
)(HKubeLayout);
