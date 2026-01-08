import { DatePicker, Tooltip } from 'antd';
import { dateTimeDefaultVar } from 'cache';
import { ArrowRightOutlined, CloseCircleFilled } from '@ant-design/icons';
import PropTypes from 'prop-types';
import { useReactiveVar } from '@apollo/client';
import React, { memo, useEffect, useState } from 'react';
import dayjs from 'dayjs';

const DateFormat = 'YYYY-MM-DD HH:mm';

const RangePickerNow = ({
  onChange,
  value = undefined,
  isDisabled = false,
}) => {
  const [stateDate, setStateDate] = useState(value);
  const [isClearTo, setIsClearTo] = useState(false);

  const dateTimeDefault = useReactiveVar(dateTimeDefaultVar);

  const onChangeHandel = (momentDate, param) => {
    let dateNew;
    if (param === 'from') {
      dateNew = {
        datesRange: {
          from: momentDate,
          to: stateDate?.datesRange?.to || undefined,
        },
      };
    }

    if (param === 'to') {
      setIsClearTo(momentDate === null);

      dateNew = {
        datesRange: {
          from: stateDate?.datesRange?.from || undefined,
          to: momentDate,
        },
      };
    }

    setStateDate(dateNew);
  };

  const handleResetToDefault = e => {
    e.stopPropagation();
    e.preventDefault();

    // Calculate fresh default time using the configured hour scope
    // This ensures we always get "X hours ago from NOW" when clearing
    const freshDefaultTime = dayjs().subtract(dateTimeDefault.hour, 'hours');

    const dateNew = {
      datesRange: {
        from: freshDefaultTime,
        to: stateDate?.datesRange?.to || undefined,
      },
    };

    setStateDate(dateNew);
    onChange(dateNew);
  };

  useEffect(() => {
    if (value?.datesRange) {
      setStateDate({
        datesRange: { from: value.datesRange.from, to: value.datesRange.to },
      });
    }
  }, [value]);

  useEffect(() => {
    // Check if 'from' date changed
    const fromChanged =
      stateDate?.datesRange?.from?.isValid() &&
      (!value?.datesRange?.from?.isValid() ||
        !value.datesRange.from.isSame(stateDate.datesRange.from));

    // Check if 'to' date changed
    const toChanged =
      stateDate?.datesRange?.to?.isValid() &&
      (!value?.datesRange?.to?.isValid() ||
        !value.datesRange.to.isSame(stateDate.datesRange.to));

    const isChange = fromChanged || toChanged;

    if (isChange || isClearTo) {
      onChange(stateDate);
      setIsClearTo(false);
    }
  }, [stateDate]);

  const isStartDateCustom =
    value?.datesRange?.from?.isValid() &&
    dateTimeDefault?.time?.isValid() &&
    !value.datesRange.from.isSame(dateTimeDefault.time);

  return (
    <>
      <DatePicker
        value={
          value?.datesRange?.from?.isValid()
            ? value?.datesRange?.from
            : dateTimeDefault.time
        }
        style={{ width: '160px' }}
        format={DateFormat}
        showTime={{ format: 'HH:mm' }}
        disabledDate={date =>
          stateDate?.datesRange?.to?.isValid() &&
          date.isAfter(stateDate?.datesRange?.to, 'day')
        }
        onChange={valueDate => onChangeHandel(valueDate, 'from')}
        placeholder="Start Date"
        allowClear={
          isStartDateCustom
            ? {
                clearIcon: (
                  <Tooltip title="Reset to default scope">
                    <CloseCircleFilled onClick={handleResetToDefault} />
                  </Tooltip>
                ),
              }
            : false
        }
        disabled={isDisabled}
      />

      <ArrowRightOutlined style={{ padding: '2px', fontSize: '12px' }} />

      <DatePicker
        value={value?.datesRange?.to?.isValid() ? value?.datesRange?.to : null}
        style={{ width: '160px' }}
        format={DateFormat}
        showTime={{ format: 'HH:mm' }}
        placeholder="End Date"
        disabledDate={date => date.isBefore(stateDate?.datesRange?.from, 'day')}
        onChange={valueDate => onChangeHandel(valueDate, 'to')}
        disabled={isDisabled}
      />
    </>
  );
};

RangePickerNow.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.string,
    PropTypes.node,
  ]),
  isDisabled: PropTypes.bool,
};

export default memo(RangePickerNow);
