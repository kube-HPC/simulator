import React, { useMemo, useCallback } from 'react';
import { Button, Space, Modal } from 'antd';
import {
  EditOutlined,
  ArrowLeftOutlined,
  ClearOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import useQuery from 'hooks/useQuery';
import { Link, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useActions } from 'hooks';
import { HeaderTitlePreferred } from '../OrderStyles';
import { queueClearedVar } from 'cache';

const LinkToEdit = ({ toggleEdit }) => {
  const query = useQuery();
  const isEditOrder = useMemo(() => query.get('queueEdit'), [query]);
  const location = useLocation();
  const { ClearQueue } = useActions();
  const [modal, contextHolderModal] = Modal.useModal();

  const nextPath = useMemo(() => {
    if (isEditOrder) {
      query.delete('queueEdit');
    } else {
      query.append('queueEdit', 'true');
    }
    return `${location.pathname}?${query.toString()}`;
  }, [location, isEditOrder, query]);

  const onStop = useCallback(() => {
    queueClearedVar(true);
    ClearQueue(() => {});
  }, [ClearQueue]);

  const showClearConfirmation = useCallback(() => {
    modal.confirm({
      title: 'Clear Queue',
      icon: <ExclamationCircleOutlined />,
      content: 'Are you sure you want to clear the entire queue?',
      okText: 'Yes, Clear Queue',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk() {
        onStop();
      },
    });
  }, [modal, onStop]);

  return (
    <HeaderTitlePreferred>
      {contextHolderModal}
      <Space>
        <Link to={nextPath}>
          <Button
            onClick={() => toggleEdit()}
            type="primary"
            icon={!isEditOrder ? <EditOutlined /> : <ArrowLeftOutlined />}
            size="large">
            {!isEditOrder ? 'Edit List' : 'Back'}
          </Button>
        </Link>
        <Button
          onClick={showClearConfirmation}
          type="default"
          icon={<ClearOutlined />}
          size="large"
          danger>
          Clear Queue
        </Button>
      </Space>
    </HeaderTitlePreferred>
  );
};

LinkToEdit.propTypes = {
  toggleEdit: PropTypes.func.isRequired,
  ClearQueue: PropTypes.func.isRequired,
};

export default LinkToEdit;
