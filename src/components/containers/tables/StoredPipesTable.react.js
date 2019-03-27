import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { Table, Button, Row, Col, Modal, Icon, Tag, Tooltip, Switch, Input, Popover, Badge, message } from 'antd';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cronstrue from 'cronstrue';
import cronParser from 'cron-parser';
import PipelineTabSwitcher from '../../dumb/PipelineTabSwitcher.react';
import { init } from '../../../actions/storedPipes.action';
import { openModal } from '../../../actions/modal.action';
import { execStoredPipe, deleteStoredPipeline, updateStoredPipeline, cronStart, cronStop } from '../../../actions/storedPipes.action';
import { addPipe } from '../../../actions/addPipe.action';
import './StoredPipesTable.scss';
import HKubeEditor from '../HKubeEditor.react';
import HEditor from '../HEditor.react';
import AddButton from '../../dumb/AddButton.react';
import { getPipelineReadme } from '../../../actions/readme.action';
import { STATUS } from '../../../constants/colors';
import { ReactComponent as PlayIconSvg } from '../../../images/play-icon.svg';
import template from '../../stubs/json-object.json';

const { Column } = Table;
class StoredPipesTable extends Component {
  componentDidMount() {
    this.props.init();
  }

  renderColumns() {}

  render() {
    const { storedPipelines, dataStats, dataSource, pipelineReadme } = this.props;

    // Need to remove "nodes" key from each pipeline.
    const fixedDataSource = [];
    storedPipelines.forEach(p => {
      const pipe = JSON.parse(JSON.stringify(p));
      delete pipe.nodes;
      fixedDataSource.push(pipe);
    });

    const deleteConfirmAction = (action, record) => {
      Modal.confirm({
        title: 'WARNING Deleting Pipeline',
        content: `Are you sure you want to delete ${record.name}? Deleting Pipeline will Stop-ALL related Jobs and Executions`,
        okText: 'Confirm',
        okType: 'danger',
        cancelText: 'Cancel',
        onOk() {
          action(record.name);
        },
        onCancel() {}
      });
    };

    const revertCronTrigger = (cronIsEnabled, record, cronExpr, cronStart, cronStop) => {
      return () => {
        const pipelineName = record.name;
        cronIsEnabled ? cronStop(pipelineName, cronExpr) : cronStart(pipelineName, cronExpr);
      };
    };

    const updateCronPattern = (pipeline, pattern, updateStoredPipeline) => {
      try {
        cronstrue.toString(pattern);
        pipeline.triggers.cron.pattern = pattern;
        updateStoredPipeline(pipeline);
      } catch (errorMessage) {
        message.error(errorMessage);
      }
    };

    return (
      <div>
        <Table
          rowKey="name"
          dataSource={storedPipelines.asMutable()}
          pagination={{
            className: 'tablePagination',
            defaultCurrent: 1,
            pageSize: 15,
            hideOnSinglePage: true
          }}
          onExpand={(expanded, record) => {
            if (expanded) {
              this.props.getPipelineReadme(record.name);
            }
          }}
          expandedRowRender={record => <PipelineTabSwitcher pipelineDetails={record} readme={pipelineReadme && pipelineReadme[record.name] && pipelineReadme[record.name].readme} />}
        >
          <Column title="Pipeline Name" dataIndex="name" key="name" />
          <Column
            title="Cron Job"
            dataIndex="cron"
            key="cron"
            render={(_, record) => {
              const cronIsEnabled = record.hasOwnProperty('triggers') && record.triggers.hasOwnProperty('cron') && record.triggers.cron.enabled;

              const cronExpr = cronIsEnabled ? record.triggers.cron.pattern : '0 * * * *';

              const interval = cronParser.parseExpression(cronExpr);

              return (
                <Row type="flex" justify="start">
                  <Col span={4} order={1}>
                    <Switch
                      checked={cronIsEnabled}
                      onChange={revertCronTrigger(cronIsEnabled, JSON.parse(JSON.stringify(record)), cronExpr, this.props.cronStart, this.props.cronStop, this.props.updateStoredPipeline)}
                    />
                  </Col>
                  <Col span={8} order={2}>
                    <Popover
                      content={`${cronstrue.toString(cronExpr, {
                        use24HourTimeFormat: true
                      })}, Next Interval: ${interval.next().toString()}`}
                      trigger="focus"
                    >
                      <Input.Search
                        className="cronInput"
                        size="small"
                        disabled={!cronIsEnabled}
                        placeholder="Cron Expression"
                        enterButton={<Icon type="check" />}
                        defaultValue={cronExpr}
                        onSearch={pattern => updateCronPattern(JSON.parse(JSON.stringify(record)), pattern, this.props.updateStoredPipeline)}
                      />
                    </Popover>
                  </Col>
                </Row>
              );
            }}
          />
          <Column
            title="Status"
            dataIndex="status"
            key="status"
            render={(_, record) => {
              if (!dataStats || dataStats.length === 0) {
                return;
              }

              // array flat one-liner
              const pipelineStats = [].concat(...[...dataStats.filter(status => status.name === record.name && status.stats.length !== 0).map(pipeline => pipeline.stats)]);

              const firstLetterUpperCase = s => s && s.charAt && s.charAt(0).toUpperCase() + s.slice(1);

              const out = pipelineStats.map((s, i) => (
                <Tooltip key={i} placement="top" title={firstLetterUpperCase(s[0])}>
                  <Tag color={STATUS[s[0]]}>{[s[1]]}</Tag>
                </Tooltip>
              ));

              return <span>{out}</span>;
            }}
          />
          <Column
            title="Action"
            dataIndex="action"
            key="action"
            render={(_, record) => {
              return (
                <Row type="flex" justify="start">
                  <Col span={4}>
                    <HEditor
                      jsonTemplate={JSON.stringify(fixedDataSource.find(p => p.name === record.name), null, 2)}
                      styledButton={(onClick, isEditable = false) => (
                        <Badge dot={isEditable}>
                          <Button shape="circle" onClick={onClick}>
                            <Icon component={PlayIconSvg} />
                          </Button>
                        </Badge>
                      )}
                      title={'Execute Pipeline Editor'}
                      okText={'Execute'}
                      action={this.props.execStoredPipe}
                    />
                  </Col>
                  <Col span={4}>
                    <HEditor
                      jsonTemplate={JSON.stringify(storedPipelines.find(p => p.name === record.name), null, 2)}
                      styledButton={(onClick, isEditable = false) => (
                        <Badge dot={isEditable}>
                          <Button shape="circle" icon="edit" onClick={onClick} />
                        </Badge>
                      )}
                      title={'Edit Pipeline Editor'}
                      okText={'Update'}
                      action={this.props.updateStoredPipeline}
                    />
                  </Col>
                  <Col span={4}>
                    <Button type="danger" shape="circle" icon="delete" onClick={() => deleteConfirmAction(this.props.deleteStoredPipeline, record)} />
                  </Col>
                </Row>
              );
            }}
          />
        </Table>
        <Popover placement="topRight" title="Update algorithm" trigger="click">
          <HKubeEditor
            jsonTemplate={JSON.stringify(template, null, 2)}
            styledButton={(onClick, isEditable = false) => <AddButton onVisible={onClick} />}
            algorithms={dataSource.asMutable()}
            pipelines={storedPipelines.asMutable().map(value => value.name)}
            title={'Add Pipeline Editor'}
            okText={'Store Pipeline'}
            hintText={
              <span>
                Hint: Type <strong>node</strong> for adding pipe-node.
              </span>
            }
            action={this.props.addPipe}
          />
        </Popover>
      </div>
    );
  }
}

