import { connect } from 'react-redux';
import { Table, Tag, Progress, notification, Icon, Button, Tooltip, Row, Col } from 'antd';
import { createSelector } from 'reselect';
import React, { Component } from 'react';
import Moment from 'react-moment';
import PropTypes from 'prop-types';
import { withState } from 'recompose';
import humanizeDuration from 'humanize-duration';
import { openModal } from '../../../actions/modal.action';
import { init, stopPipeline, execRawPipeline, downloadStorageResults } from '../../../actions/containerTable.action';
import TabSwitcher from '../../dumb/TabSwitcher.react';
import { getJaegerData } from '../../../actions/jaegerGetData.action';
import { getKubernetesLogsData } from '../../../actions/kubernetesLog.action';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { STATUS, PIPELINE_STATUS, PRIORITY } from '../../../constants/colors';
import './ContainerTable.scss';

class ContainerTable extends Component {
  componentWillMount() {
    this.props.init();

    const firstLetterUpperCase = s => s.charAt(0).toUpperCase() + s.slice(1);

    const sorter = (a, b) => {
      let tempA = null;
      let tempB = null;
      tempA = a || '';
      tempB = b || '';
      return tempA.localeCompare(tempB);
    };

    const intSorter = (a, b) => {
      return a - b;
    };

    const getStatusFilter = () => {
      return Object.keys(PIPELINE_STATUS).map(k => ({ text: firstLetterUpperCase(k), value: k }));
    };

    this.columns = [
      {
        title: 'Job ID',
        dataIndex: 'key',
        key: 'key',
        width: '15%',
        sorter: (a, b) => sorter(a.key, b.key),
        render: (text, record) => (
          <CopyToClipboard text={`${record.key}`} onCopy={() => notification.success({ message: 'Copied to clipboard' })}>
            <div>
              <Icon type="right" className="jobIdIcon" />
              {`${record.key.substring(0, 15)} ...`}
            </div>
          </CopyToClipboard>
        )
      },
      {
        title: 'Pipeline',
        dataIndex: 'status.pipeline',
        key: 'pipeline',
        width: '10%',
        sorter: (a, b) => sorter(a.key, b.key)
      },
      {
        title: 'Status',
        dataIndex: 'status.status',
        width: '10%',
        key: 'status',
        render: (text, record) => (
          <span>
            <Tag color={STATUS[record.status && record.status.status]}>{firstLetterUpperCase(record.status && record.status.status)}</Tag>
          </span>
        ),
        sorter: (a, b) => sorter(a.status.status, b.status.status),
        filterMultiple: true,
        filters: getStatusFilter(),
        onFilter: (value, record) => {
          return record.status.status === value;
        }
      },
      {
        title: 'Start time',
        dataIndex: 'status.timestamp',
        key: 'Start timestamp',
        width: '10%',
        sorter: (a, b) => sorter(a.timestamp, b.timestamp),
        render: (text, record) => (
          <span>
            <Moment format="DD/MM/YY HH:mm:ss">{record.pipeline && record.pipeline.startTime}</Moment>
          </span>
        )
      },
      {
        title: 'Running time',
        dataIndex: 'status.timestamp',
        key: 'timestamp',
        width: '10%',
        render: (text, record) => {
          return (
            <span>
              {record.results ? (
                <span>{humanizeDuration(record.results.timeTook * 1000, { maxDecimalPoints: 2 })}</span>
              ) : (
                <span>{humanizeDuration(Date.now() - (record.pipeline && record.pipeline.startTime), { maxDecimalPoints: 2 })}</span>
              )}
            </span>
          );
        }
      },
      {
        title: 'Nodes',
        dataIndex: 'status.data.details',
        key: 'details',
        width: '10%',
        render: (text, record) => {
          let statuses =
            record.status.data && record.status.data.states
              ? Object.entries(record.status.data.states.asMutable()).map((s, i) => (
                  <Tooltip key={i} placement="top" title={firstLetterUpperCase(s[0])}>
                    <Tag color={STATUS[s[0]] || 'magenta'}>{s[1]}</Tag>
                  </Tooltip>
                ))
              : null;
          return <span>{statuses}</span>;
        }
      },
      {
        title: 'Priority',
        dataIndex: 'pipeline.priority',
        key: 'priority',
        width: '5%',
        sorter: (a, b) => intSorter(a.pipeline.priority, b.pipeline.priority),
        render: (text, record) => {
          return (
            <Tooltip placement="top" title={PRIORITY[record.pipeline.priority].name}>
              <Tag color={PRIORITY[record.pipeline.priority].color}>{PRIORITY[record.pipeline.priority].name}</Tag>
            </Tooltip>
          );
        }
      },
      {
        title: 'Progress',
        dataIndex: 'Progress',
        width: '20%',
        key: 'y',
        render: (text, record) => {
          let progress = (record.status && record.status.data && record.status.data.progress) || 0;
          const stopped = record.status && record.status.status === 'stopped';
          const failed = record.status && record.status.status === 'failed';
          progress = parseInt(progress);
          if (progress === 100) {
            return (
              <span>
                <Progress percent={progress} status={stopped || failed ? 'exception' : 'success'} strokeColor={failed ? '#f50' : stopped ? 'orange' : null} />
              </span>
            );
          }
          return (
            <span>
              <Progress percent={progress} status={stopped || failed ? 'exception' : 'active'} strokeColor={failed ? '#f50' : stopped ? 'orange' : null} />
            </span>
          );
        }
      },
      {
        title: 'Action',
        dataIndex: 'action',
        key: 'stop',
        width: '10%',
        render: (text, record) => {
          const stopAction =
            record.status.status === 'active' || record.status.status === 'pending' ? (
              <Tooltip placement="top" title={'Stop Pipeline'}>
                <Button type="danger" shape="circle" icon="close" onClick={() => this.stopPipeline(record.key)} data-cy="pipelineStop" />
              </Tooltip>
            ) : (
              <Tooltip placement="top" title={'Re-Run'}>
                <Button type="default" shape="circle" icon="redo" onClick={() => this.rerunPipeline(record.pipeline)} />
              </Tooltip>
            );

          const isDisabled = !(record.results && record.results.data && record.results.data.storageInfo);
          const downloadAction = (
            <Tooltip placement="top" title={'Download Results'}>
              <Button type="default" disabled={isDisabled} shape="circle" icon="download" onClick={() => this.downloadStorageResults(record.results.data.storageInfo.path)} />
            </Tooltip>
          );

          return (
            <Row type="flex" justify="start">
              <Col span={8}>{stopAction}</Col>
              <Col span={8}>{downloadAction}</Col>
            </Row>
          );
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

  renderColumns() {}

  render() {
    const { dataSource } = this.props;
    return (
      <div>
        <Table
          columns={this.columns}
          dataSource={dataSource}
          pagination={{
            className: 'tablePagination',
            defaultCurrent: 1,
            pageSize: 15,
            hideOnSinglePage: true
          }}
          expandedRowRender={record => (
            <TabSwitcher
              record={{
                key: record.key,
                graph: record.graph,
                record: {
                  pipeline: record.pipeline,
                  status: record.status,
                  results: record.results
                },
                jaeger: this.props.jaeger[record.key] || null
              }}
            />
          )}
          onExpand={(expanded, record) => {
            if (expanded) {
              this.props.getJaegerData(record.key);
            }
          }}
        />
      </div>
    );
  }
}

const containerTable = state => state.containerTable.dataSource;
const autoCompleteFilter = state => state.autoCompleteFilter.filter;
const rowFilter = (raw, value) => Object.values(raw.status).find(data => (data instanceof Object ? false : data.includes(value) ? true : false));
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
  jaeger: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  dataSource: tableDataSelector(state),
  jaeger: state.jaeger,
  kubernetesLogs: state.kubernetesLogs,
  scriptsPath: state.serverSelection.currentSelection.scriptsPath,
  sshUser: state.serverSelection.currentSelection.user
});

export default connect(
  mapStateToProps,
  {
    openModal,
    init,
    stopPipeline,
    execRawPipeline,
    downloadStorageResults,
    getJaegerData,
    getKubernetesLogsData
  }
)(
  withState('isVisible', 'onPopoverClickVisible', {
    visible: false,
    podName: ''
  })(ContainerTable)
);
