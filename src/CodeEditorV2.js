import React, { Component } from 'react';
import { Controlled as CodeMirror } from 'react-codemirror2';
import Cookies from 'universal-cookie';

import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import {isMobile} from 'react-device-detect';
import { Button, Spinner, Form, Input } from 'react-bootstrap';
import { http } from './httpFactory';
import { API_URL, GITHUB_CLIENT_ID } from './Config/config';

import './Styles/codeEditorStyles.scss';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/darcula.css';

import 'codemirror/mode/htmlmixed/htmlmixed';
import 'codemirror/mode/css/css';
import 'codemirror/mode/javascript/javascript';

const initialCode = 
`function add(a, b) {
  return a + b;
}
console.log(add(1, 2));
`;

const tryTo = (code) =>  `try{`+String(code)+`}catch(e){console.log(e)}`;
const consoleOverride = tryTo(`console.log=(message)=>{document.getElementById('codeResult').innerHTML += message+'</br>';};`);
const messageOverride = tryTo(`var message={},reply={};reply.to=(message, args)=>{document.getElementById('codeResult').innerHTML += args+'</br>';};`);

const cookie = new Cookies();

class CodeEditorV2 extends Component {
  constructor(props) {
	super(props);
	const localCode = localStorage.getItem('localCode');
	this.state = {
	  code: (localCode?localCode:initialCode),
	};
  }

  componentDidUpdate() {
	this.runCode();
  }

  componentDidMount() {
	this.setState({
		
	});
  }

  runCode = () => {
	const { code } = this.state;
	const css = `#codeResult{color:${this.props.isDark?'white':'black'};display: grid;
    place-items: center;text-align:center;}`

	localStorage.setItem('localCode', code);

	const iframe = this.refs.iframe;
	const document = iframe.contentDocument;
	document.documentElement.innerHTML = "";
	const documentContents = `
	  <!DOCTYPE html>
	  <html lang="en">
	  <head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<meta http-equiv="X-UA-Compatible" content="ie=edge">
		<title>Document</title>
		<style>
		  ${css}
		</style>
	  </head>
	  <body>
		<code id="codeResult"></code>
		<script type="text/javascript">
		  ${consoleOverride}
		  ${messageOverride}
		  ${code}
		</script>
	  </body>
	  </html>
	`;

	document.open();
	document.write(documentContents);
	document.close();
  };

  github = () => {
	console.log(cookie.get('github_code_set'));
	!cookie.get('github_code_set')
		? window.location.href = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${API_URL}/githubCallback&scope=public_repo%20repo`
		: http.githubCommit().then(res=>console.log(res)).catch(error=>console.log(error));
  };

  render() {
	const { code } = this.state;
	const codeMirrorOptions = {
	  theme: this.props.isDark?'darcula':'default',
	  lineNumbers: true,
	  scrollbarStyle: null,
	  lineWrapping: true,
	  smartIndent: true
	};

	return (
		<React.Fragment>
			<section className="playground">
			  <div className="code-editor js-code">
				<div className="editor-header" style={{color:this.props.isDark?'white':'black',backgroundColor:this.props.isDark?'#121212':'inherit'}}>JavaScript</div>
				<CodeMirror
				  value={code}
				  options={{
					mode: 'javascript',
					...codeMirrorOptions,
				  }}
				  onBeforeChange={(editor, data, code) => {
					this.setState({ code });
				  }}
				/>
			  </div>
			</section>
			<section className="result">
			  <label htmlFor='result'><p>Output:</p></label>
			  <iframe title="result" className="iframe" ref="iframe" />
			</section>
			<Button onClick={this.github}>GitHub</Button>
		</React.Fragment>
	);
  }
}

export default CodeEditorV2;



		