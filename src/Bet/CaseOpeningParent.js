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
            itemTypes: [],
            showPrize: false
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
                    stopSpinning: false,
                    showPrize: false,
                    numKeys:  this.state.numKeys-1,
                    numCases: this.state.numCases-1
                }, this.startedSpinning))
            .catch(err => console.log(err));
    };

    buyKeys = () => {
        return http.buyKeys()
            .then(_data =>
                this.setState({
                    numKeys:  this.state.numKeys + _data.keys,
                }))
            .catch(err => console.log(err));
    };

    resetSpin = () => {
        this.setState({
            mustSpin: false,
            stopSpinning: true,
            showPrize: true
        });
    }

    render() {
        const {mustSpin, itemsList, itemTypes, prize, stopSpinning, showPrize} = this.state;

        return (<React.Fragment>
            {itemsList && itemsList.length > 0 &&
            (<React.Fragment>
                <CaseOpeningRenderer
                    callback={this.resetSpin}
                    mustSpin={mustSpin}
                    itemsList={itemsList}
                    itemTypes={itemTypes}
                    prize={prize}
                    stopSpinning={stopSpinning}
                    isDark={this.props.isDark}
                />
                <fieldset disabled={this.state.mustSpin ? 'disabled' : false}>
                    {showPrize && prize && (<h3>{prize.command.toUpperCase()}: !{prize.name}</h3>)}
                    <Form>
                        <Form.Group>
                            <BetButton
                                claimed={false}
                                variant={this.props.isDark ? "light" : "dark"}
                                onClick={this.openCase}
                                disabled={!this.state.numKeys || this.state.numKeys < 1 || !this.state.numCases || this.state.numCases < 1}
                                message={'Unlock'}
                            />
                        </Form.Group>
                        <Form.Label>
                            <table className="text">
                                <thead>
                                <tr>
                                    <th>CASES</th>
                                    <th>KEYS</th>
                                    <th><BetButton
                                        claimed={false}
                                        variant={this.props.isDark ? "light" : "dark"}
                                        onClick={this.buyKeys}
                                        disabled={this.state.numKeys && this.state.numKeys > 0}
                                        message={'BUY-KEY'}
                                    /></th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td>{this.state.numCases}</td>
                                    <td>{this.state.numKeys}</td>
                                    <td>125 zBucks</td>
                                </tr>
                                </tbody>
                            </table>
                        </Form.Label>
                    </Form>
                </fieldset>
            </React.Fragment>)}
        </React.Fragment>)
    }
}

export default CaseOpeningParent;
