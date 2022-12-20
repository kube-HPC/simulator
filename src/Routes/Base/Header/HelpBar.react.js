import React, { useCallback } from 'react';

import { useHistory, Route } from 'react-router-dom';
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
import { ReactComponent as IconSwagger } from 'images/swagger.svg';
import {
  iconsThemes,
  iconsThemesTitle,
} from '../../../styles/themes/HelperThemes';
import InactiveModeTag from './InactiveMode';
import Settings from './Settings/Settings.react';
import ExperimentPicker from './ExperimentPicker.react';
import ViewType from './ViewType.react';

const DarkText = styled.div`
  cursor: pointer;
  font-size: 14px;
  color: #cccccc;
`;

const Container = styled(FlexBox.Auto)`
  position: relative;
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
      <InactiveModeTag />

      <ExperimentPicker />

      <Icons.Hover
        type={<IconSwagger title="Swagger" />}
        onClick={openUrl(appInfo.swaggerUrl)}
        styleIcon={{ height: '25px' }}
      />

      <Popover content={<Settings />} placement="bottomRight" trigger="click">
        <Icons.Hover type={<ToolOutlined title="Settings" />} />
      </Popover>

      <Icons.Hover
        type={<GlobalOutlined title="hkube Site" />}
        onClick={openUrl(appInfo.websiteUrl)}
      />

      <Icons.Hover
        type={<GithubOutlined title="Github" />}
        onClick={openUrl(appInfo.githubUrl)}
      />

      <Icons.Hover
        type={
          <span
            title={iconsThemesTitle[themeName.toUpperCase()]}
            role="img"
            aria-label="menu-unfold"
            className="anticon anticon-menu-unfold">
            {iconsThemes[themeName.toUpperCase()]}
          </span>
        }
        onClick={toggleTheme}
      />
      <Route exact path="/jobs" component={ViewType} />
      <Icons.Hover
        type={<QuestionCircleOutlined title="Help" />}
        onClick={onGuideClick}
      />

      <DarkText as="span">{hkubeSystemVersion}</DarkText>
    </Container>
  );
};

export default HelpBar;
