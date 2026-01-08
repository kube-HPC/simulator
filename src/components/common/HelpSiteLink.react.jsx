import React from 'react';
import { selectors } from 'reducers';
import { QuestionCircleFilled } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const IconHelpStyle = styled(QuestionCircleFilled)`
  padding: 4px;
  font-size: 18px;
`;

const HelpSiteLink = ({ link = '', ...prop }) => {
  const { hkubeSiteUrl } = useSelector(selectors.config);

  return (
    <IconHelpStyle
      {...prop}
      onClick={() => window.open(`${hkubeSiteUrl}${link}`)}
    />
  );
};

export default HelpSiteLink;

HelpSiteLink.propTypes = {
  link: PropTypes.string,
};
