import React from 'react';
import styled from 'styled-components';
import { Bonde, Header } from 'bonde-components';
import BackgroundImage from './bg@2x.png';

const BaseStyled = styled.div`
  display: flex;
  flex-direction: row;
  height: 100vh;
  background-color: #fff;
  
  @media only screen and (max-width: 768px) {
    flex-direction: column;
    justify-content: center;
  }
`;

interface WrapperStyledProps {
  background?: string;
  hide?: 'mobile' | 'desktop';
};

const WrapperStyled = styled.div<WrapperStyledProps>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 180px;

  ${props => props.background && `
    background: url('${props.background}') no-repeat;
    background-position: center center;
    background-size: cover;
  `}

  ${Header.h2} {
    color: #fff;
  }

  @media only screen and (min-width: 768px) {
    width: 50%;
  }

  @media only screen and (max-width: 768px) {
    padding: 0 20px;

    ${props => props.hide === 'mobile' && `
      display: none;
    `}
  }
`

const BaseLayout = ({ children }: any) => (
  <BaseStyled>
    <WrapperStyled hide='mobile' background={BackgroundImage}>
      <Bonde large />
      <Header.h2>Quer mobilizar pessoas por uma causa? Cola aí, pode entrar. O BONDE te leva lá.</Header.h2>
    </WrapperStyled>
    <WrapperStyled>
      {children}
    </WrapperStyled>
  </BaseStyled>
);

export default BaseLayout;