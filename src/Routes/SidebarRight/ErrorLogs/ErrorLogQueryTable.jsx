import React, { useEffect, useMemo } from 'react';
import { Form, AutoComplete, DatePicker } from 'antd';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';

import { FiltersForms } from 'styles';
import qs from 'qs';

const { RangePicker } = DatePicker;
// let localValueTimeChanged = 1;
const DateFormat = 'YYYY-MM-DD HH:mm';

const ErrorLogQueryTable = ({
  onSubmit = () => {},
  ErrorLogList = undefined,
}) => {
  const [form] = Form.useForm();
  const urlParams = useLocation();
  const SubmitForm = () => {
    form.submit();
  };

  useEffect(() => {
    let isParams = false;
    const paramsUrl = qs.parse(urlParams.search, {
      ignoreQueryPrefix: true,
      allowDots: true,
      skipNulls: true,
    });

    if (paramsUrl.qSearch != null) {
      form.setFieldsValue({
        qSearch: paramsUrl.qSearch,
      });

      isParams = true;
    }

    if (paramsUrl?.qErrorLogTime?.from && paramsUrl?.qErrorLogTime?.to) {
      form.setFieldsValue({
        qErrorLogTime:
          [
            dayjs(paramsUrl?.qErrorLogTime?.from),
            dayjs(paramsUrl?.qErrorLogTime?.to),
          ] || null,
      });

      isParams = true;
    }

    if (isParams) {
      setTimeout(() => {
        SubmitForm();
      }, 500);
    }
  }, []);

  const onFinish = values => {
    onSubmit(values);
  };

  const LogOptions = useMemo(() => {
    const arrayListTypesLogs = [];
    return ErrorLogList.reduce((newItem, item) => {
      if (!arrayListTypesLogs.includes(item.type)) {
        arrayListTypesLogs.push(item.type);
        newItem.push({
          value: item.type,
          label: item.type,
        });
      }
      return newItem;
    }, []);
  }, [ErrorLogList]);

  return (
    <FiltersForms layout="inline" form={form} size="medium" onFinish={onFinish}>
      <Form.Item label="Search" name="qSearch">
        <AutoComplete
          style={{ width: '10vw', marginLeft: '1vw' }}
          options={LogOptions}
          filterOption={(inputValue, option) =>
            option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
          }
          allowClear
          onChange={SubmitForm}
        />
      </Form.Item>

      <Form.Item label="Time" name="qErrorLogTime">
        <RangePicker
          style={{ width: '16vw', marginLeft: '1vw' }}
          showTime={{ format: 'HH:mm' }}
          format={DateFormat}
          onOpenChange={() => {
            // eslint-disable-next-line no-unused-vars
            // localValueTimeChanged = Date.now();
          }}
          onChange={SubmitForm}
        />
      </Form.Item>
    </FiltersForms>
  );
};

ErrorLogQueryTable.propTypes = {
  onSubmit: PropTypes.func,
};

ErrorLogQueryTable.propTypes = {
  onSubmit: PropTypes.func,
  ErrorLogList: PropTypes.arrayOf(PropTypes.object),
};

export default React.memo(ErrorLogQueryTable);
