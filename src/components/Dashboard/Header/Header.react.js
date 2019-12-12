import React, { useCallback } from 'react';
import styled from 'styled-components';
import { USER_GUIDE, LEFT_SIDEBAR_NAMES } from 'const';
import { FlexBox, Icons } from 'components/common';
import { Tag, Tooltip, Typography, Icon } from 'antd';
import { useLeftSidebar, useConnectionStatus, useActions } from 'hooks';
import { COLOR_LAYOUT } from 'styles';
import { AutoComplete } from 'components';
import ViewType from './ViewType/ViewType.react';

const Container = styled.div`
  height: 64px;
  padding: 0 50px;
  line-height: 64px;
  background: white;
  border-bottom: 1pt solid ${COLOR_LAYOUT.border};
  padding-left: 10px;
  padding-right: 10px;
`;

const DarkText = styled.span`
  color: ${COLOR_LAYOUT.darkBorder};
`;

const HelpBar = styled(FlexBox)`
  > ${Icons.DarkHoverStyle}, ${DarkText} {
    margin-right: 10px;
  }
`;

const openWebsite = () => window.open('http://hkube.io/');
const openGithub = () => window.open('https://github.com/kube-HPC/hkube');
const appVersion = `${process.env.REACT_APP_VERSION}v`;

const Header = () => {
  const {
    value: [tableValue, setTableValue],
    isCollapsed: [leftIsCollapsed, setLeftIsCollapsed],
  } = useLeftSidebar();

  const { triggerUserGuide } = useActions();

  const onGuideClick = useCallback(() => {
    triggerUserGuide();
    setTableValue(LEFT_SIDEBAR_NAMES.JOBS);
    setLeftIsCollapsed(true);
  }, [setLeftIsCollapsed, setTableValue, triggerUserGuide]);

  const triggerLeftVisible = useCallback(() => setLeftIsCollapsed(prev => !prev), [
    setLeftIsCollapsed,
  ]);

  const { isSocketConnected } = useConnectionStatus();

  return (
    <Container className={USER_GUIDE.WELCOME}>
      <FlexBox>
        <FlexBox>
          <FlexBox.Item>
            <Icons.Hover
              type={leftIsCollapsed ? 'menu-fold' : 'menu-unfold'}
              onClick={triggerLeftVisible}
            />
          </FlexBox.Item>
          <FlexBox.Item>
            <ViewType />
          </FlexBox.Item>
        </FlexBox>
        <AutoComplete table={tableValue} className={USER_GUIDE.HEADER.AUTO_COMPLETE} />
        <HelpBar className={USER_GUIDE.HEADER.SOCIALS}>
          {!isSocketConnected && (
            <Tag color="orange">
              <Tooltip title="Reconnecting to Socket...">
                <FlexBox>
                  <FlexBox.Item>
                    <Typography.Text>Offline Mode</Typography.Text>
                  </FlexBox.Item>
                  <FlexBox.Item>
                    <Icon type="disconnect" />
                  </FlexBox.Item>
                </FlexBox>
              </Tooltip>
            </Tag>
          )}
          <Icons.Hover type="global" onClick={openWebsite} />
          <Icons.Hover type="github" onClick={openGithub} />
          <Icons.Hover type="question-circle" onClick={onGuideClick} />
          <DarkText>{appVersion}</DarkText>
        </HelpBar>
      </FlexBox>
    </Container>
  );
};

export default Header;
