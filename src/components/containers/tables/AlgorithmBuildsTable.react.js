import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import groupby from 'lodash/groupBy';
import { Table, Tag, Icon, Progress, notification, Button, Tooltip } from 'antd';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { createSelector } from 'reselect';
import ReactJson from 'react-json-view';
import React, { Component } from 'react';
import { withState } from 'recompose';
import humanizeDuration from 'humanize-duration';
import { openModal } from '../../../actions/modal.action';
import { init, cancelBuild, rerunBuild } from '../../../actions/algorithmBuildsTable.action';
import { STATUS } from '../../../constants/colors';

class AlgorithmBuildsTable extends Component {
  firstLetterUpperCase = s => s.charAt(0).toUpperCase() + s.slice(1);

  showModal = () => {
    this.setState({
      visible: true
    });
  };

  handleOk = e => {
    this.setState({
      visible: false
    });
  };

  handleCancel = e => {
    this.setState({
      visible: false
    });
  };

  cancelBuild = buildId => {
    this.props.cancelBuild(buildId);
  };

  rerunBuild = buildId => {
    this.props.rerunBuild(buildId);
  };

  componentWillMount() {
    this.props.init();
    this.setState({ isVisible: false });

    const sorter = (a, b) => {
      let tempA = null;
      let tempB = null;
      tempA = a || '';
      tempB = b || '';
      return tempA.localeCompare(tempB);
    };

    this.columns = [
      {
        title: 'Algorithm Name',
        dataIndex: 'algorithmName',
        key: 'algorithmName',
        width: '20%',
        sorter: (a, b) => sorter(a.algorithmName, b.algorithmName)
      },
      {
        title: 'Status',
        key: 'status',
        width: '20%',
        sorter: (a, b) => sorter(a.timestamp, b.timestamp),
        render: (text, record) => {
          const tags = Object.entries(record.statuses).map((s, i) => (
            <Tooltip key={i} placement="top" title={this.firstLetterUpperCase(s[0])}>
              <Tag color={STATUS[s[0]] || 'magenta'}>{s[1].length}</Tag>
            </Tooltip>
          ));
          return <span>{tags}</span>;
        }
      },
      {
        title: 'Builds',
        dataIndex: 'builds',
        key: 'builds',
        width: '60%',
        render: (text, record) =>
          this.props.dataSource.filter(d => d.algorithmName === record.algorithmName).length
      }
    ];

    this.nestedColumns = [
      {
        title: 'BuildId',
        dataIndex: 'buildId',
        key: 'buildId',
        width: '15%',
        sorter: (a, b) => sorter(a.buildId, b.buildId),
        render: (text, record) => (
          <CopyToClipboard
            text={`${record.buildId}`}
            onCopy={() => notification.success({ message: 'Copied to clipboard' })}
          >
            <div>
              <Icon type="right" className="jobIdIcon" />
              {`${record.buildId.substring(0, 15)}...`}
            </div>
          </CopyToClipboard>
        )
      },
      {
        title: 'Env',
        dataIndex: 'env',
        key: 'env',
        width: '10%',
        sorter: (a, b) => sorter(a.env, b.env)
      },
      {
        title: 'Version',
        dataIndex: 'version',
        key: 'version',
        width: '10%',
        sorter: (a, b) => sorter(a.version, b.version)
      },
      {
        title: 'Start Time',
        dataIndex: 'startTime',
        key: 'startTime',
        width: '10%',
        sorter: (a, b) => sorter(a.startTime, b.startTime),
        render: (text, record) => (
          <span>
            <Moment format="DD/MM/YY HH:mm:ss">{record.startTime}</Moment>
          </span>
        )
      },
      {
        title: 'Running time',
        dataIndex: 'timeTook',
        key: 'timeTook',
        width: '10%',
        sorter: (a, b) => sorter(a.endTime, b.endTime),
        render: (text, record) => {
          return (
            <span>
              {record.endTime ? (
                <span>
                  {humanizeDuration(record.endTime - record.startTime, { maxDecimalPoints: 2 })}
                </span>
              ) : (
                <span>
                  {humanizeDuration(Date.now() - record.startTime, { maxDecimalPoints: 2 })}
                </span>
              )}
            </span>
          );
        }
      },
      {
        title: 'Status',
        key: 'status',
        width: '15%',
        sorter: (a, b) => sorter(a.status, b.status),
        render: (text, record) => (
          <span>
            <Tag color={STATUS[record.status]}>{this.firstLetterUpperCase(record.status)}</Tag>
          </span>
        )
      },
      {
        title: 'Progress',
        dataIndex: 'Progress',
        width: '20%',
        key: 'y',
        render: (text, record) => {
          let progress = record.progress || 0;
          const failed = record.status === 'failed';
          progress = parseInt(progress);
          if (progress === 100) {
            return (
              <span>
                <Progress
                  percent={progress}
                  status={failed ? 'exception' : 'success'}
                  strokeColor={failed ? '#f50' : null}
                />
              </span>
            );
          }
          return (
            <span>
              <Progress
                percent={progress}
                status={failed ? 'exception' : 'active'}
                strokeColor={failed ? '#f50' : null}
              />
            </span>
          );
        }
      },
      {
        title: '',
        key: 'stop',
        width: '10%',
        render: (text, record) => {
          const actionButton =
            record.status === 'pending' ? (
              <Button
                type="danger"
                shape="circle"
                icon="close"
                onClick={() => this.cancelBuild(record.buildId)}
              />
            ) : (
              <Button
                type="default"
                shape="circle"
                icon="redo"
                onClick={() => this.rerunBuild(record.buildId)}
              />
            );
          return actionButton;
        }
      }
    ];
  }

