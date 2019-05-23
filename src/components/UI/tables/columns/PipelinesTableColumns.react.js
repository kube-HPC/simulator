import React from 'react';
import {
  Button,
  Row,
  Col,
  Modal,
  Icon,
  Switch,
  Input,
  Popover,
  message,
  Card
} from 'antd';

import cronParser from 'cron-parser';
import cronstrue from 'cronstrue';
import StatusTag from 'components/dumb/StatusTag.react';
import { ReactComponent as PlayIconSvg } from 'images/play-icon.svg';
import JsonEditor from 'components/dumb/JsonEditor.react';
import DrawerContainer from 'components/dumb/DrawerContainer.react';
import { stringify } from 'utils/string';
import Text from 'antd/lib/typography/Text';

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

const revertCronTrigger = (
  cronIsEnabled,
  record,
  cronExpr,
  cronStart,
  cronStop
) => {
  return () => {
    const pipelineName = record.name;
    cronIsEnabled
      ? cronStop(pipelineName, cronExpr)
      : cronStart(pipelineName, cronExpr);
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

const pipelinesTableColumns = props => [
  {
    title: 'Pipeline Name',
    dataIndex: 'name',
    key: 'name',
    width: '20%'
  },
  {
    title: 'Cron Job',
    dataIndex: 'cron',
    key: 'cron',
    width: '30%',
    render: (_, record) => {
      const cronIsEnabled =
        record.hasOwnProperty('triggers') &&
        record.triggers.hasOwnProperty('cron') &&
        record.triggers.cron.enabled;

      const cronExpr = cronIsEnabled
        ? record.triggers.cron.pattern
        : '0 * * * *';

      const interval = cronParser.parseExpression(cronExpr);

      const { cronStart, cronStop, updateStoredPipeline } = props;

      return (
        <Row type="flex" justify="start" gutter={10}>
          <Col>
            <Switch
              size="small"
              checked={cronIsEnabled}
              onChange={revertCronTrigger(
                cronIsEnabled,
                JSON.parse(JSON.stringify(record)),
                cronExpr,
                cronStart,
                cronStop,
                updateStoredPipeline
              )}
            />
          </Col>
          <Col>
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
                    updateStoredPipeline
                  )
                }
              />
            </Popover>
          </Col>
        </Row>
      );
    }
  },
  {
    title: 'Pipeline Stats',
    dataIndex: 'status',
    key: 'status',
    width: '30%',
    render: (_, record) => {
      const { dataStats } = props;
      if (!dataStats || dataStats.length === 0) return;

      // array flat one-liner
      const pipelineStats = [].concat(
        ...[
          ...dataStats
            .filter(
              status => status.name === record.name && status.stats.length !== 0
            )
            .map(pipeline => pipeline.stats)
        ]
      );

      return pipelineStats.map(([status, count], i) => (
        <StatusTag key={`${status}-${i}`} status={status} count={count} />
      ));
    }
  },
  {
    title: 'Action',
    dataIndex: 'action',
    key: 'action',
    width: '30%',
    render: (_, record) => {
      const {
        // storedPipelines,
        execStoredPipe,
        deleteStoredPipeline,
        fixedDataSource,
        updateStoredPipeline
      } = props;

      const currPipeline = fixedDataSource.find(p => p.name === record.name);

      return (
        <Row type="flex" justify="start" gutter={10}>
          <Col>
            <Button shape="circle" onClick={() => execStoredPipe(currPipeline)}>
              <Icon component={PlayIconSvg} />
            </Button>
          </Col>
          <Col>
            <DrawerContainer
              title={'Update Pipeline'}
              description={
                <>
                  Edit pipeline properties and <Text code>Update</Text>{' '}
                </>
              }
              opener={onClick => (
                <Button shape="circle" icon="edit" onClick={onClick} />
              )}
              submitText={'Update'}
              onSubmit={updateStoredPipeline}
            >
              <Card size="small">
                <JsonEditor
                  value={stringify(
                    fixedDataSource.find(p => p.name === record.name)
                  )}
                />
              </Card>
            </DrawerContainer>
          </Col>
          <Col>
            <Button
              type="danger"
              shape="circle"
              icon="delete"
              onClick={() => deleteConfirmAction(deleteStoredPipeline, record)}
            />
          </Col>
        </Row>
      );
    }
  }
];

export default pipelinesTableColumns;
