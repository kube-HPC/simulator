import { connect } from 'react-redux';
import { Table, Tag, Progress, notification, Icon, Button, Tooltip } from 'antd';
import { createSelector } from 'reselect';
import React, { Component } from 'react';
import Moment from 'react-moment';
import PropTypes from 'prop-types';
import { withState } from 'recompose';
import { openModal } from '../../../actions/modal.action';
import { init, stopPipeline, execRawPipeline, downloadStorageResults } from '../../../actions/containerTable.action';
import TabSwitcher from '../../dumb/TabSwitcher.react';
import { getJaegerData } from '../../../actions/jaegerGetData.action';
import { getKubernetesLogsData } from '../../../actions/kubernetesLog.action';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import './ContainerTable.scss'

const RECORD_STATUS = {
  active: '#2db7f5',
  completed: '#87d068',
  failed: '#f50',
  stopped: '#ec8c16',
  succeed: '#87d068',
  creating: '#838383',
  skipped: '#eeda13',
};

class ContainerTable extends Component {

  componentWillMount() {
    this.props.init();

    const firstLetterUpperCase = (s) => s.charAt(0).toUpperCase() + s.slice(1);

    const sorter = (a, b) => {
      let tempA = null;
      let tempB = null;
      tempA = a || '';
      tempB = b || '';
      return tempA.localeCompare(tempB);
    };
    this.columns = [
      {
        title: 'Job ID',
        dataIndex: 'key',
        key: 'key',
        width: '15%',
        sorter: (a, b) => sorter(a.key, b.key),
        render: (text, record) =>
          <CopyToClipboard text={`${record.key}`} onCopy={() => notification.success({ message: 'Copied to clipboard' })}>
            <div>
              <Icon type="right" className='jobIdIcon' />
              {`${record.key.substring(0, 15)} ...`}
            </div>
          </CopyToClipboard>
      },
      {
        title: 'Pipeline Name',
        dataIndex: 'status.pipeline',
        key: 'pipeline',
        width: '10%',
        onFilter: (value, record) => record.key.includes(value),
        sorter: (a, b) => sorter(a.key, b.key)
      },
      {
        title: 'Status',
        dataIndex: 'status.status',
        width: '5%',
        key: 'status',
        render: (text, record) => (<span>
          <Tag color={RECORD_STATUS[record.status && record.status.status]}>{firstLetterUpperCase(record.status && record.status.status)}</Tag>
        </span>
        ),
        sorter: (a, b) => sorter(a.status.status, b.status.status)
      },
      {
        title: 'Start time',
        dataIndex: 'status.timestamp',
        key: 'Start timestamp',
        width: '15%',
        sorter: (a, b) => sorter(a.timestamp, b.timestamp),
        render: (text, record) =>
          (<span>
            <Moment format="DD/MM/YY HH:mm:ss">
              {record.pipeline && record.pipeline.startTime}
            </Moment>
          </span>
          )
      },
      {
        title: 'Running time',
        dataIndex: 'status.timestamp',
        key: 'timestamp',
        width: '10%',
        render: (text, record) => {
          return (<span>{
            record.results ?
              <span>
                {record.results.timeTook + " Seconds"}
              </span>
              :
              <Moment date={record.pipeline && record.pipeline.startTime} durationFromNow />
          }
          </span>
          )
        }
      },
      {
        title: 'Description',
        dataIndex: 'status.data.details',
        key: 'details',
        width: '10%',
        render: (text, record) => {
          let statuses = record.status.data && record.status.data.states ?
            Object.entries(record.status.data.states.asMutable()).map((s, i) =>
              <Tooltip key={i} placement="top" title={firstLetterUpperCase(s[0])} >
                <Tag color={RECORD_STATUS[s[0]] || 'magenta'}>{s[1]}</Tag>
              </Tooltip>)
            : null;
          return (<span>
            {statuses}
          </span>
          )
        }
      },
      {
        title: 'Progress',
        dataIndex: 'Progress',
        width: '20%',
        key: 'y',
        render: (text, record) => {
          let progress = (record.status && record.status.data && record.status.data.progress) || 0;
          const stopped = (record.status && record.status.status === 'stopped');
          const failed = (record.status && record.status.status === 'failed');
          progress = parseInt(progress);
          if (progress === 100) {
            return (<span>
              <Progress percent={progress} status={stopped || failed ? 'exception' : 'success'} strokeColor={failed ? '#f50' : stopped ? 'orange' : null} />
            </span>);
          }
          return (<span>
            <Progress percent={progress} status={stopped || failed ? 'exception' : 'active'} strokeColor={failed ? '#f50' : stopped ? 'orange' : null} />
          </span>);
        }
      },
      {
        title: '',
        dataIndex: '',
        key: 'stop',
        width: '5%',
        render: (text, record) => {
          const actionButton = record.status.status === 'active' ?
            <Button type="danger" shape="circle" icon="close" onClick={() => this.stopPipeline(record.key)} /> :
            <Button type="default" shape="circle" icon="redo" onClick={() => this.rerunPipeline(record.pipeline)} />;
          return (actionButton)
        }
      },
      {
        title: '',
        dataIndex: '',
        key: 'results',
        width: '10%',
        render: (text, record) => {
          let disabled = true;
          if (record.results && record.results.data && record.results.data.storageInfo) {
            disabled = false
          }
          return <Button
            type="primary"
            disabled={disabled}
            shape="circle"
            icon="download"
            title="download results"
            onClick={() => this.downloadStorageResults(record.results.data.storageInfo.path)} />
        }
      }
    ];
  }

