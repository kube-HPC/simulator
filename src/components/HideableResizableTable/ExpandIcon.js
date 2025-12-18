import React from 'react';

import PropTypes from 'prop-types';
import Icon, { DownOutlined, RightOutlined } from '@ant-design/icons';

const ExpandIcon = ({ expanded, onExpand, record }) => (
  <Icon
    type={expanded ? <DownOutlined /> : <RightOutlined />}
    onClick={e => onExpand(record, e)}
  />
);

ExpandIcon.propTypes = {
  expanded: PropTypes.bool.isRequired,
  onExpand: PropTypes.func.isRequired,
  // TODO: detail the props
  // eslint-disable-next-line
  record: PropTypes.object.isRequired,
};

export default ExpandIcon;
