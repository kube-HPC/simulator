import React, { useEffect, useMemo } from 'react';
import dayjs from 'dayjs';
import { Form, Tooltip } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import KeycloakServices from 'keycloak/keycloakServices';
import PropTypes from 'prop-types';
import { pipelineStatuses } from '@hkube/consts';
import { useQuery, useReactiveVar } from '@apollo/client';
import { ALGORITHM_AND_PIPELINE_NAMES } from 'graphql/queries';
import { FiltersForms, COLOR_PIPELINE_STATUS } from 'styles';
import { RangePickerNow } from 'components/common';
import { isPinActiveJobVar } from 'cache';

import { selectors } from 'reducers';
import { useSelector } from 'react-redux';

import AutoCompleteFloatingLabelInput from 'components/common/FiltersInput/AutoCompleteFloatingLabelInput';
import ButtonDropdown from 'components/common/FiltersInput/ButtonDropdown';

const QueryForm = ({ params, zoomDate = Date.now(), onSubmit = () => {} }) => {
  const [form] = Form.useForm();
  const isPinActiveJobs = useReactiveVar(isPinActiveJobVar);
  const { keycloakEnable } = useSelector(selectors.connection);

  const SubmitForm = () => {
    //  setLoadingJobs(true);
    form.submit();
  };

  const FilterByMyUserName = () => {
    form.setFieldsValue({ user: KeycloakServices.getUsername() });
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

    if (keycloakEnable) {
      if (params && params.user) {
        form.setFieldsValue({ user: params.user });
      } else {
        form.resetFields(['user']);
      }
    }
  }, [params]);

  const onFinish = values => {
    onSubmit(values);
  };

  const onPinPipelineStatus = statusName => {
    if (statusName !== '') {
      form.setFieldsValue({ pipelineStatus: statusName });
      isPinActiveJobVar(statusName === 'active');
    } else {
      form.setFieldsValue({ pipelineStatus: null });
      isPinActiveJobVar(false);
    }

    SubmitForm();
  };

  const query = useQuery(ALGORITHM_AND_PIPELINE_NAMES);

  const usersOptions = useMemo(
    () =>
      query.data?.auditTrail?.find(entry => entry.user != null)?.user || null,
    [query.data?.auditTrail]
  );

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
    delete pipelineStatuses.CRASHED;
    delete pipelineStatuses.DEQUEUED;
    delete pipelineStatuses.QUEUED;
    delete pipelineStatuses.RESUMED;
    delete pipelineStatuses.RUNNING;
    delete pipelineStatuses.STALLED;

    return Object.values(pipelineStatuses).map(status => ({
      key: status,
      value: status,
      label: status,
      color: COLOR_PIPELINE_STATUS[status],
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
      spacearound={0}>
      <Form.Item label="Time" name="time">
        <RangePickerNow
          isDisabled={isPinActiveJobs}
          onChange={SubmitForm}
          zoomDateChange={zoomDate}
        />
      </Form.Item>

      <Form.Item name="pipelineName">
        <AutoCompleteFloatingLabelInput
          label="Pipeline Name / Job ID"
          width="12vw"
          options={pipelineOptions}
          allowClear
          Submit={SubmitForm}
        />
      </Form.Item>

      <Form.Item name="algorithmName">
        <AutoCompleteFloatingLabelInput
          label="Algorithm Name"
          width="9vw"
          options={algorithmOptions}
          allowClear
          Submit={SubmitForm}
        />
      </Form.Item>

      {keycloakEnable && (
        <Form.Item name="user">
          <AutoCompleteFloatingLabelInput
            label="User"
            width="9vw"
            options={usersOptions}
            allowClear
            Submit={SubmitForm}
            suffix={
              <Tooltip title="Click To Filter Yor User">
                <UserOutlined
                  style={{ color: 'rgba(0,0,0,.45)' }}
                  onClick={FilterByMyUserName}
                />
              </Tooltip>
            }
          />
        </Form.Item>
      )}

      <Form.Item name="pipelineStatus">
        <ButtonDropdown
          defaultLabel="active"
          options={pipelineStatusOptions}
          onButtonClick={onPinPipelineStatus}
        />
      </Form.Item>
    </FiltersForms>
  );
};

QueryForm.propTypes = {
  onSubmit: PropTypes.func,
  params: PropTypes.shape({
    algorithmName: PropTypes.string,
    pipelineName: PropTypes.string,
    pipelineStatus: PropTypes.string,
    user: PropTypes.string,
    datesRange: PropTypes.shape({
      // eslint-disable-next-line react/forbid-prop-types
      from: PropTypes.object,
      // eslint-disable-next-line react/forbid-prop-types
      to: PropTypes.object,
    }).isRequired,
  }).isRequired,

  zoomDate: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number]),
};

export default React.memo(QueryForm);
