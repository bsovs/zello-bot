import React from 'react';
import { Switch, Route } from 'react-router-dom';

import App from '../App';

const Routes = () => {
  return (
    <Switch> {/* The Switch decides which component to show based on the current URL.*/}
      <Route exact path='/' component={App}></Route>
    </Switch>
  );
}
export default Routes;
