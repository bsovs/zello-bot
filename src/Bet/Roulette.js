import React, {Component} from 'react'
import {Wheel} from 'react-custom-roulette'

class Roulette extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        console.log(this.props.mustSpin, this.props.prizeNumber);
        return (
            <div ref={this.props.wheelRef}>
                {this.props.winnings !== 0 && this.props.stopSpinning
                    && (<p>{!this.props.didWin && ('-')}${this.props.didWin ? this.props.winnings : (-1)*this.props.winnings}</p>)
                }
                <Wheel
                    mustStartSpinning={this.props.mustSpin}
                    //onStopSpinning={this.props.resetSpin}
                    prizeNumber={this.props.prizeNumber}
                    data={this.props.data}
                    backgroundColors={['#3e3e3e', '#df3428']}
                    textColors={['#ffffff']}
                    textDistance={75}
                    perpendicularText={true}
                    radiusLineColor={'#d4af37'}
                    radiusLineWidth={3}
                    innerBorderWidth={10}
                    innerRadius={40}
                    innerBorderColor={this.props.isDark ? 'white' : 'black'}
                    outerBorderColor={this.props.isDark ? 'white' : 'black'}
                    outerBorderWidth={5}
                />
            </div>
        )
    }
}

export default Roulette;