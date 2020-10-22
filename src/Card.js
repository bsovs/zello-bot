import React, { Component } from "react";
import * as $ from "jquery";
import { Capacitor } from '@capacitor/core';
import { Link } from "react-router-dom";
import { Button, Spinner, Form, Input } from 'react-bootstrap';
import {isMobile} from 'react-device-detect';

import logo from './Styles/logo.svg';
import './Styles/App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import ThemeButton from './ThemeButton';
import SocketConnection from './SocketConnection';
import { http } from './httpFactory';
import { socket } from './Config/config';

class Card extends Component {

	constructor(props) {
		super(props);
		this.state = {

		}
	}

	componentDidMount() {

	}

	render(){

		const { } = this.state;

		return(
			<h2>This is a card</h2>
		);
	}
}
export default Card;
