import { Divider } from 'antd';
import { AutoComplete } from 'components';
import { FlexBox } from 'components/common';
import { USER_GUIDE } from 'const';
import React from 'react';
import styled from 'styled-components';
import { COLOR_LAYOUT } from 'styles';
import ExperimentPicker from './ExperimentPicker.react';
import HelpBar from './HelpBar.react';
import SidebarActions from './SidebarActions.react';
// DO NOT REMOVE! This is important to preload the monaco instance into the global window!!!
import * as monaco from 'monaco-editor'; //eslint-disable-line

const Container = styled(FlexBox)`
  height: 64px;
  padding: 0 50px;
  line-height: 64px;
  background: white;
  border-bottom: 1pt solid ${COLOR_LAYOUT.border};
  padding-left: 10px;
  padding-right: 10px;
`;

const LongDivider = styled(Divider)`
  height: 1.5rem;
`;

const { Item } = FlexBox;

const Grow = styled(Item)`
  flex-grow: 1;
`;
const Basis = styled(Item)`
  flex-basis: 30%;
`;

const Header = () => (
  <Container className={USER_GUIDE.WELCOME}>
    <Item>
      <SidebarActions />
    </Item>
    <Basis>
      <FlexBox>
        <Item>
          <ExperimentPicker />
        </Item>
        <Item>
          <LongDivider type="vertical" />
        </Item>
        <Grow>
          <AutoComplete className={USER_GUIDE.HEADER.AUTO_COMPLETE} />
        </Grow>
      </FlexBox>
    </Basis>
    <Item>
      <HelpBar />
    </Item>
  </Container>
);

export default Header;