import React, { useCallback, useMemo, useEffect, useState } from 'react';
import { useQOrderJobs } from 'hooks';
import { arrayMoveImmutable } from 'array-move';
import { Table } from 'components';
import {
  sortableContainer,
  sortableElement,
  sortableHandle,
} from 'react-sortable-hoc';
import { MenuOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import usePath from './../usePath';

export { default as QOrderJobsColumns } from './../jobColumns';
// const rowKey = job => `job-${job.key}`;

const DragHandle = sortableHandle(() => (
  <MenuOutlined style={{ cursor: 'grab', color: '#999' }} />
));
const SortableItem = sortableElement(props => <tr {...props} />);
const SortableContainer = sortableContainer(props => <tbody {...props} />);

// component QOrderJobsTable
const QOrderJobsTable = ({ dataSource }) => {
  const { goTo } = usePath();
  const { columns, loading } = useQOrderJobs();

  const onRow = useCallback(
    job => ({
      onDoubleClick: () => goTo.overview({ nextJobId: job.key }),
    }),
    [goTo]
  );

  const [dataSourceState, setDataSourceState] = useState(dataSource);

  useEffect(() => {
    setDataSourceState(dataSource);
  }, [dataSource]);

  // add column drag
  const QOrderJobsColumns = useMemo(
    () => [
      {
        title: 'Sort',
        dataIndex: 'sort',
        width: 30,
        className: 'drag-visible',
        render: () => <DragHandle />,
        // eslint-disable-next-line no-param-reassign
      },
      ...columns,
    ],
    [columns]
  );

  const onSortEnd = useCallback(
    ({ oldIndex, newIndex }) => {
      if (oldIndex !== newIndex) {
        const newData = arrayMoveImmutable(
          [].concat(dataSourceState),
          oldIndex,
          newIndex
        ).filter(el => !!el);
        setDataSourceState(newData);
      }
    },
    [dataSourceState]
  );

  const DraggableContainer = useCallback(
    props => (
      <SortableContainer
        useDragHandle
        disableAutoscroll
        helperClass="row-dragging"
        onSortEnd={onSortEnd}
        {...props}
      />
    ),
    [onSortEnd]
  );

  // eslint-disable-next-line react/prop-types
  const DraggableBodyRow = useCallback(
    ({ className, style, ...restProps }) => {
      // function findIndex base on Table rowKey props and should always be a right array index
      const index = dataSourceState.findIndex(
        x => x.index === restProps['data-row-key']
      );
      return <SortableItem index={index} {...restProps} className />;
    },
    [dataSourceState]
  );

  return (
    <Table
      loading={loading}
      onRow={onRow}
      rowKey="index"
      expandIcon={false}
      columns={QOrderJobsColumns}
      dataSource={dataSourceState}
      pagination={false}
      components={{
        body: {
          wrapper: DraggableContainer,
          row: DraggableBodyRow,
        },
      }}
    />
  );
};

QOrderJobsTable.propTypes = {
  dataSource: PropTypes.arrayOf(PropTypes.object),
};

QOrderJobsTable.defaultProps = {
  dataSource: [],
};

export default React.memo(QOrderJobsTable);
