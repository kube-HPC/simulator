import React, { useMemo } from 'react';
import { Route } from 'react-router-dom';
import styled from 'styled-components';
import useQueryHook from 'hooks/useQuery';
import { WTable } from 'components';
import { Card } from 'components/common';
import { Collapse } from 'react-collapse';
import { Divider, Empty, BackTop, Button } from 'antd';
import { ArrowUpOutlined } from '@ant-design/icons';
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

const BackToTop = () => document.querySelector('#jobsTable .ant-table-body');

const JobsTable = () => {
  const {
    zoomedChangedDate,
    filterToggeled,
    onQuerySubmit,
    mergedParams,
    dataSourceGraph,
    debouncedZoomChanged,
    isGraphLoad,
    isTableLoad,
    onRow,
    columns,
    _dataSource,
  } = useJobsFunctionsLimit();

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

      <WTable
        id="jobsTable"
        loading={isTableLoad || isGraphLoad}
        onRow={onRow}
        rowKey={rowKey}
        expandIcon={false}
        columns={columns}
        dataSource={_dataSource}
        pagination={false}
        scroll={{ y: filterToggeled ? '50vh' : '88vh' }}
        locale={localeEmpty}
      />

      <BackTop target={BackToTop}>
        <Button
          style={{ opacity: '0.5' }}
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
