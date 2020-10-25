import React, { Component } from 'react';

class HomeNav extends Component {

	render() {
		return(
		<React.Fragment>
			<div className="homePage">
			<form action="" onSubmit={this.joinRoom} className="">

			<label htmlFor="roomno" className="roomcodeText">
				NAME
			</label>
			<input id="m" className="input" type="text" required="required"
			ref="name" name="name" placeholder="ENTER NAME" autoComplete="off" 
			autoCorrect="off" maxLength="16"/>

			<label htmlFor="roomno" className="roomcodeText">
				ROOM CODE
			</label>
			<input id="m" className="input" type="tel" required="required" pattern="[\w]{4}"
			ref="roomno" name="roomno" placeholder="ENTER 4-LETTER CODE" autoComplete="off" 
			autoCorrect="off" maxLength="4"/>

			<button className="btn min200" type="submit">Join Room</button>
			</form>
			<p className="or">or</p>
			<button className="btn min200" onClick={this.hostRoom}>Host Game</button>
			<button className="logout btn min200 btn--loginApp-link" onClick={this.logout}>Logout</button>
			</div>
		</React.Fragment>
		)
	}
}
export default HomeNav;