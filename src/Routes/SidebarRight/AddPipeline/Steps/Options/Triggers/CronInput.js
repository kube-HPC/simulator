import React, { useState, forwardRef, memo } from 'react';
import cronParser from 'cron-parser';
import cronstrue from 'cronstrue';
import { Popover, Typography, Icon, Input, Switch } from 'antd';
import useWizardContext from 'Routes/SidebarRight/AddPipeline/useWizardContext';

const { Text } = Typography;

const CronInput = forwardRef(() => {
  const { fieldDecorator } = useWizardContext();

  const [readablePattern, setReadablePattern] = useState(undefined);

  // #region  Helpers
  const content = readablePattern ? (
    <Text>
      {readablePattern.readable}, Next Interval:
      <Text code>{readablePattern.next}</Text>
    </Text>
  ) : (
    'Invalid Cron Expression'
  );

  const addonBefore = (
    <Icon
      style={{ color: !readablePattern && 'red', fontSize: '15px' }}
      type={readablePattern ? 'check' : 'warning'}
    />
  );

  const addonAfter = fieldDecorator('triggers.cron.enabled', {
    valuePropName: 'checked',
  })(<Switch />);

  const normalize = value => {
    try {
      const readable = cronstrue.toString(value, { use24HourTimeFormat: true });
      const next = cronParser.parseExpression(value).next().toString();
      setReadablePattern({ readable, next });
    } catch (err) {
      setReadablePattern(undefined);
    }
    return value;
  };
  // #endregion

  return (
    <Popover content={content} trigger="focus">
      {fieldDecorator('triggers.cron.pattern', {
        normalize,
      })(<Input addonBefore={addonBefore} addonAfter={addonAfter} />)}
    </Popover>
  );
});

CronInput.propTypes = {};

export default memo(CronInput);
