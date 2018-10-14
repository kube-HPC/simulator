import 'antd/dist/antd.css';
import { connect } from 'react-redux';
import { Table, Card } from 'antd';
import React, { Component } from 'react';
import ReactJson from 'react-json-view';
import { init } from '../actions/workerTable.action';
import { openModal } from '../actions/modal.action';
import ExecuteButton from './ExecuteButton.react';

const { Column } = Table;

const dataSource = [{
  key: 'unique-key',
  name: 'dennis3',
  nodes: [{
    nodeName: 'green',
    algorithmName: 'green-alg',
    input: [
      '@flowInput.files.link'
    ]
  }],
  webhooks: {
    progress: 'http://localhost:3003/webhook/progress',
    result: 'http://localhost:3003/webhook/result'
  },
  priority: 3
}];

class StoredPipesTable extends Component {
  constructor(props) {
    super(props);
    // this.props.dataSource = data;
  }

  componentWillMount() {
    // this.props.init();
  }

  renderColumns() {}

  render() {
    // const { dataSource } = this.props;
    return (
      <div>
        <Table
          dataSource={dataSource}
          pagination={{
            defaultCurrent: 1, pageSize: 15
          }}
          locale={{ emptyText: 'no data' }}
          expandedRowRender={(record) => (
            <Card title="Full details">
              <ReactJson src={record}/>
            </Card>
          )}>
          <Column
            title="Pipe Name"
            dataIndex="name"
            key="name"/>
          <Column
            title="Progress"
            dataIndex="webhooks.progress"
            key="progress"/>
          <Column
            title="Result"
            dataIndex="webhooks.result"
            key="result"/>
          <Column
            title="Total Nodes"
            dataIndex="nodes.length"
            key="nodes"/>
          <Column
            title="Priority"
            dataIndex="priority"
            key="priority"/>
          <Column
            title="Action"
            dataIndex="action"
            key="action"
            render={(() => (<div>
              <ExecuteButton pipe={JSON.stringify(dataSource[0], null, 2)}/>
            </div>
        ))}/>
        </Table>
      </div>
    );
  }
}

StoredPipesTable.propTypes = {
  init: React.PropTypes.func.isRequired
};

// TODO:: fetch data from server
// const storedPipesTable = (state) => state.storedPipesTable.dataSource;
// const autoCompleteFilter = (state) => state.autoCompleteFilter.filter;

// const tableDataSelector = createSelector(
//   storedPipesTable,
//   autoCompleteFilter,
//   (storedPipes) => storedPipes
// );

// const mapStateToProps = (state) => ({
//   dataSource: tableDataSelector(state),
//   scriptsPath: state.serverSelection.currentSelection.scriptsPath,
//   sshUser: state.serverSelection.currentSelection.user
// });

const mapStateToProps = (state) => state;

export default connect(mapStateToProps, { openModal, init })(StoredPipesTable);
