import React from 'react';
import * as $ from "jquery";

const consoleOverride = `console.log = function(message) {document.getElementById('codeResult').innerHTML += message;}`;
	
const messageOverride = `var reply.to = function(message, args) {document.getElementById('codeResult').innerHTML += args;}`;

export default class UseScript extends React.Component {
	constructor(props) {
		super(props);
		this.state = {removeChild:()=>null};
	}

	componentDidUpdate() {
		const script = document.createElement('script');
		script.type = 'text/javascript';
		script.innerHTML = consoleOverride + messageOverride + String(this.props.code);
		console.log(script);
		script.async = true;
		this.instance.appendChild(script);
		$(script).siblings().remove();
	}
	
	tryTo = (code) =>  `try{`+String(code)+`}catch(e){console.log(e)}`;

	render() {
		return(<div ref={el => (this.instance = el)} />)
	}
}
