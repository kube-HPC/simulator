import { Radio, Typography } from 'antd';
import { logModes } from '@hkube/consts';
import { FlexBox } from 'components/common';
import { useSettings } from 'hooks';
import React, { memo, useCallback } from 'react';

const LogMode = () => {
  const { logMode, setSettings } = useSettings();

  const onChange = useCallback(
    ({ target: { value: logModeValue } }) =>
      setSettings({ logMode: logModeValue }),
    [setSettings]
  );
  return (
    <FlexBox.Auto>
      <Typography.Text strong>Log Mode</Typography.Text>
      <Radio.Group value={logMode} onChange={onChange}>
        <Radio value={logModes.ALGORITHM}>Algorithm</Radio>
        <Radio value={logModes.INTERNAL}>Internal</Radio>
        <Radio value={logModes.ALL}>All</Radio>
      </Radio.Group>
    </FlexBox.Auto>
  );
};

export default memo(LogMode);
