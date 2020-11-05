import React, { Component } from "react";
import * as $ from "jquery";
import { Capacitor } from '@capacitor/core';
import { Link } from "react-router-dom";
import { Button, Spinner, Form, Input, Navbar, Nav } from 'react-bootstrap';
import {isMobile} from 'react-device-detect';
import { Switch, Route } from 'react-router-dom';
import { useHistory } from 'react-router'

import 'bootstrap/dist/css/bootstrap.min.css';
import logo from './Styles/logo.svg';
import './Styles/App.css';
import SwipeableViews from 'react-swipeable-views';

import Card from './Card';
import ThemeButton from './ThemeButton';
import SocketConnection from './SocketConnection';
import { http } from './httpFactory';
import { socket } from './Config/config';
import LolBets from './Bet/LolBets';
import MyBets from './Bet/MyBets';
import BetsHome from './Bet/BetsHome';
import RouletteParent from "./Bet/RouletteParent";
import CaseOpeningParent from "./Bet/CaseOpeningParent";

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
		
		http.getProfile()
			.then(profile=>this.setState({username: profile.username}))
			.catch(error => console.log(error));
		
	};
	
	fillBet = (bet) => this.setState({bet});

	render(){

    const { bet } = this.state;

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
							<Link to="/bets">
								BETS
							</Link>
						</Nav.Link>
						<Nav.Link>
							<Link to="/bets/roulette">
								Roulette
							</Link>
						</Nav.Link>
						<Nav.Link>
							<Link to="/bets/cases">
								OPEN CASES
							</Link>
						</Nav.Link>
						<Nav.Link>
							<Link to="/bets/lol-bets">
								LOL BETS
							</Link>
						</Nav.Link>
						<Nav.Link>
							<Link to="/bets/my-bets">
								MY BETS
							</Link>
						</Nav.Link>
					</Nav>
					<ThemeButton 
						isDark={this.state.isDark}
						setIsDark={(isDark)=>this.setState({isDark})}
					/>	
				</Navbar>
				
				<h1>Zello Bets</h1>
				
			</header>
			<main>

				<Switch>
					<Route exact path='/bets'><BetsHome fillBet={this.fillBet} /></Route>
					<Route path='/bets/lol-bets/:summoner?/:wager?/:isWin?' component={LolBets} />
					<Route path='/bets/lol-bets' component={LolBets} />
					<Route path='/bets/my-bets'><MyBets username={this.state.username} isDark={this.state.isDark} /></Route>
					<Route path='/bets/roulette'><RouletteParent isDark={this.state.isDark} /></Route>
					<Route path='/bets/cases'><CaseOpeningParent isDark={this.state.isDark} /></Route>
				</Switch>

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
