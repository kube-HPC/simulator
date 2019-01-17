
import { connect } from 'react-redux';
import { Table, Card, Button, Row, Col, Modal } from 'antd';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactJson from 'react-json-view';
import { init } from '../../../actions/storedPipes.action';
import { openModal } from '../../../actions/modal.action';
import { execStoredPipe, deleteStoredPipeline, updateStoredPipeline } from '../../../actions/storedPipes.action';
import './StoredPipesTable.scss';
import HEditor from '../HEditor.react';

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

    const deleteConfirmAction = (action, record) => {
      Modal.confirm(
        {
          title: 'WARNING Deleting Pipeline',
          content: `Are you sure you want to delete ${record.name}? Deleting Pipeline will Stop-ALL related Jobs and Executions`,
          okText: 'Confirm',
          okType: 'danger',
          cancelText: 'Cancel',
          onOk() {
            action(record.name);
          },
          onCancel() {}
        },
      );
    };
    
    return (
      <div>
        <Table
          rowKey="name"
          dataSource={dataSource.asMutable()}
          pagination={{ className: "tablePagination", defaultCurrent: 1, pageSize: 15, hideOnSinglePage: true,}}
          locale={{ emptyText: 'No Stored Pipelines' }}
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
              <Row type="flex" justify="space-between">
                <Col >
                  <HEditor 
                    jsonTemplate={JSON.stringify(fixedDataSource.find((p) => p.name === record.name), null, 2)}
                    styledButton={(onClick) => 
                      <Button shape="circle" icon="caret-right" onClick={onClick}/>
                    }
                    title={'Execute Pipeline Editor'}
                    okText={'Execute'}
                    action={this.props.execStoredPipe}
                  />
                </Col>
                <Col >
                  <HEditor 
                    jsonTemplate={JSON.stringify(fixedDataSource.find((p) => p.name === record.name), null, 2)}
                    styledButton={(onClick) => 
                      <Button shape="circle" icon="edit" onClick={onClick}/>
                    }
                    title={'Edit Pipeline Editor'}
                    okText={'Update'}
                    action={this.props.updateStoredPipeline}
                  />
                </Col>
                <Col >
                  <Button type="danger" shape="circle" icon="delete" 
                    onClick={() => deleteConfirmAction(this.props.deleteStoredPipeline, record)}
                  />
                </Col>
              </Row>
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
  execStoredPipe: PropTypes.func.isRequired,
  deleteStoredPipeline: PropTypes.func.isRequired,
  updateStoredPipeline: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  dataSource: state.storedPipeline.dataSource
});

export default connect(mapStateToProps, { openModal, init, execStoredPipe, deleteStoredPipeline, updateStoredPipeline })(StoredPipesTable);