  _expandedRowRender = record => {
    const data = [];
    const dataSource = this.props.dataSource.filter(d => d.algorithmName === record.algorithmName);

    dataSource.forEach(d => {
      data.push(d);
    });

    return (
      <Table
        columns={this.nestedColumns}
        dataSource={data}
        pagination={{
          style: { paddingRight: '50px' },
          defaultCurrent: 1,
          pageSize: 15,
          hideOnSinglePage: true
        }}
        expandedRowRender={record => (
          <ReactJson
            src={record}
            name={false}
            iconStyle="square"
            displayDataTypes={false}
            displayObjectSize={false}
            enableClipboard={false}
          />
        )}
      />
    );
  };

  render() {
    const { dataSource } = this.props;
    const grouped = groupby(dataSource, 'algorithmName');
    const builds = Object.entries(grouped).map(([k, v]) => {
      return {
        algorithmName: k,
        statuses: groupby(v, 'status')
      };
    });

    return (
      <div>
        <Table
          columns={this.columns}
          dataSource={builds}
          pagination={{
            className: 'tablePagination',
            defaultCurrent: 1,
            pageSize: 15,
            hideOnSinglePage: true
          }}
          expandedRowRender={this._expandedRowRender}
        />
      </div>
    );
  }
}

const algorithmBuildsTable = state => state.algorithmBuildsTable.dataSource;
const autoCompleteFilter = state => state.autoCompleteFilter.filter;

const tableDataSelector = createSelector(
  algorithmBuildsTable,
  autoCompleteFilter,
  algorithmBuildsTable => algorithmBuildsTable
);

AlgorithmBuildsTable.propTypes = {
  dataSource: PropTypes.array.isRequired,
  init: PropTypes.func.isRequired,
  cancelBuild: PropTypes.func.isRequired,
  rerunBuild: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  dataSource: tableDataSelector(state),
  scriptsPath: state.serverSelection.currentSelection.scriptsPath,
  sshUser: state.serverSelection.currentSelection.user,
  showModal: state.algorithmBuildsTable.showModal
});

export default connect(
  mapStateToProps,
  { openModal, init, cancelBuild, rerunBuild }
)(
  withState('isVisible', 'onPopoverClickVisible', { visible: false, podName: '' })(
    AlgorithmBuildsTable
  )
);
