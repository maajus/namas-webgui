import React from "react";
var moment = require('moment');

import { sendCommand } from "../../actions/fetchActions";
import { connect } from "react-redux"


@connect((store) => {

    return {
    };
})




export default class Date extends React.Component {

    constructor(props){
        super(props);
    };

    //get rx settings
    refreshTime(){
        this.props.refresh();
    }

    //send browser time to rx
    syncTime(){

        this.props.dispatch(sendCommand("Set","CommandToRx", {
            SetRxTime:1,
            Time:moment().format('YYYY-MM-DD HH:mm:ss')
        }));

        //this.props.socket.emit('req', {cmd: "Set", object: "CommandToRx", data:{
            //SetRxTime:1,
            //Time:moment().format('YYYY-MM-DD HH:mm:ss')
        //}});

        this.refreshTime();

    }


    render() {

        //get and format current time
        var now = moment().format('YYYY-MM-DD  HH:mm:ss');

        if(this.props.data != null) {

            return (
                <div className="container-fluid">
                    <div style={{paddingBottom:"20px"}}>
                        <label> Browser time : <b>{now}</b> </label>
                        <br/>
                        <label> RX time : <b>{this.props.data}</b> </label>
                    </div>
                    <div className="btn-group btn-group-mano" >
                        <button 
                            style={{width:"120px",textAlign:'center', padding:"5px"}}
                            type="button" 
                            className="btn btn-default btn-mano" 
                            onClick={this.refreshTime.bind(this)}>
                            Refresh
                        </button>
                        <button 
                            style={{width:"120px",textAlign:'center', padding:"5px"}}
                            type="button" 
                            className="btn btn-default btn-mano" 
                            onClick={this.syncTime.bind(this)}>
                            Sync
                        </button>
                    </div>

                </div>
            );
        }else{
            return <span> </span>
        }
    }
};

