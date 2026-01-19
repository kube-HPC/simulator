import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { StopOutlined } from '@ant-design/icons';
import { Button, Tooltip, Popconfirm } from 'antd';
import PropTypes from 'prop-types';
import { useActions } from 'hooks';
// import { useVT } from 'virtualizedtableforantd4';
import { SelectFilterOptions } from './QueueOrderComponents';
import { TableAllInOneTypeColumns } from './QueueOrderComponents/TableAllInOneTypeColumns';
import { TableAllInOne, FilterTable } from './OrderStyles';

const BottomPanel = styled.div`
  margin-top: 10px;
  display: none; // flex;
  justify-content: flex-end;
`;

const TableOrderConsolidated = ({
  dataSourceAllJobs,
  handlePageSize,
  filterTableAllInOne,
  filterTableAllInOneVal,
}) => {
  const { stopPipeline } = useActions();
  const [isLoading, setIsLoading] = useState(true);
  const [stopAllInQueueIsRun, setStopAllInQueueIsRun] = useState(false);

  // eslint-disable-next-line no-console
  console.log(handlePageSize);

  /* const [vt] = useVT(
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
  ); */

  const onSelectFilter = selectValue => {
    filterTableAllInOne(selectValue);
    setIsLoading(true);
  };

  const handelStopAllQueue = useCallback(() => {
    stopPipeline();
    setStopAllInQueueIsRun(true);
  }, [stopPipeline]);

  useEffect(() => {
    if (dataSourceAllJobs.length > 0) {
      setTimeout(() => setIsLoading(false), 1500);
    } else {
      setTimeout(() => setIsLoading(false), 3500);
    }
  }, [isLoading, dataSourceAllJobs.length]);

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
        //  components={vt}
      />
      <BottomPanel>
        {dataSourceAllJobs.length > 0 && (
          <Tooltip title="stop all queue jobs">
            <Popconfirm
              title="Are you sure you want to stop all jobs in queue?"
              onConfirm={handelStopAllQueue}
              okText="Yes"
              cancelText="No">
              <Button
                icon={<StopOutlined />}
                loading={stopAllInQueueIsRun}
                styles={{ paddingLeft: '10' }}>
                stop all queue jobs
              </Button>
            </Popconfirm>
          </Tooltip>
        )}
      </BottomPanel>
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
