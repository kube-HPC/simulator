import React from 'react';
import { Tooltip } from 'antd';
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
    <Tooltip title="Click to open help site" placement="top">
      <IconHelpStyle
        {...prop}
        onClick={() => window.open(`${hkubeSiteUrl}${link}`)}
      />
    </Tooltip>
  );
};

export default HelpSiteLink;

HelpSiteLink.propTypes = {
  link: PropTypes.string,
};
