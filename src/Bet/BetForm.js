import React, {Component} from "react";

import {Button, Spinner, Form, Input} from 'react-bootstrap';
import {isMobile} from 'react-device-detect';
import {http} from "../httpFactory";
import RouletteParent from "./RouletteParent";
import BetButton from "./BetButton";

class BetForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            summoner: props.bet.summoner || '',
            lockedSummoner: '',
            oddsData: null,
            wager: props.bet.wager || 20,
            loading: props.bet.loading || false,
            isWin: props.bet.isWin || false,
            error: null
        };
    }

    async componentDidMount() {

    }

    setBetOdds = () => {
        return http.getBetOdds(this.state.summoner)
            .then(oddsData => this.setState({oddsData, lockedSummoner: oddsData.summonerName}))
            .catch(error => this.setState({error: error.message}));
    }

    setSummoner = (event) => {
        this.setState({summoner: event.target.value});
    }

    setWager = (event) => {
        this.setState({wager: event.target.value});
    }

    setWin = (event) => {
        this.setState({isWin: event.target.checked});
    }

    submitForm = (event) => {
        event.preventDefault();
        this.setState({loading: true});
        this.props.setBet(this.state.lockedSummoner, parseInt(this.state.wager), !!this.state.isWin).finally(() => this.setState({loading: false}));
    }

    render() {

        const {summoner, wager, loading, isWin, error, lockedSummoner, oddsData} = this.state;

        return (
            <React.Fragment>
                {this.state.loading
                    ? (
                        <div className="loading">
                            <Spinner
                                id="spinner"
                                as="span"
                                animation="border"
                                size={isMobile ? "1x" : "sm"}
                                role="status"
                                aria-hidden="true"
                            />
                            <p>This may take ~30sec</p>
                        </div>
                    )
                    : (<React.Fragment>
                        {error && (<h3 className="text">Error: {error}</h3>)}

                        <fieldset disabled={lockedSummoner ? 'disabled' : false}>
                            <Form>
                                <Form.Group controlId="formBasicText">
                                    <Form.Label>Summoner Name</Form.Label>
                                    <Form.Control type="text" placeholder="Enter Summoner Name" required="required"
                                                  onChange={this.setSummoner}
                                                  value={summoner}
                                    />
                                    <BetButton
                                        claimed={false}
                                        variant={this.props.isDark ? "light" : "dark"}
                                        onClick={() => this.setBetOdds()}
                                        disabled={lockedSummoner}
                                        message={'Get Odds'}
                                    />
                                    {oddsData && (
                                        <Form.Text className="text-muted">
                                            <span>Odds of Win: {Math.round(100 * oddsData.odds)}%</span>
                                            <span>Payout: {oddsData.payout}</span>
                                        </Form.Text>
                                    )}
                                </Form.Group>
                            </Form>
                        </fieldset>

                        <fieldset disabled={!lockedSummoner ? 'disabled' : false}>
                            <Form onSubmit={this.submitForm}>
                                <Form.Group>
                                    <Form.Label>Z-Bucks Wager</Form.Label>
                                    <Form.Control type="range" onChange={this.setWager} value={wager}/>
                                    <Form.Text className="text-muted">
                                        Amount: <Form.Control type="number" onChange={this.setWager} value={wager}/>
                                    </Form.Text>
                                    <Form.Check
                                        type='checkbox'
                                        id='default-checkbox'
                                        label='Will Win'
                                        onChange={this.setWin}
                                        checked={isWin}
                                    />
                                </Form.Group>
                                <Form.Group>
                                    <Button variant={this.props.isDark ? "light" : "dark"} type="submit">
                                        Place Bet
                                    </Button>
                                    <Form.Text className="text-muted">
                                        We'll never share your data with anyone else.
                                    </Form.Text>
                                </Form.Group>
                            </Form>
                        </fieldset>
                    </React.Fragment>)}
            </React.Fragment>
        )
    }
}

export default BetForm;