import { Icon, Input, Popover, Switch, Typography } from 'antd';
import { FlexBox } from 'components/common';
import cronParser from 'cron-parser';
import cronstrue from 'cronstrue';
import { useActions, usePipeline } from 'hooks';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useReducer, useRef } from 'react';
import { notification } from 'utils';

const { Text } = Typography;

const DEFAULT_CRON_EXPR = '0 * * * *';
const ERROR_CRON_EXPR = 'Invalid Cron Expression, fix it and press apply';
const inputWidth = { width: 160 };

const isCron = pipeline =>
  pipeline.triggers && pipeline.triggers.cron && pipeline.triggers.cron.enabled;
const isPattern = pipeline =>
  pipeline.triggers && pipeline.triggers.cron && !!pipeline.triggers.cron.pattern;

const enterButton = <Icon type="check" />;

const PipelineCron = ({ pipeline }) => {
  const { cronStart, cronStop } = useActions();
  const { update } = usePipeline();

  const cronIsEnabled = isCron(pipeline);
  const prevCronRef = useRef(cronIsEnabled);

  const patternIsPresent = isPattern(pipeline);

  const [loading, toggleLoading] = useReducer(p => !p, false);

  const cronExpr = patternIsPresent ? pipeline.triggers.cron.pattern : DEFAULT_CRON_EXPR;

  useEffect(() => {
    if (prevCronRef.current !== cronIsEnabled) {
      toggleLoading();
    }
  }, [cronIsEnabled]);

  let renderTooltip = ERROR_CRON_EXPR;

  try {
    const interval = cronParser.parseExpression(cronExpr);

    // cronstrue.toString throws error on invalid cronExpr
    renderTooltip = (
      <Text>
        {cronstrue.toString(cronExpr, {
          use24HourTimeFormat: true,
        })}
        , Next Interval:<Text code>{interval.next().toString()}</Text>
      </Text>
    );
  } catch (errorMessage) {
    // No need,
    // On error `renderToolTip` got default value.
  }

  const { name } = pipeline;

  const onChange = useCallback(() => {
    toggleLoading();
    cronIsEnabled ? cronStop(name, cronExpr) : cronStart(name, cronExpr);
  }, [cronExpr, cronIsEnabled, cronStart, cronStop, name]);

  const onSearch = pattern => {
    try {
      cronstrue.toString(pattern);
      update({
        ...pipeline,
        triggers: {
          ...pipeline.triggers,
          cron: { ...pipeline.triggers.cron, pattern },
        },
      });
    } catch (errorMessage) {
      notification({ message: ERROR_CRON_EXPR, description: errorMessage });
    }
  };

  return (
    <FlexBox.Auto justify="start">
      <Switch size="small" checked={cronIsEnabled} loading={loading} onChange={onChange} />
      <Popover content={renderTooltip} trigger="focus">
        <Input.Search
          style={inputWidth}
          size="small"
          disabled={!cronIsEnabled}
          placeholder="Cron Expression"
          enterButton={enterButton}
          defaultValue={cronExpr}
          onSearch={onSearch}
        />
      </Popover>
    </FlexBox.Auto>
  );
};

PipelineCron.propTypes = {
  pipeline: PropTypes.object.isRequired,
};

export default PipelineCron;
