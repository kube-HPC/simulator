import React, { useMemo } from 'react';
import moment from 'moment';
import { Form, Button, DatePicker, AutoComplete } from 'antd';
import PropTypes from 'prop-types';
import { pipelineStatuses } from '@hkube/consts';
import { useQuery } from '@apollo/client';
import { ALGORITHM_AND_PIPELINE_NAMES } from '../../../../qraphql/queries';
// import { formatNode } from '../graphUtils';

// import { filterToggeledVar } from 'cache';

const { RangePicker } = DatePicker;
// let num = 1;
let localValueTimeChanged = 1;
const QueryForm = ({ onSubmit, params, zoomDate }) => {
  //  const filterToggeled = useReactiveVar(filterToggeledVar);

  const [form] = Form.useForm();

  useMemo(() => {
    params &&
      params.datesRange &&
      form.setFieldsValue({
        time: [moment(params.datesRange?.from), moment(params.datesRange?.to)],
      });
    form.setFieldsValue({
      algorithmName: params?.algorithmName,
      pipelineName: params?.pipelineName,
      pipelineStatus: params?.pipelineStatus,
    });
  }, [params, zoomDate]);
  const query = useQuery(ALGORITHM_AND_PIPELINE_NAMES);
  const onFinish = values => {
    // console.log('Received values of form: ', values);
    onSubmit(values);
  };

  const buttonItemLayout = {
    wrapperCol: {
      span: 1,
      offset: 4,
    },
  };
  const algorithmOptions = query?.data?.algorithms?.map(algorithm => ({
    value: algorithm.name,
    label: algorithm.name,
  }));
  const pipelineOptions = query?.data?.pipelines.map(pipeline => ({
    value: pipeline.name,
    label: pipeline.name,
  }));
  const pipelineStatusOptions = Object.values(pipelineStatuses).map(status => ({
    value: status,
    label: status,
  }));

  return (
    <Form
      layout="inline"
      form={form}
      initialValues={
        params &&
        {
          // //  time: [moment(params.datesRange?.from), moment(params.datesRange?.to)],
          // algorithmName: params.algorithmName,
          // pipelineName: params.pipelineName,
          // pipelineStatus: params.pipelineStatus,
        }

        // algorithm: params.algorithm,
        // pipeline: params.pipeline,
        //   pipelineStatus: params.pipelineStatus,
      }
      style={{
        justifyContent: 'space-around',
        border: '1px solid #d9d9d9',
        borderRadius: '2px',
        margin: '4px',
        padding: '8px',
        background: 'aliceblue',
        boxShadow: 'box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 2px',
      }}
      size="medium"
      onFinish={onFinish}>
      <Form.Item label="Time" name="time">
        <RangePicker
          style={{ width: '16vw', marginLeft: '1vw' }}
          showTime={{ format: 'HH:mm' }}
          format="YYYY-MM-DD HH:mm"
          onOpenChange={() => {
            // eslint-disable-next-line no-unused-vars
            localValueTimeChanged = Date.now();
          }}
        />
      </Form.Item>

      <Form.Item label="Pipeline Name" name="pipelineName">
        <AutoComplete
          style={{ width: '8vw', marginLeft: '1vw' }}
          options={pipelineOptions}
          filterOption={(inputValue, option) =>
            option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
          }
        />
      </Form.Item>
      <Form.Item label="Pipeline Status" name="pipelineStatus">
        <AutoComplete
          style={{ width: '8vw', marginLeft: '1vw' }}
          options={pipelineStatusOptions}
          filterOption={(inputValue, option) =>
            option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
          }
        />
      </Form.Item>
      <Form.Item label="Algorithm Name" name="algorithmName">
        <AutoComplete
          style={{ width: '8vw', marginLeft: '1vw' }}
          options={algorithmOptions}
          filterOption={(inputValue, option) =>
            option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
          }
        />
      </Form.Item>
      <Form.Item {...buttonItemLayout}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
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
  params: PropTypes.objectOf(PropTypes.string).isRequired,
  zoomDate: PropTypes.instanceOf(Date),
};
QueryForm.defaultProps = {
  onSubmit: () => {},
  zoomDate: Date.now(),
};
export default React.memo(QueryForm);
