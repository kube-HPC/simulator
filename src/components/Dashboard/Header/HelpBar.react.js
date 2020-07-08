import { Popover } from 'antd';
import { FlexBox, Icons } from 'components/common';
import { appInfo } from 'config';
import { LEFT_SIDEBAR_NAMES, USER_GUIDE, STATE_SOURCES } from 'const';
import { useActions, useLeftSidebar, useStore } from 'hooks';
import React, { useCallback } from 'react';
import styled from 'styled-components';
import ConnectionStatus from './ConnectionStatus.react';
import Settings from './Settings/Settings.react';

const DarkText = styled(Icons.DarkHoverStyle)`
  cursor: pointer;
`;

const Container = styled(FlexBox.Auto)`
  > ${Icons.DarkHoverStyle}, ${DarkText} {
    margin-right: 10px;
  }
`;

const openUrl = url => () => window.open(url);

const HelpBar = () => {
  const {
    value: [, setTableValue],
    isCollapsed: [, setLeftIsCollapsed],
  } = useLeftSidebar();

  const { triggerUserGuide } = useActions();
  const hkubeSystemVersion = useStore(STATE_SOURCES.HKUBE_SYSTEM_VERSION);

  const onGuideClick = useCallback(() => {
    triggerUserGuide();
    setTableValue(LEFT_SIDEBAR_NAMES.JOBS);
    setLeftIsCollapsed(true);
  }, [setLeftIsCollapsed, setTableValue, triggerUserGuide]);

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
