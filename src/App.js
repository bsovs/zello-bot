import React, {Component} from "react";
import {Capacitor} from '@capacitor/core';
import {Link} from "react-router-dom";
import {Button, Spinner, Form, Input, Navbar, Nav} from 'react-bootstrap';
import {isMobile} from 'react-device-detect';
import Cookies from 'universal-cookie';

import 'bootstrap/dist/css/bootstrap.min.css';
import './Styles/App.css';
import SwipeableViews from 'react-swipeable-views';

import Card from './Card';
import ThemeButton from './ThemeButton';
import SocketConnection from './SocketConnection';

//Global Vars
const cookies = new Cookies();

class App extends Component {

    constructor(props) {
        super(props);
        let user = cookies.get('user', {doNotParse: true});
        this.state = {
            isDark: false,
            isWeb: Capacitor.platform === 'web',
            socketConnected: true,
            user: user !== '' ? user : null,
        }
    }

    componentDidMount() {
        this.setState({
            socketConnected: !(this.state.isWeb && this.state.socketConnected === null)
        });

    };

    //button functions
    home = () => {
        this.setState({});
    }
    joinRoom = (event) => {
        event.preventDefault();
        this.setState({});
    }

    render() {

        return (
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
                    <Navbar bg={this.state.isDark ? "dark" : "light"} variant={this.state.isDark ? "dark" : "light"}>
                        <Navbar.Brand><Link to="/">Home</Link></Navbar.Brand>
                        <Nav className="mr-auto">
                            {this.state.user
                                ? (<Nav.Link>
                                        <Link to="/bets">
                                            BETS
                                        </Link>
                                    </Nav.Link>
                                )
                                : (<Nav.Link href="/api/discord">
                                        Authorize App
                                    </Nav.Link>
                                )
                            }
                        </Nav>
                        <ThemeButton
                            isDark={this.state.isDark}
                            setIsDark={(isDark) => this.setState({isDark})}
                        />
                    </Navbar>
                </header>
                <main>

                    <h1>Zello Bot</h1>

                    {this.state.user
                        ? (
                            <h1>Such Empty</h1>
                        )
                        : (<a href="/api/discord">
                                Authorize App
                            </a>
                        )
                    }

                </main>
                <footer>
                    <p>
                        Created by Barndo @ ZELLO
                    </p>
                </footer>
            </div>
        );
    }
}

export default App;

/*
				<SwipeableViews enableMouseEvents>
					<Card value="hello world card!"/>
				</SwipeableViews>
				
				<CodeEditorV2 
					isDark={this.state.isDark}
				/>
				
				*/
