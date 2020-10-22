import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { BreedDetails } from './pages/BreedDetails';
import { Dashboard } from './pages/Dashboard';
import { Login } from './pages/Login';

const App = () => (
  <Router>
    <div>
      <Switch>
        <Route exact path="/">
          <Dashboard />
        </Route>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/breed/:breedId">
          <BreedDetails />
        </Route>
      </Switch>
    </div>
  </Router>
);

export default App;
