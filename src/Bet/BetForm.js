import React, { Component } from "react";

import { Button, Spinner, Form, Input } from 'react-bootstrap';
import {isMobile} from 'react-device-detect';

class BetForm extends Component {	

	constructor(props) {
		super(props);
		this.state = {
			summoner: '',
			wager: 20,
			loading: false,
			isWin: false
		};
	}
	async componentDidMount() {
		
	}
	
	setSummoner = (event) => {
		this.setState({summoner: event.target.value});
	}
	
	setWager = (event) => {
		this.setState({wager: event.target.value});
	}
	
	setWin = (event) => {
		this.setState({isWin: event.target.checked });
	}
	
	submitForm = (event) => {
		event.preventDefault();
		this.setState({loading: true});
		this.props.bet(this.state.summoner, this.state.wager, this.state.isWin).finally(()=>this.setState({loading: false}));
	}

	render(){
	return (
		<React.Fragment>
		{this.state.loading
			?(
			<div className="loading">
				<Spinner
				  id="spinner"
				  as="span"
				  animation="border"
				  size={isMobile ? "1x" : "sm"}
				  role="status"
				  aria-hidden="true"
				/>
				<p>This may take ~30sec</p>
			</div>
			)
		:(
			<Form onSubmit={this.submitForm}>
				<Form.Group controlId="formBasicText">
					<Form.Label>Summoner Name</Form.Label>
					<Form.Control type="text" placeholder="Enter Summoner Name" required="required" onChange={this.setSummoner}  />
				</Form.Group> 
				<Form.Group>
					<Form.Label>Z-Bucks Wager</Form.Label>
					<Form.Control type="range" onChange={this.setWager} value={this.state.wager} />
					<Form.Text className="text-muted">
						Amount: <Form.Control type="number" onChange={this.setWager} value={this.state.wager}/>
					</Form.Text>
					<Form.Check 
						type='checkbox'
						id='default-checkbox'
						label='Will Win'
						onChange={this.setWin}
						checked={this.state.isWin}
					/>
				</Form.Group>
				<Form.Group>
					<Button variant={this.state.isDark?"light":"dark"} type="submit">
						Place Bet
					</Button>
					<Form.Text className="text-muted">
						We'll never share your data with anyone else.
					</Form.Text>
				</Form.Group>
			</Form>
		)}
		</React.Fragment>
	)}
}export default BetForm;