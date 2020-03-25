import React from 'react';
import {
  Button,
  Form,
  InputField,
  Link as LinkStyled
} from 'bonde-components';
import { Form as FinalForm } from 'react-final-form';
import { Link } from 'react-router-dom';
import Container from '../../components/Container';
import { composeValidators, required, isEmail } from '../../validations';

interface LoginFormProps {
  onSubmit: any;
};

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) =>
  <FinalForm onSubmit={onSubmit}>
    {({ handleSubmit, submitting }) => (
      <Form onSubmit={handleSubmit}>
        <InputField
          name='email'
          label='Email'
          placeholder='seuemail@examplo.com'
          validate={composeValidators(
            required('Inform seu e-mail'),
            isEmail('E-mail inválido')
          )}
        />
        <InputField
          name='password'
          label='Senha'
          placeholder='Sua senha'
          type='password'
          validate={required('Informe sua senha')}
        />
        <Container>
          <LinkStyled component={Link} to='/auth/reset-password'>Esqueci a senha</LinkStyled>
          <Button type='submit' disabled={submitting}>Partiu</Button>
        </Container>
      </Form>
    )}
  </FinalForm>
;

export default LoginForm;