import React from 'react';
import DynamicTable from 'components/Layout/DynamicTable.react';
import useJobs from 'hooks/useJobs.react';

const JobsTable = () => {
  const { columns, dataSource, expandedRowRender, onExpand } = useJobs();

  return (
    <DynamicTable
      columns={columns}
      dataSource={dataSource}
      expandedRowRender={expandedRowRender}
      onExpand={onExpand}
    />
  );
};

export default JobsTable;
// JobsTable.whyDidYouRender = true;
