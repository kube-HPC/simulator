import React, { forwardRef } from 'react';
import { Table, Popconfirm, Select, Tag, Button } from 'antd';
import {
  sortableContainer,
  sortableElement,
  sortableHandle,
} from 'react-sortable-hoc';
import { MenuOutlined, DeleteOutlined } from '@ant-design/icons';
// import { arrayMoveImmutable } from "array-move";
import styled from 'styled-components';
import { toUpperCaseFirstLetter } from 'utils';

import {
  getJobIdPosition,
  getJobsIdsScopePreferred,
  getManaged,
  movePreferred,
  addPreferred,
  deletePreferred,
  getStatusManage,
  getStatusPreferred,
} from './useQueueOrderJobs';
import JobTime from '../JobTime';

const ContainerQueue = styled.div`
  tr.drop-over-downward td {
    border-bottom: 2px dashed #1890ff;
  }

  tr.drop-over-upward td {
    border-top: 2px dashed #1890ff;
  }
`;

const ContainerPreferred = styled.div`
  tr.drop-over-downward td {
    border-bottom: 2px dashed #1890ff;
  }

  tr.drop-over-upward td {
    border-top: 2px dashed #1890ff;
  }
`;
// const MAX_NUMBER = Number.MAX_SAFE_INTEGER;

const TypeTable = {
  PREFERRED: 'preferred',
  QUEUE: 'queue',
};
const TypeFilter = {
  JOBID: 'jobId',
  PIPELINE: 'pipeline',
  TAG: 'tag',
};

const DragHandle = sortableHandle(() => (
  <MenuOutlined style={{ cursor: 'grab', color: '#999' }} />
));

const StartTime = (startTime, { results }) => (
  <JobTime startTime={startTime} results={results} />
);

const TypeTableColumns = {
  JOBID: [
    {
      title: 'Sort',
      dataIndex: 'sort',
      width: 30,
      className: 'drag-visible',
      render: () => <DragHandle />,
    },
    {
      title: 'Name',
      dataIndex: 'pipelineName',
    },
    {
      title: 'Start Time',
      dataIndex: 'entranceTime',
      key: `Start timestamp`,
      width: `10%`,
      render: StartTime,
    },
    {
      title: 'jobID',
      dataIndex: 'jobId',
      className: 'drag-visible',
    },
  ],
  PIPELINE: [
    {
      title: 'Sort',
      dataIndex: 'sort',
      width: 30,
      className: 'drag-visible',
      render: () => <DragHandle />,
    },
    {
      title: 'Pipeline Name',
      dataIndex: 'name',
    },
    {
      title: 'jobs Count',
      dataIndex: 'count',
    },
  ],
  TAG: [
    {
      title: 'Sort',
      dataIndex: 'sort',
      width: 30,
      className: 'drag-visible',
      render: () => <DragHandle />,
    },
    {
      title: 'Tag Name',
      dataIndex: 'name',
      render: name => {
        if (name) {
          const arrayTags = name.toString().split(',');

          return arrayTags.length > 0
            ? arrayTags.map(tagName => <Tag color="purple">{tagName}</Tag>)
            : 'No tag';
        }

        return 'No tag.';
      },
    },
    {
      title: 'jobs Count',
      dataIndex: 'count',
    },
  ],
};

const SortableItem = sortableElement(props => <tr {...props} />);
const SortableContainer = sortableContainer(props => <tbody {...props} />);

const SelectFilterOptions = forwardRef((props, ref) => (
  // eslint-disable-next-line
  <Select ref={ref} onChange={e => props.onSelect(e)}>
    {Object.entries(TypeFilter).map(([key, value]) => (
      <Select.Option key={key} value={key}>
        {toUpperCaseFirstLetter(value)}
      </Select.Option>
    ))}
  </Select>
));

