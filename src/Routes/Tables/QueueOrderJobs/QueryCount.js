import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { TitleTable, BadgeCount } from './OrderStyles';

export const QueryCount = ({ nameCount, selectorsData, status, isShow }) => {
  const counter = useSelector(selectorsData);
  return (
    <>
      {!isShow && <TitleTable>{nameCount}</TitleTable>}
      {isShow && (
        <BadgeCount
          overflowCount={9999}
          count={counter}
          status={status}
          size="large">
          <TitleTable>{nameCount}</TitleTable>
        </BadgeCount>
      )}
    </>
  );
};

QueryCount.propTypes = {
  nameCount: PropTypes.string,
  // eslint-disable-next-line react/forbid-prop-types
  selectorsData: PropTypes.object.isRequired,
  status: PropTypes.string,
  isShow: PropTypes.bool,
};

QueryCount.defaultProps = {
  nameCount: 'preferred',
  status: 'success',
  isShow: true,
};
