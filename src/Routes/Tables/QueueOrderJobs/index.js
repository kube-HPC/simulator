import React from 'react';
import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { TypeTable, TypeFilter } from 'const';
import { getQueryParams } from 'utils';

import TableOrderConsolidated from './TableOrderConsolidated';
import TablePreferred from './TablePreferred';
import TableQueue from './TableQueue';
import { FlexItems, DividerTables } from './OrderStyles';
import { orderApi } from './useQueueOrderJobs';
import { LinkToEdit } from './QueueOrderComponents';

const PAGE_SIZE_TABLE = 30;
class QueueOrderJobs extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // data jobs
      dataSourcePreferred: [],
      dataSourceQueue: [],
      isLoadDataQueue: false,
      isLoadDataPreferred: false,
      // state table action
      selectTable: '', // which table is start drag job
      hoverTable: '', // hover some table
      rowOverIndex: null, // hover on some row table
      positionOverY: null, // Position the mouse arrow on a row, in the top half or in the bottom half
      isDrag: false, // if action id drag jobs

      // filter jobs to group by pipeline or tag default is list jobs
      filterPreferredVal: TypeFilter.JOBID.toUpperCase(), // select filter preferred, group by pipeline or tag
      filterQueueVal: TypeFilter.JOBID.toUpperCase(), // select filter queue , group by pipeline or tag
      filterTableAllInOneVal: TypeFilter.JOBID.toUpperCase(),

      // state paging queue
      pageQueueViewJobId: '', // set jobId is view table queue
      pageQueueLastActionIntention: '', // go to last jobId in list queue
      pageQueueHasNext: 0, // number next jobs in table queue
      pageQueueHasPrev: 0, // number previous jobs in table Preferred
      numberRowToViewPagingQueue: orderApi.numberJobsPerPage, // number row to view in table queue

      // state paging preferred
      pagePreferredViewJobId: '', // set jobId is view table Preferred
      pagePreferredLastActionIntention: '', // go to last jobId in list Preferred
      pagePreferredHasNext: 0, // number next jobs in table Preferred
      pagePreferredHasPrev: 0, // number previous jobs in table Preferred
      numberRowToViewPagingPreferred: orderApi.numberJobsPerPage, // number row to view in table Preferred

      // eslint-disable-next-line react/prop-types
      isEditOrder: getQueryParams('queueEdit') || false,
      TableOrderConsolidatedSize: PAGE_SIZE_TABLE,
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
      isEditOrder,
      TableOrderConsolidatedSize,
      filterTableAllInOneVal,
    } = this.state;

    let dataStatusManage = [];
    let dataStatusPreferred = [];

    if (!isEditOrder) {
      dataStatusPreferred = await orderApi.getStatusPreferred(
        filterTableAllInOneVal,
        null,
        null,
        TableOrderConsolidatedSize
      );

      if (
        TableOrderConsolidatedSize > dataStatusPreferred?.returnList?.length ||
        TableOrderConsolidatedSize > dataStatusPreferred?.length
      ) {
        dataStatusManage = await orderApi.getStatusManage(
          filterTableAllInOneVal,
          null,
          null,
          TableOrderConsolidatedSize
        );
      }
    } else {
      dataStatusManage = await orderApi.getStatusManage(
        filterQueueVal,
        pageQueueViewJobId,
        pageQueueLastActionIntention,
        numberRowToViewPagingQueue
      );
      dataStatusPreferred = await orderApi.getStatusPreferred(
        filterPreferredVal,
        pagePreferredViewJobId,
        pagePreferredLastActionIntention,
        numberRowToViewPagingPreferred
      );
    }
    this.setState({
      isLoadDataPreferred: false,
      isLoadDataQueue: false,
      pageQueueHasNext: dataStatusManage?.nextCount || 0,
      pageQueueHasPrev: dataStatusManage?.prevCount || 0,
      dataSourceQueue: dataStatusManage?.returnList || dataStatusManage,
      pagePreferredHasNext: dataStatusPreferred?.nextCount || 0,
      pagePreferredHasPrev: dataStatusPreferred?.prevCount || 0,
      dataSourcePreferred:
        dataStatusPreferred?.returnList || dataStatusPreferred,
    });
  }

  showPromiseConfirmDelete = async keyDelete => {
    Modal.confirm({
      title: 'Do you want to move these item to Queue list?',
      icon: <ExclamationCircleOutlined />,
      onOk: async () => {
        const res = await this.handleDelete(keyDelete);
        return res;
      },
      onCancel() {},
    });
  };

  handleDelete = async keyDelete => {
    const { dataSourcePreferred, filterPreferredVal } = this.state;

    // get all jobsid need to delete
    const jobsIdToDelete = await orderApi.getJobsIdsScopePreferred(
      filterPreferredVal,
      dataSourcePreferred,
      keyDelete
    );
    this.setState({ isLoadDataPreferred: true, isLoadDataQueue: true });
    // delete all jobsIds from preferred
    await orderApi.deletePreferred([].concat(jobsIdToDelete));
    this.setState({ selectTable: '' });
  };

  filterPreferred = filterValue => {
    this.setState({
      filterPreferredVal: filterValue,
      isLoadDataPreferred: true,
      dataSourcePreferred: [],
      // reset paging Preferred
      pagePreferredViewJobId: '',
      pagePreferredLastActionIntention: '',
      pagePreferredHasNext: 0,
      pagePreferredHasPrev: 0,
      numberRowToViewPagingPreferred: orderApi.numberJobsPerPage,
    });
  };

  filterQueue = filterValue => {
    this.setState({
      isLoadDataQueue: true,
      filterQueueVal: filterValue,
      dataSourceQueue: [],
      // reset paging queue
      pageQueueViewJobId: '',
      pageQueueLastActionIntention: '',
      pageQueueHasNext: 0,
      pageQueueHasPrev: 0,
      numberRowToViewPagingQueue: orderApi.numberJobsPerPage,
    });
  };

  filterTableAllInOne = filterValue => {
    this.setState({ filterTableAllInOneVal: filterValue });
  };

  pageGoToView = (typeTable, goToView) => {
    const { dataSourceQueue, dataSourcePreferred } = this.state;

    if (goToView === 'next') {
      if (typeTable === TypeTable.QUEUE) {
        this.setState({ isLoadDataQueue: true });
        this.setState({ pageQueueLastActionIntention: goToView });
        this.setState({
          pageQueueViewJobId: dataSourceQueue[dataSourceQueue.length - 1].jobId,
        });
      } else {
        this.setState({ isLoadDataPreferred: true });
        this.setState({ pagePreferredLastActionIntention: goToView });
        this.setState({
          pagePreferredViewJobId:
            dataSourcePreferred[dataSourcePreferred.length - 1].jobId,
        });
      }
    }

    if (goToView === 'previous') {
      if (typeTable === TypeTable.QUEUE) {
        this.setState({ isLoadDataQueue: true });
        this.setState({ pageQueueLastActionIntention: goToView });
        this.setState({ pageQueueViewJobId: dataSourceQueue[0].jobId });
      } else {
        this.setState({ isLoadDataPreferred: true });
        this.setState({ pagePreferredLastActionIntention: goToView });
        this.setState({ pagePreferredViewJobId: dataSourcePreferred[0].jobId });
      }
    }

    if (goToView === 'begin' || goToView === 'end') {
      if (typeTable === TypeTable.QUEUE) {
        this.setState({ isLoadDataQueue: true });
        this.setState({ pageQueueLastActionIntention: goToView });
        this.setState({ pageQueueViewJobId: '' });
      } else {
        this.setState({ isLoadDataPreferred: true });
        this.setState({ pagePreferredLastActionIntention: goToView });
        this.setState({ pagePreferredViewJobId: '' });
      }
    }
  };

  onSortEnd = async ({ oldIndex, newIndex }) => {
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
        this.setState({ isLoadDataPreferred: true, isLoadDataQueue: true });
        const { positionOverY } = this.state;

        // get all jobsId need to move

        const jobsToMove = await orderApi.getJobsIdsScopePreferred(
          filterPreferredVal,
          dataSourcePreferred,
          oldIndex
        );

        // get jobId position
        const jobIdPosition = await orderApi.getJobIdPosition(
          dataSourcePreferred,
          filterPreferredVal,
          rowOverIndex,
          positionOverY
        );

        // where set scope after or before jobId position
        const position = positionOverY ? 'after' : 'before';

        const jobsInsert = [].concat(jobsToMove);

        orderApi.movePreferred(jobsInsert, position, jobIdPosition);

        await this.getStatusManageAndPreferred();
      }
    } else if (
      hoverTable === TypeTable.PREFERRED &&
      selectTable === TypeTable.QUEUE
    ) {
      this.setState({ isLoadDataPreferred: true, isLoadDataQueue: true });
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
          resultAllJobs = await orderApi.getManaged(
            null,
            null,
            name,
            null,
            count
          );
        }

        // get all jobsId need to move preferred by tag name
        if (filterQueueVal === TypeFilter.TAG.toUpperCase()) {
          const tag = name.length > 0 ? name : '';
          resultAllJobs = await orderApi.getManaged(
            null,
            null,
            null,
            tag,
            count
          );
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

          // Unhandled Rejection (TypeError): Cannot read properties of undefined (reading 'jobId')
          jobIdPosition =
            dataSourcePreferred.find(x => x.index === rowOverIndex)?.jobId ||
            undefined;

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
        await orderApi.addPreferred(jobsInsert, position, jobIdPosition);
      }
    } else if (
      hoverTable === TypeTable.QUEUE &&
      selectTable === TypeTable.PREFERRED
    ) {
      await this.showPromiseConfirmDelete(oldIndex);
      await this.getStatusManageAndPreferred();
    }

    this.setState({ selectTable: '' });
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
    this.setState({ numberRowToViewPagingPreferred: value });
  };

  onChangeNumberRowPagingQueue = value => {
    this.setState({ numberRowToViewPagingQueue: value });
  };

  toggleEdit = () => {
    const { isEditOrder } = this.state;
    this.setState({ isEditOrder: !isEditOrder });
    this.setState({ TableOrderConsolidatedSize: PAGE_SIZE_TABLE });
  };

  handleTableSize = () => {
    const { TableOrderConsolidatedSize } = this.state;
    this.setState({
      TableOrderConsolidatedSize: TableOrderConsolidatedSize + PAGE_SIZE_TABLE,
    });
  };

  render() {
    const {
      dataSourcePreferred,
      dataSourceQueue,

      hoverTable,
      selectTable,
      isDrag,

      filterQueueVal,
      filterPreferredVal,
      filterTableAllInOneVal,

      pageQueueHasNext,
      pageQueueHasPrev,
      numberRowToViewPagingQueue,

      pagePreferredHasNext,
      pagePreferredHasPrev,
      numberRowToViewPagingPreferred,

      isEditOrder,
      isLoadDataPreferred,
      isLoadDataQueue,
    } = this.state;

    return (
      <>
        <LinkToEdit toggleEdit={this.toggleEdit} />

        {!isEditOrder && (
          <TableOrderConsolidated
            handlePageSize={this.handleTableSize}
            dataSourceAllJobs={[...dataSourcePreferred, ...dataSourceQueue]}
            filterTableAllInOne={this.filterTableAllInOne}
            filterTableAllInOneVal={filterTableAllInOneVal}
          />
        )}

        {isEditOrder && (
          <FlexItems>
            <TablePreferred
              dataSourcePreferred={dataSourcePreferred}
              isLoadData={isLoadDataPreferred}
              onSortEnd={this.onSortEnd}
              handleOnHoverTable={this.handleOnHoverTable}
              handleOnSelectedTable={this.handleOnSelectedTable} //
              handleOnRowOverAndPosition={this.handleOnRowOverAndPosition}
              isDrag={isDrag}
              pageGoToView={this.pageGoToView}
              filterPreferredVal={filterPreferredVal}
              pagePreferredHasPrev={pagePreferredHasPrev}
              pagePreferredHasNext={pagePreferredHasNext}
              filterPreferred={this.filterPreferred}
              onChangeNumberRowPagingPreferred={
                this.onChangeNumberRowPagingPreferred
              }
              numberRowToViewPagingPreferred={numberRowToViewPagingPreferred}
              handleDelete={this.handleDelete}
            />

            <DividerTables />

            <TableQueue
              dataSourceQueue={dataSourceQueue}
              isLoadData={isLoadDataQueue}
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
              isDeleteOverTable={
                hoverTable === TypeTable.QUEUE &&
                selectTable === TypeTable.PREFERRED
              }
            />
          </FlexItems>
        )}
      </>
    );
  }
}

export default React.memo(QueueOrderJobs);
