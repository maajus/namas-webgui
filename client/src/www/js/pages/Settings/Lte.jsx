import React from "react";
import Checkbox from "../../components/Checkbox";
import Select from 'react-select';
import { connect } from "react-redux"
import { fetchWifiStatus } from "../../actions/fetchActions";
import { sendCommand } from "../../actions/fetchActions";

var td_style = {
    paddingTop: '.1em',
    paddingBottom: '.5em',
    textAlign:'left',
}


var mode_options = [
    {value: '0', label:'auto'},
    {value: '1', label:'GSM Only'},
    {value: '2', label:'3G only'},
    {value: '3', label:'LTE only'},
    {value: '4', label:'GSM+3G'},
];


@connect((store) => {

    return {
        wifiStatus: store.WifiStatus.data,
        modemSettings: store.RxSettings.data,
    };
})



export default class Lte extends React.Component {

    constructor(props){
        super(props);

    };

    componentDidMount(){

        this.props.dispatch(fetchWifiStatus());
    }


    apnChanged(event){

        var data = this.props.modemSettings;
        data.Modem.APN = event.target.value;
        this.setState({modemSettings:data});

    }


    usernameChanged(event){

        var data = this.props.modemSettings;
        data.Modem.Username = event.target.value;
        this.setState({modemSettings:data});

    }

    modemPassChanged(event){

        var data = this.props.modemSettings;
        data.Modem.Password = event.target.value;
        this.setState({modemSettings:data});

    }

    modemModeChanged(row){

        var data = this.props.modemSettings;
        data.Modem.Network_mode = row.value;
        this.setState({modemSettings:data});

    }

      enableData(event){

        var enable = event.target.value == "0" ? 0 : 1; //convert bool to int
        if(this.props.wifiStatus.Modem_enabled == "1")
            this.props.dispatch(sendCommand("Set", "CommandToRx", {LteEnable:{Enable:1,Data:enable}}));
        var status = this.props.wifiStatus;
        status.Modem_data = enable.toString();
        this.setState({wifiStatus:status});

    }


  
    render() {

        let Modem_signal;
        //console.log(this.state.data);
            if(parseInt(this.props.wifiStatus.Modem_signal) < 0)
                Modem_signal = "N/A";
            else
                Modem_signal = "-"+this.props.wifiStatus.Modem_signal.toString() + " dbm";

        return (
            <div className="container-fluid" style={{paddingTop:"0px"}}>

                <div className="col-xs-12" style={{paddingBottom:"5px"}}>
                    <label className="my-label"> 
                        LTE status:&nbsp; 
                        <label style={{color:"#10BDC9"}}>{this.props.wifiStatus.Modem_enabled=="1"? " ON":" OFF"}</label>
                    </label>
                </div>

            <div className="col-xs-12" style={{paddingBottom:"13px"}}>

                <ul onChange={this.enableData.bind(this)}>
                    <li className="radioMenu">
                        <input type="radio" id="option3" name="LTEselector" value="1" 
                            checked={parseInt(this.props.wifiStatus.Modem_data)}/>
                        <label className="radioMenu" for="option3">Data mode</label>
                        <div className="check"></div>
                    </li>
                    <li className="radioMenu">
                        <input type="radio" id="option4" name="LTEselector" value="0"
                            checked={!parseInt(this.props.wifiStatus.Modem_data)}/>
                        <label className="radioMenu" for="option4">SMS mode</label>
                        <div className="check"><div class="inside"></div></div>
                    </li>
                </ul>
            </div>

                <div className="col-lg-12 col-xs-12" style={{paddingLeft:"0px"}}>

                        <div className="col-6-lg col-md-6 col-sm-6 col-xs-6">
                            <label>
                                <label className="my-label">APN:</label>
                                <input
                                    type="text"
                                    value={this.props.modemSettings.Modem.APN}
                                    className="form-control mystyle"
                                    onChange={this.apnChanged.bind(this)} />
                            </label><br/>

                            <label style={{paddingTop:'5px'}}>
                                <label className="my-label">Username:</label>
                                <input
                                    type="text"
                                    value={this.props.modemSettings.Modem.Username}
                                    className="form-control mystyle"
                                    onChange={this.usernameChanged.bind(this)} />
                            </label><br/>
                        </div>

                        <div className="col-6-lg col-md-6 col-sm-6 col-xs-6">
                            <label>
                                <label className="my-label">Password:</label>
                                <input
                                    type="text"
                                    value={this.props.modemSettings.Modem.Password}
                                    className="form-control mystyle"
                                    onChange={this.modemPassChanged.bind(this)} />
                            </label><br/>

                            <label style={{paddingTop:'5px'}}>
                                <label className="my-label">Network mode:</label>
                                <Select
                                    name="form-field-name"
                                    value={mode_options[parseInt(this.props.modemSettings.Modem.Network_mode)]}
                                    options={mode_options}
                                    onChange={this.modemModeChanged.bind(this)}
                                    clearable={false}
                                />
                            </label>

                        </div>
                </div>

            <div className="col-xs-12 col-lg-6 col-md-6" style={{paddingTop:"20px"}}>
                <table  className="table" style={{paddingLeft:"30px"}}>
                    <tbody>
                       <tr>
                            <td style={td_style} className="my-label">Carrier: </td>
                            <td style={td_style} className="my-label"><b>{this.props.wifiStatus.Modem_carrier}</b></td>
                        </tr>
                        <tr>
                            <td style={td_style} className="my-label">Network: </td>
                            <td style={td_style} className="my-label"><b>{this.props.wifiStatus.Modem_mode}</b>
                            </td>
                        </tr>
                       <tr>
                            <td style={td_style} className="my-label">Signal: </td>
                            <td style={td_style} className="my-label"><b>{Modem_signal}</b></td>
                        </tr>
                        <tr>
                            <td style={td_style} className="my-label">IP: </td>
                            <td style={td_style} className="my-label"><b>{this.props.wifiStatus.Modem_ip}</b></td>
                        </tr>
 
                    </tbody>
                </table>
            </div>


        </div>
        );
    }
};

