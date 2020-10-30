import React, { Component } from "react";

import {http} from "../httpFactory";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { Button, Spinner, Form, Input } from 'react-bootstrap';

import BetForm from './BetForm';

class LolBets extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	async componentDidMount() {
		
	}
	
	setBet = (summoner, wager, isWin) => {
		return http.setBet(summoner, wager, isWin).then(summoner=>this.setState({summoner})).catch(err=>err);
	};
	
	render() {
		const { } = this.props;
		
		console.log(this.props.match.params);
		
		return (
			<React.Fragment>
			
			{this.state.summoner
				?(<React.Fragment>
					<h3> Bet Confirmed </h3>
					<table id="claimTable" className="text" style={{width: '100%', alignItems: 'center'}}>
						<tr>Bet Time: { this.state.summoner.betSpecs.bet_time }</tr>
						<tr>Wager: { this.state.summoner.betSpecs.wager } z-bucks</tr>
						<tr>Win/Loss: { this.state.summoner.betSpecs.is_win ? 'Win' : 'Loss' }</tr>
						<tr>Summoner Name: { this.state.summoner.name }</tr>
						<tr>Summoner Level: { this.state.summoner.summonerLevel }</tr>
						<tr>
							<Button className="btn-border" variant="primary" onClick={()=>this.setState({summoner: null})}>
								New Bet
							</Button>
						</tr>
					</table>
				</React.Fragment>)
				:(
					<BetForm setBet={this.setBet} bet={this.props.match.params} />
				)
			}
			</React.Fragment>
		);
	}
}
export default LolBets;