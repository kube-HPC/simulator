import React, { useMemo } from 'react';
import { useQOrderJobs } from 'hooks';
import QOrderJobsTable from './QOrderJobsTable';
import QOrderFilters from './QOrderJobsFilters';

const QOrderJobsAmount = parseInt(process.env.REACT_APP_SLICE_Q_ORDER_JOBS, 10);
const shouldSliceQOrderJobs =
  Number.isInteger(QOrderJobsAmount) && QOrderJobsAmount > 0;

// component QOrderJobs
const QOrderJobs = () => {
  const { dataSource } = useQOrderJobs();
  const _dataSource = useMemo(() => {
    const ds = dataSource.map((item, index) => ({
      ...item,
      index,
    }));

    return shouldSliceQOrderJobs ? ds.slice(0, QOrderJobsAmount) : ds;
  }, [dataSource]);

  return (
    <>
      <QOrderFilters />
      <QOrderJobsTable dataSource={_dataSource} />
    </>
  );
};

export default React.memo(QOrderJobs);
