import React, { Component } from "react";
import { clone } from "lodash";

import {http} from "../httpFactory";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { Button, Spinner, Form, Input } from 'react-bootstrap';

import BetButton from "./BetButton";
import {MOCKED_BET} from "./mocked_bet";
import Roulette from "./Roulette";

const data = [
    {option: '0', style: {backgroundColor: 'green', textColor: 'black'}},
];
const odd = {option: '1', style: {backgroundColor: 'black',  textColor: 'white'}};
const even = {option: '2', style: {backgroundColor: 'red',  textColor: 'white'}}

for(let i=0; i<32; i++){
    let item = i%2===0 ? clone(even) : clone(odd);
    item.option = i;
    data.push(item);
}

class RouletteParent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            betNumber: -1,
            wager: 5,
            prizeNumber : -1,
            mustSpin: false
        };
    }

    spinWheel = () => {
        const {betNumber, wager} = this.state;
        if(betNumber < 0 || betNumber >= data.length || wager < 0 || wager > 100) return new Promise(resolve => resolve());
        console.log(betNumber, wager);
        return http.spinWheel(betNumber, wager).then(_data =>this.setState({prizeNumber : _data.winningNumber, mustSpin: true})).catch(err=>err);
    };

    setNumber = (event) => {
        this.setState({betNumber: event.target.value})
    };

    setWager = (event) => {
        this.setState({wager: event.target.value});
    }

    render() {
        const { betNumber, wager } = this.state;
        
        return (
            <React.Fragment>
                <Roulette
                    data={data}
                    prizeNumber ={this.state.prizeNumber}
                    mustSpin={this.state.mustSpin}
                    isDark={this.props.isDark}
                />

                <Form>
                    <Form.Group controlId="formBasicText">
                        <Form.Control as="select"  onChange={this.setNumber} value={betNumber}>
                            <option disabled>Bet Number</option>
                            {
                                data.map(slot => (
                                    <option style={slot.style}>{slot.option}</option>
                                ))
                            }
                        </Form.Control>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Z-Bucks Wager: ${wager}</Form.Label>
                        <Form.Control type="range" onChange={this.setWager}
                                      value={wager}
                                      min={0}
                                      max={20}
                        />
                        <BetButton
                            claimed={false}
                            variant={this.props.isDark?"light":"dark"}
                            onClick={()=>this.spinWheel(this.state.bet)}
                            disabled={false}
                            message={'Spin'}
                        />
                    </Form.Group>
                </Form>
            </React.Fragment>
        );
    }
}
export default RouletteParent;