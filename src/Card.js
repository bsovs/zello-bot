import React, { Component } from "react";
import * as $ from "jquery";
import { Capacitor } from '@capacitor/core';
import { Link } from "react-router-dom";
import { Button, Spinner, Form, Input } from 'react-bootstrap';
import {isMobile} from 'react-device-detect';

import logo from './Styles/logo.svg';

import ThemeButton from './ThemeButton';
import SocketConnection from './SocketConnection';
import { http } from './httpFactory';
import { socket } from './Config/config';

class Card extends Component {

	constructor(props) {
		super(props);
		this.state = props;
	}

	componentDidMount() {

	}

	render(){

		const { value } = this.state;

		return(
			<React.Fragment>
				<h2>{value}</h2>
			</React.Fragment>
		);
	}
}
export default Card;
