import styled from 'styled-components';
import { COLOR_LAYOUT } from 'styles/colors';

const BottomPosition = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;

  padding: 0 24px;
  border-top: 1px solid ${COLOR_LAYOUT.border};
  width: 100%;
`;

export default BottomPosition;