StoredPipesTable.propTypes = {
  init: PropTypes.func.isRequired,
  dataSource: PropTypes.array.isRequired,
  storedPipelines: PropTypes.array.isRequired,
  dataStats: PropTypes.array,
  execStoredPipe: PropTypes.func.isRequired,
  deleteStoredPipeline: PropTypes.func.isRequired,
  updateStoredPipeline: PropTypes.func.isRequired,
  cronStop: PropTypes.func.isRequired,
  cronStart: PropTypes.func.isRequired,
  addPipe: PropTypes.func.isRequired
};

const algorithmTable = state => state.algorithmTable.dataSource;
const autoCompleteFilter = state => state.autoCompleteFilter.filter;

const tableDataSelector = createSelector(
  algorithmTable,
  autoCompleteFilter,
  algorithmTable => algorithmTable
);

const mapStateToProps = state => ({
  dataSource: tableDataSelector(state),
  storedPipelines: state.storedPipeline.dataSource,
  dataStats: state.storedPipeline.dataStats,
  pipelineReadme: state.pipelineReadme
});

export default connect(
  mapStateToProps,
  { openModal, init, addPipe, execStoredPipe, deleteStoredPipeline, updateStoredPipeline, cronStop, cronStart, getPipelineReadme }
)(StoredPipesTable);
