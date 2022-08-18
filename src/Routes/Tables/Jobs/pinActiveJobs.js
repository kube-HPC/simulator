import React from 'react';
import PropTypes from 'prop-types';
import { PushpinOutlined } from '@ant-design/icons';
import { useReactiveVar } from '@apollo/client';
import { isPinActiveJobVar } from 'cache';

const PinActiveJobs = ({ status }) => {
  const isPinActiveJobs = useReactiveVar(isPinActiveJobVar);
  return status.status === 'active' && isPinActiveJobs && <PushpinOutlined />;
};
PinActiveJobs.propTypes = {
  // eslint-disable-next-line
  status: PropTypes.object.isRequired,
  // eslint-disable-next-line
  style: PropTypes.object,
};

export default React.memo(PinActiveJobs);
