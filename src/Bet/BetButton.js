import React, { Component } from "react";

import { Button, Spinner } from 'react-bootstrap';
import { isMobile } from "react-device-detect";

class BetButton extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false
        }
    }

    pressed = () => {
        this.setState({loading: true}, () =>
            this.props.onClick().finally(()=>this.setState({loading: false}))
        );
    };

    render() {
        return (
            <React.Fragment>
                {this.state.loading
                    ?(<Button variant={this.props.variant}
                              onClick={this.pressed}
                              ref={this.inputRef}
                        >
                        <div className="loading">
                            <Spinner
                                id="spinner"
                                as="span"
                                animation="border"
                                size={isMobile ? "1x" : "sm"}
                                role="status"
                                aria-hidden="true"
                            />
                        </div>
                    </Button>
                    )
                    :this.props.claimed
                        ? (<Button className="btn-border" variant="secondary" disabled="disabled">
                            Claimed
                        </Button>)
                        : (<Button variant={this.props.variant}
                                   onClick={this.pressed}
                                   ref={this.inputRef}
                                   disabled={this.props.disabled}
                            >
                            {this.props.message}
                        </Button>)
                }
            </React.Fragment>
        );
    }
}
export default BetButton;