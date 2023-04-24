import React from 'react';
import { selectors } from 'reducers';
import { QuestionCircleFilled } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

const HelpSiteLink = ({ link }) => {
  const { hkubeSiteUrl } = useSelector(selectors.config);

  return (
    <QuestionCircleFilled
      style={{ padding: '5px', fontSize: '18px' }}
      onClick={() => window.open(`${hkubeSiteUrl}${link}`)}
    />
  );
};

export default HelpSiteLink;

HelpSiteLink.propTypes = {
  link: PropTypes.string,
};

HelpSiteLink.defaultProps = {
  link: '',
};
