import { Select as AntSelect, Typography } from 'antd';
import { FlexBox } from 'components/common';
import React, { useCallback } from 'react';
import styled from 'styled-components';
import { dateTimeDefaultVar, instanceFiltersVar } from 'cache';
import { useReactiveVar } from '@apollo/client';
import dayjs from 'dayjs';
import { LOCAL_STORAGE_KEYS } from 'const';
import { useDispatch } from 'react-redux';
import { updatePreferenceLocal } from 'reducers/preferences.reducer';

const Select = styled(AntSelect)`
  width: 190px;
`;

// 1 hour / 24 hours/ 7 days/ 1 month

const OptionDefaultTime = [
  {
    value: 1,
    label: '1 hour',
  },
  {
    value: 24,
    label: '24 hour',
  },
  {
    value: 168,
    label: '7 days',
  },
  {
    value: 720,
    label: '1 month',
  },
];

const SetDefaultTime = () => {
  const dateTimeDefault = useReactiveVar(dateTimeDefaultVar);
  const instanceFilters = useReactiveVar(instanceFiltersVar);
  const dispatch = useDispatch();

  const onChange = useCallback(
    itemSelect => {
      window.localStorage.setItem(
        LOCAL_STORAGE_KEYS.LOCAL_STORAGE_KEY_TIME,
        itemSelect
      );
      const newDefTime = dayjs().add(-itemSelect, 'hour');

      dateTimeDefaultVar({ hour: parseInt(itemSelect, 10), time: newDefTime });

      instanceFilters.jobs.datesRange.from = newDefTime;
      instanceFilters.jobs.datesRange.to = null;
      instanceFiltersVar({ ...instanceFilters });

      // Update preferences (local only — saved when user clicks Save Preferences)
      dispatch(
        updatePreferenceLocal({
          section: 'scoopIntervalHours',
          value: parseInt(itemSelect, 10),
        })
      );
    },
    [instanceFilters, dispatch]
  );

  return (
    <FlexBox.Auto>
      <Typography.Text strong>Default Scoop</Typography.Text>
      <Select
        style={{ width: '100px' }}
        defaultValue={dateTimeDefault.hour || 24}
        onChange={onChange}
        options={OptionDefaultTime}
      />
    </FlexBox.Auto>
  );
};

export default React.memo(SetDefaultTime);
