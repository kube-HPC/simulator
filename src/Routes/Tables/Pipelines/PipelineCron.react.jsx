import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { USER_GUIDE } from 'const';
import { EditFilled } from '@ant-design/icons';
import { Popover, Switch, Typography, Tooltip, Space } from 'antd';
import dayjs from 'dayjs';
import { useActions, usePipeline } from 'hooks';
import { FlexBox, CronModel } from 'components/common';
import cronParser from 'cron-parser';
import cronstrue from 'cronstrue';
import { notification } from 'utils';
import { pipelineListVar } from 'cache';

const { Text } = Typography;
const iconSize = {
  width: '18px',

  opacity: 0.6,
  cursor: 'pointer',
};

const CronButtonsContainer = styled.div`
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
`;

const DEFAULT_CRON_EXPR = '0 * * * *';
const ERROR_CRON_EXPR = 'Invalid Cron Expression';

const isCron = pipeline =>
  pipeline.triggers && pipeline.triggers.cron && pipeline.triggers.cron.enabled;

const isPattern = pipeline =>
  pipeline.triggers &&
  pipeline.triggers.cron &&
  !!pipeline.triggers.cron.pattern;

const updatePipelineListVar = (pipelineName, enabled) => {
  const current = pipelineListVar();
  pipelineListVar(
    current.map(p =>
      p.name === pipelineName
        ? {
            ...p,
            triggers: {
              ...p.triggers,
              cron: {
                ...p.triggers?.cron,
                enabled,
              },
            },
          }
        : p
    )
  );
};

const PipelineCron = ({ pipeline }) => {
  const [isModalCronOpen, setIsModalCronOpen] = useState(false);
  const [cronIsEnabled, setCronIsEnabled] = useState(isCron(pipeline));
  const { cronStart, cronStop } = useActions();
  const { updateCron } = usePipeline();
  const prevCronRef = useRef(cronIsEnabled);
  const patternIsPresent = isPattern(pipeline);

  const [loading, setToggleLoading] = useState(false);

  const cronExpr = patternIsPresent
    ? pipeline.triggers.cron.pattern
    : DEFAULT_CRON_EXPR;

  const [value, setValue] = useState(cronExpr);
  // const [intervalCronText, setIntervalCronText] = useState(cronParser.parseExpression(value));

  useEffect(() => {
    setToggleLoading(false);
  }, [cronIsEnabled, prevCronRef, setToggleLoading]);

  let renderTooltip = ERROR_CRON_EXPR;
  let renderTime = ERROR_CRON_EXPR;

  try {
    const interval = cronParser.parseExpression(value);
    const nextInterval = interval.next();
    const nextIntervalDate = nextInterval.toDate();
    const formattedNextInterval =
      dayjs(nextIntervalDate).format('DD/MM/YY HH:mm:ss');
    // cronstrue.toString throws error on invalid cronExpr
    renderTooltip = (
      <Text>
        {cronstrue.toString(value, {
          use24HourTimeFormat: true,
        })}
        , Next Interval:<Text code>{nextIntervalDate.toString()}</Text>
      </Text>
    );

    renderTime = <Text>Next: {formattedNextInterval}</Text>;
  } catch (errorMessage) {
    // No need,
    // On error `renderToolTip` got default value.
  }

  const { name } = pipeline;

  const onToggle = useCallback(() => {
    setToggleLoading(true);
    if (cronIsEnabled) {
      cronStop(name, value, () => {
        setToggleLoading(false);
        setCronIsEnabled(false);
        updatePipelineListVar(name, false); // 👈 patch the source of truth
      });
    } else {
      cronStart(name, value, () => {
        setToggleLoading(false);
        setCronIsEnabled(true);
        updatePipelineListVar(name, true); // 👈 patch the source of truth
      });
    }
  }, [cronIsEnabled, cronStop, name, value, cronStart]);

  const onSave = useCallback(
    pattern => {
      try {
        cronstrue.toString(pattern);
        updateCron(pipeline, pattern);
        //  setIntervalCronText(pattern);
      } catch (errorMessage) {
        notification({ message: ERROR_CRON_EXPR, description: errorMessage });
      }
    },
    [pipeline, updateCron]
  );

  const handleCronModelChange = useCallback(
    val => {
      setValue(val);
      onSave(val);
    },
    [onSave]
  );

  const openPopupWizard = () => {
    setIsModalCronOpen(true);
    if (!cronIsEnabled) {
      onToggle();
    }
  };

  return (
    <FlexBox.Auto justify="start">
      <Tooltip title={`Toggle cron ${cronIsEnabled ? 'Off' : 'On'}`}>
        <Switch
          size="small"
          checked={cronIsEnabled}
          loading={loading}
          onChange={onToggle}
        />
      </Tooltip>

      <Popover content={renderTooltip} trigger="hover">
        {cronIsEnabled ? renderTime : <Text disabled>Cron {value}</Text>}

        {/* <Input.Search
          style={inputWidth}
          onChange={handleChange}
          onClick={() => setIsModalCronOpen(true)}
    
          value={value}
          size="small"
          disabled={!cronIsEnabled}
          placeholder="Cron Expression"
          enterButton={enterButton}
          onSearch={onSave}
  /> */}
      </Popover>

      <CronButtonsContainer>
        <Space.Compact className={USER_GUIDE.TABLE_JOB.ACTIONS_SELECT}>
          <Tooltip title="Edit cron">
            <EditFilled style={iconSize} onClick={openPopupWizard} />
          </Tooltip>
        </Space.Compact>
      </CronButtonsContainer>

      <CronModel
        defaultValueExternal={value}
        onChange={handleCronModelChange}
        isShowModalExternal={isModalCronOpen}
        setIsShowModalExternal={setIsModalCronOpen}
        cronIsEnabled={cronIsEnabled}
        switchLoading={loading}
        switchOnToggle={onToggle}
      />
    </FlexBox.Auto>
  );
};

PipelineCron.propTypes = {
  // TODO: detail the props
  // eslint-disable-next-line
  pipeline: PropTypes.object.isRequired,
};

export default React.memo(PipelineCron);
