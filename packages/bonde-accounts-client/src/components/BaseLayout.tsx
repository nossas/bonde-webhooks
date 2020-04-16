import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Bonde, Header } from 'bonde-components';
import BackgroundImage from './bg@2x.png';
import * as Flag from './Flag';

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

const LanguageTool = styled.div`
  display: flex;
  flex-direction: row;
  position: absolute;
  top: 15px;
  right: 15px;

  button {
    padding: 0;
    background: none;
    outline: none;
    border: none;
    cursor: pointer;

    margin-left: 5px;
    opacity: 0.3;

    &.active {
      opacity: 1;
    }
  }

  @media only screen and (max-width: 768px) {
    display: none;
  }
`

interface WrapperStyledProps {
  background?: string;
  hide?: 'mobile' | 'desktop';
};

const WrapperStyled = styled.div<WrapperStyledProps>`
  position: relative;
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

const languages = [
  {
    locale: 'pt-BR',
    flag: Flag.Portuguese,
  },
  {
    locale: 'en',
    flag: Flag.English,
  },
  {
    locale: 'es',
    flag: Flag.Spanish,
  },
]

const BaseLayout = ({ children }: any) => {
  const { i18n } = useTranslation();
  console.log('i18n', i18n)

  const changeLanguage = (lng: 'en' | 'es' | 'pt-BR') => {
    i18n.changeLanguage(lng);
  };

  return (
    <BaseStyled>
      <WrapperStyled hide='mobile' background={BackgroundImage}>
        <Bonde large />
        <Header.h2>Quer mobilizar pessoas por uma causa? Cola aí, pode entrar. O BONDE te leva lá.</Header.h2>
      </WrapperStyled>
      <WrapperStyled>
        {children}
        <LanguageTool>
          {languages.map(({ flag: Flag, locale }, index) => (
            <button
              key={`language-button-${locale}`}
              className={locale === i18n.language ? 'active' : null}
              onClick={() => changeLanguage(locale)}
              title={locale}
            >
              <Flag />
            </button>
          ))}
        </LanguageTool>
      </WrapperStyled>
    </BaseStyled>
  )
};

export default BaseLayout;