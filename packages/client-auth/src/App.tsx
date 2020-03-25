import React from 'react';
import { BondeSessionProvider } from 'bonde-core-tools';
import { Router, Route, Redirect } from "react-router-dom";
import { createBrowserHistory } from 'history';
import BaseLayout from './components/BaseLayout';
// import RegisterForm from './components/RegisterForm';
import SessionRedirect from './components/SessionRedirect';
import TextLoading from './components/TextLoading';

import LoginPage from './scenes/LoginPage';
import RegisterPage from './scenes/RegisterPage';

const history = createBrowserHistory();

const config = {
  crossStorageUrl: process.env.REACT_APP_DOMAIN_CROSS_STORAGE || 'http://cross-storage.bonde.devel',
  graphqlApiUrl: process.env.REACT_APP_HASURA_API_URL || 'https://api-graphql.staging.bonde.org/v1/graphql'
};

const App = () => {
  const appUrl = process.env.REACT_APP_ADMIN_URL || 'http://app.bonde.devel:8181';

  return (
    <BondeSessionProvider loading={TextLoading} config={config}>
      <Router history={history}>
        <SessionRedirect loading={TextLoading} paths={['/auth/login']} to={appUrl}>
          <BaseLayout>
            <Route exact path='/'>
              <Redirect to='/auth/login' />
            </Route>
            <Route exact path='/auth/login'>
              <LoginPage to={appUrl} />
            </Route>
            <Route exact path='/auth/register'>
              <RegisterPage to={appUrl} />
            </Route>
          </BaseLayout>
        </SessionRedirect>
      </Router>
    </BondeSessionProvider>
  );
};

export default App;
