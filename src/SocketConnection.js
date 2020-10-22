import React, { Component } from "react";

import {socket} from "./Config/config";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

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
				<div class="alert alert-dismissible  show" role="alert">
					<FontAwesomeIcon icon={faExclamationTriangle} size="1x" />
					<strong>Internet not Connected</strong>
				</div>
			);
		}
		return null;
	}
}
export default SocketConnection;