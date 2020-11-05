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
    {option: '🔑', style: {backgroundColor: 'green', textColor: 'black'}},
];
const odd = {option: '1', style: {backgroundColor: 'black',  textColor: 'white'}};
const even = {option: '2', style: {backgroundColor: 'red',  textColor: 'white'}}

for(let i=1; i<32; i++){
    let item = i%2===0 ? clone(even) : clone(odd);
    item.option = i;
    data.push(item);
}

const initState = {
    betNumber: 1,
    wager: 5,
    prizeNumber : -1,
    winnings: 0,
    didWin: false,
    mustSpin: false,
    redBlack: false,
    betColor: 'Red',
    stopSpinning: false
};

class RouletteParent extends Component {
    constructor(props) {
        super(props);
        this.state = initState;
        this.wheelRef = React.createRef();
    }

    spinWheel = () => {
        const {redBlack, betColor, betNumber, wager} = this.state;
        if(betNumber < 0 || betNumber >= data.length || wager < 0 || wager > 100) return new Promise(resolve => resolve());

        return http.spinWheel(redBlack ? betColor : betNumber, wager)
            .then(_data =>
                this.setState({
                    mustSpin: true,
                    prizeNumber : _data.winningNumber,
                    didWin: _data.didWin,
                    winnings: _data.winnings,
                    stopSpinning: false
                }, this.startedSpinning))
            .catch(err=>err);
    };

    resetSpin = () => {
        this.setState({mustSpin: false, stopSpinning: true});
    }

    // Hack to reset wheel DOM and callback, TODO: remove once module updated
    startedSpinning = () => {
        setTimeout(() => {
            const wheelRef = document.getElementsByClassName('started-spinning');
            if (wheelRef[0]) wheelRef[0].classList.remove('started-spinning');
            this.resetSpin();
        },12000);
    };

    setNumber = (event) => {
        this.setState({betNumber: event.target.value})
    };

    setWager = (event) => {
        this.setState({wager: event.target.value});
    };

    setRedBlack = (event) => {
        this.setState({redBlack: event.target.checked });
    };

    setBetColor = (event) => {
        this.setState({betColor: event.target.value})
    };

    render() {
        const { betNumber, wager, redBlack, betColor } = this.state;
        
        return (
            <React.Fragment>
                <Roulette
                    wheelRef={this.wheelRef}
                    data={data}
                    resetSpin={this.resetSpin}
                    prizeNumber ={this.state.prizeNumber}
                    winnings={this.state.winnings}
                    didWin={this.state.didWin}
                    mustSpin={this.state.mustSpin}
                    stopSpinning={this.state.stopSpinning}
                    isDark={this.props.isDark}
                />
                <fieldset disabled={this.state.mustSpin ? 'disabled' : false}>
                    <Form>
                        <Form.Group controlId="formBasicText" style={{display:'inline-block'}}>
                                <Form.Control as="select"
                                              onChange={redBlack ? this.setBetColor : this.setNumber}
                                              value={redBlack ? betColor : betNumber}>
                                    {redBlack
                                        ? (<React.Fragment>
                                                <option disabled>Bet Color</option>
                                                <option style={even.style}>Red</option>
                                                <option style={odd.style}>Black</option>
                                            </React.Fragment>
                                        )
                                        : (<React.Fragment>
                                                <option disabled>Bet Number</option>
                                                {
                                                    data.filter(s => s.option !== '🔑').map(slot => (
                                                        <option style={slot.style}>{slot.option}</option>
                                                    ))
                                                }
                                            </React.Fragment>
                                        )
                                    }
                                </Form.Control>
                            <Form.Check
                                type='checkbox'
                                id='default-checkbox'
                                label='Red/Black'
                                onChange={this.setRedBlack}
                                checked={redBlack}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Z-Bucks Wager: ${wager}</Form.Label>
                            <Form.Text className="text-muted">
                                (20 zBucks for a chance at a key!)
                            </Form.Text>
                            <Form.Control type="range" onChange={this.setWager}
                                          value={wager}
                                          min={1}
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
                </fieldset>
            </React.Fragment>
        );
    }
}
export default RouletteParent;