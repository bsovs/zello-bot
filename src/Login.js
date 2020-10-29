//Imports
import React, { Component } from "react";
import * as $ from "jquery";
import Cookies from 'universal-cookie';
import { Capacitor } from '@capacitor/core';
import { Link } from "react-router-dom";
import { Button, Spinner, Form, Input } from 'react-bootstrap';
import {isMobile} from 'react-device-detect';

import 'bootstrap/dist/css/bootstrap.min.css';
import "./Styles/App.css";
import "./Styles/theme.css";

import HomeNav from './HomeNav';
import HomeButton from './HomeButton';
import ThemeButton from './ThemeButton';
import SocketConnection from './SocketConnection';
import {http} from './httpFactory';

//Global Vars
const cookies = new Cookies();

//Main Class
class Login extends Component {

	constructor(props) {
		super(props);
		
		let JWT = cookies.get('JWT', {doNotParse: true});
		this.state = {
			isDark: false,
			isWeb: Capacitor.platform==='web',
			username: null,
			password: null,
			email: null,
			fullName: null,
			JWT: JWT!=='' ? JWT : null,
			userData: null,
			socketConnected: true,
			login: true
		}
	};
  
	componentWillMount() {
		this.setState(this.props.location.state);
	};
	componentDidMount() {
		this.setState({
			socketConnected: (this.state.isWeb && this.state.socketConnected===null) ? false : true
		});
	};

	handleUsernameChange = (event) => {
		this.setState({username: event.target.value});
	};
	handlePasswordChange = (event) => {
		this.setState({password: event.target.value});
	};
	handleEmailChange = (event) => {
		this.setState({email: event.target.value});
	};
	handleFullNameChange = (event) => {
		this.setState({fullName: event.target.value});
	};


	//button functions
	login = async(event) => {
		event.preventDefault();
		this.setState({loading: true});
		http.login(this.state.username, this.state.password).then((response)=>{
			this.formResponse(response);
		});
	};
	signup = async(event) => {
		event.preventDefault();
		this.setState({loading: true});
		http.signup(this.state.username, this.state.password, this.state.email, this.state.fullName).then((response)=>{
			this.formResponse(response);
		});
	};
	userData = async() => {
		http.getProfile(this.state.JWT).then((response)=>{
			this.setState({userData: response});
		})
		.catch(error=>console.log(error));
	};
	logout = () => {
		http.logout().then(()=>{
			cookies.remove('JWT');
			this.setState({
				JWT: null,
				userData: null,
				username: '',
				password: ''
			});
		})
		.catch((error)=>console.log(error));
	};

	formResponse = (response) => {
		let json = JSON.parse(response);
		if(json.success){
			this.setJWT(true)
			this.setState({
				JWT: true,
				username: '',
				password: '',
				error: null,
				loading: false
			});
		}else{
			console.log(json.error);
			this.setState({
				error: json.error,
				password: '',
				loading: false
			});
		}
	}

	//set JWT Cookies
	setJWT = (access_token) => {
		cookies.set('JWT', access_token, { path: '/', maxAge: 3600});
	}
	
	switchForm = () => {
		this.setState({ login: !this.state.login });
	}

	//rerender frame
	shouldRerender = () => {
		this.setState(this.state);
	};

