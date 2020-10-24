import React from 'react';
import Safe from 'react-safe';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import {isMobile} from 'react-device-detect';
import { Button, Spinner, Form, Input } from 'react-bootstrap';
 
import UseScript from './Helper/UseScript';

import './Styles/codeEditorStyles.scss';
 
const initialCode = `
	function add(a, b) {
	  return a + b;
	}
	console.log(add(1, 2));
	`;
 
class CodeEditor extends React.Component {
 
	constructor(props) {
		super(props);
		const localCode = localStorage.getItem('localCode');
		this.state = {
			code: (localCode?localCode:initialCode),
			resultNum: 0
		}
	}
 
	runScript = () => {
		/*try{
			this.state.resetScript();
			document.getElementById('codeResult').innerHTML = '';
		}catch(e){console.log(e)}*/
		this.setState(
			prevState => ({codeResult: this.state.code, resultNum: (prevState.resultNum+1)})
			//, ()=>this.setState({resetScript: useScript(consoleOverride(this.state.resultNum) + messageOverride(this.state.resultNum) + this.state.codeResult, 'scriptEditor')})
		);
	}
 
	render() {
		const { code, codeResult, resultNum } = this.state;  
		
		return (
		<React.Fragment>
			<Editor
				className='codeBox'
				value={code}
				onValueChange={code => {this.setState({ code });localStorage.setItem('localCode', code);}}
				highlight={code => highlight(code, languages.js)}
				padding={12}
				style={{
				  fontFamily: '"Fira code", "Fira Mono", monospace',
				  fontSize: 16,
				  WebkitFilter: this.props.isDark?'invert(100%)':'invert(0%)'
				}}
			/>
			<span style={{display:'inline-block'}}>
				<Button variant={this.props.isDark?"dark":"light"} onClick={this.runScript}>Run</Button> 
				<label htmlFor='codeResult'>Results:</label>
				<code id='codeResult'>
					<UseScript code={ codeResult } />
				</code>
			</span>
		</React.Fragment>
		);
	}
}
export default CodeEditor;