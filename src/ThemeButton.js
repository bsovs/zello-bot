import React, { Component } from "react";
import * as $ from "jquery";
import {isMobile} from 'react-device-detect';

import { Button, Spinner, Form, Input } from 'react-bootstrap';
import { CirclePicker } from 'react-color';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';

import './Styles/theme.css';

const COLORS = {BLACK: '#0000', PURPLE:'#b082ff', RED:'#F47373', GREEN:'#37D67A', BLUE:'#2CCCE4', ORANGE:'#FFA500'};

class ThemeButton extends Component {
	
	constructor(props) {
		super(props);
		let localTheme = localStorage.getItem("themeColor");
		this.state = {
			prefersDarkScheme: window.matchMedia("(prefers-color-scheme: dark)"),
			currentTheme: localStorage.getItem("theme"),
			localTheme: localTheme,
			themeColor: localTheme ? localTheme : COLORS.BLACK
		};
		this.props.setIsDark(
			(this.state.prefersDarkScheme.matches) ? true : false
		);
	}
	async componentDidMount() {
		if (this.state.currentTheme === "dark") {
			document.body.classList.add("dark-theme");
			this.props.setIsDark(true);
		} else if (this.state.currentTheme === "light") {
			document.body.classList.add("light-theme");
			this.props.setIsDark(false);
		}
	}

	toggle = () => {
		if (this.state.prefersDarkScheme.matches) {
			document.body.classList.toggle("light-theme");
			var theme = document.body.classList.contains("light-theme")
			  ? "light"
			  : "dark";
		} else {
			document.body.classList.toggle("dark-theme");
			var theme = document.body.classList.contains("dark-theme")
			  ? "dark"
			  : "light";
		}
		this.props.setIsDark(!this.props.isDark);
		localStorage.setItem("theme", theme);
	}
	
	render() {
		const { isDark } = this.props;
		
		return(
			<React.Fragment>
				<Button onClick={this.toggle} aria-label={isDark?'Enable Light-Mode':'Enable Dark-Mode'} 
					variant={isDark?"light":"dark"}
					>
					<FontAwesomeIcon 
						icon={isDark?faSun:faMoon} 
						size="1x" 
						style={{color: isDark?"black":"white"}}
					/>
				</Button>
			</React.Fragment>
		)
	}
}
export default ThemeButton;