	render(){return(
		<div className="App noselect">
			<header>
				<alert>
					<SocketConnection
						isWeb={this.state.isWeb}
						socketConnected={this.state.socketConnected}
						setSocketConnected={
							(socketConnected) => {
								return new Promise((resolve, reject) => { 
									this.setState({socketConnected}, resolve()) 
								});
							}
						}
					/>
				</alert>
				<React.Fragment>
					<HomeButton />
					<ThemeButton 
						isDark={this.state.isDark}
						setIsDark={(isDark)=>this.setState({isDark})}
					/>
				</React.Fragment>
			</header>
			<main>
				{!this.state.JWT && (this.state.login
					?(
						<Form onSubmit={this.login}>
							
							{this.state.error && (<Form.Label type="invalid">{this.state.error}</Form.Label>)}
							
							<Form.Group controlId="formBasicUsername">
								<Form.Label>Username</Form.Label>
								<Form.Control type="text" placeholder="Enter Username" required="required"
									value={this.state.username} onChange={this.handleUsernameChange}
								/>
							</Form.Group>

							<Form.Group controlId="formBasicPassword">
								<Form.Label>Password</Form.Label>
								<Form.Control type="password" placeholder="Password" required="required"
									value={this.state.password} onChange={this.handlePasswordChange}
								/>
							</Form.Group>
							<Form.Group controlId="formBasicCheckbox">
								<Form.Check type="checkbox" label="Remeber Me" />
								<Form.Text className="text-muted">
									We'll never share your info with anyone else.
								</Form.Text>
							</Form.Group>
							
							<button className="btn btn-border" 
								variant="primary" 
								type="submit"
								disabled={this.state.loading}
							>
							{this.state.loading
								?(<div className="loading">
									<Spinner
									  as="span"
									  animation="border"
									  size={isMobile ? "1x" : "sm"}
									  role="status"
									  aria-hidden="true"
									/>
								</div>)
								: 'Login'
							}
							</button>
						</Form>	
					)
					:(
						<Form onSubmit={this.signup}>
							
							{this.state.error && (<Form.Label type="invalid">{this.state.error}</Form.Label>)}
							
							<Form.Group controlId="formBasicUsername">
								<Form.Label>Username</Form.Label>
								<Form.Control type="text" placeholder="Enter Username" required="required"
									value={this.state.username} onChange={this.handleUsernameChange}
								/>
							</Form.Group>

							<Form.Group controlId="formBasicPassword">
								<Form.Label>Password</Form.Label>
								<Form.Control type="password" placeholder="Password" required="required"
									value={this.state.password} onChange={this.handlePasswordChange}
								/>
							</Form.Group>
							
							<Form.Group controlId="formBasicEmail">
								<Form.Label>Email</Form.Label>
								<Form.Control type="email" placeholder="Enter Email" required="required"
									value={this.state.email} onChange={this.handleEmailChange}
								/>
							</Form.Group>

							<Form.Group controlId="formBasicFullName">
								<Form.Label>Name</Form.Label>
								<Form.Control type="text" placeholder="Enter Full Name" required="required"
									value={this.state.fullName} onChange={this.handleFullNameChange}
								/>
							</Form.Group>
							
							<Form.Group controlId="formBasicCheckbox">
								<Form.Check type="checkbox" label="Remeber Me" />
								<Form.Text className="text-muted">
									We'll never share your info with anyone else.
								</Form.Text>
							</Form.Group>
							
							<button className="btn btn-border" 
								variant="primary" 
								type="submit"
								disabled={this.state.loading}
							>
							{this.state.loading
								?(<div className="loading">
									<Spinner
									  as="span"
									  animation="border"
									  size={isMobile ? "1x" : "sm"}
									  role="status"
									  aria-hidden="true"
									/>
								</div>)
								: 'Signup'
							}
							</button>
						</Form>	
					)
				)
				}
				
				{!this.state.JWT && (
					<button className="btn" 
						variant="primary" 
						type="submit"
						disabled={this.state.loading}
						onClick={this.switchForm}
					>
						{this.state.login ? 'Signup' : 'Login'}
					</button>
				)}

				{this.state.JWT &&
					(<React.Fragment>
						<button className="btn btn-border" 
							variant="primary" 
							type="submit"
							onClick={this.userData}
						>
							View Profile
						</button>
						{this.state.userData && (
							<p>
								{this.state.userData.username}
								{this.state.userData.email}
								{this.state.userData.full_name}
							</p>
						)}
						<button className="btn btn-border" 
							variant="primary" 
							type="submit"
							onClick={this.logout}
						>
							Logout
						</button>
					</React.Fragment>)
				}
				
			</main>
			<footer>
				<p>
					Created by Brandon Sovran.
				</p>
			</footer>
      </div>
    );}
}
export default Login;
