import React, { useState, forwardRef, memo, useCallback } from 'react';
import cronParser from 'cron-parser';
import cronstrue from 'cronstrue';
import { CheckOutlined, WarningOutlined, EditFilled } from '@ant-design/icons';
import { Popover, Typography, Input, Switch, Form } from 'antd';
import { CronModel } from 'components/common';
import useWizardContext from '../../../useWizardContext';

const { Text } = Typography;
const iconSize = {
  width: '18px',

  opacity: 0.6,
  cursor: 'pointer',
};
const CronInput = forwardRef(() => {
  const { form, setForm, valuesState } = useWizardContext();
  const [valueCron, setValueCron] = useState(
    valuesState?.triggers?.cron?.pattern || '* * * * *'
  );
  const [loading] = useState(false);
  const [isModalCronOpen, setIsModalCronOpen] = useState(false);
  const [readablePattern, setReadablePattern] = useState(true);
  const [cronIsEnabled, setCronIsEnabled] = useState(
    valuesState?.triggers?.cron?.enabled || false
  );

  const normalize = e => {
    try {
      const { value } = e.target;

      setValueCron(value);
      const readable = cronstrue.toString(value, { use24HourTimeFormat: true });
      const next = cronParser.parseExpression(value).next().toString();
      setReadablePattern({ readable, next });
    } catch (err) {
      setReadablePattern(undefined);
    }
  };

  const openPopupWizard = () => {
    setIsModalCronOpen(true);

    if (!cronIsEnabled) {
      // onToggle();
    }
  };

  const handleCronModelChange = useCallback(
    val => {
      form.setFieldsValue({ triggers: { cron: { pattern: val } } });
      normalize({ target: { value: val } });
      setForm();
    },
    [form, setForm]
  );

  const switchOnChange = val => {
    setCronIsEnabled(val);
    form.setFieldsValue({ triggers: { cron: { enabled: val } } });
    setForm();
  };

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
      // valuePropName="checked"

      noStyle>
      <Switch onChange={switchOnChange} checked={cronIsEnabled} />
    </Form.Item>
  );
  return (
    <>
      <Popover content={content} trigger="focus">
        <Form.Item
          label="Progress"
          name={['triggers', 'cron', 'pattern']}
          onChange={normalize}>
          <Input
            addonBefore={addonBefore}
            addonAfter={addonAfter}
            suffix={<EditFilled style={iconSize} onClick={openPopupWizard} />}
          />
        </Form.Item>
      </Popover>
      {isModalCronOpen && (
        <CronModel
          defaultValueExternal={valueCron}
          isShowModalExternal={isModalCronOpen}
          setIsShowModalExternal={setIsModalCronOpen}
          cronIsEnabled={cronIsEnabled}
          switchLoading={loading}
          switchOnToggle={switchOnChange}
          onChange={handleCronModelChange}
        />
      )}
    </>
  );
});

CronInput.propTypes = {};

export default memo(CronInput);
