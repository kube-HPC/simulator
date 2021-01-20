import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { Popover } from 'antd';
import { selectors } from 'reducers';
import { useSelector } from 'react-redux';
import { USER_GUIDE } from 'const';
import { useActions, useLeftSidebar } from 'hooks';
import { FlexBox, Icons } from 'components/common';
import { appInfo } from 'config';
import ConnectionStatus from './ConnectionStatus.react';
import Settings from './Settings/Settings.react';

const DarkText = styled(Icons.DarkHoverStyle)`
  cursor: pointer;
`;

const Container = styled(FlexBox.Auto)`
  position: relative;
  > ${Icons.DarkHoverStyle}, ${DarkText} {
    margin-right: 10px;
  }
`;

const openUrl = url => () => window.open(url);

const HelpBar = () => {
  const history = useHistory();
  const { setCollapsed } = useLeftSidebar();

  const { triggerUserGuide } = useActions();
  const { hkubeSystemVersion } = useSelector(selectors.connection.stats);

  const onGuideClick = useCallback(() => {
    triggerUserGuide();
    history.push('/jobs');
    setCollapsed(true);
  }, [history, setCollapsed, triggerUserGuide]);

  return (
    <Container className={USER_GUIDE.HEADER.SOCIALS}>
      <ConnectionStatus />
      <Popover content={<Settings />} placement="bottomRight">
        <Icons.Hover type="tool" />
      </Popover>
      <Icons.Hover type="global" onClick={openUrl(appInfo.websiteUrl)} />
      <Icons.Hover type="github" onClick={openUrl(appInfo.githubUrl)} />
      <Icons.Hover type="question-circle" onClick={onGuideClick} />
      <DarkText as="span">{hkubeSystemVersion}</DarkText>
    </Container>
  );
};

export default HelpBar;
