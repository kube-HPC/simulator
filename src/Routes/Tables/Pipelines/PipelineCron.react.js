import React, { useCallback, useEffect, useReducer, useRef } from 'react';
import PropTypes from 'prop-types';
import { Icon, Input, Popover, Switch, Typography, Tooltip } from 'antd';
import { useActions, usePipeline } from 'hooks';
import { FlexBox } from 'components/common';
import cronParser from 'cron-parser';
import cronstrue from 'cronstrue';
import { notification } from 'utils';

const { Text } = Typography;

const DEFAULT_CRON_EXPR = '0 * * * *';
const ERROR_CRON_EXPR = 'Invalid Cron Expression';
const inputWidth = { width: '20ch' };

const isCron = pipeline =>
  pipeline.triggers && pipeline.triggers.cron && pipeline.triggers.cron.enabled;

const isPattern = pipeline =>
  pipeline.triggers &&
  pipeline.triggers.cron &&
  !!pipeline.triggers.cron.pattern;

// the extra div is required for the tooltip to render
const enterButton = (
  <Tooltip title="save changes">
    <div>
      <Icon type="check" />
    </div>
  </Tooltip>
);

const PipelineCron = ({ pipeline }) => {
  const { cronStart, cronStop } = useActions();
  const { updateCron } = usePipeline();
  const cronIsEnabled = isCron(pipeline);
  const prevCronRef = useRef(cronIsEnabled);
  const patternIsPresent = isPattern(pipeline);

  const [loading, toggleLoading] = useReducer(p => !p, false);

  const cronExpr = patternIsPresent
    ? pipeline.triggers.cron.pattern
    : DEFAULT_CRON_EXPR;

  useEffect(() => {
    if (prevCronRef.current !== cronIsEnabled) {
      toggleLoading();
    }
  }, [cronIsEnabled, prevCronRef, toggleLoading]);

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

  const onToggle = useCallback(() => {
    toggleLoading();
    cronIsEnabled ? cronStop(name, cronExpr) : cronStart(name, cronExpr);
  }, [toggleLoading, cronExpr, cronIsEnabled, cronStart, cronStop, name]);

  const onSave = useCallback(
    pattern => {
      try {
        cronstrue.toString(pattern);
        updateCron(pipeline, pattern);
      } catch (errorMessage) {
        notification({ message: ERROR_CRON_EXPR, description: errorMessage });
      }
    },
    [pipeline, updateCron]
  );

  return (
    <FlexBox.Auto justify="start">
      <Tooltip title={`toggle cron ${cronIsEnabled ? 'off' : 'on'}`}>
        <Switch
          size="small"
          checked={cronIsEnabled}
          loading={loading}
          onChange={onToggle}
        />
      </Tooltip>

      <Popover content={renderTooltip} trigger="focus">
        <Input.Search
          style={inputWidth}
          size="small"
          disabled={!cronIsEnabled}
          placeholder="Cron Expression"
          enterButton={enterButton}
          defaultValue={cronExpr}
          onSearch={onSave}
        />
      </Popover>
    </FlexBox.Auto>
  );
};

PipelineCron.propTypes = {
  // TODO: detail the props
  // eslint-disable-next-line
  pipeline: PropTypes.object.isRequired,
};

export default React.memo(PipelineCron);
