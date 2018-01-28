import React from "react";
import Checkbox from "../../components/Checkbox";
import Select from 'react-select';
import { connect } from "react-redux"
import { fetchWifiSettings } from "../../actions/fetchActions";
import { fetchWifiStatus } from "../../actions/fetchActions";

var td_style = {
    paddingTop: '.1em',
    paddingBottom: '.5em',
    textAlign:'left',
}


var ch_options = [
    { value: '1', label: '1. 2412 MHz' },
    { value: '2', label: '2. 2417 MHz' },
    { value: '3', label: '3. 2422 MHz' },
    { value: '4', label: '4. 2427 MHz' },
    { value: '5', label: '5. 2432 MHz' },
    { value: '6', label: '6. 2437 MHz' },
    { value: '7', label: '7. 2442 MHz' },
    { value: '8', label: '8. 2447 MHz' },
    { value: '9', label: '9. 2452 MHz' },
    { value: '10', label: '10. 2457 MHz' },
    { value: '11', label: '11. 2462 MHz' },
    { value: '12', label: '12. 2467 MHz' },
    { value: '13', label: '13. 2472 MHz' },

    { value: '36', label: '36. 5180 MHz' },
    { value: '40', label: '40. 5200 MHz' },
    { value: '44', label: '44. 5220 MHz' },
    { value: '48', label: '48. 5240 MHz' },
    { value: '52', label: '52. 5260 MHz' },
    { value: '56', label: '56. 5280 MHz' },
    { value: '60', label: '60. 5300 MHz' },
    { value: '64', label: '64. 5320 MHz' },
    { value: '100', label: '100. 5500 MHz' },
    { value: '104', label: '104. 5520 MHz' },
    { value: '108', label: '108. 5540 MHz' },
    { value: '112', label: '112. 5460 MHz' },
    { value: '116', label: '116. 5580 MHz' },
    { value: '120', label: '120. 5600 MHz' },
    { value: '124', label: '124. 5620 MHz' },
    { value: '128', label: '128. 5640 MHz' },
    { value: '132', label: '132. 5660 MHz' },
    { value: '136', label: '136. 5680 MHz' },
    { value: '140', label: '140. 5700 MHz' },
    { value: '149', label: '149. 5745 MHz' },
    { value: '153', label: '153. 5765 MHz' },
    { value: '157', label: '157. 5785 MHz' },
    { value: '161', label: '161. 5805 MHz' },
    { value: '165', label: '165. 5825 MHz' }
];



function channelByVal(val){

    for(var i = 0; i < ch_options.length; i++){

        if(ch_options[i].value == val)
            return ch_options[i];

    }

}


@connect((store) => {

    return {
        wifiStatus: store.WifiStatus.data,
        wifiSettings: store.WifiSettings.data,
    };
})



export default class Wifi extends React.Component {

    constructor(props){
        super(props);

    };

    componentDidMount(){

        this.props.dispatch(fetchWifiSettings());
        this.props.dispatch(fetchWifiStatus());
    }


    hideSSIDChanged(value){

        var data = this.props.wifiSettings;
        data.HideSSID = value ? "1":"0";
        this.setState({wifiSettings:data});

    }

    ssidChanged(event){

        var data = this.props.wifiSettings;
        data.SSID = event.target.value;
        this.setState({wifiSettings:data});
    }

    passChanged(event){

        var data = this.props.wifiSettings;
        data.Passw = event.target.value;
        this.setState({wifiSettings:data});
    }

    chChanged(row){

        var data = this.props.wifiSettings;
        data.Channel = row.value;
        this.setState({wifiSettings:data});

    }
  
    render() {

        //console.log(this.state.data);


        return (
            <div className="container-fluid" style={{paddingTop:"0px"}}>

                <div className="col-xs-12" style={{paddingBottom:"10px"}}>
                    <label className="my-label"> 
                        WiFi status:&nbsp; 
                        <label style={{color:"#10BDC9"}}>{this.props.wifiStatus.WIFI_Enabled=="1"? " ON":" OFF"}</label>
                    </label>
                </div>


                <div className="col-xs-12 col-lg-6 col-md-6" >
                    <Checkbox
                        label="Hide SSID"
                        checked={parseInt(this.props.wifiSettings.HideSSID)}
                        handler={this.hideSSIDChanged.bind(this)}
                                          />

                <label style={{paddingTop:'10px'}}>
                    <label className="my-label"> AP name: </label>
                    <input
                        type="text"
                        value={this.props.wifiSettings.SSID}
                        className="form-control mystyle"
                        onChange={this.ssidChanged.bind(this)} />
                </label><br/>


                <label style={{paddingTop:'10px'}}>
                    <label className="my-label">AP password:</label>
                    <input
                        type="text"
                        value={this.props.wifiSettings.Passw}
                        className="form-control mystyle"
                        onChange={this.passChanged.bind(this)} />
                </label><br/>

                <label style={{paddingTop:'10px',paddingBottom:'20px', margin:"0px"}}>
                    <label className="my-label">Channel:</label>
                    <Select
                        name="form-field-name"
                        value={channelByVal(this.props.wifiSettings.Channel)}
                        options={ch_options}
                        onChange={this.chChanged.bind(this)}
                        searchable={false}
                        clearable={false}
                    />
                </label>
            </div>


            <div className="col-xs-12 col-lg-6 col-md-6" style={{paddingTop:"10px"}}>
                <table  className="table" style={{paddingLeft:"30px"}}>
                    <tbody>
                       <tr>
                            <td style={td_style} className="my-label">WiFi MAC: </td>
                            <td style={td_style} className="my-label"><b>{this.props.wifiStatus.MAC}</b></td>
                        </tr>
                        <tr>
                            <td style={td_style} className="my-label">Client: </td>
                            <td style={td_style} className="my-label">
                                <b>{this.props.wifiStatus.Client_connected=="1"?"Connected":"Not connected"}</b>
                            </td>
                        </tr>
                       <tr>
                            <td style={td_style} className="my-label">Client MAC: </td>
                            <td style={td_style} className="my-label"><b>{this.props.wifiStatus.Client_MAC}</b></td>
                        </tr>
                        <tr>
                            <td style={td_style} className="my-label">IP: </td>
                            <td style={td_style} className="my-label"><b>{this.props.wifiStatus.RxIP}</b></td>
                        </tr>
 
                    </tbody>
                </table>
            </div>


        </div>
        );
    }
};

