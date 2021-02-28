import React from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import LoginPage from './Pages/Login';
import Home from './Pages/home';

const App: React.FC = () => {
  return (
    <div>
      <HashRouter>
        <Switch>
          <Route path='/' component={Home} exact />
          <Route path='/login' component={LoginPage} exact />
        </Switch>
      </HashRouter>
    </div>
  );
};

export default App;
