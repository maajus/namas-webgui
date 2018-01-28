import React from "react";
import { connect } from "react-redux"
import { fetchWifiStatus } from "../../actions/fetchActions";
import { sendCommand } from "../../actions/fetchActions";


@connect((store) => {

    return {
        modemSettings: store.RxSettings.data,
    };
})



export default class Sms extends React.Component {

    constructor(props){
        super(props);

    };

    nrChanged(nr,event){

        var data = this.props.modemSettings;
        data.Modem.NrList["Nr"+nr] = event.target.value;
        this.setState({modemSettings:data});

    }



    testNr(nr){
        this.props.dispatch(sendCommand("Set", "CommandToRx", {TestNr:this.state.modemSettings.Modem.NrList["Nr"+nr]}));
    }

    render() {

        return (
            <div className="container-fluid" style={{paddingTop:"0px"}}>

                <div className="col-xs-12" style={{paddingBottom:"10px"}}>
                    <label className="my-label"> 
                        SMS commands
                    </label>
                </div>

                <div className="col-lg-12 col-xs-12" >

                    <div className="col-6-lg col-md-6 col-sm-6 col-xs-6">
                        <label style={{paddingTop:'5px'}}>
                            <label className="my-label">Phone number 1:</label>
                            <input
                                type="text"
                                value={this.props.modemSettings.Modem.NrList.Nr1}
                                className="form-control mystyle"
                                onChange={this.nrChanged.bind(this,1)} />
                        </label>
                        <br/>
                        <label style={{paddingTop:'0px'}}>
                            <label className="my-label">Phone number 2:</label>
                            <input
                                type="text"
                                value={this.props.modemSettings.Modem.NrList.Nr2}
                                className="form-control mystyle"
                                onChange={this.nrChanged.bind(this,2)} />
                        </label>
                        <br/>
                        <label style={{paddingTop:'0px'}}>
                            <label className="my-label">Phone number 3:</label>
                            <input
                                type="text"
                                value={this.props.modemSettings.Modem.NrList.Nr3}
                                className="form-control mystyle"
                                onChange={this.nrChanged.bind(this,3)} />
                        </label>
                    </div>
                    <div className="col-6-lg col-md-6 col-sm-6 col-xs-6">

                        <button 
                            type="button"
                            className="btn btn-primary btn-work"
                            onClick={this.testNr.bind(this,1)} 
                            style={{height:"35px",marginTop:"26px", marginBottom:"26px"}}
                        ><label className="my-label">Test</label></button><br/>

                    <button 
                        type="button"
                        className="btn btn-primary btn-work"
                        style={{height:"35px", marginBottom:"26px"}}
                        onClick={this.testNr.bind(this,2)} 
                    ><label className="my-label">Test</label></button><br/>


                <button 
                    type="button"
                    className="btn btn-primary btn-work"
                    onClick={this.testNr.bind(this,3)} 
                    style={{height:"35px"}}
                ><label className="my-label">Test</label></button><br/>
            </div>

        </div>
    </div>
        );
    }
};

