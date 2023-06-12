import React, { useEffect, useMemo } from 'react';
import dayjs from 'dayjs';
import { Form, AutoComplete, Button } from 'antd';
import PropTypes from 'prop-types';
import { pipelineStatuses } from '@hkube/consts';
import { useQuery, useReactiveVar } from '@apollo/client';
import { ALGORITHM_AND_PIPELINE_NAMES } from 'graphql/queries';
import { FiltersForms } from 'styles';
import { RangePickerNow } from 'components/common';
import { isPinActiveJobVar } from 'cache';

const QueryForm = ({ onSubmit, params, zoomDate }) => {
  const [form] = Form.useForm();
  const isPinActiveJobs = useReactiveVar(isPinActiveJobVar);

  const SubmitForm = () => {
    //  setLoadingJobs(true);
    form.submit();
  };

  useEffect(() => {
    if (params?.datesRange?.from || params?.datesRange?.to) {
      form.setFieldsValue({
        time: {
          datesRange: {
            from: dayjs(params.datesRange.from),
            to: dayjs(params.datesRange.to),
          },
        },
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
  }, [params]);

  const onFinish = values => {
    onSubmit(values);
  };

  const onPinActive = () => {
    if (!isPinActiveJobs) {
      form.setFieldsValue({ pipelineStatus: 'active' });
    } else {
      form.setFieldsValue({ pipelineStatus: null });
    }

    isPinActiveJobVar(!isPinActiveJobs);

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

  const pipelineStatusOptions = useMemo(() => {
    delete pipelineStatuses.PENDING;

    return Object.values(pipelineStatuses).map(status => ({
      value: status,
      label: status,
    }));
  }, []);

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
        <RangePickerNow
          isDisabled={isPinActiveJobs}
          onChange={SubmitForm}
          zoomDateChange={zoomDate}
        />
      </Form.Item>
      <Form.Item label="Pipeline Name / Job ID" name="pipelineName">
        <AutoComplete
          style={{ width: '8vw' }}
          options={pipelineOptions}
          filterOption={(inputValue, option) =>
            option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
          }
          allowClear
          onSearch={SubmitForm}
          onSelect={SubmitForm}
          onClear={SubmitForm}
        />
      </Form.Item>
      <Form.Item label="Pipeline Status" name="pipelineStatus">
        <AutoComplete
          allowClear
          style={{ width: '8vw' }}
          options={pipelineStatusOptions}
          filterOption={(inputValue, option) =>
            option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
          }
          onSelect={SubmitForm}
          onClear={SubmitForm}
          disabled={isPinActiveJobs}
        />
      </Form.Item>
      <Form.Item label="Algorithm Name" name="algorithmName">
        <AutoComplete
          allowClear
          style={{ width: '8vw' }}
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
          type={isPinActiveJobs ? 'primary' : 'dashed'}
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
      // eslint-disable-next-line react/forbid-prop-types
      from: PropTypes.object,
      // eslint-disable-next-line react/forbid-prop-types
      to: PropTypes.object,
    }).isRequired,
  }).isRequired,

  zoomDate: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number]),
};
QueryForm.defaultProps = {
  onSubmit: () => {},
  zoomDate: Date.now(),
};
export default React.memo(QueryForm);
