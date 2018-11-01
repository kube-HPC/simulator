import 'antd/dist/antd.css';
import { connect } from 'react-redux';
import { Table, Card } from 'antd';
import React, { Component } from 'react';
import ReactJson from 'react-json-view';
import { init } from '../actions/storedPipes.action';
import { openModal } from '../actions/modal.action';
import ExecuteButton from './ExecuteButton.react';

const { Column } = Table;

class StoredPipesTable extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.props.init();
  }

  renderColumns() {}

  render() {
    const { dataSource } = this.props;
    return (
      <div>
        <Table
          rowKey="name"
          dataSource={dataSource.asMutable()}
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
            render={((text, record) => (<div>
              <ExecuteButton pipe={JSON.stringify(dataSource.find((p) => p.name === record.name), null, 2)}/>
            </div>
        ))}/>
        </Table>
      </div>
    );
  }
}

StoredPipesTable.propTypes = {
  init: React.PropTypes.func.isRequired,
  dataSource: React.PropTypes.array.isRequired
};

const mapStateToProps = (state) => ({
  dataSource: state.storedPipeline.dataSource
});

export default connect(mapStateToProps, { openModal, init })(StoredPipesTable);
