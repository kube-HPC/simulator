import React, { useMemo } from 'react';
import useQuery from 'hooks/useQuery';
import GridView from 'components/GridView/GridView.react';
import JobsTable from './JobsTable.react';

export { default as getJobsColumns } from './getJobsColumns.react';

export default () => {
  const query = useQuery();
  const showGrid = useMemo(() => query.get('view') === 'grid', [query]);
  if (showGrid) return <GridView />;
  return <JobsTable />;
};
