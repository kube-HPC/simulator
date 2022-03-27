import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { TitleTable, BadgeCount } from './OrderStyles';

export const QCount = ({ nameCount, selectorsData, status, isShow }) => {
  const counter = useSelector(selectorsData);
  return (
    <>
      {!isShow && <TitleTable>{nameCount}</TitleTable>}
      {isShow && (
        <BadgeCount count={counter} status={status} size="large">
          <TitleTable>{nameCount}</TitleTable>
        </BadgeCount>
      )}
    </>
  );
};

QCount.propTypes = {
  nameCount: PropTypes.string,
  // eslint-disable-next-line react/forbid-prop-types
  selectorsData: PropTypes.object.isRequired,
  status: PropTypes.string,
  isShow: PropTypes.bool,
};

QCount.defaultProps = {
  nameCount: 'preferred',
  status: 'success',
  isShow: true,
};
