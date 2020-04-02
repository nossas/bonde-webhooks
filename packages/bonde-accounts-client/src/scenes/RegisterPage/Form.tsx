import React, { useState } from 'react';
import gql from 'graphql-tag'
import styled from 'styled-components';
import { useLocation, Link } from 'react-router-dom';
import { useSession, useMutation } from 'bonde-core-tools';
import { Button, ConnectedForm, InputField, Header, Link as LinkStyled, Hint } from 'bonde-components';
import { composeValidators, required, min } from '../../validations';
import Container from '../../components/Container';

const registerUserMutation = gql`
  mutation Register ($input: RegisterInput!) {
    register(input: $input) {
      first_name
      token
    }
  }
`

const Styles = styled.div`
  & > span {
    display: block;
    margin-bottom: 15px;
    text-align: right;
  }
`

const RegisterForm = ({ to }: any) => {
  const { search } = useLocation();
  const { login } = useSession();
  const [error, setError] = useState(undefined);
  const [registerUser] = useMutation(registerUserMutation);

  const urlParams = new URLSearchParams(search);
  const code = urlParams.get('code');
  const email = urlParams.get('email');

  return (
    <>
      <Header.h1>O Bonde tá na área! Chega mais.</Header.h1>
      <ConnectedForm
        initialValues={{ input: { email, invitation_code: code } }}
        onSubmit={async (values: any) => {
          try {
            const { data } = await registerUser({ variables: values })
            login(data.register)
              .then(() => {
                window.location.href = to;
              })
          } catch (err) {
            if (err && err.message && err.message.indexOf('invalid_invitation_code') !== -1) {
              setError('Seu convite não é válido, peça um novo convite para a comunidade')
              console.log('err', err)
            }
            console.log('RegisterFailed', err)
          }
        }}
      >
        {({ submitting }) => (
          <Styles>
            {error && <Hint color='error'>{error}</Hint>}
            <Hint color='error'>Seu convite não é válido, peça um novo convite para a comunidade</Hint>
            <Container column>
              <InputField
                name='input.first_name'
                label='Nome'
                placeholder='Seu nome'
                validate={required('Informe seu nome')}
              />
              <InputField
                name='input.last_name'
                label='Sobrenome'
                placeholder='Seu sobrenome'
                onBlur={required('Informe seu sobrenome')}
              />
            </Container>
            <InputField
              disabled
              name='input.email'
              label='Email'
              placeholder='Seu email'
            />
            <InputField
              type='password'
              name='input.password'
              label='Senha'
              placeholder='Sua senha'
              validate={composeValidators(
                required('Informe uma senha'),
                min(6, 'Minimo 6 catacteres')
              )}
            />
            <Container reverse>
              <LinkStyled to='/auth/login' component={Link}>Já tenho conta</LinkStyled>
              <Button type='submit' disabled={submitting}>Partiu</Button>
            </Container>
          </Styles>
        )}
      </ConnectedForm>
    </>
  );
};

export default RegisterForm;
