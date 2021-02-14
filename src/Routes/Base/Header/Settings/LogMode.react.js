import { Radio, Typography } from 'antd';
import { FlexBox } from 'components/common';
import { useSettings } from 'hooks';
import { logModeTypes } from 'config/template/log-mode.template';
import React, { memo, useCallback } from 'react';

const LogMode = () => {
  const { logMode, setSettings } = useSettings();

  const onChange = useCallback(
    // eslint-disable-next-line
    ({ target: { value: logMode } }) => setSettings({ logMode }),
    [setSettings]
  );
  return (
    <FlexBox.Auto>
      <Typography.Text strong>Log Mode</Typography.Text>
      <Radio.Group value={logMode} onChange={onChange}>
        {Object.entries(logModeTypes).map(([key, value]) => (
          <Radio key={key} value={value}>
            {key}
          </Radio>
        ))}
      </Radio.Group>
    </FlexBox.Auto>
  );
};

export default memo(LogMode);
