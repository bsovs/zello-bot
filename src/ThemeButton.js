import React, { Component } from "react";
import * as $ from "jquery";
import {isMobile} from 'react-device-detect';

import './Styles/theme.css';

import { CirclePicker } from 'react-color';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';

const COLORS = {PURPLE:'#b082ff', RED:'#F47373', GREEN:'#37D67A', BLUE:'#2CCCE4', ORANGE:'#FFA500'};

class ThemeButton extends Component {
	
	constructor(props) {
		super(props);
		let localTheme = localStorage.getItem("themeColor");
		this.state = {
			prefersDarkScheme: window.matchMedia("(prefers-color-scheme: dark)"),
			currentTheme: localStorage.getItem("theme"),
			localTheme: localTheme,
			themeColor: localTheme ? localTheme : COLORS.PURPLE
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
		if (this.state.localTheme) {
			$('body').css("--btn-color" , this.state.themeColor);
			$('body').css("--global-color" , this.state.themeColor);
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
	
	handleChangeComplete = (color) => {
		if(color && color.hex){
			$('body').css("--btn-color" , color.hex);
			$('body').css("--global-color" , color.hex);
			if(this.state.localTheme!==color.hex)
				localStorage.setItem("themeColor", color.hex);
			this.setState({ themeColor: color.hex });
		}
	};
	
	render() {
		const { isDark } = this.props;
		
		return(
			<React.Fragment>
				<button className="btn float-right" onClick={this.toggle} aria-label={isDark?'Enable Light-Mode':'Enable Dark-Mode'}>
					<FontAwesomeIcon icon={isDark?faSun:faMoon} size="1x" />
				</button>
				<CirclePicker 
					className="float-right"
					width ='220px'
					colors={[COLORS.PURPLE, COLORS.RED, COLORS.GREEN, COLORS.BLUE, COLORS.ORANGE]}
					color={ this.state.themeColor }
					onChangeComplete={ this.handleChangeComplete }
				/>
			</React.Fragment>
		)
	}
}
export default ThemeButton;