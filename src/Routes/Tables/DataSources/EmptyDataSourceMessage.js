import React from 'react';
import styled from 'styled-components';
import { COLOR } from 'styles/colors';

const Message = styled.p`
  text-align: center;
  margin: 0 auto;
`;

const Header = styled.h4`
  font-weight: bold;
  color: ${COLOR.red};
  text-transform: capitalize;
`;

export default () => (
  <Message>
    <Header>empty dataSource</Header>
    double click to upload new files
  </Message>
);
