// libs

import 'antd/dist/antd.css';
import { connect } from 'react-redux';
import { Table, Card } from 'antd';
import ReactJson from 'react-json-view';
import { openModal } from '../actions/modal.action';
import { init } from '../actions/algorithmTable.action';
import { createSelector } from 'reselect';
import React, { Component } from 'react';
import { withState } from 'recompose';

const RECORD_STATUS = {
  bootstrap: '#2db7f5',
  ready: '#87d068',
  init: '#f50',
  working: '#ec8c16',
  shutdown: '#87d068',
  error: '#87d068',
  stop: '#87d068'
};

class AlgorithmTable extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.props.init();
    const callPopOverWorkAround = (isVisible) => {
      this.props.onPopoverClickVisible(isVisible);
    };

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
        dataIndex: 'data.name',
        key: 'name',
        width: '20%',
        sorter: (a, b) => sorter(a.data.name, b.data.name)
      },
      {
        title: 'Algorithm Image',
        dataIndex: 'data.algorithmImage',
        key: 'algorithmImage',
        width: '20%',
        onFilter: (value, record) => record.data.algorithmImage.includes(value),
        sorter: (a, b) => sorter(a.data.algorithmImage, b.data.algorithmImage)
      },
      {
        title: 'cpu',
        dataIndex: 'data.cpu',
        key: 'cpu',
        width: '20%'
      },
      {
        title: 'mem',
        dataIndex: 'data.mem',
        key: 'mem',
        width: '20%',
        sorter: (a, b) => sorter(a.data.mem, b.data.mem)
      },
      {
        title: 'Worker Image',
        dataIndex: 'data.workerImage',
        key: 'workerImage',
        width: '20%',
        sorter: (a, b) => sorter(a.data.workerImage, b.data.workerImage)

      }
    ];
  }

  renderColumns() {
  }

  render() {
    const { dataSource } = this.props;
    return (
      <div>
        <Table
          columns={this.columns}
          dataSource={dataSource.asMutable()}
          pagination={{
            defaultCurrent: 1, pageSize: 15
          }}
          locale={{ emptyText: 'no data' }}

          expandedRowRender={(record) => (
            <Card title="Full details">
              <ReactJson src={record} />
            </Card>

          )} />
      </div>
    );
  }
}

const algorithmTable = (state) => state.algorithmTable.dataSource;
const autoCompleteFilter = (state) => state.autoCompleteFilter.filter;

const tableDataSelector = createSelector(
  algorithmTable,
  autoCompleteFilter,
  (algorithmTable, autoCompleteFilter) => {
    return algorithmTable;
  }
);

AlgorithmTable.propTypes = {
  dataSource: React.PropTypes.array.isRequired
};

const mapStateToProps = (state) => ({
  dataSource: tableDataSelector(state),
  scriptsPath: state.serverSelection.currentSelection.scriptsPath,
  sshUser: state.serverSelection.currentSelection.user
});

export default connect(mapStateToProps, { openModal, init })(
  withState('isVisible', 'onPopoverClickVisible', { visible: false, podName: '' })(AlgorithmTable)
);
