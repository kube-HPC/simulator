import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { SelectFilterOptions } from './QueueOrderComponents';
import { TableAllInOneTypeColumns } from './QueueOrderComponents/TableAllInOneTypeColumns';
import { TableAllInOne, FilterTable } from './OrderStyles';

const scrollElement = '.TableAllInOne div.ant-table-body';

const TableOrderConsolidated = ({
  dataSourceAllJobs,
  handlePageSize,
  filterTableAllInOne,
  filterTableAllInOneVal,
}) => {
  const [isLoading, setIsLoading] = useState(true);

  const handleScroll = event => {
    const maxScroll = event.target.scrollHeight - event.target.clientHeight;
    const currentScroll = event.target.scrollTop;
    if (currentScroll === maxScroll) {
      setIsLoading(true);
      handlePageSize();
    }
  };

  const onSelectFilter = selectValue => {
    filterTableAllInOne(selectValue);
    setIsLoading(true);
  };

  useEffect(() => {
    const tableContent = document.querySelector(scrollElement);
    tableContent.addEventListener('scroll', handleScroll);

    if (dataSourceAllJobs.length > 0) {
      setIsLoading(false);
    }

    return () => {
      tableContent.removeEventListener('scroll', handleScroll);
    };
  }, []);

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
