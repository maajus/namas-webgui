import React from "react";
import Checkbox from "../../components/Checkbox";
import { connect } from "react-redux"

var td_style = {
    paddingTop: '.1em',
    paddingBottom: '.5em',
    textAlign:'left',
}

@connect((store) => {

    return {
        data: store.RxSettings.data.Ethernet,
        ip: store.RxSettings.data.Eth_ip,
    };
})




export default class Network extends React.Component {
    
    ipChange(value){
        var data = this.props.data;
        data.IP = value.target.value;
        this.setState({data:data});
    }

    maskChange(value){

        var data = this.props.data;
        data.Mask = value.target.value;
        this.setState({data:data});
    }

    gwChange(value){

        var data = this.props.data;
        data.Gateway = value.target.value;
        this.setState({data:data});

    }

    dns1Change(value){
        var data = this.props.data;
        data.DNS1 = value.target.value;
        this.setState({data:data});

    }

    dns2Change(value){
        var data = this.props.data;
        data.DNS2 = value.target.value;
        this.setState({data:data});
    }


    dhcpEnabled(val){
        var data = this.props.data;
        data.DHCP = val? "1":"0";
        this.setState({data:data});
    }

    macChange(value){
        var data = this.props.data;
        data.MAC = value.target.value;
        this.setState({data:data});
    }


    render() {


            return (
                <div className="container-fluid" style={{paddingTop:"0px", paddingBottom:"0px"}}>

                    <div className="col-xs-12">
                        <label className="my-label" style={{paddingBottom:"10px"}}> 
                            Ethernet status:&nbsp; 
                            <label style={{color:"#10BDC9"}}>{this.props.data.Enabled=="1"? " ON":" OFF"}</label>
                        </label>
                    </div>
                    <div className="col-xs-12">
                        <Checkbox label="DHCP" checked={parseInt(this.props.data.DHCP)} handler={this.dhcpEnabled.bind(this)}/>
                    </div>

                    <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6" style={{textAlign:"left"}}>

                        <label style={{paddingTop:'5px',textAlign:"left"}}>
                            <label className="my-label"> Static IP:</label>
                            <br/>
                            <input
                                disabled={parseInt(this.props.data.DHCP)}
                                type="text"
                                value={this.props.data.IP}
                                style={{textAlign:"center"}}
                                className="form-control mystyle"
                                onChange={this.ipChange.bind(this)} />
                        </label><br/>


                        <label style={{paddingTop:'5px',textAlign:"left"}}>
                            <label className="my-label">  Gateway:</label>
                            <br/>
                            <input
                                disabled={parseInt(this.props.data.DHCP)}
                                type="text"
                                value={this.props.data.Gateway}
                                style={{textAlign:"center"}}
                                className="form-control mystyle"
                                onChange={this.gwChange.bind(this)} />
                        </label><br/>



                        <label style={{paddingTop:'5px',textAlign:"left"}}>
                            <label className="my-label">  Net Mask:</label>
                            <br/>
                            <input
                                disabled={parseInt(this.props.data.DHCP)}
                                type="text"
                                value={this.props.data.Mask}
                                style={{textAlign:"center"}}
                                className="form-control mystyle"
                                onChange={this.maskChange.bind(this)} />
                        </label><br/>

                    </div>


                    <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6" style={{textAlign:"left"}}>

                        <label style={{paddingTop:'5px',textAlign:"left"}}>
                            <label className="my-label">  DNS1:</label>
                            <br/>
                            <input
                                disabled={parseInt(this.props.data.DHCP)}
                                type="text"
                                value={this.props.data.DNS1}
                                style={{textAlign:"center"}}
                                className="form-control mystyle"
                                onChange={this.dns1Change.bind(this)} />
                        </label><br/>


                        <label style={{paddingTop:'5px',textAlign:"left"}}>
                            <label className="my-label">   DNS2:</label>
                            <br/>
                            <input
                                disabled={parseInt(this.props.data.DHCP)}
                                type="text"
                                value={this.props.data.DNS2}
                                style={{textAlign:"center"}}
                                className="form-control mystyle"
                                onChange={this.dns2Change.bind(this)} />
                        </label><br/>



                        <label style={{paddingTop:'5px',textAlign:"left"}}>
                            <label className="my-label"> MAC: </label>
                            <br/>
                            <input
                                type="text"
                                value={this.props.data.MAC}
                                style={{textAlign:"center"}}
                                className="form-control mystyle"
                                onChange={this.macChange.bind(this)} />
                        </label><br/>


                    </div>


                    <div className="col-xs-12 col-lg-6 col-md-8" style={{paddingTop:"10px"}}>
                        <table  className="table" style={{paddingLeft:"30px"}}>
                            <tbody>
                                <tr>
                                    <td style={td_style} className="my-label">IP: </td>
                                    <td style={td_style} className="my-label"><b>{this.props.ip}</b></td>
                                </tr>
                                <tr>
                                    <td style={td_style} className="my-label">Data Port: </td>
                                    <td style={td_style} className="my-label"><b>65111</b></td>
                                </tr>
                                <tr>
                                    <td style={td_style} className="my-label">Audio Port: </td>
                                    <td style={td_style} className="my-label"><b>65112</b></td>
                                </tr>

                            </tbody>
                        </table>
                    </div>


                </div>
            );
           }
};

