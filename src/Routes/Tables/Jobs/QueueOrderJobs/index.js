import React from 'react';
import { TypeTable, TypeFilter } from 'const';
import { Popconfirm } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import SortableTablePreferred from './TablePreferred';
import SortableTableQueue from './TableQueue';
import { DividerTables } from './OrderStyles';

import {
  getJobIdPosition,
  getJobsIdsScopePreferred,
  getManaged,
  movePreferred,
  addPreferred,
  deletePreferred,
  getStatusManage,
  getStatusPreferred,
  numberJobsPerPage,
} from './useQueueOrderJobs';

class QueueOrderJobs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSourcePreferred: [],
      dataSourceQueue: [],
      selectTable: '',
      hoverTable: '',
      // rowSelectIndex: null,
      rowOverIndex: null,
      positionOverY: null,
      isDrag: false,
      filterPreferredVal: TypeFilter.JOBID.toUpperCase(),
      filterQueueVal: TypeFilter.JOBID.toUpperCase(),

      // Paging
      pageQueueViewJobId: '',
      pageQueueLastActionIntention: '',
      pageQueueHasNext: 0,
      pageQueueHasPrev: 0,
      numberRowToViewPagingQueue: numberJobsPerPage,

      pagePreferredViewJobId: '',
      pagePreferredLastActionIntention: '',
      pagePreferredHasNext: 0,
      pagePreferredHasPrev: 0,
      numberRowToViewPagingPreferred: numberJobsPerPage,

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

    this.dataInterval = null;
  }

  async componentDidMount() {
    this.dataInterval = setInterval(async () => {
      const { isDrag } = this.state;

      if (!isDrag) {
        await this.getStatusManageAndPreferred();
      }
    }, 3000);
  }

  componentWillUnmount() {
    // clearing the intervals
    if (this.dataInterval) clearInterval(this.dataInterval);
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
      numberRowToViewPagingQueue,
      numberRowToViewPagingPreferred,
    } = this.state;

    const dataStatusManage = await getStatusManage(
      filterQueueVal,
      pageQueueViewJobId,
      pageQueueLastActionIntention,
      numberRowToViewPagingQueue
    );
    const dataStatusPreferred = await getStatusPreferred(
      filterPreferredVal,
      pagePreferredViewJobId,
      pagePreferredLastActionIntention,
      numberRowToViewPagingPreferred
    );

    this.setState({
      pageQueueHasNext: dataStatusManage?.nextCount || 0,
      pageQueueHasPrev: dataStatusManage?.prevCount || 0,
      dataSourceQueue: dataStatusManage?.returnList || dataStatusManage,
      pagePreferredHasNext: dataStatusPreferred?.nextCount || 0,
      pagePreferredHasPrev: dataStatusPreferred?.prevCount || 0,
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

    if (goToView === 'begin' || goToView === 'end') {
      if (typeTable === TypeTable.QUEUE) {
        this.setState({ pageQueueLastActionIntention: goToView });
        this.setState({ pageQueueViewJobId: '' });
      } else {
        this.setState({ pagePreferredLastActionIntention: goToView });
        this.setState({ pagePreferredViewJobId: '' });
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
        console.log('rowOverIndex >> ', rowOverIndex);
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

        // set all jobsId need to move preferred in array

        jobsIdToAdd = resultAllJobs.map(x => x.jobId);
      }

      // step 2 : set jobsIds in preferred by position after or before item
      // /////////////////////////////////////////////////////////////////////
      if (dataSourcePreferred.length > 0) {
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
        addPreferred(jobsInsert, position, jobIdPosition);
      }
    }
  };

  // handles
  handleOnSelectedTable = selectTable => {
    this.setState({
      selectTable,
      isDrag: true,
    });
  };

  handleOnHoverTable = hoverTable => {
    this.setState({ hoverTable });
  };

  handleOnRowOverAndPosition = (index, pos) => {
    this.setState({ rowOverIndex: index });

    this.setState({
      positionOverY: pos
        ? 1 // "add bottom element"
        : 0, // "add top element"
    });
  };

  onChangeNumberRowPagingPreferred = value => {
    console.log(value);
    this.setState({ numberRowToViewPagingPreferred: value });
  };

  onChangeNumberRowPagingQueue = value => {
    this.setState({ numberRowToViewPagingQueue: value });
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

      filterQueueVal,
      filterPreferredVal,

      pageQueueHasNext,
      pageQueueHasPrev,
      numberRowToViewPagingQueue,

      pagePreferredHasNext,
      pagePreferredHasPrev,
      numberRowToViewPagingPreferred,
    } = this.state;

    return (
      <>
        <div style={{ display: 'flex', gap: '20px' }}>
          <SortableTablePreferred
            dataSourcePreferred={dataSourcePreferred}
            onSortEnd={this.onSortEnd}
            handleOnHoverTable={this.handleOnHoverTable}
            handleOnSelectedTable={this.handleOnSelectedTable} //
            handleOnRowOverAndPosition={this.handleOnRowOverAndPosition}
            isDrag={isDrag}
            actionsCol={actionsCol}
            pageGoToView={this.pageGoToView}
            filterPreferredVal={filterPreferredVal}
            pagePreferredHasPrev={pagePreferredHasPrev}
            pagePreferredHasNext={pagePreferredHasNext}
            filterPreferred={this.filterPreferred}
            onChangeNumberRowPagingPreferred={
              this.onChangeNumberRowPagingPreferred
            }
            numberRowToViewPagingPreferred={numberRowToViewPagingPreferred}
          />

          <DividerTables />
          <DividerTables />

          <SortableTableQueue
            dataSourceQueue={dataSourceQueue}
            onSortEnd={this.onSortEnd}
            handleOnSelectedTable={this.handleOnSelectedTable} //
            handleOnHoverTable={this.handleOnHoverTable}
            isDrag={isDrag}
            pageGoToView={this.pageGoToView}
            filterQueueVal={filterQueueVal}
            pageQueueHasPrev={pageQueueHasPrev}
            pageQueueHasNext={pageQueueHasNext}
            filterQueue={this.filterQueue}
            onChangeNumberRowPagingQueue={this.onChangeNumberRowPagingQueue}
            numberRowToViewPagingQueue={numberRowToViewPagingQueue}
          />
        </div>
        <div style={{ display: 'none1' }}>
          ** hoverTable :{hoverTable} ** *** rowOverIndex : {rowOverIndex} ***
          *** positionOverY : {positionOverY} *** *** isDrag :
          {isDrag.toString()}*** *** filterQueueVal : {filterQueueVal} **** ***
          filterPreferredVal : {filterPreferredVal} ***
        </div>
      </>
    );
  }
}

export default React.memo(QueueOrderJobs);
