import React, { Component } from "react";

import {socket} from "./Config/config";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { Alert } from 'react-bootstrap';

class SocketConnection extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	async componentDidMount() {
		if(this.props.isWeb){
			socket.on('connect_error', () => {
				this.props.setSocketConnected(false).then(() => {
					
				});
			});
			socket.on('connected', () => {
				this.props.setSocketConnected(true);
			});
		}
	}
	
	render() {
		const { isWeb, socketConnected } = this.props;

		if (isWeb && !socketConnected){
			return (
				<Alert role="alert" variant={this.props.isDark?"light":"dark"}>
					<FontAwesomeIcon icon={faExclamationTriangle} size="1x" />
					<strong>Internet not Connected</strong>
				</Alert>
			);
		}
		return null;
	}
}
export default SocketConnection;