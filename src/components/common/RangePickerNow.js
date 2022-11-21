import { DatePicker } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import React, { memo, forwardRef, useEffect, useState } from 'react';
import moment from 'moment';

const DateFormat = 'YYYY-MM-DD HH:mm';
const dateNow = new Date();
dateNow.setHours(-24);
const RangePickerNow = forwardRef(({ onChange, value, isDisabled }) => {
  const [stateDate, setStateDate] = useState(value);

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
    if (
      value?.datesRange?.from !== stateDate?.datesRange?.from ||
      value?.datesRange?.to !== stateDate?.datesRange?.to
    ) {
      onChange(stateDate);
    }
  }, [stateDate]);

  return (
    <>
      <DatePicker
        value={
          value?.datesRange?.from?.isValid()
            ? value?.datesRange?.from
            : moment(dateNow)
        }
        style={{ width: '160px' }}
        format={DateFormat}
        showTime={{ format: 'HH:mm' }}
        // disabledDate={(date) => date.isBefore(stateDate?.datesRange?.from, 'day') }
        disabledDate={date =>
          stateDate?.datesRange?.to?.isValid() &&
          date.isSameOrAfter(stateDate?.datesRange?.to, 'day')
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
