import React, { useCallback } from 'react';

import { FlexBox, Icons } from 'components/common';
import { useNavigate } from 'react-router-dom';
import {
  GlobalOutlined,
  GithubOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { useActions, useSiteThemeMode } from 'hooks';
import { appInfo } from 'config';
import { ReactComponent as IconSwagger } from 'images/swagger.svg';
import { selectors } from 'reducers';
import { Divider, Typography, Image } from 'antd';
import { ReactComponent as ApiIcon } from 'images/apiIcon.svg';
import SetDefaultTime from './SetDefaultTime';
import { GRAFANA_ICON } from './grafana-icon';

// import LogMode from './LogMode.react';
// import LogSource from './LogSource.react';
// import GraphDirection from './GraphDirection.react';
import {
  iconsThemes,
  iconsThemesTitle,
} from '../../../../styles/themes/HelperThemes';

// import TypesSelect from './TypesSelect.react';

const { Text } = Typography;
const Settings = () => {
  const { hkubeSiteUrl } = useSelector(selectors.config);
  const { setTheme, themeName } = useSiteThemeMode();

  const navigate = useNavigate();

  const { triggerUserGuide } = useActions();
  const { hkubeSystemVersion } = useSelector(selectors.connection);
  const { grafanaUrl } = useSelector(selectors.connection);

  const onGuideClick = useCallback(() => {
    triggerUserGuide();
    navigate('/jobs');
  }, [navigate, triggerUserGuide]);

  const openUrl = url => () => window.open(url);

  const DarkText = styled.div`
    cursor: pointer;
    font-size: 14px;
    color: #cccccc;
  `;

  const TextLink = styled(Text)`
    cursor: pointer;
  `;

  const DividerStyle = styled(Divider)`
    width: 203px;
    margin: 0px;
  `;

  const LightThemeButton = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 13px;
    font-weight: 600;
    padding: 6px 12px;
    border-radius: 6px;
    width: 100%;
    color: #1677ff;
    background: #ffffff;
    border: 2px solid ${({ $active }) => ($active ? '#1677ff' : '#d0e4ff')};
    box-shadow: ${({ $active }) =>
      $active ? '0 0 0 2px rgba(22,119,255,0.2)' : 'none'};
    transition: all 0.2s ease;

    &:hover {
      border-color: #1677ff;
      box-shadow: 0 0 0 2px rgba(22, 119, 255, 0.15);
    }
  `;

  const DarkThemeButton = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 13px;
    font-weight: 600;
    padding: 6px 12px;
    border-radius: 6px;
    width: 100%;
    color: #ffffff;
    background: #182039;
    border: 2px solid ${({ $active }) => ($active ? '#40a9ff' : '#2e4a7a')};
    box-shadow: ${({ $active }) =>
      $active ? '0 0 0 2px rgba(64,169,255,0.25)' : 'none'};
    transition: all 0.2s ease;

    &:hover {
      border-color: #40a9ff;
      box-shadow: 0 0 0 2px rgba(64, 169, 255, 0.2);
    }
  `;

  const LightsOutThemeButton = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 13px;
    font-weight: 500;
    padding: 6px 12px;
    border-radius: 6px;
    width: 100%;
    color: #5a6a7a;
    background: #0a0f1a;
    border: 2px solid ${({ $active }) => ($active ? '#3a4a5a' : '#1a2030')};
    box-shadow: ${({ $active }) =>
      $active ? '0 0 0 2px rgba(58,74,90,0.4)' : 'none'};
    letter-spacing: 0.03em;
    transition: all 0.2s ease;

    &:hover {
      border-color: #3a4a5a;
      box-shadow: 0 0 0 2px rgba(58, 74, 90, 0.3);
    }
  `;
  return (
    <FlexBox.Auto align="left" direction="column" gutter={[10, 10]}>
      <FlexBox.Auto>
        <Icons.Hover
          type={<IconSwagger title="Swagger" />}
          onClick={openUrl(appInfo.swaggerUrl)}
          styleIcon={{ height: '25px' }}
        />
        <TextLink onClick={openUrl(appInfo.swaggerUrl)}>Swagger</TextLink>
      </FlexBox.Auto>

      <FlexBox.Auto>
        <Icons.Hover
          type={<ApiIcon title="Spec" />}
          onClick={openUrl(appInfo.specUrl)}
          styleIcon={{ height: '25px' }}
        />
        <TextLink onClick={openUrl(appInfo.specUrl)}>Spec</TextLink>
      </FlexBox.Auto>

      <FlexBox.Auto>
        <Icons.Hover
          type={<GithubOutlined title="Github" />}
          onClick={openUrl(appInfo.githubUrl)}
        />
        <TextLink onClick={openUrl(appInfo.githubUrl)}>Github</TextLink>
      </FlexBox.Auto>

      <FlexBox.Auto>
        <Image
          disabled={grafanaUrl === undefined}
          preview={false}
          style={{
            width: '22px',
            filter: 'grayscale(100%)',
            cursor: 'pointer',
          }}
          src={GRAFANA_ICON}
        />
        <TextLink
          disabled={grafanaUrl === undefined}
          onClick={grafanaUrl !== undefined ? openUrl(grafanaUrl) : false}>
          Grafana
        </TextLink>
      </FlexBox.Auto>

      <FlexBox.Auto>
        <Icons.Hover
          type={<GlobalOutlined title="hkube Site" />}
          onClick={openUrl(appInfo.websiteUrl)}
        />
        <TextLink
          onClick={
            hkubeSiteUrl ? openUrl(hkubeSiteUrl) : openUrl(appInfo.websiteUrl)
          }>
          Hkube Site
        </TextLink>
      </FlexBox.Auto>

      <FlexBox.Auto>
        <DividerStyle />
      </FlexBox.Auto>

      <FlexBox.Auto direction="column" gutter={[6, 6]}>
        <LightThemeButton
          $active={themeName.toUpperCase() === 'LIGHT'}
          onClick={() => setTheme('light')}>
          Light
        </LightThemeButton>

        <DarkThemeButton
          $active={themeName.toUpperCase() === 'DARK'}
          onClick={() => setTheme('dark')}>
          Dark
        </DarkThemeButton>

        <LightsOutThemeButton
          $active={themeName.toUpperCase() === 'LIGHTSOUT'}
          onClick={() => setTheme('lightsOut')}>
          Lights Out
        </LightsOutThemeButton>
      </FlexBox.Auto>
      <SetDefaultTime />

      <FlexBox.Auto>
        <DividerStyle />
      </FlexBox.Auto>

      <FlexBox.Auto>
        <Icons.Hover
          type={<QuestionCircleOutlined title="Help" />}
          onClick={onGuideClick}
        />
        <TextLink onClick={onGuideClick}>Help</TextLink>
      </FlexBox.Auto>

      <DarkText as="span">{hkubeSystemVersion}</DarkText>

      {/*  <GraphDirection />
      <LogSource />
      <LogMode /> */}

      {/* <TypesSelect /> */}
    </FlexBox.Auto>
  );
};
export default Settings;
