
import { connect } from 'react-redux';
import { Table, Card, Button } from 'antd';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactJson from 'react-json-view';
import { init } from '../../../actions/storedPipes.action';
import { openModal } from '../../../actions/modal.action';
import { execStoredPipe } from '../../../actions/storedPipes.action';
// import ExecuteButton from '../ExecuteButton.react';
import HEditor from '../HEditor.react';
import './StoredPipesTable.scss';

const { Column } = Table;

class StoredPipesTable extends Component {

  componentWillMount() {
    this.props.init();
  }

  renderColumns() {}

  render() {
    const { dataSource } = this.props;

    // Need to remove "nodes" key from each pipeline.
    const fixedDataSource = [];
    dataSource.forEach((p) => {
      const pipe = JSON.parse(JSON.stringify(p));
      delete pipe.nodes;
      fixedDataSource.push(pipe);
    });
    
    return (
      <div>
        <Table
          rowKey="name"
          dataSource={dataSource.asMutable()}
          pagination={{ className: "tablePagination", defaultCurrent: 1, pageSize: 15, hideOnSinglePage: true,}}
          locale={{ emptyText: 'no data' }}
          expandedRowRender={(record) => (
            <Card title="Full details">
              <ReactJson 
                src={record} 
                displayDataTypes={false} 
                displayObjectSize={false} 
                iconStyle="square"
               />
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
            render={((_,record) => (
              <HEditor 
                jsonTemplate={JSON.stringify(fixedDataSource.find((p) => p.name === record.name), null, 2)}
                styledButton={(showPopup) => 
                  <Button shape="circle" icon="caret-right" onClick={showPopup} />
                }
                title={'Execute Pipeline Editor'}
                okText={'Execute'}
                action={this.props.execStoredPipe}
                hintText={{}}
              />
        ))}
            />
        </Table>
      </div>
    );
  }
}

StoredPipesTable.propTypes = {
  init: PropTypes.func.isRequired,
  dataSource: PropTypes.array.isRequired,
  execStoredPipe: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  dataSource: state.storedPipeline.dataSource
});

export default connect(mapStateToProps, { openModal, init, execStoredPipe })(StoredPipesTable);
