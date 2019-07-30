import React, { useState } from 'react';
import cronParser from 'cron-parser';
import cronstrue from 'cronstrue';

import {
  Row,
  Col,
  Icon,
  Switch,
  Input,
  Popover,
  message,
  Typography
} from 'antd';

const { Text } = Typography;

const DEFAULT_CRON_EXPR = '0 * * * *';
const ERROR_CRON_EXPR = 'Invalid Cron Expression, fix it and press apply';

export default function SwitchCron(props) {
  const { pipeline, cronStart, cronStop, updateStoredPipeline } = props;

  const cronIsEnabled =
    pipeline.triggers &&
    pipeline.triggers.cron &&
    pipeline.triggers.cron.enabled;

  const patternIsPresent =
    pipeline.triggers &&
    pipeline.triggers.cron &&
    !!pipeline.triggers.cron.pattern;

  const [loading, setLoading] = useState(false);
  const toggleLoading = () => setLoading(prev => !prev);

  let cronExpr = patternIsPresent
    ? pipeline.triggers.cron.pattern
    : DEFAULT_CRON_EXPR;

  let renderTooltip = null;
  try {
    const interval = cronParser.parseExpression(cronExpr);

    // ! cronstrue.toString throws error on invalid cronExpr
    renderTooltip = (
      <Text>
        {cronstrue.toString(cronExpr, {
          use24HourTimeFormat: true
        })}
        , Next Interval:<Text code>{interval.next().toString()}</Text>
      </Text>
    );
  } catch (errorMessage) {
    // No need
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
        <Popover content={renderTooltip} trigger="focus">
          <Input.Search
            style={{ width: 160 }}
            size="small"
            disabled={!cronIsEnabled}
            placeholder="Cron Expression"
            enterButton={<Icon type="check" />}
            defaultValue={cronExpr}
            onSearch={pattern => {
              try {
                cronstrue.toString(pattern);
                updateStoredPipeline({
                  ...pipeline,
                  triggers: {
                    ...pipeline.triggers,
                    cron: { ...pipeline.triggers.cron, pattern }
                  }
                });
              } catch (errorMessage) {
                message.error(
                  `Cron Expression: ${ERROR_CRON_EXPR}, of ${
                    pipeline.name
                  } is Invalid`
                );
              }
            }}
          />
        </Popover>
      </Col>
    </Row>
  );
}
