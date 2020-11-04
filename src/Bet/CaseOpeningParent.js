import React, {Component} from "react";

import {http} from "../httpFactory";

import {Button, Spinner, Form, Input} from 'react-bootstrap';
import CaseOpeningRenderer from "./CaseOpeningRenderer";
import BetButton from "./BetButton";

class CaseOpeningParent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mustSpin: false,
            stopSpinning: true,
            numKeys: 0,
            numCases: 0,
            prize: 0,
            itemsList: [],
            itemTypes: []
        };
    }

    componentDidMount() {
        http.getCaseItems()
            .then(_data => this.setState({itemsList: _data.items, itemTypes: _data.itemTypes}))
            .catch(error => console.log(error));
        http.getKeysAndCases()
            .then(_data => this.setState({numKeys: _data.keys, numCases: _data.cases}))
            .catch(error => console.log(error));
    }

    openCase = () => {
        return http.openCase()
            .then(_data =>
                this.setState({
                    mustSpin: true,
                    prize: _data.item,
                    stopSpinning: false
                }, this.startedSpinning))
            .catch(err => console.log(err));
    };

    resetSpin = () => {
        this.setState({mustSpin: false, stopSpinning: true});
    }

    render() {
        const {mustSpin, itemsList, itemTypes, prize, stopSpinning} = this.state;

        return (<React.Fragment>
            {itemsList && itemsList.length > 0 &&
            (<React.Fragment>
                <CaseOpeningRenderer
                    mustSpin={mustSpin}
                    itemsList={itemsList}
                    itemTypes={itemTypes}
                    prize={prize}
                    stopSpinning={stopSpinning}
                    isDark={this.props.isDark}
                />
                <fieldset disabled={this.state.mustSpin ? 'disabled' : false}>
                    <Form>
                        <Form.Group>
                            <BetButton
                                claimed={false}
                                variant={this.props.isDark ? "light" : "dark"}
                                onClick={this.openCase}
                                disabled={!this.state.numKeys || this.state.numKeys < 1}
                                message={'Unlock'}
                            />
                        </Form.Group>
                        <Form.Label>
                            <p> Keys: {this.state.numKeys} </p>
                            <p>Cases: {this.state.numCases} </p>
                        </Form.Label>
                    </Form>
                </fieldset>
            </React.Fragment>)}
        </React.Fragment>)
    }
}

export default CaseOpeningParent;
