import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { Detail, Dashboard, Login } from './pages';

const App = () => (
  <Router>
    <Switch>
      <Route exact path="/">
        <Dashboard />
      </Route>
      <Route path="/login">
        <Login />
      </Route>
      <Route path="/breed/:breedId">
        <Detail />
      </Route>
    </Switch>
  </Router>
);

export default App;
