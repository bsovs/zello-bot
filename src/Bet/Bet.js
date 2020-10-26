import React, { Component } from "react";

import {http} from "../httpFactory";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { Button, Spinner, Form, Input } from 'react-bootstrap';

import BetForm from './BetForm';

class Bet extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	async componentDidMount() {
		//this.bet('sohozang');
	}
	
	bet = (summoner, wager, isWin) => {
		return http.setBet(summoner, wager, isWin).then(summoner=>this.setState({summoner})).catch(err=>err);
	};
	
	render() {
		const { } = this.props;

		return (
			<React.Fragment>
			
			{this.state.summoner
				?(<React.Fragment>
					<p> Bet Confirmed </p>
					<ul>
						<li>Bet Time: { this.state.summoner.betSpecs.bet_time }</li>
						<li>Wager: { this.state.summoner.betSpecs.wager } z-bucks</li>
						<li>Win/Loss: { this.state.summoner.betSpecs.is_win ? 'Win' : 'Loss' }</li>
						<li>Summoner Name: { this.state.summoner.name }</li>
						<li>Summoner Level: { this.state.summoner.summonerLevel }</li>
					</ul>
					<Button className="btn-border" variant="primary" onClick={()=>this.setState({summoner: null})}>
						New Bet
					</Button>
				</React.Fragment>)
				:(
					<BetForm bet={this.bet} />
				)
			}
			</React.Fragment>
		);
	}
}
export default Bet;