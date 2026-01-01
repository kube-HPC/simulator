import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import _ from 'lodash';

const VersionTag = styled.span`
  float: right;
  margin-left: 5ch;
  font-weight: bold;
`;

/**
 * @param {{
 *   version: DataSourceVersion;
 *   isLatest: boolean;
 * }} props
 */
export const VersionRow = ({ title, isLatest, isSnapshot = false }) => (
  <>
    <span>{title}</span>
    <VersionTag>
      {
        // \u00A0 is a space character to maintain the margins when the tag is empty
        isSnapshot ? 'Snapshot' : isLatest ? 'Latest' : '\u00A0'
      }
    </VersionTag>
  </>
);
VersionRow.propTypes = {
  title: PropTypes.string.isRequired,
  isLatest: PropTypes.bool.isRequired,
  isSnapshot: PropTypes.bool,
};

/**
 * @param {import('./VersionSelect').DataSourceVersion} collection
 * @param {import('./VersionSelect').ExtendedDataSource} entry
 */
export const checkLatest = (collection, entry) => {
  if (!entry || !collection) return false;
  return _.last(collection)?.id === entry?.id;
};
