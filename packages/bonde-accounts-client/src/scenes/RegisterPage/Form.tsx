import React from 'react';
import gql from 'graphql-tag'
import { useLocation, Link } from 'react-router-dom';
import { Form as FinalForm } from 'react-final-form';
import { useSession, useMutation } from 'bonde-core-tools';
import { Button, Form, InputField, Header, Link as LinkStyled } from 'bonde-components';
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

const RegisterForm = ({ to }: any) => {
  const { search } = useLocation();
  const { login } = useSession();
  const [registerUser] = useMutation(registerUserMutation);

  const urlParams = new URLSearchParams(search);
  const code = urlParams.get('code');
  const email = urlParams.get('email');

  return (
    <>
      <Header.h1>O Bonde tá na área! Chega mais.</Header.h1>
      <FinalForm
        initialValues={{ input: { email, invitation_code: code } }}
        onSubmit={async (values: any) => {
          console.log('values', values);
          try {
            const { data } = await registerUser({ variables: values })
            
            login(data.register)
              .then(() => {
                window.location.href = to;
              })
          } catch (err) {
            console.log('RegisterFailed', err)
          }
        }}
      >
        {({ handleSubmit, submitting }) => (
          <Form onSubmit={handleSubmit}>
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
          </Form>
        )}
      </FinalForm>
    </>
  );
};

export default RegisterForm;
