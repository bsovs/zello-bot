import React, { Component } from "react";
import update from 'immutability-helper';

import {http} from "../httpFactory";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { Button, Spinner, Form, Input } from 'react-bootstrap';


class MyBets extends Component {
	constructor(props) {
		super(props);
		this.state = {bets: []};
	}
	async componentDidMount() {
		this.getBets();
	}
	
	getBets = () => {
		http.getBets().then(bets=>this.setState({bets})).catch(err=>err);
	};
	
	checkBet = (betId) => {
		http.checkBet(betId).then(res=>{
			const betIndex = this.state.bets.findIndex(bet => bet && bet.bet_id == betId);
			if (betIndex === -1){
					console.log('error'); //error
			}else{
				this.setState({
					bets: [
						...this.state.bets.slice(0,betIndex),
						Object.assign({}, this.state.bets[betIndex], {disabled: 'disabled'}, 
							res.error
								?{message: res.error}
								:{message: res.winnings}
							),
						...this.state.bets.slice(betIndex+1)
					]
				});
			}
			console.log(this.state.bets[betIndex], res);
			
		}).catch(err=>console.log(err));
	}
	
	render() {
		const { username } = this.props;
		const { bets } = this.state;
		
		let betRenderer = bets.map(bet => (
			<tr key={bet.bet_id}>
				<td>{bet.bet_specs.lol_name}</td>
				<td>{bet.bet_specs.wager}</td>
				<td>{bet.bet_specs.is_win?'W':'L'}</td>
				<td>
				{bet.claimed 
					?(<Button className="btn-border" variant="secondary" disabled="disabled">
						Claimed
					</Button>)
					:(<Button variant={this.state.isDark?"light":"dark"} onClick={()=>this.checkBet(`${bet.bet_id}`)} disabled={bet.disabled}>
						{bet.message ? bet.message : 'Check Status'}
					</Button>)
				}
				</td>
			</tr>)
		);

		return (
			<React.Fragment>
				<table id="claimTable" className="text" style={{width: '100%', alignItems: 'center'}}>
					<label htmlFor="claimTable" className="text">{username && username+"'s Bets"}</label>
					<tr>
						<th>Summoner</th>
						<th>Wager</th>
						<th>Win/Loss</th>
						<th>Status</th>
					</tr>
					
					{betRenderer}
				</table>
			</React.Fragment>
		);
	}
}
export default MyBets;