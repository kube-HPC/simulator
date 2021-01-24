import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const TagLabel = styled.span`
  font-weight: bold;
  margin-right: 1ch;
`;

const TagContainer = styled.span`
  margin-left: 1ch;
  white-space: nowrap;
  &::first-of-type {
    margin-left: none;
  }
`;

const TagValue = styled.span``;

const Tag = ({ title, value }) =>
  value ? (
    <TagContainer>
      <TagLabel>{title}</TagLabel>
      <TagValue>{value}</TagValue>
    </TagContainer>
  ) : null;
Tag.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.node.isRequired,
};

export default Tag;
