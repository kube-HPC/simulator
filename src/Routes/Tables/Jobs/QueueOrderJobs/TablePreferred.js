import React from 'react';
import { TypeTable } from 'const';
import PropTypes from 'prop-types';
import { Table } from 'antd';
import {
  SortableItem,
  SortableContainer,
  SelectFilterOptions,
  TypeTableColumns,
} from './OrderComponents';
import { ContainerArea, TitleTable, FilterTable } from './OrderStyles';
import OrderPaging from './OrderPaging';

class SortableTablePreferred extends React.Component {
  // eslint-disable-next-line no-useless-constructor
  constructor(props) {
    super(props);
  }

  DraggableContainer = props => {
    const { onSortEnd, handleOnSelectedTable, handleOnHoverTable } = this.props;

    return (
      <SortableContainer
        useDragHandle
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

  render() {
    const {
      dataSourcePreferred,
      handleOnHoverTable,
      filterPreferredVal,
      actionsCol,
      handleOnRowOverAndPosition,
      pagePreferredHasPrev,
      pagePreferredHasNext,
      isDrag,
      pageGoToView,
      filterPreferred,
      onChangeNumberRowPagingPreferred,
      numberRowToViewPagingPreferred,
    } = this.props;
    return (
      <ContainerArea
        onMouseEnter={() => {
          handleOnHoverTable(TypeTable.PREFERRED);
        }}
        onMouseLeave={() => {
          handleOnHoverTable('');
        }}>
        <TitleTable>Preferred </TitleTable>

        <FilterTable>
          GroupBy : <SelectFilterOptions onSelect={filterPreferred} />
        </FilterTable>
        <Table
          pagination={false}
          dataSource={dataSourcePreferred}
          columns={[...TypeTableColumns[filterPreferredVal], ...actionsCol]} // actionsCol
          rowKey="index"
          onRow={(record, index) => ({
            onMouseMove: event => {
              const rect = event.target.getBoundingClientRect();
              const pos =
                event.clientY - rect.top > event.target.offsetHeight / 2;

              // light border tr where the input element
              if (isDrag) {
                if (pos) {
                  event.target.parentNode.classList.add('drop-over-downward');
                  event.target.parentNode.classList.remove('drop-over-upward');
                } else {
                  event.target.parentNode.classList.add('drop-over-upward');
                  event.target.parentNode.classList.remove(
                    'drop-over-downward'
                  );
                }
              }

              handleOnRowOverAndPosition(index, pos);
            },
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

        <OrderPaging
          HasPrev={pagePreferredHasPrev}
          HasNext={pagePreferredHasNext}
          pageGoToView={pageGoToView}
          numberRowToView={numberRowToViewPagingPreferred}
          onChangeNumberRow={onChangeNumberRowPagingPreferred}
          TypeTable={TypeTable.PREFERRED}
        />
      </ContainerArea>
    );
  }
}

SortableTablePreferred.propTypes = {
  pageGoToView: PropTypes.func.isRequired,
  filterPreferred: PropTypes.func.isRequired,
  onSortEnd: PropTypes.func.isRequired,
  handleOnSelectedTable: PropTypes.func.isRequired,
  handleOnHoverTable: PropTypes.func.isRequired,
  dataSourcePreferred: PropTypes.func.isRequired,
  filterPreferredVal: PropTypes.string.isRequired,
  actionsCol: PropTypes.oneOfType([PropTypes.object]).isRequired,
  isDrag: PropTypes.bool.isRequired,
  handleOnRowOverAndPosition: PropTypes.func.isRequired,
  pagePreferredHasPrev: PropTypes.number.isRequired,
  pagePreferredHasNext: PropTypes.number.isRequired,
  onChangeNumberRowPagingPreferred: PropTypes.func.isRequired,
  numberRowToViewPagingPreferred: PropTypes.number.isRequired,
};

export default SortableTablePreferred;
