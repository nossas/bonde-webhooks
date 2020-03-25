import React from 'react';
import styled from 'styled-components';
import { Header } from 'bonde-components';

const BaseStyled = styled.div`
  display: flex;
  flex-direction: row;
  height: 100vh;
  background-color: #fff;
  
  @media only screen and (max-width: 768px) {
    flex-direction: column;
  }
`;

interface WrapperStyledProps {
  hide?: 'mobile' | 'desktop';
};

const WrapperStyled = styled.div<WrapperStyledProps>`
  margin: auto 0;
  padding: 0 10%;

  @media only screen and (min-width: 768px) {
    width: 50%;
  }

  @media only screen and (max-width: 768px) {
    ${props => props.hide === 'mobile' && `
      display: none;
    `}
  }
`

const BaseLayout = ({ children }: any) => (
  <BaseStyled>
    <WrapperStyled hide='mobile'>
      <Header.h2 color='#fff'>Quer mobilizar pessoas por uma causa? Cola aí, pode entrar. O BONDE te leva lá.</Header.h2>
    </WrapperStyled>
    <WrapperStyled>
      {children}
    </WrapperStyled>
  </BaseStyled>
);

export default BaseLayout;