class QueueOrderJobs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSourcePreferred: [],
      dataSourceQueue: [],
      selectTable: '',
      hoverTable: '',
      rowSelectIndex: null,
      rowOverIndex: null,
      positionOverY: null,
      isDrag: false,
      filterPreferredVal: TypeFilter.JOBID.toUpperCase(),
      filterQueueVal: TypeFilter.JOBID.toUpperCase(),

      // Paging
      pageQueueViewJobId: '',
      pageQueueLastActionIntention: '',
      pageQueueHasNext: '',
      pageQueueHasPrev: '',

      pagePreferredViewJobId: '',
      pagePreferredLastActionIntention: '',
      pagePreferredHasNext: '',
      pagePreferredHasPrev: '',

      // Table
      actionsCol: [
        {
          title: 'action',
          dataIndex: 'action',
          width: 30,
          render: (text, record) => {
            const { dataSourcePreferred } = this.state;
            return dataSourcePreferred.length >= 1 ? (
              <Popconfirm
                title="Sure to delete?"
                onConfirm={() => this.handleDelete(record.key)}>
                <DeleteOutlined />
              </Popconfirm>
            ) : null;
          },
        },
      ],
    };

    this.getStatusManageAndPreferred = this.getStatusManageAndPreferred.bind(
      this
    );
  }

  async componentDidMount() {
    setInterval(async () => {
      const { isDrag } = this.state;

      if (!isDrag) {
        await this.getStatusManageAndPreferred();
      }
    }, 3000);
  }

  handleDelete = async keyDelete => {
    const { dataSourcePreferred, filterPreferredVal } = this.state;

    // get all jobsid need to delete
    const jobsIdToDelete = await getJobsIdsScopePreferred(
      filterPreferredVal,
      dataSourcePreferred,
      keyDelete
    );

    // delete all jobsIds from preferred

    deletePreferred([].concat(jobsIdToDelete));
  };

  async getStatusManageAndPreferred() {
    const {
      filterQueueVal,
      filterPreferredVal,
      pageQueueViewJobId,
      pageQueueLastActionIntention,
      pagePreferredViewJobId,
      pagePreferredLastActionIntention,
    } = this.state;

    const dataStatusManage = await getStatusManage(
      filterQueueVal,
      pageQueueViewJobId,
      pageQueueLastActionIntention
    );
    const dataStatusPreferred = await getStatusPreferred(
      filterPreferredVal,
      pagePreferredViewJobId,
      pagePreferredLastActionIntention
    );

    this.setState({ pageQueueHasNext: dataStatusManage?.hasNext || false });
    this.setState({ pageQueueHasPrev: dataStatusManage?.hasPrev || false });
    this.setState({
      dataSourceQueue: dataStatusManage?.returnList || dataStatusManage,
    });
    console.log(dataStatusManage);

    console.log(dataStatusPreferred);

    this.setState({
      pagePreferredHasNext: dataStatusPreferred?.hasNext || false,
    });
    this.setState({
      pagePreferredHasPrev: dataStatusPreferred?.hasPrev || false,
    });
    this.setState({
      dataSourcePreferred:
        dataStatusPreferred?.returnList || dataStatusPreferred,
    });
  }

  filterPreferred = filterValue => {
    this.setState({
      filterPreferredVal: filterValue,
      pageQueueViewJobId: '',
      pageQueueLastActionIntention: '',
      pagePreferredViewJobId: '',
      pagePreferredLastActionIntention: '',
    });
  };

  filterQueue = filterValue => {
    this.setState({
      filterQueueVal: filterValue,
      pageQueueViewJobId: '',
      pageQueueLastActionIntention: '',
      pagePreferredViewJobId: '',
      pagePreferredLastActionIntention: '',
    });
  };

  pageGoToView = (typeTable, goToView) => {
    const { dataSourceQueue, dataSourcePreferred } = this.state;

    if (goToView === 'next') {
      if (typeTable === TypeTable.QUEUE) {
        this.setState({ pageQueueLastActionIntention: goToView });
        this.setState({
          pageQueueViewJobId: dataSourceQueue[dataSourceQueue.length - 1].jobId,
        });
      } else {
        this.setState({ pagePreferredLastActionIntention: goToView });
        this.setState({
          pagePreferredViewJobId:
            dataSourcePreferred[dataSourcePreferred.length - 1].jobId,
        });
      }
    }

    if (goToView === 'previous') {
      if (typeTable === TypeTable.QUEUE) {
        this.setState({ pageQueueLastActionIntention: goToView });
        this.setState({ pageQueueViewJobId: dataSourceQueue[0].jobId });
      } else {
        this.setState({ pagePreferredLastActionIntention: goToView });
        this.setState({ pagePreferredViewJobId: dataSourcePreferred[0].jobId });
      }
    }
  };

  onSortEnd = async ({ oldIndex, newIndex }) => {
    console.log('oldIndex >> ', oldIndex, 'newIndex >>', newIndex);
    this.setState({ isDrag: false });
    const {
      dataSourcePreferred,
      dataSourceQueue,
      selectTable,
      hoverTable,
      rowOverIndex,
      filterQueueVal,
      filterPreferredVal,
    } = this.state;

    // console.log("hoverTable >> ", hoverTable, "selectTable >> ", selectTable);

    // PREFERRED to PREFERRED
    if (
      hoverTable === TypeTable.PREFERRED &&
      selectTable === TypeTable.PREFERRED
    ) {
      if (oldIndex !== newIndex) {
        const { positionOverY } = this.state;

        // get all jobsId need to move
        const jobsToMove = await getJobsIdsScopePreferred(
          filterPreferredVal,
          dataSourcePreferred,
          oldIndex
        );

        // get jobId position
        const jobIdPosition = await getJobIdPosition(
          dataSourcePreferred,
          filterPreferredVal,
          rowOverIndex,
          positionOverY
        );

        // where set scope after or before jobId position
        const position = positionOverY ? 'after' : 'before';

        const jobsInsert = [].concat(jobsToMove);

        movePreferred(jobsInsert, position, jobIdPosition);
      }
    } else if (
      hoverTable === TypeTable.PREFERRED &&
      selectTable === TypeTable.QUEUE
    ) {
      // QUEUE to PREFERRED
      const { positionOverY } = this.state;
      let jobsInsert = [];
      let jobIdPosition = '';
      let position = 'first';
      let jobsIdToAdd = null;

      // step 1 : get jobs from queue to move preferred
      // ///////////////////////////////////////////////

      if (filterQueueVal === TypeFilter.JOBID.toUpperCase()) {
        jobsIdToAdd = dataSourceQueue.find(x => x.index === oldIndex).jobId;
        console.log(jobsIdToAdd);
      } else {
        // get name aggregation add to preferred

        const { name, count } = dataSourceQueue.find(x => x.index === oldIndex);

        let resultAllJobs = [];

        // get all jobsId need to move preferred by pipeline name
        if (filterQueueVal === TypeFilter.PIPELINE.toUpperCase()) {
          const res = await getManaged(null, null, name, null, count);
          resultAllJobs = res.returnList;
        }

        // get all jobsId need to move preferred by tag name
        if (filterQueueVal === TypeFilter.TAG.toUpperCase()) {
          const res = await getManaged(null, null, null, name, count);
          resultAllJobs = res.returnList;
        }

        console.log(
          'get all jobsId need to move >> PIPELINE resultAllJobs >> ',
          resultAllJobs
        );

        // set all jobsId need to move preferred in array

        jobsIdToAdd = resultAllJobs.map(x => x.jobId);
        console.log(jobsIdToAdd);
      }

      // step 2 : set jobsIds in preferred by position after or before item
      // /////////////////////////////////////////////////////////////////////
      if (dataSourcePreferred.length > 0) {
        console.log(newIndex, rowOverIndex);

        // get jobId That the data is added after or before it
        if (filterPreferredVal === TypeFilter.JOBID.toUpperCase()) {
          // when aggregation is JobId
          jobIdPosition = dataSourcePreferred.find(
            x => x.index === rowOverIndex
          ).jobId;

          // get position to need add jobsID
          position = positionOverY ? 'after' : 'before';
        } else {
          // when aggregation is Pipeline or Tag
          const lastJobID =
            dataSourcePreferred.find(x => x.index === rowOverIndex).lastJob ||
            undefined;
          const jobIdOfPreviousAggregation =
            dataSourcePreferred.find(x => x.index === rowOverIndex - 1)
              ?.lastJob || undefined;

          // 1 - is add to bottom
          // 0 - is add to up
          jobIdPosition = lastJobID;
          if (positionOverY) {
            jobIdPosition = lastJobID;
            // job add in after aggregation
            position = 'after';
          }
          // get jobId of previous aggregation if we need to add before
          // and we add this in after previous aggregation
          else if (jobIdOfPreviousAggregation) {
            jobIdPosition = jobIdOfPreviousAggregation;
            // job add in after next aggregation
            position = 'after';
          } else {
            jobIdPosition = undefined;
            // job add in last list
            position = 'first';
          }
        }

        // jobs to add
        jobsInsert = [].concat(jobsIdToAdd);
      } else {
        // job add in first list
        position = 'first';
      }

      // set jobs to add in array
      jobsInsert = [].concat(jobsIdToAdd);

      // add all jobs to preferred
      if (jobsInsert.length > 0) {
        console.log(jobsInsert, position, jobIdPosition);
        addPreferred(jobsInsert, position, jobIdPosition);
      }
    }
  };

  DraggableContainer = props => (
    <SortableContainer
      useDragHandle
      disableAutoscroll
      helperClass="row-dragging"
      onSortEnd={this.onSortEnd}
      onMouseEnter={() => {
        this.setState({ hoverTable: TypeTable.PREFERRED });
      }}
      {...props}
    />
  );

  DraggableContainerQueue = props => (
    <SortableContainer
      useDragHandle
      transitionDuration={0}
      disableAutoscroll
      helperClass="row-dragging"
      onSortEnd={this.onSortEnd}
      onMouseEnter={() => {
        this.setState({ hoverTable: TypeTable.QUEUE });
      }}
      {...props}
    />
  );

  DraggableBodyRow = ({ className, style, ...restProps }) => {
    const { dataSourcePreferred } = this.state; // dataSourceQueue

    const index = dataSourcePreferred.findIndex(
      x => x?.index === restProps['data-row-key']
    );
    return <SortableItem index={index} {...restProps} />;
  };

  DraggableBodyRowQueue = ({ className, style, ...restProps }) => {
    const { dataSourceQueue } = this.state;

    const index = dataSourceQueue?.findIndex(
      x => x?.index === restProps['data-row-key']
    );
    return <SortableItem index={index} {...restProps} />;
  };

  render() {
    const {
      dataSourcePreferred,
      dataSourceQueue,
      hoverTable,
      rowOverIndex,
      positionOverY,
      actionsCol,
      isDrag,
      rowSelectIndex,
      filterQueueVal,
      filterPreferredVal,

      pageQueueHasNext,
      pageQueueHasPrev,
      pagePreferredHasNext,
      pagePreferredHasPrev,
    } = this.state;

    return (
      <>
        ** hoverTable :{hoverTable} ** *** rowOverIndex : {rowOverIndex} *** ***
        positionOverY : {positionOverY} *** *** isDrag :{isDrag.toString()}***
        *** filterQueueVal : {filterQueueVal} **** *** filterPreferredVal :{' '}
        {filterPreferredVal} ***
        <ContainerPreferred
          onMouseEnter={() => {
            this.setState({ hoverTable: TypeTable.PREFERRED });
          }}
          onMouseLeave={() => {
            this.setState({ hoverTable: '' });
          }}>
          <h1>Preferred </h1>
          GroupBy : <SelectFilterOptions onSelect={this.filterPreferred} />
          <Table
            pagination={false}
            dataSource={dataSourcePreferred}
            columns={[...TypeTableColumns[filterPreferredVal], ...actionsCol]} // actionsCol
            rowKey="index"
            onRow={(record, index) => ({
              onMouseDown: () => {
                this.setState({
                  selectTable: TypeTable.PREFERRED,
                  isDrag: true,
                });
              },
              onMouseMove: event => {
                const rect = event.target.getBoundingClientRect();
                const pos =
                  event.clientY - rect.top > event.target.offsetHeight / 2;

                // light border tr where the input element
                if (isDrag) {
                  if (pos) {
                    event.target.parentNode.classList.add('drop-over-downward');

                    event.target.parentNode.classList.remove(
                      'drop-over-upward'
                    );
                  } else {
                    event.target.parentNode.classList.add('drop-over-upward');
                    event.target.parentNode.classList.remove(
                      'drop-over-downward'
                    );
                  }
                }

                this.setState({ rowOverIndex: index });
                this.setState({
                  positionOverY: pos
                    ? 1 // "add bottom element"
                    : 0, // "add top element"
                });
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
          <div>
            {pagePreferredHasPrev && (
              <Button
                onClick={() =>
                  this.pageGoToView(TypeTable.PREFERRED, 'previous')
                }
                type="primary"
                shape="circle">
                {' '}
                pre{' '}
              </Button>
            )}
            {pagePreferredHasNext && (
              <Button
                onClick={() => this.pageGoToView(TypeTable.PREFERRED, 'next')}
                type="primary"
                shape="circle">
                {' '}
                next{' '}
              </Button>
            )}
          </div>
        </ContainerPreferred>
        <ContainerQueue
          onMouseEnter={() => {
            this.setState({ hoverTable: TypeTable.QUEUE });
          }}
          onMouseLeave={() => {
            this.setState({ hoverTable: '' });
          }}>
          <h1>Queue {rowSelectIndex}</h1>
          GroupBy : <SelectFilterOptions onSelect={this.filterQueue} />
          <Table
            pagination={false}
            dataSource={dataSourceQueue}
            columns={TypeTableColumns[filterQueueVal]}
            rowKey="index"
            onRow={(record, index) => ({
              onMouseDown: () => {
                this.setState({
                  selectTable: TypeTable.QUEUE,
                  rowSelectIndex: index,
                  isDrag: true,
                });
              },
            })}
            components={{
              body: {
                wrapper: this.DraggableContainerQueue,
                row: this.DraggableBodyRowQueue,
              },
            }}
          />
          <div>
            {pageQueueHasPrev && (
              <Button
                onClick={() => this.pageGoToView(TypeTable.QUEUE, 'previous')}
                type="primary"
                shape="circle">
                {' '}
                previous{' '}
              </Button>
            )}
            {pageQueueHasNext && (
              <Button
                onClick={() => this.pageGoToView(TypeTable.QUEUE, 'next')}
                type="primary"
                shape="circle">
                {' '}
                next{' '}
              </Button>
            )}
          </div>
        </ContainerQueue>
      </>
    );
  }
}

export default React.memo(QueueOrderJobs);
