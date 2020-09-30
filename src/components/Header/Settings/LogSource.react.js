import { Radio, Typography } from 'antd';
import { FlexBox } from 'components/common';
import { useSettings } from 'hooks';
import { logSourceTypes } from 'config/template/log-sources.template';
import React, { memo, useCallback } from 'react';

const LogSource = () => {
  const { logSource, setSettings } = useSettings();

  const onChange = useCallback(
    // eslint-disable-next-line
    ({ target: { value: logSource } }) => setSettings({ logSource }),
    [setSettings]
  );
  return (
    <FlexBox.Auto>
      <Typography.Text strong>Log Source</Typography.Text>
      <Radio.Group value={logSource} onChange={onChange}>
        {Object.entries(logSourceTypes).map(([key, value]) => (
          <Radio key={key} value={value}>
            {key}
          </Radio>
        ))}
      </Radio.Group>
    </FlexBox.Auto>
  );
};

export default memo(LogSource);
