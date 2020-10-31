import React, { Component } from "react";
import * as $ from "jquery";
import { Link } from "react-router-dom";

import {http} from "../httpFactory";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { Button, Spinner, Form, Input } from 'react-bootstrap';



class BetsHome extends Component {
	constructor(props) {
		super(props);
		this.state = {bets: []};
	}
	async componentDidMount() {
		this.getPopularBets();
	}
	
	getPopularBets = () => {
		http.getPopularBets().then(bets=>this.setState({bets})).catch(err=>err);
	};
	
	placeBet = (betId) => {
		const bet = this.state.bets.find(bet => bet && bet.bet_id == betId);
		this.props.fillBet(bet);
	}
	
	render() {
		const { bets } = this.state;
		
		let betRenderer = bets.map(bet => (
			<tr key={bet.bet_id}>
				<td>{bet.bet_specs.lol_name}</td>
				<td>{bet.bet_specs.wager}</td>
				<td>{bet.bet_specs.is_win?'W':'L'}</td>
				<td>
					<Button variant={this.state.isDark?"light":"dark"}>
						<Link to={`/bets/lol-bets/${bet.bet_specs.lol_name}/${bet.bet_specs.wager}/${bet.bet_specs.is_win}`}>
							Place Bet
						</Link>
					</Button>
				</td>
			</tr>)
		);

		return (
			<React.Fragment>
				<table id="claimTable" className="text" style={{width: '100%', alignItems: 'center'}}>
					<label htmlFor="claimTable" className="text">Popular Bets</label>
					<tr>
						<th>Summoner</th>
						<th>Wager</th>
						<th>Win/Loss</th>
					</tr>
					
					{betRenderer}
				</table>
			</React.Fragment>
		);
	}
}
export default BetsHome;