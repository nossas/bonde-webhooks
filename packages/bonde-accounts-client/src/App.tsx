import * as React from 'react';
import { Router, Route, Redirect } from "react-router-dom";
import { I18nextProvider } from 'react-i18next'
import { BondeSessionProvider } from 'bonde-core-tools';
import { createBrowserHistory } from 'history';
import { Loading } from 'bonde-components';
import BaseLayout from './components/BaseLayout';
import SessionRedirect from './components/SessionRedirect';
import TextLoading from './components/TextLoading';
import LoginPage from './scenes/LoginPage';
import RegisterPage from './scenes/RegisterPage';
import ForgetPasswordPage from './scenes/ForgetPasswordPage';
import ResetPasswordPage from './scenes/ResetPasswordPage';
import i18n from './i18n';

const history = createBrowserHistory();

const config = {
  crossStorageUrl: process.env.REACT_APP_DOMAIN_CROSS_STORAGE || 'http://bonde.devel:5003',
  graphqlApiUrl: process.env.REACT_APP_HASURA_API_URL || 'http://api-graphql.bonde.devel/v1/graphql'
};

const LoadingI18n = () => (
  <Loading
    fullsize
    message='Carregando tradução...'
  />
)

const App = React.memo(() => {
  const appUrl = process.env.REACT_APP_ADMIN_URL || 'http://bonde.devel:5001';

  return (
    <BondeSessionProvider loading={TextLoading} config={config}>
      <I18nextProvider i18n={i18n}>
        <Router history={history}>
          <SessionRedirect loading={TextLoading} paths={['/auth/login']} to={appUrl}>
            <BaseLayout>
              <Route exact path='/'>
                <Redirect to='/login' />
              </Route>
              <Route exact path='/login'>
                <LoginPage to={appUrl} />
              </Route>
              <Route exact path='/register'>
                <RegisterPage to={appUrl} />
              </Route>
              <Route exact path='/forget-password'>
                <ForgetPasswordPage />
              </Route>
              <Route exact path='/reset-password'>
                <ResetPasswordPage />
              </Route>
            </BaseLayout>
          </SessionRedirect>
        </Router>
      </I18nextProvider>
    </BondeSessionProvider>
  );
});

export default () => (
  <React.Suspense fallback={<LoadingI18n />}>
    <App />
  </React.Suspense>
);
