import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { compose, withState } from 'recompose';

import { BackTop, message, Layout } from 'antd';

import JobsTable from 'components/smart/tables/JobsTable.react';
import WorkersTable from 'components/smart/tables/WorkersTable.react';
import DebugTable from 'components/smart/tables/DebugTable.react';
import AlgorithmBuildsTable from 'components/smart/tables/AlgorithmBuildsTable.react';
import PipelinesTable from 'components/smart/tables/PipelinesTable.react';
import DriversTable from 'components/smart/tables/DriversTable.react';
import AlgorithmsTable from 'components/smart/tables/AlgorithmsTable.react';
import NodeStatistics from 'components/smart/NodeStatistics.react';
import SideBar from 'components/smart/SideBarContainer.react';
import TableAutoComplete from 'components/dumb/TableAutoComplete.react';
import Sider from 'components/dumb/Sider.react';

import { init } from 'actions/config.action.js';

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
`;

const HeaderStyled = styled(Header)`
  background: white;
  border-bottom: 1pt solid #ccc;
  text-align: center;
`;

const ContentStyled = styled(Content)`
  background: white;
  min-height: auto;
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

  useEffect(() => {
    init();
    message.config({
      duration: 5,
      maxCount: 3
    });
  }, [init]);

  return (
    <LayoutStyled>
      <SideBar open={false} />
      <Sider {...props} onSelect={setTable} />
      <LayoutStyled>
        <HeaderStyled>
          <TableAutoComplete />
        </HeaderStyled>
        <ContentStyled>
          <BackTop />
          {tableSelector[table]}
        </ContentStyled>
      </LayoutStyled>
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

export default compose(
  connect(
    mapStateToProps,
    { init }
  ),
  withState('isTableVisible', 'onMenuSelected', {
    visible: true,
    menuItem: {}
  }),
  withState('isVodUpVisible', 'onVodUpPopoverClickVisible', false),
  withState('isVodDownVisible', 'onVodDownPopoverClickVisible', false)
)(LayoutInner);
