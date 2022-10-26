import React, { useEffect, useMemo, useCallback } from 'react';
import moment from 'moment';
import { Form, DatePicker, AutoComplete, Button } from 'antd';
import PropTypes from 'prop-types';
import { pipelineStatuses } from '@hkube/consts';
import { useQuery } from '@apollo/client';
import { ALGORITHM_AND_PIPELINE_NAMES } from 'graphql/queries';
import { FiltersForms } from 'styles';
// import { isPinActiveJobVar } from 'cache';

const { RangePicker } = DatePicker;
// let num = 1;
let localValueTimeChanged = 1;
const DateFormat = 'YYYY-MM-DD HH:mm';
const QueryForm = ({ onSubmit, params, zoomDate }) => {
  // const isPinActiveJobs = useReactiveVar(isPinActiveJobVar);
  const [form] = Form.useForm();

  const SubmitForm = () => {
    //  setLoadingJobs(true);
    form.submit();
  };

  useEffect(() => {
    if (params?.datesRange?.from && params?.datesRange?.to) {
      form.setFieldsValue({
        time: [
          moment(params.datesRange.from, DateFormat),
          moment(params.datesRange.to, DateFormat),
        ],
      });
    } else {
      form.resetFields(['time']);
    }

    if (params && params.pipelineName) {
      form.setFieldsValue({ pipelineName: params.pipelineName });
    } else {
      form.resetFields(['pipelineName']);
    }

    if (params && params.algorithmName) {
      form.setFieldsValue({ algorithmName: params.algorithmName });
    } else {
      form.resetFields(['algorithmName']);
    }

    if (params && params.pipelineStatus) {
      form.setFieldsValue({ pipelineStatus: params.pipelineStatus });
    } else {
      form.resetFields(['pipelineStatus']);
    }
  }, [params, zoomDate]);

  const onFinish = values => {
    onSubmit(values);
  };

  const isShowActive = useCallback(
    () => form.getFieldValue('pipelineStatus') === 'active',
    [form]
  );

  const onPinActive = () => {
    // isPinActiveJobVar(!isPinActiveJobs);

    if (form.getFieldValue('pipelineStatus') === 'active') {
      form.setFieldsValue({ pipelineStatus: null });
    } else {
      form.setFieldsValue({ pipelineStatus: 'active' });
    }
    SubmitForm();
  };

  const query = useQuery(ALGORITHM_AND_PIPELINE_NAMES);
  const algorithmOptions = useMemo(
    () =>
      query?.data?.algorithms.list?.map(algorithm => ({
        value: algorithm.name,
        label: algorithm.name,
      })),
    [query?.data?.algorithms.list]
  );

  const pipelineOptions = useMemo(
    () =>
      query?.data?.pipelines.list.map(pipeline => ({
        value: pipeline.name,
        label: pipeline.name,
      })),
    [query?.data?.pipelines.list]
  );

  const pipelineStatusOptions = useMemo(
    () =>
      Object.values(pipelineStatuses).map(status => ({
        value: status,
        label: status,
      })),
    []
  );

  // useEffect(() => {
  //  setTimeout(setLoadingJobs(false), 3000);
  // }, [loadingJobs]);
  return (
    <FiltersForms
      layout="inline"
      form={form}
      size="medium"
      onFinish={onFinish}
      spacearound={1}>
      <Form.Item label="Time" name="time">
        <RangePicker
          style={{ width: '16vw', marginLeft: '1vw' }}
          showTime={{ format: 'HH:mm' }}
          format={DateFormat}
          onOpenChange={() => {
            // eslint-disable-next-line no-unused-vars
            localValueTimeChanged = Date.now();
          }}
          onChange={SubmitForm}
        />
      </Form.Item>

      <Form.Item label="Pipeline Name" name="pipelineName">
        <AutoComplete
          style={{ width: '8vw', marginLeft: '1vw' }}
          options={pipelineOptions}
          filterOption={(inputValue, option) =>
            option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
          }
          allowClear
          onSelect={SubmitForm}
          onClear={SubmitForm}
        />
      </Form.Item>
      <Form.Item label="Pipeline Status" name="pipelineStatus">
        <AutoComplete
          allowClear
          style={{ width: '8vw', marginLeft: '1vw' }}
          options={pipelineStatusOptions}
          filterOption={(inputValue, option) =>
            option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
          }
          onSelect={SubmitForm}
          onClear={SubmitForm}
        />
      </Form.Item>
      <Form.Item label="Algorithm Name" name="algorithmName">
        <AutoComplete
          allowClear
          style={{ width: '8vw', marginLeft: '1vw' }}
          options={algorithmOptions}
          filterOption={(inputValue, option) =>
            option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
          }
          onSelect={SubmitForm}
          onClear={SubmitForm}
        />
      </Form.Item>
      <Form.Item>
        <Button
          type={isShowActive() ? 'primary' : 'dashed'}
          htmlType="button"
          onClick={onPinActive}
          title="Show Active">
          Show Active
        </Button>
      </Form.Item>
    </FiltersForms>
  );
};

QueryForm.propTypes = {
  onSubmit: PropTypes.func,
};
QueryForm.defaultProps = {
  onSubmit: () => {},
};

QueryForm.propTypes = {
  onSubmit: PropTypes.func,
  params: PropTypes.shape({
    algorithmName: PropTypes.string,
    pipelineName: PropTypes.string,
    pipelineStatus: PropTypes.string,
    datesRange: PropTypes.shape({
      from: PropTypes.string,
      to: PropTypes.string,
    }).isRequired,
  }).isRequired,

  zoomDate: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number]),
};
QueryForm.defaultProps = {
  onSubmit: () => {},
  zoomDate: Date.now(),
};
export default React.memo(QueryForm);
