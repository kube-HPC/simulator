import { Radio, Typography } from 'antd';
import { FlexBox } from 'components/common';
import { useSettings } from 'hooks';
import React, { memo, useCallback } from 'react';

export const directionTypes = {
  'Left Right': 'LR',
  'Up Down': 'UD',
};

const GraphDirection = () => {
  const { graphDirection, setSettings } = useSettings();

  const onChange = useCallback(
    // eslint-disable-next-line
    ({ target: { value: graphDirection } }) => setSettings({ graphDirection }),
    [setSettings]
  );

  return (
    <FlexBox.Auto>
      <Typography.Text strong>Graph Direction</Typography.Text>
      <Radio.Group value={graphDirection} onChange={onChange}>
        {Object.entries(directionTypes).map(([key, value]) => (
          <Radio key={key} value={value}>
            {key}
          </Radio>
        ))}
      </Radio.Group>
    </FlexBox.Auto>
  );
};

export default memo(GraphDirection);
