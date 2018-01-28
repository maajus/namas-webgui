import React from "react";


const powers = ['N/A','200mW','450mW','800mW'];

import { connect } from "react-redux"
import { getRxConfig } from "../actions/fetchActions";

//suscribe to redux store
@connect((store) => {

    return {
        TxStatus:store.TxStatus.data,
        RxConfig:store.RxConfig.data,
    };
})


export default class TxInfo extends React.Component {

    constructor(props){
        super(props);
        this.frequencies = ["412MHz","415MHz","418MHz"];
        };

    componentDidMount(){

        this.props.dispatch(getRxConfig());
        this._isMounted = true;
    }


    componentWillUnmount(){

        this._isMounted = false;
    }

    componentWillReceiveProps(newProps){

        if(newProps.RxConfig != undefined){
            this.frequencies = [
                (parseInt(newProps.RxConfig.BASE_FREQ) + 7).toString() + "MHz",
                (parseInt(newProps.RxConfig.BASE_FREQ) + 10).toString() + "MHz",
                (parseInt(newProps.RxConfig.BASE_FREQ) + 13).toString() + "MHz"
            ]
        }
    }




    render() {


//5        console.log(this.props);
        var mem = "N/A";
        if(this.props.TxStatus.FreeMemory > 0)
        mem = (this.props.TxStatus.FreeMemory/1024).toFixed(1) +
                       "/"+ (this.props.TxStatus.TotalMemory/1024).toFixed(1) +" GB";

        var bat = "N/A"
        if(this.props.TxStatus.BatteryPercentage > 0)
            bat = this.props.TxStatus.BatteryPercentage+" V";

        if(this.props.TxStatus.Freq != "0")
            var Freq = parseInt(this.props.TxStatus.Freq)/5+parseInt(this.props.RxConfig.BASE_FREQ) + " MHz"
        else Freq = "N/A";

        let hidden="my-label";
        if(this.props.hideMemory)
            hidden = "my-label hidden";


        return (
            <div className="container-fluid jumbotron" style={{padding:'1px'}}>

                <div className="col-lg-2 col-md-2 col-sm-2 col-xs-3" style={{paddingLeft:'0px'}}>
                    <label className="my-label"> TX ID: </label>
                    <br/>
                    <label className="my-label">TX NAME: </label>
                    <br/>
                    <label className="my-label">FREQUENCY:</label>
                </div>
                <div className="col-lg-4 col-md-4 col-sm-4 col-xs-3" style={{color:'#0abcc7', fontWeight:'bold', paddingLeft:"0px"}}>
                    <label className="my-label">{this.props.TxStatus.TxID} </label>
                    <br/>
                    <label className="my-label">{this.props.TxStatus.Name}</label>
                    <br/>
                    <label className="my-label">
                        {Freq}
                    </label>
                </div>

                <div className="col-lg-2 col-md-2 col-sm-2 col-xs-2">
                    <label className="my-label">POWER:</label>
                    <br/>
                    <label className="my-label">VOLTAGE:</label>
                    <br/>
                    <label className={hidden}>MEMORY:</label>
                </div>

                <div className="col-lg-4 col-md-4 col-sm-4 col-xs-4"
                    style={{color:'#0abcc7', fontWeight:'bold', paddingRight:"0px", paddingLeft:"20px"}}>
                    <label className="my-label">{powers[this.props.TxStatus.Power]}</label>
                    <br/>
                    <label className="my-label">{bat}</label>
                    <br/>
                    <label className={hidden}>{mem}</label>
                </div>
            </div>
        );
    }
};

