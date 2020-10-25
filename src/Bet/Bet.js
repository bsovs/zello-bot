import React, { Component } from "react";

import {http} from "../httpFactory";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

import BetForm from './BetForm';

class Bet extends Component {
	constructor(props) {
		super(props);
		this.state = {summoner: { betSpecs:{} }};
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
			
				<BetForm bet={this.bet} />
				
				<ul>
					<li>Bet Time: { this.state.summoner.betSpecs.bet_time }</li>
					<li>Win/Loss: { this.state.summoner.betSpecs.is_win ? 'Win' : 'Loss' }</li>
					<li>Summoner: { this.state.summoner.name }</li>
					<li>Level: { this.state.summoner.summonerLevel }</li>
				</ul>
			</React.Fragment>
		);
	}
}
export default Bet;