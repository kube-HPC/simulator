import { Tag } from 'antd';
import PropTypes from 'prop-types';
import React from 'react';
import { COLOR_BOARDS } from 'styles';
import { toUpperCaseFirstLetter } from 'utils';

const BoardStatus = ({ status }) => (
  <Tag color={COLOR_BOARDS[status]}>{toUpperCaseFirstLetter(status)}</Tag>
);

BoardStatus.propTypes = {
  status: PropTypes.string.isRequired,
};

export default BoardStatus;
