import React from 'react';
import { BondeSessionProvider, useSession } from 'bonde-core-tools';
import { Redirect, Route, Switch } from "react-router";
import { Router, useLocation } from "react-router-dom";
import { createBrowserHistory } from 'history';
import { Loading } from 'bonde-components';
import LoginForm from './LoginForm';

const history = createBrowserHistory();

const RegisterForm = () => (
  <div>
    <h3>Register Form</h3>
  </div>
)

const config = {
  crossStorageUrl: process.env.REACT_APP_DOMAIN_CROSS_STORAGE || 'http://cross-storage.bonde.devel',
  graphqlApiUrl: process.env.REACT_APP_HASURA_API_URL || 'https://api-graphql.staging.bonde.org/v1/graphql'
}

const TextLoading = ({ fetching }: any) => 
  <Loading
    fullsize
    message={fetching === 'signing' ? 'Carregando sessão...' : undefined}
  />
;

const AuthRouting = () => {
  const { isLogged } = useSession();
  const location = useLocation();

  if (isLogged && (location.pathname === '/' || location.pathname === '/auth/login')) {
    window.location.href = 'http://app.bonde.devel:1234/'
  };

  return (
    <Switch>
      <Route path='/'>
        <Route exact path='/auth/login'>
          <LoginForm />
        </Route>
        <Route exact path='/auth/register'>
          <RegisterForm />
        </Route>
        {!isLogged && location.pathname === '/' && <Redirect to='/auth/login' />}
      </Route>
    </Switch>
  );
};


function App() {
  return (
    <BondeSessionProvider loading={TextLoading} config={config} fetchData={false}>
      <Router history={history}>
        <AuthRouting />
      </Router>
    </BondeSessionProvider>
  );
}

export default App;
