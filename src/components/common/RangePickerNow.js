import { DatePicker } from 'antd';
import { dateTimeDefaultVar } from 'cache';
import { ArrowRightOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import { useReactiveVar } from '@apollo/client';
import React, { memo, forwardRef, useEffect, useState } from 'react';

const DateFormat = 'YYYY-MM-DD HH:mm';

const RangePickerNow = forwardRef(({ onChange, value, isDisabled }) => {
  const [stateDate, setStateDate] = useState(value);
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
      dateNew = {
        datesRange: {
          from: stateDate?.datesRange?.from || undefined,
          to: momentDate,
        },
      };
    }

    setStateDate(dateNew);
  };

  useEffect(() => {
    if (value?.datesRange) {
      setStateDate({
        datesRange: { from: value.datesRange.from, to: value.datesRange.to },
      });
    }
  }, [value]);

  useEffect(() => {
    const isChange =
      (value?.datesRange?.from?.isValid() &&
        !value?.datesRange?.from.isSame(stateDate?.datesRange?.from)) ||
      (value?.datesRange?.to?.isValid() &&
        !value?.datesRange?.to.isSame(stateDate?.datesRange?.to));

    if (isChange) {
      onChange(stateDate);
    }
  }, [stateDate]);

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
        allowClear={false}
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
});

RangePickerNow.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.string,
    PropTypes.node,
  ]).isRequired,
  isDisabled: PropTypes.bool,
};

RangePickerNow.defaultProps = { isDisabled: false };
export default memo(RangePickerNow);
