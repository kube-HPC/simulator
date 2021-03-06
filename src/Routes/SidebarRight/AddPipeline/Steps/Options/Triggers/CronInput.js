import React, { useState, forwardRef, memo } from 'react';
import cronParser from 'cron-parser';
import cronstrue from 'cronstrue';

import { Popover, Typography, Icon, Input, Switch } from 'antd';
import addPipelineSchema from './../../../schema';

const { Text } = Typography;
const { errorMessage, fields } = addPipelineSchema.TRIGGERS.CRON;

// TODO: rebuild this component to not use forwardRef
// eslint-disable-next-line
const CronInput = forwardRef(({ getFieldDecorator }) => {
  const [readablePattern, setReadablePattern] = useState(undefined);

  // #region  Helpers
  const content = readablePattern ? (
    <Text>
      {readablePattern.readable}, Next Interval:
      <Text code>{readablePattern.next}</Text>
    </Text>
  ) : (
    errorMessage
  );

  const addonBefore = (
    <Icon
      style={{ color: !readablePattern && 'red', fontSize: '15px' }}
      type={readablePattern ? 'check' : 'warning'}
    />
  );

  const addonAfter = getFieldDecorator(fields.ENABLED, {
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
      {getFieldDecorator(fields.PATTERN, { normalize })(
        <Input addonBefore={addonBefore} addonAfter={addonAfter} />
      )}
    </Popover>
  );
});

CronInput.propTypes = {};

export default memo(CronInput);
