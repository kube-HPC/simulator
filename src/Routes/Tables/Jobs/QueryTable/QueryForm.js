import React, { useEffect, useMemo, useState } from 'react';
import moment from 'moment';
import { Form, DatePicker, AutoComplete } from 'antd';
// import { ReloadOutlined,  SearchOutlined,  LoadingOutlined,} from '@ant-design/icons';
import PropTypes from 'prop-types';
import { pipelineStatuses } from '@hkube/consts';
import { useQuery } from '@apollo/client';
import { ALGORITHM_AND_PIPELINE_NAMES } from 'graphql/queries';

// import { formatNode } from '../graphUtils';

// import { filterToggeledVar } from 'cache';
// import { instanceFiltersVar } from 'cache';

const { RangePicker } = DatePicker;
// let num = 1;
let localValueTimeChanged = 1;
const QueryForm = ({ onSubmit, params, zoomDate }) => {
  // const instanceFilters = useReactiveVar(instanceFiltersVar);
  // console.log(instanceFilters);
  const [loadingJobs, setLoadingJobs] = useState(false);

  const [form] = Form.useForm();

  const SubmitForm = () => {
    setLoadingJobs(true);
    form.submit();
  };
  // const onReset = () => {
  //    form.resetFields();
  // SubmitForm();
  // };

  useMemo(() => {
    /*  const jobs = {
      limit: 20,
      algorithmName: params?.algorithmName || null,
      pipelineName: params?.pipelineName || null,
      pipelineStatus: params?.pipelineStatus || null,
      datesRange: {
        from: params?.datesRange?.from || null,
        to: params?.datesRange?.to || null,
      },
    }; */
    // instanceFiltersVar({ ...instanceFiltersVar(), jobs });

    if (params?.datesRange?.from && params?.datesRange?.to) {
      form.setFieldsValue({
        time: [
          moment(params.datesRange.from, 'YYYY-MM-DD HH:mm'),
          moment(params.datesRange.to, 'YYYY-MM-DD HH:mm'),
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

    // form.setFieldsValue({
    //    algorithmName: params?.algorithmName||undefined,
    //   pipelineName: params?.pipelineName||undefined,
    //    pipelineStatus: params?.pipelineStatus||undefined,
    //  });

    // (params?.algorithmName==null) && form.resetFields(['algorithmName'])
    // (params?.pipelineName==null) &&  form.resetFields(['pipelineName'])
    // (params?.pipelineStatus==null) && form.resetFields(['pipelineStatus'])
  }, [params, zoomDate]);

  const query = useQuery(ALGORITHM_AND_PIPELINE_NAMES);

  const onFinish = values => {
    // console.log('Received values of form: ', values);
    onSubmit(values);
  };

  /* const buttonItemLayout = {
    wrapperCol: {
      span: 1,
      offset: 4,
    },
  }; */

  const algorithmOptions = query?.data?.algorithms.list?.map(algorithm => ({
    value: algorithm.name,
    label: algorithm.name,
  }));
  const pipelineOptions = query?.data?.pipelines.list.map(pipeline => ({
    value: pipeline.name,
    label: pipeline.name,
  }));
  const pipelineStatusOptions = Object.values(pipelineStatuses).map(status => ({
    value: status,
    label: status,
  }));

  useEffect(() => {
    setTimeout(setLoadingJobs(false), 3000);
  }, [loadingJobs]);
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
          onChange={SubmitForm}
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
          onChange={SubmitForm}
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
          onChange={SubmitForm}
        />
      </Form.Item>

      {/*    <Form.Item {...buttonItemLayout}>
        <Button htmlType="button" onClick={onReset} title="Reset">
          <ReloadOutlined />
        </Button>
      </Form.Item>

      <Form.Item {...buttonItemLayout}>
        <Button type="primary" htmlType="submit" title="Search">
          {loadingJobs ? <LoadingOutlined /> : <SearchOutlined />}
        </Button>
        </Form.Item> */}
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
