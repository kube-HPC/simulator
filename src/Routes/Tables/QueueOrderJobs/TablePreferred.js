import React from 'react';
import { TypeTable, TypeFilter } from 'const';
import PropTypes from 'prop-types';
import { Popconfirm } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { selectors } from 'reducers';
import { QueryCount } from './QueryCount';
import { ContainerArea, FilterTable, TableItem } from './OrderStyles';
import OrderPaging from './OrderPaging';
import {
  SortableItem,
  SortableContainer,
  SelectFilterOptions,
} from './QueueOrderComponents';
import { TypeTableColumns } from './QueueOrderComponents/TypeTableColumns';

class TablePreferred extends React.Component {
  actionsCol = [
    {
      title: 'action',
      dataIndex: 'action',
      width: 30,
      render: (text, record) => {
        const { dataSourcePreferred, handleDelete } = this.props;
        return dataSourcePreferred.length >= 1 ? (
          <Popconfirm
            title="Do you want to move these item to Queue list?"
            onConfirm={() => handleDelete(record.key)}>
            <DeleteOutlined />
          </Popconfirm>
        ) : null;
      },
    },
  ];

  shouldCancelStart = e => {
    let targetEle = e;
    if (!targetEle.id) {
      targetEle = e.target;
    }

    if (targetEle.outerHTML.indexOf('delete') > -1) {
      return true;
    }

    return false;
  };

  DraggableContainer = props => {
    const { onSortEnd, handleOnSelectedTable, handleOnHoverTable } = this.props;

    return (
      <SortableContainer
        shouldCancelStart={this.shouldCancelStart}
        disableAutoscroll
        helperClass="row-dragging"
        onSortEnd={onSortEnd}
        onSortStart={() => {
          handleOnSelectedTable(TypeTable.PREFERRED);
        }}
        onMouseEnter={() => {
          handleOnHoverTable(TypeTable.PREFERRED);
        }}
        {...props}
      />
    );
  };

  DraggableBodyRow = ({ className, style, ...restProps }) => {
    const { dataSourcePreferred } = this.props;
    const index = dataSourcePreferred.findIndex(
      x => x?.index === restProps['data-row-key']
    );
    return <SortableItem index={index} {...restProps} />;
  };

  paintDragLocation = (event, record, isDrag) => {
    const { handleOnRowOverAndPosition } = this.props;
    const rect = event.target.getBoundingClientRect();
    const pos = event.clientY - rect.top > event.target.offsetHeight / 2;

    // light border tr where the input element
    if (isDrag) {
      if (pos) {
        event.target.parentNode.classList.add('drop-over-downward');
        event.target.parentNode.classList.remove('drop-over-upward');
      } else {
        event.target.parentNode.classList.add('drop-over-upward');
        event.target.parentNode.classList.remove('drop-over-downward');
      }
    }

    handleOnRowOverAndPosition(record.index, pos);
  };

  render() {
    const {
      dataSourcePreferred,
      handleOnHoverTable,
      filterPreferredVal,

      pagePreferredHasPrev,
      pagePreferredHasNext,
      isDrag,
      pageGoToView,
      filterPreferred,
      onChangeNumberRowPagingPreferred,
      numberRowToViewPagingPreferred,

      isLoadData,
    } = this.props;
    return (
      <ContainerArea
        onMouseEnter={() => {
          handleOnHoverTable(TypeTable.PREFERRED);
        }}
        onMouseLeave={() => {
          handleOnHoverTable('');
        }}>
        <QueryCount
          isShow={dataSourcePreferred.length > 0}
          nameCount="Preferred"
          status="processing"
          selectorsData={selectors.queue.preferred}
        />

        <FilterTable>
          GroupBy :{' '}
          <SelectFilterOptions
            onSelect={filterPreferred}
            filterVal={filterPreferredVal}
          />
        </FilterTable>
        <TableItem
          loading={isLoadData}
          pagination={
            filterPreferredVal !== TypeFilter.JOBID.toLocaleUpperCase()
              ? { position: ['bottomCenter', 'bottomCenter'] }
              : false
          }
          dataSource={dataSourcePreferred}
          columns={[
            ...TypeTableColumns[filterPreferredVal],
            ...this.actionsCol,
          ]}
          rowKey="index"
          onRow={record => ({
            onMouseMove: event => this.paintDragLocation(event, record, isDrag),
            onMouseLeave: event => {
              event.target.parentNode.classList.remove('drop-over-downward');
              event.target.parentNode.classList.remove('drop-over-upward');
            },
          })}
          components={{
            body: {
              wrapper: this.DraggableContainer,
              row: this.DraggableBodyRow,
            },
          }}
        />
        {filterPreferredVal === TypeFilter.JOBID.toLocaleUpperCase() && (
          <OrderPaging
            HasPrev={pagePreferredHasPrev}
            HasNext={pagePreferredHasNext}
            pageGoToView={pageGoToView}
            numberRowToView={numberRowToViewPagingPreferred}
            onChangeNumberRow={onChangeNumberRowPagingPreferred}
            TypeTable={TypeTable.PREFERRED}
          />
        )}
      </ContainerArea>
    );
  }
}

TablePreferred.propTypes = {
  pageGoToView: PropTypes.func.isRequired,
  filterPreferred: PropTypes.func.isRequired,
  onSortEnd: PropTypes.func.isRequired,
  handleOnSelectedTable: PropTypes.func.isRequired,
  handleOnHoverTable: PropTypes.func.isRequired,
  dataSourcePreferred: PropTypes.arrayOf(PropTypes.object).isRequired,
  filterPreferredVal: PropTypes.string.isRequired,
  isDrag: PropTypes.bool.isRequired,
  handleOnRowOverAndPosition: PropTypes.func.isRequired,
  pagePreferredHasPrev: PropTypes.number.isRequired,
  pagePreferredHasNext: PropTypes.number.isRequired,
  onChangeNumberRowPagingPreferred: PropTypes.func.isRequired,
  numberRowToViewPagingPreferred: PropTypes.number.isRequired,
  handleDelete: PropTypes.func.isRequired,

  isLoadData: PropTypes.bool.isRequired,
};

export default TablePreferred;
