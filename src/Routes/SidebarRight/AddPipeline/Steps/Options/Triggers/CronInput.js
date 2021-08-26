import React, { useState, forwardRef, memo } from 'react';
import cronParser from 'cron-parser';
import cronstrue from 'cronstrue';
import { CheckOutlined, WarningOutlined } from '@ant-design/icons';
import { Popover, Typography, Input, Switch, Form } from 'antd';

const { Text } = Typography;

const CronInput = forwardRef(() => {
  const [readablePattern, setReadablePattern] = useState(true);

  // #region  Helpers
  const content = readablePattern ? (
    <Text>
      {readablePattern.readable}, Next Interval:
      <Text code>{readablePattern.next}</Text>
    </Text>
  ) : (
    'Invalid Cron Expression'
  );

  const addonBefore = readablePattern ? (
    <CheckOutlined style={{ fontSize: '15px' }} />
  ) : (
    <WarningOutlined style={{ color: 'red', fontSize: '15px' }} />
  );

  const addonAfter = (
    <Form.Item
      name={['triggers', 'cron', 'enabled']}
      valuePropName="checked"
      noStyle>
      <Switch />
    </Form.Item>
  );

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
      <Form.Item
        label="Progress"
        name={['triggers', 'cron', 'pattern']}
        normalize={normalize}>
        <Input addonBefore={addonBefore} addonAfter={addonAfter} />
      </Form.Item>
    </Popover>
  );
});

CronInput.propTypes = {};

export default memo(CronInput);
