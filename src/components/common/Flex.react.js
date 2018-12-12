import styled from 'styled-components';

export const FlexRows = styled.div`
  display: flex;
  flex-shrink: 0;
  justify-content: ${(props) => props.justifyContent || 'initial'};
  align-items: ${(props) => props.alignItems || 'initial'};
  flex-direction: column;
`;
export const FlexColumns = styled.div`
  display: flex;
  flex-shrink: 0;
  justify-content: ${(props) => props.justifyContent || 'initial'};
  align-items: ${(props) => props.alignItems || 'initial'};
  flex-direction: row;
`;
export const AutoSize = styled.div`
  flex-grow: 1;
  position: relative;
`;
