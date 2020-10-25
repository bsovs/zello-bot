import React from 'react';
import { Switch, Route } from 'react-router-dom';

import App from '../App';
import Login from '../Login';
import BetParent from '../BetParent';

const Routes = () => {
  return (
    <Switch> {/* The Switch decides which component to show based on the current URL.*/}
      <Route exact path='/' component={App}></Route>
	  <Route exact path='/login' component={Login}></Route>
	  <Route exact path='/lol-bets' component={BetParent}></Route>
    </Switch>
  );
}
export default Routes;
