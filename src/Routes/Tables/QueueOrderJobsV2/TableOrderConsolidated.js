import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useVT } from 'virtualizedtableforantd4';
import { SelectFilterOptions } from './QueueOrderComponents';
import { TableAllInOneTypeColumns } from './QueueOrderComponents/TableAllInOneTypeColumns';
import { TableAllInOne, FilterTable } from './OrderStyles';

const TableOrderConsolidated = ({
  dataSourceAllJobs,
  handlePageSize,
  filterTableAllInOne,
  filterTableAllInOneVal,
}) => {
  const [isLoading, setIsLoading] = useState(true);

  const [vt] = useVT(
    () => ({
      initTop: 1,
      onScroll: ({ isEnd }) => {
        if (isEnd) {
          setIsLoading(true);
          handlePageSize(); // get more data
        }
      },
      scroll: { y: 2000 },
      debug: false,
    }),
    [dataSourceAllJobs]
  );

  const onSelectFilter = selectValue => {
    filterTableAllInOne(selectValue);
    setIsLoading(true);
  };

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1500);
  }, [isLoading]);

  return (
    <>
      <FilterTable>
        GroupBy :{' '}
        <SelectFilterOptions
          onSelect={onSelectFilter}
          filterVal={filterTableAllInOneVal}
        />
      </FilterTable>

      <TableAllInOne
        className="TableAllInOne"
        pagination={false}
        dataSource={dataSourceAllJobs}
        columns={TableAllInOneTypeColumns[filterTableAllInOneVal]}
        rowKey={record => `${record.key}_${record.typeElement}`}
        scroll={{ y: '80vh' }}
        loading={isLoading}
        components={vt}
      />
    </>
  );
};

TableOrderConsolidated.propTypes = {
  dataSourceAllJobs: PropTypes.arrayOf(PropTypes.object).isRequired,
  handlePageSize: PropTypes.func.isRequired,
  filterTableAllInOne: PropTypes.func.isRequired,
  filterTableAllInOneVal: PropTypes.string.isRequired,
};

export default TableOrderConsolidated;
