import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { message, Layout } from 'antd';

import JobsTable from 'components/smart/tables/JobsTable.react';
import WorkersTable from 'components/smart/tables/WorkersTable.react';
import DebugTable from 'components/smart/tables/DebugTable.react';
import AlgorithmBuildsTable from 'components/smart/tables/AlgorithmBuildsTable.react';
import PipelinesTable from 'components/smart/tables/PipelinesTable.react';
import DriversTable from 'components/smart/tables/DriversTable.react';
import AlgorithmsTable from 'components/smart/tables/AlgorithmsTable.react';
import NodeStatistics from 'components/smart/NodeStatistics.react';
import TableAutoComplete from 'components/dumb/TableAutoComplete.react';
import Sider from 'components/dumb/Sider.react';
import SiderMini from 'components/dumb/SiderMini.react';

import { init } from 'actions/config.action.js';
import DrawerContainer from 'components/dumb/DrawerContainer.react';
import AddPipelineSteps from 'components/dumb/AddPipeline/AddPipelineSteps.react';
import AddAlgorithmForm from 'components/operations/AddAlgorithm.react';
import AddPipeline from '../operations/AddPipeline.react';
import AddDebug from 'components/operations/AddDebug.react';

const { Header, Content } = Layout;

const LayoutStyled = styled(Layout)`
  height: 100vh;
  * {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell,
      'Open Sans', 'Helvetica Neue', sans-serif;
  }

  .ant-tooltip-inner {
    background-color: white;
    color: black;
  }

  .ant-layout-sider-light .ant-layout-sider-trigger {
    color: rgba(0, 0, 0, 0.65);
    font-size: 20px;
    background: #fff;
    border-right: 1px solid #e8e8e8;
  }
`;

const LayoutMargin = styled(Layout)`
  background: white;
`;

const HeaderStyled = styled(Header)`
  background: white;
  border-bottom: 1pt solid #ccc;
  text-align: center;
`;

const ContentStyled = styled(Content)`
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

function LayoutInner({ init, ...props }) {
  const [table, setTable] = useState('Jobs');
  const [operation, setOperation] = useState('AddPipeline');
  const [visible, setVisible] = useState(false);

  const triggerVisible = () => setVisible(!visible);

  const operationSelector = {
    AddPipeline: <AddPipeline onSubmit={triggerVisible} />,
    AddAlgorithm: <AddAlgorithmForm onSubmit={triggerVisible} />,
    AddDebug: <AddDebug onSubmit={triggerVisible} />
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
      <Sider {...props} onSelect={setTable} />
      <Layout>
        <HeaderStyled>
          <TableAutoComplete />
        </HeaderStyled>
        <LayoutMargin>
          <ContentStyled>{tableSelector[table]}</ContentStyled>
          <SiderMini
            {...props}
            onSelect={op => {
              setOperation(op);
              setVisible(!visible);
            }}
          />
          <DrawerContainer visible={visible} onClose={triggerVisible}>
            {operationSelector[operation]}
          </DrawerContainer>
        </LayoutMargin>
      </Layout>
    </LayoutStyled>
  );
}

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

LayoutInner.propTypes = {
  init: PropTypes.func.isRequired
};

export default connect(
  mapStateToProps,
  { init }
)(LayoutInner);
