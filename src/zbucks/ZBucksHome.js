import React, { Component } from "react";

import {http} from "../httpFactory";

class ZBucksHome extends Component {
    constructor(props) {
        super(props);
        this.state = {bankList: []};
    }
    async componentDidMount() {
        this.getBankList();
    }

    getBankList = () => {
        http.getBankList().then(bankList=>this.setState({bankList})).catch(err=>err);
    };

    render() {
        const { bankList } = this.state;

        let userRenderer = bankList.map(user => (
            <tr key={user.id}>
                <td>{user.username}</td>
                <td>{user.zbucks}</td>
            </tr>)
        );

        return (
            <React.Fragment>
                <table id="zbucksTable" className="text" style={{width: '100%', alignItems: 'center'}}>
                    <label htmlFor="zbucksTable" className="text">Bank List</label>
                    <tr>
                        <th>Username</th>
                        <th>Z-Bucks</th>
                    </tr>

                    {userRenderer}
                </table>
            </React.Fragment>
        );
    }
}
export default ZBucksHome;