import styled from 'styled-components';

export const ButtonGroup = styled.div`
  display: flex;
`;

export const StyledButton = styled.a`
  background: transparent;
  border-radius: 3px;
  border: 2px solid ${(props) => props.theme.colors.primary};
  color: ${(props) => props.theme.colors.primary};
  padding: 0.25em 1em;
  cursor: pointer;
  user-select: none;
  text-decoration: none;

  ${ButtonGroup} & {
    margin-right: 1rem;

    &:last-child {
      margin-right: 0;
    }
  }
`;