  rerunPipeline(pipeline) {
    this.props.execRawPipeline(pipeline);
  }

  stopPipeline(jobId) {
    this.props.stopPipeline(jobId);
  }

  downloadStorageResults(path) {
    this.props.downloadStorageResults(path);
  }

  renderColumns() {
  }

  render() {
    const { dataSource } = this.props;
    return (
      <div>
        <Table
          columns={this.columns}
          dataSource={dataSource}
          pagination={{ className: 'tablePagination', defaultCurrent: 1, pageSize: 15, hideOnSinglePage: true }}
          expandedRowRender={(record) => (
            <TabSwitcher record={{
              key: record.key,
              graph: record.graph,
              record: {
                pipeline: record.pipeline,
                status: record.status,
                results: record.results
              },
              jaeger: (this.props.jaeger[record.key] || null)
            }} />
          )}
          onExpand={(expanded, record) => {
            if (expanded) {
              this.props.getJaegerData(record.key);

            }
          }} />
      </div>
    );
  }
}

const containerTable = (state) => state.containerTable.dataSource;
const autoCompleteFilter = (state) => state.autoCompleteFilter.filter;
const rowFilter = (raw, value) => Object.values(raw.status).find(data => data instanceof Object ? false : data.includes(value) ? true : false)
const tableDataSelector = createSelector(
  containerTable,
  autoCompleteFilter,
  (containerTable, autoCompleteFilter) => containerTable && containerTable.asMutable().filter(row => rowFilter(row, autoCompleteFilter))

);

ContainerTable.propTypes = {
  execRawPipeline: PropTypes.func.isRequired,
  downloadStorageResults: PropTypes.func.isRequired,
  init: PropTypes.func.isRequired,
  getJaegerData: PropTypes.func.isRequired,
  dataSource: PropTypes.array.isRequired,
  stopPipeline: PropTypes.func.isRequired,
  jaeger: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  dataSource: tableDataSelector(state),
  jaeger: state.jaeger,
  kubernetesLogs: state.kubernetesLogs,
  scriptsPath: state.serverSelection.currentSelection.scriptsPath,
  sshUser: state.serverSelection.currentSelection.user
});

export default connect(mapStateToProps, { openModal, init, stopPipeline, execRawPipeline, downloadStorageResults, getJaegerData, getKubernetesLogsData })(
  withState('isVisible', 'onPopoverClickVisible', { visible: false, podName: '' })(ContainerTable)
);
