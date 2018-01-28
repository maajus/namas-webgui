
import React from "react";
import Checkbox from "../../components/Checkbox";
import IPut from "../../components/IPut";
import { connect } from "react-redux"
import { sendCommand } from "../../actions/fetchActions";

@connect((store) => {

    return {
        data: store.RxSettings.data.web_gui,
    };
})


export default class Web extends React.Component {


    webEnabled(val){

        //if(val == "0"){
            //let ret = confirm("Are you sure you want to stop Web server? Connection to RX will be lost");
            //if(!ret) return;
        //}

        var data = this.props.data;
        data.enabled = val? "1":"0";
        this.setState({data:data});
        //this.props.dispatch(sendCommand("Set","CommandToRx", {EnableWeb:{enable:data.enabled, https:data.https}}));
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



    httpsChange(val){

        var data = this.props.data;
        data.https = val? "1":"0";
        this.setState({data:data});
    }

    render() {

        return (
            <div className="container-fluid" style={{paddingLeft:'40px', paddingTop:"0px"}}>
                <Checkbox label="Web server" checked={parseInt(this.props.data.enabled)} handler={this.webEnabled.bind(this)}/>
                <hr style={{marginTop:"10px"}}/>


                <Checkbox label="HTTPS" checked={parseInt(this.props.data.https)} handler={this.httpsChange.bind(this)}/>
                <label style={{paddingTop:'5px'}}> 
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

            </div>
        );
    }
};

