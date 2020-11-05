import React, { Component } from "react";
import * as $ from "jquery";
import { Capacitor } from '@capacitor/core';
import { Link } from "react-router-dom";
import { Navbar, Nav } from 'react-bootstrap';
import { Switch, Route } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import './Styles/App.css';

import ThemeButton from './ThemeButton';
import SocketConnection from './SocketConnection';
import { http } from './httpFactory';
import LolBets from './Bet/LolBets';
import MyBets from './Bet/MyBets';
import BetsHome from './Bet/BetsHome';
import RouletteParent from "./Bet/RouletteParent";
import CaseOpeningParent from "./Items/CaseOpeningParent";

class ItemsParent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isDark: false,
            isWeb: Capacitor.platform==='web',
            socketConnected: true
        }
    }

    componentDidMount() {
        this.setState({
            socketConnected: (!(this.state.isWeb && this.state.socketConnected === null))
        });

        http.getProfile()
            .then(profile=>this.setState({username: profile.username}))
            .catch(error => console.log(error));

    };

    render(){

        return(
            <div className="App noselect">
                <header>
                    <SocketConnection
                        className="alert"
                        isWeb={this.state.isWeb}
                        isDark={this.state.isDark}
                        socketConnected={this.state.socketConnected}
                        setSocketConnected={
                            (socketConnected) => {
                                return new Promise((resolve, reject) => {
                                    this.setState({socketConnected}, resolve())
                                });
                            }
                        }
                    />

                    <Navbar bg={this.state.isDark?"dark":"light"} variant={this.state.isDark?"dark":"light"}>
                        <Navbar.Brand><Link to="/">Home</Link></Navbar.Brand>
                        <Nav className="mr-auto">
                            <Nav.Link>
                                <Link to="/items">
                                    OPEN CASES
                                </Link>
                            </Nav.Link>
                        </Nav>
                        <ThemeButton
                            isDark={this.state.isDark}
                            setIsDark={(isDark)=>this.setState({isDark})}
                        />
                    </Navbar>

                </header>
                <main>

                    <Switch>
                        <Route path='/items'><CaseOpeningParent isDark={this.state.isDark} /></Route>
                    </Switch>

                </main>
                <footer>

                </footer>
            </div>
        );}
}
export default ItemsParent;
