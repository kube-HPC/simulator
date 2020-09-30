import React, { useMemo } from 'react';
import useQuery from 'hooks/useQuery';
import GridView from 'Routes/Tables/Jobs/GridView.react';
import JobsTable from './JobsTable.react';

export { default as getJobsColumns } from './getJobsColumns.react';

export default () => {
  const query = useQuery();
  const showGrid = useMemo(() => query.get('view') === 'grid', [query]);
  return showGrid ? <GridView /> : <JobsTable />;
};
