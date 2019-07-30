import React, { useState } from 'react';
import cronParser from 'cron-parser';
import cronstrue from 'cronstrue';

import { Row, Col, Icon, Switch, Input, Popover, message } from 'antd';

const DEFAULT_CRON_EXPR = '0 * * * *';

export default function SwitchCron(props) {
  const { pipeline, cronStart, cronStop, updateStoredPipeline } = props;
  const cronIsEnabled =
    pipeline.triggers &&
    pipeline.triggers.cron &&
    pipeline.triggers.cron.enabled;

  const [loading, setLoading] = useState(false);
  const toggleLoading = () => setLoading(prev => !prev);
  const cronExpr = cronIsEnabled
    ? pipeline.triggers.cron.pattern
    : DEFAULT_CRON_EXPR;

  let interval = undefined;
  try {
    interval = cronParser.parseExpression(cronExpr);
    interval.next().toString();
  } catch (errorMessage) {
    message.error(errorMessage.message);
  }
  return (
    <Row type="flex" justify="start" gutter={10}>
      <Col>
        <Switch
          size="small"
          checked={cronIsEnabled}
          loading={loading}
          onChange={() => {
            toggleLoading();
            cronIsEnabled
              ? cronStop(pipeline.name, cronExpr)
              : cronStart(pipeline.name, cronExpr);
            setTimeout(() => {
              toggleLoading();
            }, 2000);
          }}
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
            onSearch={pattern => {
              try {
                cronParser.parseExpression(cronExpr);
                updateStoredPipeline({
                  ...pipeline,
                  triggers: {
                    ...pipeline.triggers,
                    cron: { ...pipeline.triggers.cron, pattern }
                  }
                });
              } catch (errorMessage) {
                message.error(errorMessage.message);
              }
            }}
          />
        </Popover>
      </Col>
    </Row>
  );
}
