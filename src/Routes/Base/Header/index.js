import React from 'react';
import { Route, Routes } from 'react-router-dom';
import styled from 'styled-components';
import { FlexBox } from 'components/common';
import { USER_GUIDE } from 'const';
import { COLOR_LAYOUT } from 'styles';
import NewButtonSelect from './NewButtonSelect';

import HelpBar from './HelpBar.react';
import TagsFiltersViews from './TagsFiltersViews';

import ViewType from './ViewType.react';

// DO NOT REMOVE! This is important to preload the monaco instance into the global window!!!
// eslint-disable-next-line
import * as monaco from 'monaco-editor';

const Container = styled(FlexBox)`
  padding: 1em 2ch;

  border-bottom: 1px solid ${COLOR_LAYOUT.border};
`;

const ButtonsContainer = styled(FlexBox.Auto)`
  padding: 0 1ch;

  div:empty {
    padding-left: 0 !important;
    padding-right: 0 !important;
  }
`;

const Header = () => (
  <Container className={USER_GUIDE.WELCOME}>
    <ButtonsContainer>
      <NewButtonSelect />

      <Routes>
        <Route path="/jobs" element={<ViewType />} />
        <Route path="/jobs" element={<TagsFiltersViews sectionName="jobs" />} />

        <Route
          path="/pipelines"
          element={<TagsFiltersViews sectionName="pipelines" />}
        />

        <Route
          path="/algorithms"
          element={<TagsFiltersViews sectionName="algorithms" />}
        />
      </Routes>
    </ButtonsContainer>

    <HelpBar />
  </Container>
);

export default Header;
