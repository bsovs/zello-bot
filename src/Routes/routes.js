import React from 'react';
import {Switch, Route} from 'react-router-dom';

import App from '../App';
import Login from '../Login';
import BetParent from '../BetParent';
import ItemsParent from "../ItemsParent";

const Routes = () => {
    return (
        <Switch>
            <Route exact path='/' component={App}></Route>
            <Route path='/login' component={Login}></Route>
            <Route path='/bets' component={BetParent}></Route>
            <Route path='/items' component={ItemsParent}></Route>
        </Switch>
    );
}
export default Routes;
