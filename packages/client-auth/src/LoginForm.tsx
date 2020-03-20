import * as React from 'react'
import { Header, Main, Body, Button } from 'bonde-components'
import gql from 'graphql-tag';
import { useSession, useMutation } from 'bonde-core-tools';

const LoginMutation = gql`
  mutation authenticate($email: String!, $password: String!){
    authenticate(email: $email, password: $password) {
      valid
      token
    }
  }
`

const LoginForm = () => {
  let email: any, password: any;
  const { login } = useSession();
  const [authenticate, { data }] = useMutation(LoginMutation)

  if (!!data) {
    login(data.authenticate)
      .then(() => {
        window.location.href = 'http://app.bonde.devel:1234/';
      });
  };

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
  )
}

export default LoginForm