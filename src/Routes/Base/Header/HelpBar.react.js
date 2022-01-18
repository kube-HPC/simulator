import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import {
  ToolOutlined,
  GlobalOutlined,
  GithubOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import styled from 'styled-components';
import { Popover } from 'antd';
import { selectors } from 'reducers';
import { useSelector } from 'react-redux';
import { USER_GUIDE } from 'const';
import { useActions, useLeftSidebar, useSiteThemeMode } from 'hooks';
import { FlexBox, Icons } from 'components/common';
import { appInfo } from 'config';
import { iconsThemes } from '../../../styles/themes/HelperThemes';
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
  const { toggleTheme, themeName } = useSiteThemeMode();

  const history = useHistory();
  const { setCollapsed } = useLeftSidebar();

  const { triggerUserGuide } = useActions();
  const { hkubeSystemVersion } = useSelector(selectors.connection);

  const onGuideClick = useCallback(() => {
    triggerUserGuide();
    history.push('/jobs');
    setCollapsed(true);
  }, [history, setCollapsed, triggerUserGuide]);

  return (
    <Container className={USER_GUIDE.HEADER.SOCIALS}>
      <ConnectionStatus />
      <Icons.Hover
        type={
          <span
            role="img"
            aria-label="menu-unfold"
            className="anticon anticon-menu-unfold">
            {iconsThemes[themeName.toUpperCase()]}
          </span>
        }
        onClick={toggleTheme}
      />

      <Popover content={<Settings />} placement="bottomRight" trigger="click">
        <Icons.Hover type={<ToolOutlined />} />
      </Popover>
      <Icons.Hover
        type={<GlobalOutlined />}
        onClick={openUrl(appInfo.websiteUrl)}
      />
      <Icons.Hover
        type={<GithubOutlined />}
        onClick={openUrl(appInfo.githubUrl)}
      />
      <Icons.Hover type={<QuestionCircleOutlined />} onClick={onGuideClick} />
      <DarkText as="span">{hkubeSystemVersion}</DarkText>
    </Container>
  );
};

export default HelpBar;
