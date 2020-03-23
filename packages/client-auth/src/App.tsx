import React from 'react';
import { BondeSessionProvider } from 'bonde-core-tools';
import { Router, Route, Redirect } from "react-router-dom";
import { createBrowserHistory } from 'history';
import { Loading } from 'bonde-components';
import SessionRedirect from './components/SessionRedirect';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';

const history = createBrowserHistory();

const config = {
  crossStorageUrl: process.env.REACT_APP_DOMAIN_CROSS_STORAGE || 'http://cross-storage.bonde.devel',
  graphqlApiUrl: process.env.REACT_APP_HASURA_API_URL || 'https://api-graphql.staging.bonde.org/v1/graphql'
};

interface TextLoadingProps {
  fetching: 'session' | 'redirect'
};

const TextLoading = ({ fetching }: TextLoadingProps) => {
  const messages = {
    session: 'Carregando sessão...',
    redirect: 'Redirecionando app...'
  };

  return (
    <Loading
      fullsize
      message={messages[fetching]}
    />
  )
};

const App = () => {
  const appUrl = process.env.REACT_APP_ADMIN_URL || 'http://app.bonde.devel:8181';

  return (
    <BondeSessionProvider loading={TextLoading} config={config}>
      <Router history={history}>
        <SessionRedirect loading={TextLoading} paths={['/auth/login']} to={appUrl}>
          <Route exact path='/'>
            <Redirect to='/auth/login' />
          </Route>
          <Route exact path='/auth/login'>
            <LoginForm to={appUrl} />
          </Route>
          <Route exact path='/auth/register'>
            <RegisterForm />
          </Route>
        </SessionRedirect>
      </Router>
    </BondeSessionProvider>
  );
};

export default App;
