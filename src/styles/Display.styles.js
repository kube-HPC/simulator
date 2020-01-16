import styled from 'styled-components';

const Display = styled.div`
  display: ${({ isVisible = true }) => (isVisible ? 'block' : 'none')};
  visibility: ${({ hidden = false }) => (hidden ? 'hidden' : 'visible')};
`;

export default Display;
