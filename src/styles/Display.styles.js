import styled from 'styled-components';

const Display = styled.div`
  display: ${({ isVisible }) => (isVisible ? 'block' : 'none')};
`;

export default Display;
