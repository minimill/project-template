import { createGlobalStyle } from 'styled-components';
import { normalize } from 'styled-normalize';

const GlobalStyle = createGlobalStyle`
  ${normalize}

  /* You can continue writing global styles here */
  body {
    padding: 0;
    background-color: ${(props) => props.theme.colors.white};
  }

  h1, h2, h3, h4, h5, h6, p {
    font-family: 'Roboto', sans-serif;
    color: ${(props) => props.theme.colors.black};
  }
`;

export default GlobalStyle;
