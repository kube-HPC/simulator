import { AutoComplete } from 'components';
import { FlexBox } from 'components/common';
import { USER_GUIDE } from 'const';
import { useLeftSidebar } from 'hooks';
import React from 'react';
import styled from 'styled-components';
import { COLOR_LAYOUT } from 'styles';
import ExperimentPicker from './ExperimentPicker.react';
import HelpBar from './HelpBar.react';
import SidebarActions from './SidebarActions.react';

const Container = styled(FlexBox.Auto)`
  height: 64px;
  padding: 0 50px;
  line-height: 64px;
  background: white;
  border-bottom: 1pt solid ${COLOR_LAYOUT.border};
  padding-left: 10px;
  padding-right: 10px;
`;

const Header = () => {
  const {
    value: [tableValue],
  } = useLeftSidebar();

  return (
    <Container className={USER_GUIDE.WELCOME}>
      <SidebarActions />
      <FlexBox.Auto>
        <ExperimentPicker />
        <AutoComplete table={tableValue} className={USER_GUIDE.HEADER.AUTO_COMPLETE} />
      </FlexBox.Auto>
      <HelpBar />
    </Container>
  );
};

export default Header;
