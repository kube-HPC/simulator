import React, { useMemo, useCallback } from 'react';
import { Button, Space } from 'antd';
import {
  EditOutlined,
  ArrowLeftOutlined,
  ClearOutlined,
} from '@ant-design/icons';
import useQuery from 'hooks/useQuery';
import { Link, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useActions } from 'hooks';
import { HeaderTitlePreferred } from '../OrderStyles';

const LinkToEdit = ({ toggleEdit }) => {
  const query = useQuery();
  const isEditOrder = useMemo(() => query.get('queueEdit'), [query]);
  const location = useLocation();
  const { ClearQueue } = useActions();

  const nextPath = useMemo(() => {
    if (isEditOrder) {
      query.delete('queueEdit');
    } else {
      query.append('queueEdit', 'true');
    }
    return `${location.pathname}?${query.toString()}`;
  }, [location, isEditOrder, query]);

  const onStop = useCallback(() => ClearQueue(() => {}), [ClearQueue]);

  return (
    <HeaderTitlePreferred>
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
          onClick={onStop}
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
