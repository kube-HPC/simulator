import { Card } from 'antd';
import template from 'config/template/addPipeline.template';
import React from 'react';
import styled from 'styled-components';
import { stringify } from 'utils/string';
import { SB_SECTIONS } from 'const';
import JsonEditor from './JsonEditor.react';

const StyledCard = styled(Card)`
  width: 45%;
  height: 65vh;
  margin: 0 auto;
`;

export default {
  title: `${SB_SECTIONS.COMMON}|Json Editor`,
};

export const Default = () => <JsonEditor value={stringify(template)} />;
export const InCard = () => (
  <StyledCard>
    <JsonEditor height={'60vh'} value={stringify(template)} />
  </StyledCard>
);
export const Empty = () => <JsonEditor />;
