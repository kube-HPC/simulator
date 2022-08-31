import React, { useMemo } from 'react';
import { Route } from 'react-router-dom';
import styled from 'styled-components';
import useQueryHook from 'hooks/useQuery';
import { Table } from 'components';
import { Card } from 'components/common';
import { Collapse } from 'react-collapse';
import { Divider, Empty, BackTop, Button } from 'antd';
import { ArrowUpOutlined } from '@ant-design/icons';
import useJobsFunctions from './useJobsFunctions';
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

const BackToTop = () => document.querySelector('#jobsTable .ant-table-body');

const JobsTable = () => {
  const {
    zoomedChangedDate,
    filterToggeled,
    onQuerySubmit,
    mergedParams,
    dataSourceGraph,
    debouncedZoomChanged,
    onFetchMore,
    isGraphLoad,
    isTableLoad,
    onRow,
    columns,
    _dataSource,
  } = useJobsFunctions();

  return (
    <>
      <Collapse isOpened={filterToggeled}>
        <QueryForm
          zoomDate={zoomedChangedDate}
          onSubmit={onQuerySubmit}
          params={mergedParams}
        />

        {dataSourceGraph && (
          <QueryDateChart
            dataSource={dataSourceGraph}
            onZoom={debouncedZoomChanged}
          />
        )}

        <Divider />
      </Collapse>

      <Table
        id="jobsTable"
        fetchMore={onFetchMore}
        loading={isTableLoad && isGraphLoad}
        onRow={onRow}
        rowKey={rowKey}
        expandIcon={false}
        columns={columns}
        dataSource={_dataSource}
        pagination={false}
        isInfinity
        heightScroll={filterToggeled ? '58vh' : '88vh'}
        locale={localeEmpty}
        rowClassName={record => {
          if (record.status.status === 'active') {
            return 'active-row';
          }
          return null;
        }}
      />
      <BackTop target={BackToTop}>
        <Button
          style={{ opacity: '0.7' }}
          type="primary"
          shape="circle"
          size="large"
          icon={<ArrowUpOutlined />}
        />
      </BackTop>
    </>
  );
};

const Container = styled(Card)`
  & .ant-card-body {
    padding: 5px;
  }
`;

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
      <Route
        exact
        path="/jobs/:jobId/overview/:tabKey"
        component={OverviewDrawer}
      />
    </>
  );
};

export default React.memo(Jobs);
