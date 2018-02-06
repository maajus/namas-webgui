import React from "react";
import Checkbox from "../../components/Checkbox";
import IPut from "../../components/IPut";
import { connect } from "react-redux"

@connect((store) => {

    return {
        data: store.RxSettings.data.ftp_server,
    };
})


export default class Ftp extends React.Component {


    ftpEnabled(val){

        var data = this.props.data;
        data.enabled = val? "1":"0";
        this.setState({data:data});
    }

    ipChange(event){

        var data = this.props.data;
        data.hostname = event.target.value;
        this.setState({data:data});

    }

    userChange(event){

        var data = this.props.data;
        data.username = event.target.value;
        this.setState({data:data});
    }

    passChange(event){

        var data = this.props.data;
        data.pass= event.target.value;
        this.setState({data:data});
    }

    portChange(event){

        var data = this.props.data;
        data.port = event.target.value;
        this.setState({data:data});
    }

    render() {

        var hostname = this.props.data.hostname;
        /*     if (!hostname){*/
        //hostname = '...';
        //}

        return (
            <div className="container-fluid" style={{paddingLeft:'40px', paddingTop:"0px"}}>
                <Checkbox label="FTPS Client" checked={parseInt(this.props.data.enabled)} handler={this.ftpEnabled.bind(this)}/>
                <hr style={{marginBottom:'10px', marginTop:"10px"}}/>


                <label style={{paddingTop:'5px'}}> 
                    Host: 
                    <br/>
                    <input 
                        type="text" 
                        value={hostname} 
                        className="form-control mystyle"
                        onChange={this.ipChange.bind(this)} />
                </label><br/>



                <label style={{paddingTop:'5px'}}> 
                    Username: 
                    <br/>
                    <input 
                        type="text" 
                        value={this.props.data.username} 
                        className="form-control mystyle"
                        onChange={this.userChange.bind(this)} />
                </label><br/>


                <label style={{paddingTop:'5px'}}> 
                    Password: 
                    <br/>
                    <input 
                        type="text" 
                        value={this.props.data.pass} 
                        className="form-control mystyle"
                        onChange={this.passChange.bind(this)} />
                </label><br/>


                <label style={{paddingTop:'5px'}}> 
                    Port: 
                    <br/>
                    <input 
                        type="text" 
                        value={this.props.data.port} 
                        className="form-control mystyle"
                        onChange={this.portChange.bind(this)} />
                </label><br/>

            </div>
        );
    }
};

