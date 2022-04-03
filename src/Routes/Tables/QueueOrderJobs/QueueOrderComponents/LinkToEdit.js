import React, { useMemo } from 'react';
import { Button } from 'antd';
import { EditOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import useQuery from 'hooks/useQuery';
import { Link, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { HeaderTitlePreferred } from '../OrderStyles';

const LinkToEdit = ({ toggleEdit }) => {
  const query = useQuery();
  const isEditOrder = useMemo(() => query.get('queueEdit'), [query]);
  const location = useLocation();
  const nextPath = useMemo(() => {
    if (isEditOrder) {
      query.delete('queueEdit');
    } else {
      query.append('queueEdit', 'true');
    }
    return `${location.pathname}?${query.toString()}`;
  }, [location, isEditOrder, query]);

  return (
    <HeaderTitlePreferred>
      <Link to={nextPath}>
        <Button
          onClick={() => toggleEdit()}
          type="primary"
          icon={!isEditOrder ? <EditOutlined /> : <ArrowLeftOutlined />}
          size="large">
          {!isEditOrder ? 'Edit List' : 'Back'}
        </Button>
      </Link>
    </HeaderTitlePreferred>
  );
};

LinkToEdit.propTypes = {
  toggleEdit: PropTypes.func.isRequired,
};

export default LinkToEdit;
