import React from "react";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { Link } from "react-router-dom";
import { Button, Spinner, Form, Input } from 'react-bootstrap';

const HomeButton = props => {
	return(
		<Link to="/">
			<button className="btn btn-border float-left"><FontAwesomeIcon icon={faHome} size="xs" variant="outlined"/></button>
		</Link>
	)
}
export default HomeButton;