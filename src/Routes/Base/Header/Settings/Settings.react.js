import React, { useCallback } from 'react';
import { FlexBox, Icons } from 'components/common';
import { useHistory } from 'react-router-dom';
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
import { Divider, Typography } from 'antd';
import { ReactComponent as ApiIcon } from 'images/apiIcon.svg';
import SetDefaultTime from './SetDefaultTime';
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
  const { toggleTheme, themeName } = useSiteThemeMode();

  const history = useHistory();

  const { triggerUserGuide } = useActions();
  const { hkubeSystemVersion } = useSelector(selectors.connection);

  const onGuideClick = useCallback(() => {
    triggerUserGuide();
    history.push('/jobs');
  }, [history, triggerUserGuide]);

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
        <Icons.Hover
          type={<GlobalOutlined title="hkube Site" />}
          onClick={openUrl(appInfo.websiteUrl)}
        />
        <TextLink onClick={openUrl(appInfo.websiteUrl)}>Hkube Site</TextLink>
      </FlexBox.Auto>

      <FlexBox.Auto>
        <DividerStyle />
      </FlexBox.Auto>

      <FlexBox.Auto>
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
        <TextLink onClick={toggleTheme}>Mode Theme</TextLink>
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
