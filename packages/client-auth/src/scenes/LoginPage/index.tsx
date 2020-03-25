import * as React from 'react';
import { useLocation } from 'react-router-dom';
import { Header } from 'bonde-components';
import { useMutation, useSession } from 'bonde-core-tools';
import gql from 'graphql-tag';
import LoginForm from './Form';

const LoginMutation = gql`
  mutation authenticate($email: String!, $password: String!){
    authenticate(email: $email, password: $password) {
      valid
      token
    }
  }
`

interface LoginPageProps {
  // Default url redirect when not exists next query params
  to: string;
}

const LoginPage: React.FC<LoginPageProps> = ({ to }) => {
  const { login } = useSession();
  const { search } = useLocation();
  const [authenticate] = useMutation(LoginMutation);

  return (
    <>
      <Header.h1>O Bonde tá na área! Chega mais.</Header.h1>
      <LoginForm
        onSubmit={async (values: any) => {
          try {
            const { data } = await authenticate({ variables: values });
            console.log('LoginSuccessfully', data);
            login(data.authenticate)
              .then(() => {
                // Redirect form after login on session
                const urlParams = new URLSearchParams(search);
                const nextUrl = urlParams.get('next');
                window.location.href = nextUrl ? nextUrl : to;
              });
          } catch (err) {
            if (err.graphQLErrors && err.graphQLErrors.filter((e: any) => e.message === 'email_password_dismatch').length > 0) {
              return { email: 'Ops! Email ou senha incorretos'};
            }
            console.log('LoginFailed', err);
          }
        }}
      />
    </>
  );
}

export default LoginPage;