import React from "react";

import { sendCommand } from "../../actions/fetchActions";
import { connect } from "react-redux"


@connect((store) => {

    return {
        data:store.RxStatus.data,
    };
})




export default class Storage extends React.Component {

    //get rx settings
    refresh(){

        this.props.refresh();

    }

    //send browser time to rx
    formatStorage(){

        this.props.dispatch(sendCommand("Set","CommandToRx", {FormatSD:1}));
    }


    render() {

        if(this.props.data != null) {

            var perc = (100-(this.props.data.FreeMemory/this.props.data.TotalMemory)*100).toFixed(2);
            var used = this.props.data.TotalMemory - this.props.data.FreeMemory;
            if(used < 6) used = 0;


            return (
                <div>
                    <div className="row">
                        <div style={{padding:"10px"}}>
                            <div className="progress" style={{height:"20px"}}>
                                <div className="progress-bar"
                                    role="progressbar"
                                    aria-valuenow={perc}
                                    aria-valuemin="0"
                                    aria-valuemax="100"
                                    style={{width: perc+"%",background:"#0ABCC7", height:"20px"}}>
                            <span style={{top:"2px"}}>{perc.toString() + "%"}</span>
                                </div>
                                </div>


                        </div>
                        <div className="col-lg-12 center-block">
                            <label style={{paddingTop:'5px'}} >
                                Total:  <b>{this.props.data.TotalMemory} MB</b>
                            </label><br/>
                            <label > Used: <b> {used} MB</b></label><br/>
                            <label style={{paddingBottom:'20px'}}>
                                Free:  <b>{this.props.data.FreeMemory} MB</b>
                            </label><br/>


                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={this.formatStorage.bind(this)}>
                                Format
                            </button>
                        </div>
                    </div>

                </div>
            );
        }else{
            return <span>Loading...</span>
        }
    }
};

