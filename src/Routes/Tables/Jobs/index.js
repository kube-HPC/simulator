import React, { useMemo } from 'react';

import { Route, Routes } from 'react-router-dom';
import styled from 'styled-components';
import useQueryHook from 'hooks/useQuery';
import { WTable } from 'components';
import { Card } from 'components/common';
import { Collapse } from 'react-collapse';
import { Divider, Empty, FloatButton } from 'antd';
import { selectors } from 'reducers';
import { useSelector } from 'react-redux';

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

const localeEmpty = {
  emptyText: (
    <Empty description={<span>No results match your search criteria</span>} />
  ),
};

const Container = styled(Card)`
  & .ant-card-body {
    padding: 5px;
  }
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
const BackToTop = () => document.querySelector('#jobsTable .ant-table-body');

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

  // if have keycloak remove avatar from columns job
  const trimmedColumns = useMemo(() => {
    if (!keycloakEnable) {
      return columns.slice(1);
    }
    return columns;
  }, [columns, keycloakEnable]);

  return (
    <>
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

      <WTable
        id="jobsTable"
        loading={isTableLoad}
        onRow={onRow}
        rowKey={rowKey}
        expandIcon={false}
        columns={trimmedColumns}
        dataSource={_dataSource}
        pagination={false}
        scroll={{ y: filterToggeled ? '50vh' : '80vh' }}
        locale={localeEmpty}
      />

      <FloatButton.BackTop
        target={BackToTop}
        style={{ opacity: '0.7', marginRight: '70px' }}
        type="primary"
        shape="circle"
        size="large"
        icon={<ArrowUpOutlined />}
      />
    </>
  );
};

const GridViewWrapper = React.memo(() => (
  <Container bordered={false}>
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
