import * as React from 'react';
import { Header, Main, Body, Button } from 'bonde-components';
import { useMutation, useSession } from 'bonde-core-tools';
import gql from 'graphql-tag';
import { useLocation } from "react-router-dom";

const LoginMutation = gql`
  mutation authenticate($email: String!, $password: String!){
    authenticate(email: $email, password: $password) {
      valid
      token
    }
  }
`

interface LoginFormProps {
  // Default url redirect when not exists next query params
  to: string;
}

const LoginForm: React.FC<LoginFormProps> = ({ to }) => {
  let email: any, password: any;
  const [authenticate, { data }] = useMutation(LoginMutation);
  const { login } = useSession();
  const { search } = useLocation();

  if (!!data) {
    login(data.authenticate)
      .then(() => {
        // Redirect form after login on session
        const urlParams = new URLSearchParams(search);
        const nextUrl = urlParams.get('next');
        window.location.href = nextUrl ? nextUrl : to;
      });
  }

  return (
    <Main>
      <Body>
        <Header.h2>Login Form</Header.h2>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            const variables = { email: email.value, password: password.value }
            authenticate({ variables })
          }}
        >
          <input ref={n => email = n} type='text' name='email' placeholder='Email' />
          <input ref={n => password = n} type='password' name='password' placeholder='Password' />
          <div>
            <Button type='submit'>Submit</Button>
          </div>
        </form>
      </Body>
    </Main>
  );
}

export default LoginForm;