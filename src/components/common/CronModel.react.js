import React, { useCallback, useRef, useState } from 'react';
import {
  Divider,
  Input,
  Modal,
  Button,
  Alert,
  Switch,
  Tooltip,
  Typography,
} from 'antd';
import PropTypes from 'prop-types';
import Cron from 'react-js-cron';
import 'react-js-cron/dist/styles.css';
import { FlexBox } from 'components/common';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

const { Text } = Typography;

const CronModel = ({
  isShowModalExternal = undefined,
  setIsShowModalExternal = undefined,
  defaultValueExternal = undefined,
  onChange,

  cronIsEnabled = undefined,
  switchLoading = undefined,
  switchOnToggle = undefined,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [valueCron, setCronValue] = useState(
    defaultValueExternal || '0 * * * *'
  );

  const inputCronRef = useRef(null);

  const [error, onError] = useState();

  const showModal = () => {
    setIsShowModalExternal(true);
    setIsModalOpen(true);
  };

  const handleOk = () => {
    onChange(valueCron);
    setIsShowModalExternal(false);
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsShowModalExternal(false);
    setIsModalOpen(false);
  };

  const customSetValue = useCallback(newValue => {
    setCronValue(newValue);
  }, []);

  return (
    <>
      {isShowModalExternal === undefined && (
        <Button type="primary" onClick={showModal}>
          Cron Wizrd
        </Button>
      )}
      <Modal
        destroyOnHidden
        title={
          <>
            <Text>Schedule Wizard </Text>
            {cronIsEnabled !== undefined && (
              <Tooltip title={`toggle cron ${cronIsEnabled ? 'off' : 'on'}`}>
                <Switch
                  size="small"
                  checked={cronIsEnabled}
                  loading={switchLoading}
                  onChange={switchOnToggle}
                />
              </Tooltip>
            )}{' '}
            <Divider />
          </>
        }
        open={isModalOpen || isShowModalExternal}
        onOk={handleOk}
        onCancel={handleCancel}>
        <FlexBox.Auto justify="flex-start">
          <Text>Cron : </Text>
          <Input
            ref={inputCronRef}
            onBlur={event => {
              setCronValue(event.target.value);
            }}
            onPressEnter={() => {
              setCronValue(inputCronRef.current?.input.value || '');
            }}
            value={valueCron}
            onChange={e => setCronValue(e.target.value)}
          />
        </FlexBox.Auto>
        <Divider>
          <ArrowUpOutlined />
          <ArrowDownOutlined />
        </Divider>

        <Cron value={valueCron} setValue={customSetValue} onError={onError} />

        {error?.description && (
          <Alert message={error.description} type="error" />
        )}
      </Modal>
    </>
  );
};

CronModel.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  onChange: PropTypes.func.isRequired,
  isShowModalExternal: PropTypes.bool,
  setIsShowModalExternal: PropTypes.func,
  defaultValueExternal: PropTypes.string,

  cronIsEnabled: PropTypes.bool,
  switchLoading: PropTypes.bool,
  switchOnToggle: PropTypes.func,
};

export default CronModel;
