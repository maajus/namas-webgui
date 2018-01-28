import React from "react";


import { sendCommand } from "../../actions/fetchActions";
import { connect } from "react-redux"


@connect((store) => {

    return {
        data:store.RxStatus.data,
    };
})



export default class System extends React.Component {

    //get rx settings
    refresh(){

        this.props.refresh();

    }

    //enter transport mode
    transportMode(){

        this.props.dispatch(sendCommand("Set", "CommandToRx", {DisableBattery:1}));
    }


    //reset system default settings
    factoryReset(){

        let ret = confirm("Are you sure you want to restore factory settings? RX will restart and all settings will be lost.");
        if(ret) 
            this.props.dispatch(sendCommand("Set", "CommandToRx", {FactoryDefaults:1}));

    }

    formatStorage(){

        let ret = confirm("Are you sure you want to format SD card? RX will restart and all records will be lost.");
        if(ret) 
            this.props.dispatch(sendCommand("Set","CommandToRx", {FormatSD:1}));

    }


    removePartial(){

        let ret = confirm("Are you sure you want to remove partial records?");
        if(ret) 
            this.props.dispatch(sendCommand("Set","CommandToRx", {RemovePartFiles:1}));

    }



    powerOffRx(){
        let ret = confirm("Are you sure you want to power OFF RX?");
        if(ret) 
            this.props.dispatch(sendCommand("Set","CommandToRx", {PowerOffRx:1}));

    }


    restartRX(){

        let ret = confirm("Are you sure you want to restart RX?");
        if(ret) 
            this.props.dispatch(sendCommand("Set","CommandToRx", {RestartRx:1}));

    }


    render() {

        //get and format current time
        //console.log(this.props.data);


        var perc = (100-(this.props.data.FreeMemory/this.props.data.TotalMemory)*100).toFixed(2);
        var used = this.props.data.TotalMemory - this.props.data.FreeMemory;
        if(used < 6) used = 0;



        if(this.props.data != null) {

            return (
                <div className="container-fluid">

                    <label style={{paddingBottom:"20px"}}> 
                        RX software version: &nbsp;<b> {this.props.version}</b> 
                    </label>


                    <div className="row">
                        <div style={{paddingLeft:"20px", paddingRight:"20px"}}>
                            <div className="progress" style={{height:"20px"}}>
                                <div className="progress-bar"
                                    role="progressbar"
                                    aria-valuenow={perc}
                                    aria-valuemin="0"
                                    aria-valuemax="100"
                                    style={{width: Math.round(perc)+"%",background:"#0ABCC7", height:"20px"}}>
                                    <span style={{top:"2px"}}>{perc.toString() + "%"}</span>
                                </div>
                            </div>
                        </div>
                    </div>


                    <div className="row" >
                        <div className="col-xs-6" >
                            <label className="my-label">
                                Total:   &nbsp;<b>{this.props.data.TotalMemory} MB</b>
                            </label><br/>
                            <label className="my-label" > Used:  &nbsp;<b> {used} MB</b></label><br/>
                            <label className="my-label" style={{paddingBottom:'30px'}}>
                                Free:   &nbsp;<b>{this.props.data.FreeMemory} MB</b>
                            </label><br/>

                        </div>

                        <div className="col-xs-6 " style={{textAlign:"center"}}>
                            <button
                                type="button"
                                className="btn btn-default my-button"
                                onClick={this.formatStorage.bind(this)}>
                                Format storage
                            </button>
                        </div>
                    </div>



                    <div className="row" style={{paddingBottom:"20px"}} >

                        <div className="col-xs-6 text-center"   >
                            <button
                                type="button"
                                className="btn btn-default my-button"
                                onClick={this.factoryReset.bind(this)}>
                                Reset to<br/> factory defaults
                            </button>
                        </div>

                        <div className="col-xs-6 text-center">
                            <button
                                type="button"
                                className="btn btn-default my-button"
                                onClick={this.removePartial.bind(this)}>
                                Remove partial <br/> records
                            </button>

                        </div>

                    </div>

                    <div className="row">
                        <div className="col-xs-6 text-center">
                            <button
                                type="button"
                                className="btn btn-default my-button"
                                onClick={this.restartRX.bind(this)}>
                                Restart RX
                            </button>
                        </div>

                        <div className="col-xs-6 text-center" >
                            <button
                                type="button"
                                className="btn btn-default my-button"
                                onClick={this.powerOffRx.bind(this)}>
                                Power OFF RX
                            </button>
                        </div>
                    </div>



                </div>

            );
        }else{
            return <span> </span>
        }
    }
};

//<div className="col-xs-12 col-lg-6 col-md-6 col-sm-6" style={{textAlign:"center",paddingBottom:"15px"}}>
//<button
//type="button"
//className="btn btn-primary"

//style={{width:"90%" ,height:"90px"}}
//onClick={this.transportMode.bind(this)}>
//Enter transport mode
//</button>
//</div>

