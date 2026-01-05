import React, { useMemo, useCallback, useRef } from 'react';

import { Route, Routes } from 'react-router-dom';
import styled from 'styled-components';
import useQueryHook from 'hooks/useQuery';
import { HKGrid, Card } from 'components/common';
import { Collapse } from 'react-collapse';
import { Divider, FloatButton } from 'antd';
import { selectors } from 'reducers';
import { useSelector } from 'react-redux';
import { USER_GUIDE } from 'const';
import {
  ArrowUpOutlined,
  CaretUpOutlined,
  CaretDownOutlined,
} from '@ant-design/icons';
import useJobsFunctionsLimit from './useJobsFunctionsLimit';

import GridView from './GridView';
import OverviewDrawer from './OverviewDrawer';
import QueryForm from './QueryTable/QueryForm';
import QueryDateChart from './QueryTable/QueryDateChart';

export { default as jobColumns } from './jobColumns';

const rowKey = job => `job-${job.key}`;

const Container = styled(Card)`
  & .ant-card-body {
    padding: 5px;
  }
`;

const JobsWrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const CaretDownOutlinedCenter = styled(CaretDownOutlined)`
  position: absolute;
  z-index: 99;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 20px;
`;

const CaretUpOutlinedCenter = styled(CaretUpOutlined)`
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 20px;
  margin-top: 18px;
`;

const BackToTop = () => document.querySelector('#jobsTable .ag-body-viewport');

const JobsTable = () => {
  const { keycloakEnable } = useSelector(selectors.connection);
  const {
    zoomedChangedDate,
    filterToggeled,
    filterToggeledVar,
    onQuerySubmit,
    mergedParams,
    dataSourceGraph,
    debouncedZoomChanged,

    isTableLoad,
    onRow,
    columns,
    _dataSource,
  } = useJobsFunctionsLimit();

  const toggleCollapseGraph = val => {
    filterToggeledVar(val);
  };

  // Cache sliced columns
  const slicedColumnsRef = useRef({ source: null, result: null });

  const columnDefs = useMemo(() => {
    if (!keycloakEnable) {
      // Return cached sliced columns if source hasn't changed
      if (slicedColumnsRef.current.source === columns) {
        return slicedColumnsRef.current.result;
      }
      const sliced = columns.slice(1);
      slicedColumnsRef.current = { source: columns, result: sliced };
      return sliced;
    }
    return columns;
  }, [columns, keycloakEnable]);

  const rowData = useMemo(() => _dataSource || [], [_dataSource]);

  const handleRowClicked = useCallback(
    params => {
      if (onRow) {
        const rowClickHandler = onRow(params.data);
        if (rowClickHandler && rowClickHandler.onClick) {
          rowClickHandler.onClick();
        }
      }
    },
    [onRow]
  );

  const getRowId = useCallback(params => rowKey(params.data), []);

  const defaultColDef = useMemo(
    () => ({
      resizable: true,
      sortable: true,
    }),
    []
  );

  const gridStyle = useMemo(
    () => ({
      height: '100%',
      width: '100%',
    }),
    []
  );

  return (
    <JobsWrapper>
      <QueryForm
        zoomDate={zoomedChangedDate}
        onSubmit={onQuerySubmit}
        params={mergedParams}
        jobs={_dataSource}
      />

      {!filterToggeled && (
        <CaretDownOutlinedCenter
          title="Open Graph"
          onClick={() => toggleCollapseGraph(true)}
        />
      )}

      <Collapse isOpened={filterToggeled || false}>
        {dataSourceGraph && filterToggeled && (
          <>
            <QueryDateChart
              dataSource={dataSourceGraph}
              onZoom={debouncedZoomChanged}
            />
            <CaretUpOutlinedCenter
              title="Close Graph"
              onClick={() => toggleCollapseGraph(false)}
            />
            <Divider />
          </>
        )}
      </Collapse>

      <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
        <HKGrid
          id="jobsTable"
          className={USER_GUIDE.TABLE}
          rowData={rowData}
          columnDefs={columnDefs}
          getRowId={getRowId}
          onRowClicked={handleRowClicked}
          loading={isTableLoad}
          enableRowHoverActions
          actionClassName={USER_GUIDE.TABLE_JOB.ACTIONS_SELECT}
          defaultColDef={defaultColDef}
          style={gridStyle}
          overlayLoadingTemplate='<span class="ag-overlay-loading-center">Loading...</span>'
          overlayNoRowsTemplate='<span class="ag-overlay-no-rows-center">No results match your search criteria</span>'
        />
      </div>

      <FloatButton.BackTop
        target={BackToTop}
        style={{ opacity: '0.7', marginRight: '70px' }}
        type="primary"
        shape="circle"
        size="large"
        icon={<ArrowUpOutlined />}
      />
    </JobsWrapper>
  );
};

const GridViewWrapper = React.memo(() => (
  <Container variant="borderless">
    <GridView />
  </Container>
));

const Jobs = () => {
  const query = useQueryHook();
  const showGrid = useMemo(() => query.get('view') === 'grid', [query]);
  return (
    <>
      {showGrid ? <GridViewWrapper /> : <JobsTable />}
      <Routes>
        <Route path=":jobId/overview/:tabKey" element={<OverviewDrawer />} />
      </Routes>
    </>
  );
};

export default React.memo(Jobs);
