import { connect } from 'react-redux';
import {
  Table,
  Button,
  Row,
  Col,
  Modal,
  Icon,
  Tag,
  Tooltip,
  Switch,
  Input,
  Popover,
  Badge,
  message
} from 'antd';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cronstrue from 'cronstrue';
import cronParser from 'cron-parser';
import PipelineTabSwitcher from 'components/dumb/PipelineTabSwitcher.react';
import { init } from 'actions/storedPipes.action';
import { openModal } from 'actions/modal.action';
import {
  execStoredPipe,
  deleteStoredPipeline,
  updateStoredPipeline,
  cronStart,
  cronStop
} from 'actions/storedPipes.action';
import { addPipe } from 'actions/addPipe.action';
// import './StoredPipesTable.scss';
import JsonEditorModal from 'components/containers/JsonEditorModal.react';
import FloatingAddButton from 'components/dumb/FloatingAddButton.react';
import { getPipelineReadme } from 'actions/readme.action';
import { STATUS } from 'constants/colors';
import { ReactComponent as PlayIconSvg } from 'images/play-icon.svg';
import { sideBarOpen, sideBarClose } from 'actions/sideBar.action';
import sideBarTypes from 'constants/sideBarTypes';

import template from 'config/template/addPipeline.template';
import paginationStyle from 'config/template/table-pagination.template';

const { Column } = Table;
class StoredPipesTable extends Component {
  componentDidMount() {
    this.props.init();
  }

  renderColumns() {}

  render() {
    const {
      storedPipelines,
      dataStats,
      algorithms,
      pipelineReadme,
      sideBarOpen,
      sideBarClose
    } = this.props;

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
        content: `Are you sure you want to delete ${
          record.name
        }? Deleting Pipeline will Stop-ALL related Jobs and Executions`,
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
          pagination={paginationStyle}
          onExpand={(expanded, record) => {
            if (expanded) {
              this.props.getPipelineReadme(record.name);
            }
          }}
          expandedRowRender={record => (
            <PipelineTabSwitcher
              pipelineDetails={record}
              readme={
                pipelineReadme && pipelineReadme[record.name] && pipelineReadme[record.name].readme
              }
            />
          )}
        >
          <Column title="Pipeline Name" dataIndex="name" key="name" />
          <Column
            title="Cron Job"
            dataIndex="cron"
            key="cron"
            render={(_, record) => {
              const cronIsEnabled =
                record.hasOwnProperty('triggers') &&
                record.triggers.hasOwnProperty('cron') &&
                record.triggers.cron.enabled;

              const cronExpr = cronIsEnabled ? record.triggers.cron.pattern : '0 * * * *';

              const interval = cronParser.parseExpression(cronExpr);

              return (
                <Row type="flex" justify="start">
                  <Col span={4} order={1}>
                    <Switch
                      checked={cronIsEnabled}
                      onChange={revertCronTrigger(
                        cronIsEnabled,
                        JSON.parse(JSON.stringify(record)),
                        cronExpr,
                        this.props.cronStart,
                        this.props.cronStop,
                        this.props.updateStoredPipeline
                      )}
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
                        style={{ width: 160 }}
                        size="small"
                        disabled={!cronIsEnabled}
                        placeholder="Cron Expression"
                        enterButton={<Icon type="check" />}
                        defaultValue={cronExpr}
                        onSearch={pattern =>
                          updateCronPattern(
                            JSON.parse(JSON.stringify(record)),
                            pattern,
                            this.props.updateStoredPipeline
                          )
                        }
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
              const pipelineStats = [].concat(
                ...[
                  ...dataStats
                    .filter(status => status.name === record.name && status.stats.length !== 0)
                    .map(pipeline => pipeline.stats)
                ]
              );

              const firstLetterUpperCase = s =>
                s && s.charAt && s.charAt(0).toUpperCase() + s.slice(1);

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
                    <JsonEditorModal
                      jsonTemplate={JSON.stringify(
                        fixedDataSource.find(p => p.name === record.name),
                        null,
                        2
                      )}
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
                    <JsonEditorModal
                      jsonTemplate={JSON.stringify(
                        storedPipelines.find(p => p.name === record.name),
                        null,
                        2
                      )}
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
                    <Button
                      type="danger"
                      shape="circle"
                      icon="delete"
                      onClick={() => deleteConfirmAction(this.props.deleteStoredPipeline, record)}
                    />
                  </Col>
                </Row>
              );
            }}
          />
        </Table>
        <FloatingAddButton
          onClick={() => {
            sideBarOpen({
              payload: {
                formData: template,
                algorithms: algorithms,
                pipelines: storedPipelines.map(pipeline => pipeline.name),
                onSubmit: pipeline => {
                  this.props.addPipe(pipeline);
                  sideBarClose();
                },
                type: sideBarTypes.ADD_PIPELINE
              }
            });
          }}
        />
      </div>
    );
  }
}

StoredPipesTable.propTypes = {
  init: PropTypes.func.isRequired,
  algorithms: PropTypes.array.isRequired,
  storedPipelines: PropTypes.array.isRequired,
  dataStats: PropTypes.array,
  execStoredPipe: PropTypes.func.isRequired,
  deleteStoredPipeline: PropTypes.func.isRequired,
  updateStoredPipeline: PropTypes.func.isRequired,
  cronStop: PropTypes.func.isRequired,
  cronStart: PropTypes.func.isRequired,
  addPipe: PropTypes.func.isRequired,
  sideBarOpen: PropTypes.func.isRequired,
  sideBarClose: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  algorithms: state.algorithmTable.dataSource.map(tableRow => tableRow.key),
  storedPipelines: state.storedPipeline.dataSource,
  dataStats: state.storedPipeline.dataStats,
  pipelineReadme: state.pipelineReadme,
  sideBar: state.sideBar
});

export default connect(
  mapStateToProps,
  {
    openModal,
    init,
    addPipe,
    execStoredPipe,
    deleteStoredPipeline,
    updateStoredPipeline,
    cronStop,
    cronStart,
    getPipelineReadme,
    sideBarOpen,
    sideBarClose
  }
)(StoredPipesTable);
