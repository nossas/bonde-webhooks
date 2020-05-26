import { useEffect, useState } from 'react';
import gql from 'graphql-tag';
import { useMutation } from 'bonde-core-tools';
import { useHistory, useLocation } from 'react-router-dom';

const registerVerifyMutation = gql`
  mutation RegisterVerify ($code: String!, $email: String!) {
    register_verify(code: $code, email: $email) {
      code
      email
      isNewUser
    }
  }
`

export type RegisterVerify = {
  data?: {
    register_verify: {
      code: string;
      email: string;
      isNewUser: boolean;
    }
  }
}

const Verify = ({ children }: any) => {
  const [success, setSuccess] = useState(false)
  const [errors, setErrors] = useState(undefined);
  
  const [verify] = useMutation(registerVerifyMutation)
  const location = useLocation();
  const history = useHistory();
  
  useEffect(() => {
    // Get variables on URL
    const params = new URLSearchParams(location.search);
    const variables = {
      code: params.get('code'),
      email: params.get('email')
    };

    verify({ variables })
      .then(({ data }: RegisterVerify) => {
        if (data && !data.register_verify.isNewUser) {
          history.push('/login');
        }
        setSuccess(true);
      })
      .catch((err: any) => {
        setErrors(err.message);
      });
  }, [verify, history, location.search]);

  // This code is a first check to render
  if (errors) return `${errors}`;
  
  if (!success) return 'Loading...';
  
  return children;
}

export default Verify;