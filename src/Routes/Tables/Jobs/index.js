import React, { useCallback, useMemo, useState } from 'react';
import { Route, useHistory, useLocation } from 'react-router-dom';
import qs from 'qs';
import styled from 'styled-components';
import useQueryHook from 'hooks/useQuery';
import { Table } from 'components';
import { Card } from 'components/common';
import { useJobs, usePolling } from 'hooks';
import { useQuery, useReactiveVar } from '@apollo/client';
import { Collapse } from 'react-collapse';
import { filterToggeledVar } from 'cache';
import { JOB_QUERY } from '../../../graphql/queries';
import GridView from './GridView';
import OverviewDrawer from './OverviewDrawer';
import usePath from './usePath';
import QueryForm from './QueryTable/QueryForm';
import QueryDateChart from './QueryTable/QueryDateChart';

// import { _ } from 'core-js';

const jobsAmount = parseInt(process.env.REACT_APP_SLICE_JOBS, 10);
const shouldSliceJobs = Number.isInteger(jobsAmount) && jobsAmount > 0;
let limitAmount = 20;
export { default as jobColumns } from './jobColumns';
const rowKey = job => `job-${job.key}`;
let zoomedChangedDate = Date.now();
// const dateObj = new Date();
const JobsTable = () => {
  const [queryParams, setQueryParams] = useState({
    limit: 20,
    // datesRange:{from:dateObj.setDate(dateObj.getDate()),to:dateObj.setDate(dateObj.getDate()-7)}
  });

  const history = useHistory();
  const urlParams = useLocation();

  const mergedParams = useMemo(() => {
    const locationParsed = qs.parse(urlParams.search, {
      ignoreQueryPrefix: true,
      allowDots: true,
    });
    // const locationParsed = tempLocationParsed?.from && tempLocationParsed?.to ? { from: tempLocationParsed.from, to: tempLocationParsed.to } : null;
    const mergedItemsParams = { ...locationParsed, ...queryParams };

    const _qParams = qs.stringify(mergedItemsParams, { allowDots: true });
    // const { datesRange, ...rest } = mergedItemsParams;
    // const _qParams = datesRange ?
    //   new URLSearchParams({ ...rest, from: datesRange?.from, to: datesRange?.to }).toString()
    //   : new URLSearchParams({ ...rest }).toString();

    history.push({
      pathname: urlParams.pathname,
      //   search: urlParams.search === '' ? `?${_qParams}` : `${urlParams.search}&&${_qParams}`
      search: `?${_qParams}`,
    });

    return mergedItemsParams;
  }, [queryParams]);

  const filterToggeled = useReactiveVar(filterToggeledVar);
  const query = useQuery(JOB_QUERY, {
    variables: mergedParams,
  });
  limitAmount = query?.data?.jobsAggregated.jobs?.length || limitAmount;
  usePolling(query, 3000);

  const { goTo } = usePath();
  const { columns } = useJobs();
  const onRow = useCallback(
    job => ({
      onDoubleClick: () => goTo.overview({ nextJobId: job.key }),
    }),
    [goTo]
  );
  const onFetchMore = useCallback(
    () =>
      query.fetchMore({
        variables: {
          cursor: query?.data?.jobsAggregated?.cursor,
          ...mergedParams,
        },
      }),
    [query, queryParams]
  );

  const onZoomChanged = useCallback(data => {
    const datesRange = {
      from: new Date(data.min).toISOString(),
      to: new Date(data.max).toISOString(),
    };
    setQueryParams({ ...mergedParams, datesRange, limit: 20 });
    zoomedChangedDate = Date.now();
    query.fetchMore({ variables: { ...mergedParams, datesRange, limit: 20 } });
  });

  const onQuerySubmit = useCallback(values => {
    let datesRange = null;
    const { time, ...other } = values;
    time
      ? (datesRange = {
          from: time[0]?.toISOString(),
          to: time[1]?.toISOString(),
        })
      : null;
    Object.values(other).forEach((element, index) => {
      element === '' ? (other[Object.keys(other)[index]] = undefined) : null;
    });
    // console.log({ ...other, datesRange });

    setQueryParams({ ...mergedParams, ...other, datesRange });
  });

  const _dataSource = useMemo(() => {
    if (query && query.data) {
      if (shouldSliceJobs) {
        return query.data.jobsAggregated.jobs.slice(0, jobsAmount);
      }
      return query.data.jobsAggregated.jobs;
    }
    return [];
  }, [query]);

  // const params = useMemo(() => {
  //   return queryParams || {};
  // }, [queryParams]);

  return (
    <>
      <Collapse isOpened={filterToggeled}>
        <QueryForm
          zoomDate={zoomedChangedDate}
          onSubmit={onQuerySubmit}
          params={mergedParams}
        />
        <QueryDateChart dataSource={_dataSource} onZoom={onZoomChanged} />
      </Collapse>
      <Table
        fetchMore={onFetchMore}
        loading={query.loading}
        onRow={onRow}
        rowKey={rowKey}
        expandIcon={false}
        columns={columns}
        dataSource={_dataSource}
        pagination={false}
        isInfinity
      />
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
