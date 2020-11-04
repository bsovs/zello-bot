import React from "react";

import Carousel from '@brainhubeu/react-carousel';
import '@brainhubeu/react-carousel/lib/style.css';

const PRIZE_SLIDE = 99;
const SLIDE_INC = 20;
const INIT_ANI_SPEED = 10000;

class CaseOpeningRenderer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            aniSpeed: INIT_ANI_SPEED,
            slideNumber: 0,
            prizeNumber: 0,
            width: 0, height: 0
        };
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    }

    componentDidMount() {
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions() {
        this.setState({ width: window.innerWidth, height: window.innerHeight });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.prize && this.props.mustSpin && !prevProps.mustSpin) {
            const prizeNumber = this.props.itemsList && this.props.itemsList.indexOf(this.props.itemsList.find(item => item.name === this.props.prize.name));
            const lengthShift = this.props.itemsList.length + 100;
            this.setState({
                prizeNumber: prizeNumber + lengthShift,
            }, this.startSpin);
        }
    }

    startSpin = () => {
        const timer = setInterval(this.updateSpeed, 15);
        this.setState({
            slideNumber: 0,
            timer: timer
        });
    }

    updateSpeed = () => {
        let inc;
        if (this.state.slideNumber < 6) inc = (-1) * ((INIT_ANI_SPEED / 6) - (10 * 9));
        else if (this.state.slideNumber >= PRIZE_SLIDE - SLIDE_INC) inc = (500);
        else inc = (0)

        if (this.state.slideNumber >= this.state.prizeNumber) clearInterval(this.state.timer);
        else this.changeSpeed(inc);
    }

    changeSpeed = (inc) => {
        this.setState({
            aniSpeed: this.state.aniSpeed + inc,
            slideNumber: this.state.slideNumber + 1
        });
    }

    glowColor = (item) => {
        try {
            return this.props.itemTypes.find(itemType => itemType.class.toUpperCase() === item.class.toUpperCase()).color;
        } catch (e) {
            return '#fffeee';
        }
    }

    slideValues = () => {
        return this.props.itemsList.map(item => (
            <img width="500" height="500" src={item.href} style={{boxShadow: `0px 0px 23px ${this.glowColor(item)}`, margin: '28px 0px'}}/>
        ));
    }

    render() {
        const {slideNumber, width, height} = this.state;
        const {itemsList} = this.props;

        return (<React.Fragment>
            {itemsList && itemsList.length > 0 && (
                <Carousel
                    infinite
                    centered
                    slidesPerScroll={1}
                    slidesPerPage={((width-100)/500)}
                    value={slideNumber}
                    animationSpeed={14000}
                    draggable={false}
                    slides={this.slideValues()}
                />)}
        </React.Fragment>)
    }
}

export default CaseOpeningRenderer;
