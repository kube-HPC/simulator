import styled from 'styled-components';
import { ifProp } from 'styled-tools';

const Display = styled.div`
  display: ${ifProp({ isVisible: false }, 'none', 'block')};
  visibility: ${ifProp({ hidden: true }, 'hidden', 'visible')};
`;

export default Display;
