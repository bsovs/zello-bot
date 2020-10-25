import React, { Component } from "react";
import * as $ from "jquery";
import { Capacitor } from '@capacitor/core';
import { Link } from "react-router-dom";
import { Button, Spinner, Form, Input } from 'react-bootstrap';
import {isMobile} from 'react-device-detect';

import logo from './Styles/logo.svg';
import './Styles/App.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import SwipeableViews from 'react-swipeable-views';

import Card from './Card';
import ThemeButton from './ThemeButton';
import SocketConnection from './SocketConnection';
import { http } from './httpFactory';
import { socket } from './Config/config';
import CodeEditorV2 from './CodeEditorV2';
import Bet from './Bet/Bet';

class BetParent extends Component {

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
			socketConnected: (this.state.isWeb && this.state.socketConnected===null) ? false : true
		});
		
	};

	//button functions
	home = () => {
		this.setState({

		});
	}
	joinRoom = (event) => {
		event.preventDefault();
		this.setState({
	
		});
	}

	render(){

    const { } = this.state;

    return(
		<div className="App noselect">
			<header>
				<span>
					<SocketConnection
						isWeb={this.state.isWeb}
						socketConnected={this.state.socketConnected}
						setSocketConnected={
							(socketConnected) => {
								return new Promise((resolve, reject) => { 
									this.setState({socketConnected}, resolve()) 
								});
							}
						}
					/>
				</span>
				<React.Fragment>
					<ThemeButton 
						isDark={this.state.isDark}
						setIsDark={(isDark)=>this.setState({isDark})}
					/>
				</React.Fragment>
			</header>
			<main>
				
				<h1>Zello Bets</h1>

				<Bet />

			</main>
			<footer>
				<p>
					Bank of Zello co.
				</p>
			</footer>
      </div>
    );}
}
export default BetParent;