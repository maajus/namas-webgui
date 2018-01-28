import React from "react";
import Checkbox from "../../components/Checkbox";
import IPut from "../../components/IPut";
import { connect } from "react-redux"

var td_style = {
    paddingTop: '.1em',
    paddingBottom: '.5em',
    textAlign:'left',
}

@connect((store) => {

    return {
        data: store.RxSettings.data.VPN,
        ip: store.WifiStatus.data.VpnIP,
    };
})


export default class Vpn extends React.Component {


    vpnEnabled(val){

        var data = this.props.data;
        data.Enabled = val? "1":"0";
        this.setState({data:data});
    }

    usernameChange(event){

        var data = this.props.data;
        data.username = event.target.value;
        this.setState({data:data});

    }

    passChange(event){

        var data = this.props.data;
        data.password = event.target.value;
        this.setState({data:data});
    }

    render() {

        console.log(this.props);

            return (
                <div className="container-fluid" style={{paddingLeft:'40px', paddingTop:"0px"}}>
            <Checkbox label="OpenVPN" checked={parseInt(this.props.data.Enabled)} handler={this.vpnEnabled.bind(this)}/>

                <label style={{paddingTop:'15px'}}> 
                    Username: 
                    <br/>
                    <input 
                        type="text" 
                        value={this.props.data.username} 
                        className="form-control mystyle"
                        onChange={this.usernameChange.bind(this)} />
                </label><br/>



                <label style={{paddingTop:'5px'}}> 
                    Password: 
                    <br/>
                    <input 
                        type="text" 
                        value={this.props.data.password} 
                        className="form-control mystyle"
                        onChange={this.passChange.bind(this)} />
                </label><br/>

                    <div className="col-xs-12 col-lg-6 col-md-8" style={{paddingTop:"20px", paddingLeft:"0px"}}>
                        <table  className="table" style={{paddingLeft:"0px"}}>
                            <tbody>
                                <tr>
                                    <td style={td_style} className="my-label">IP: </td>
                                    <td style={td_style} className="my-label"><b>{this.props.ip}</b></td>
                                </tr>
                                <tr>
                                    <td style={td_style} className="my-label">Server IP: </td>
                                    <td style={td_style} className="my-label"><b>{this.props.data.serverIP}</b></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>


    </div>
            );
    }
};

