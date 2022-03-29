import React from 'react';
import { TypeTable, TypeFilter } from 'const';
import PropTypes from 'prop-types';
import { Empty } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import {
  SortableItem,
  SortableContainer,
  SelectFilterOptions,
  TypeTableColumns,
} from './OrderComponents';
import {
  ContainerArea,
  TitleTable,
  FilterTable,
  DeleteOverTable,
  TableItem,
} from './OrderStyles';
import OrderPaging from './OrderPaging';

class TableQueue extends React.Component {
  // eslint-disable-next-line no-useless-constructor
  constructor(props) {
    super(props);
  }

  DraggableContainerQueue = props => {
    const { onSortEnd, handleOnSelectedTable, handleOnHoverTable } = this.props;

    return (
      <SortableContainer
        transitionDuration={0}
        disableAutoscroll
        helperClass="row-dragging"
        onSortEnd={onSortEnd}
        onSortStart={() => {
          handleOnSelectedTable(TypeTable.QUEUE);
        }}
        onMouseEnter={() => {
          handleOnHoverTable(TypeTable.QUEUE);
        }}
        {...props}
      />
    );
  };

  DraggableBodyRowQueue = ({ className, style, ...restProps }) => {
    const { dataSourceQueue } = this.props;

    const index = dataSourceQueue?.findIndex(
      x => x?.index === restProps['data-row-key']
    );
    return <SortableItem index={index} {...restProps} />;
  };

  render() {
    const {
      dataSourceQueue,
      handleOnHoverTable,
      filterQueueVal,
      pageQueueHasPrev,
      pageQueueHasNext,
      pageGoToView,
      filterQueue,
      onChangeNumberRowPagingQueue,
      numberRowToViewPagingQueue,
      viewTableColumnOrRow,
      isDeleteOverTable,
      isLoadData,
    } = this.props;

    return (
      <ContainerArea
        $isDirectionColumn={viewTableColumnOrRow}
        onMouseEnter={() => {
          handleOnHoverTable(TypeTable.QUEUE);
        }}
        onMouseLeave={() => {
          handleOnHoverTable('');
        }}>
        <TitleTable>Managed</TitleTable>

        <FilterTable>
          GroupBy :{' '}
          <SelectFilterOptions
            onSelect={filterQueue}
            filterVal={filterQueueVal}
          />
        </FilterTable>

        <DeleteOverTable $isDisplay={isDeleteOverTable}>
          <DeleteOutlined />
          <br />
          Release to move the item to the queue
        </DeleteOverTable>
        <TableItem
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="There are no pending jobs"
              />
            ),
          }}
          loading={isLoadData}
          pagination={
            filterQueueVal !== TypeFilter.JOBID.toLocaleUpperCase()
              ? { position: ['bottomCenter', 'bottomCenter'] }
              : false
          }
          dataSource={dataSourceQueue}
          columns={TypeTableColumns[filterQueueVal]}
          rowKey="index"
          components={{
            body: {
              wrapper: this.DraggableContainerQueue,
              row: this.DraggableBodyRowQueue,
            },
          }}
        />

        {filterQueueVal === TypeFilter.JOBID.toLocaleUpperCase() && (
          <OrderPaging
            HasPrev={pageQueueHasPrev}
            HasNext={pageQueueHasNext}
            pageGoToView={pageGoToView}
            numberRowToView={numberRowToViewPagingQueue}
            onChangeNumberRow={onChangeNumberRowPagingQueue}
            TypeTable={TypeTable.QUEUE}
          />
        )}
      </ContainerArea>
    );
  }
}

TableQueue.propTypes = {
  pageGoToView: PropTypes.func.isRequired,
  onSortEnd: PropTypes.func.isRequired,
  handleOnSelectedTable: PropTypes.func.isRequired,
  handleOnHoverTable: PropTypes.func.isRequired,
  dataSourceQueue: PropTypes.func.isRequired,
  filterQueueVal: PropTypes.string.isRequired,
  isDrag: PropTypes.bool.isRequired,
  isLoadData: PropTypes.bool.isRequired,
  pageQueueHasPrev: PropTypes.number.isRequired,
  pageQueueHasNext: PropTypes.number.isRequired,
  filterQueue: PropTypes.func.isRequired,
  onChangeNumberRowPagingQueue: PropTypes.func.isRequired,
  numberRowToViewPagingQueue: PropTypes.number.isRequired,
  viewTableColumnOrRow: PropTypes.bool.isRequired,
  isDeleteOverTable: PropTypes.bool.isRequired,
};

// const areEqual = (prev, next) => prev.dataSourceQueue === next.dataSourceQueue;

export default TableQueue;