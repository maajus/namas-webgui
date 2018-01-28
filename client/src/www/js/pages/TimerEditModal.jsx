"use strict;"

import React from "react";

//import InputMoment from '../components/input-moment/input-moment'
import {BigInputMoment, TimePicker} from 'react-input-moment'
import WeekDayPicker from '../components/WeekDayPicker';
import { connect } from "react-redux"
import { fetchTxPresets } from "../actions/fetchActions";
import Select from 'react-select';
import Checkbox from "../components/Checkbox";
import { fetchRxSettings } from "../actions/fetchActions";

var moment = require('moment');

import {
    Modal,
    ModalHeader,
    ModalTitle,
    ModalClose,
    ModalBody,
    ModalFooter
} from 'react-modal-bootstrap';


//suscribe to redux store
@connect((store) => {

    return {
        TxPresets:store.TxPresets.data,
        RxConfig:store.RxConfig.data,
        FtpEnabled:store.RxSettings.data.ftp_server,
    };
})



export default class TimerEditModal extends React.Component {

    constructor(){
        super();
        this.state={
            showModal:false, 
            beg:moment(), 
            end:moment().add(5,'m'), 
            interruptTX:1, 
            upload:0, 
            invalidDate:false, 
            smsNotifications:0,
            days:0,
            weekTimer:false
        };

    }

    componentDidMount(){


        this.props.dispatch(fetchRxSettings());
        this.props.dispatch( fetchTxPresets());

    }

    componentWillReceiveProps(nextProps){

        this.setState({showModal:nextProps.data.show, data:nextProps.data.data});
        if(nextProps.data.beg != undefined){
            let week = false;
            if(nextProps.data.days > 0) week = true;

            this.setState({beg:moment(nextProps.data.beg),
                end:moment(nextProps.data.end),
                days:nextProps.data.days,
                showModal:nextProps.data.show,
                txid:nextProps.data.txid,
                upload:nextProps.data.upload,
                interruptTX:nextProps.data.interruptTX,
                nr:nextProps.data.nr,
                smsNotifications:nextProps.data.smsNotifications,
                weekTimer:week,
            });

            this.timer = nextProps.data.data;
        }



    }

    modalClosed(){

        this.setState({showModal:false,invalidDate:false,invalidDay:false,days:0});
        this.props.callback(null,false);

    }


    begChanged(date){

        //console.log(date);
        this.setState({beg:date});

    }

    endChanged(date){

        //console.log(date);
        this.setState({end:date});
    }

    daysChanged(days){

        //console.log("days : "+days);
        this.setState({days:days});

    }

    txidChanged(val){

        this.setState({txid:val.label});

    }

    uploadChanged(val){

        var Val = val ? "1":"0";
        this.setState({upload:Val});
    }

    interruptTXChanged(val){

        var Val = val ? "1":"0";
        this.setState({interruptTX:Val});

    }

    smsNotificationsChanged(val){

        var Val = val ? "1":"0";
        this.setState({smsNotifications:Val});

    }

    typeSelected(event){

        var enable = event.target.value == "0"; //convert bool to int
        this.setState({weekTimer:enable});
    }



    typeSelector(){

        return(
            <div className="col-4-lg col-md-4 col-sm-4 col-xs-12" style={{paddingTop:"0px",paddingBottom:"20px"}} >
                <ul onChange={this.typeSelected.bind(this)} >
                    <li className="radioMenu">
                        <input 
                            type="radio" 
                            id="eth_on" 
                            value="1" 
                            checked={!this.state.weekTimer}/>

                        <label className="radioMenu" for="eth_on">Once </label>
                        <div className="check"></div>
                    </li>
                    <li className="radioMenu">
                        <input 
                            type="radio" 
                            id="eth_off" 
                            value="0" 
                            checked={this.state.weekTimer}/>

                        <label className="radioMenu" for="eth_off">Repeat</label>
                        <div className="check"><div class="inside"></div></div>
                    </li>
                </ul>
            </div>

        );

    }



    smsBox(){

        if(!this.props.rxtimer) return(<span/>);
        if(this.props.RxConfig.LTE != "1") return(<span/>);


        return(
            <Checkbox
                label="SMS notifications"
                checked={parseInt(this.state.smsNotifications)}
                handler={this.smsNotificationsChanged.bind(this)}
            />
        );




    }

    dayConfig(){

        if(this.state.weekTimer){

            let col = "white";
            if(this.state.invalidDay)
                col = "red";

            return(
                <div>
                    <label style={{color:col}}> Repeat: </label>
                    <div className="row" style={{paddingBottom:"20px"}}>
                        <div className="col-xs-12 text-center">
                            <WeekDayPicker days={this.state.days} valid={this.state.invalidDay} callback={this.daysChanged.bind(this)}/>
                        </div>
                    </div>
                </div>
            );
        }



    }

    timerConfig(){

        if(!this.props.rxtimer) return;
        if(this.props.TxPresets.TxPresetsList == undefined) return;
        if(this.props.TxPresets.TxPresetsList.TxPreset == undefined){//tx list is empty

            return <label style={{color:"red"}} > No TX preset found. Please Create one. </label>

        };

        var options;
        if(this.props.TxPresets.TxPresetsList.TxPreset.constructor == Array){

            //extract tx ids to options array
            options = this.props.TxPresets.TxPresetsList.TxPreset.map(function(item){
                return {value:0, label:item.ID}
            });

        }
        else{
            options = [{value:0, label:this.props.TxPresets.TxPresetsList.TxPreset.ID}]
        }

        //by default select first tx id
        var val = options[0];
        if(this.state.txid != "") {
            val = {value:0, label:options[0].label};
        }

        var upload;
        if(this.props.FtpEnabled != undefined){
            if(this.props.FtpEnabled.enabled != "1") upload = "true";
        }

        return (<div>TX ID:
            <Select
                name="form-field-name"
                value={val}
                options={options}
                onChange={this.txidChanged.bind(this)}
                searchable={false}
                clearable={false}
            />

        <Checkbox
            style={{paddingTop:"5px"}}
            disabled={upload}
            label="Upload downloaded records"
            checked={parseInt(this.state.upload)}
            handler={this.uploadChanged.bind(this)}
        />
        <Checkbox
            label="Interrupt TX REC"
            checked={parseInt(this.state.interruptTX)}
            handler={this.interruptTXChanged.bind(this)}
        />
    </div>
        );

    }


    saveDate(){
        //console.log(this.timer);
        var temp = this.state;

        if(temp.weekTimer){
            if(temp.days == 0){
                this.setState({invalidDay:true});
                return;
            }
        }
        else{
            temp.days = 0;

            if(temp.beg.isAfter(temp.end)){
                this.setState({invalidDate:true});
                return;
            }

        }


        if(this.state.txid == "" && this.props.rxtimer){

            var presets = this.props.TxPresets.TxPresetsList.TxPreset;

            if(presets.constructor == Array)
                temp.txid =  presets[0].ID;
            else
                temp.txid =  presets.ID;

        }
        this.props.callback(temp,true);

    }

    inputMoment(mom, handler){

        if(this.state.weekTimer){
            return (
                <TimePicker
                    moment={mom}
                    onChange={handler}
                    prevMonthIcon="icon ion-chevron-left"
                    nextMonthIcon="icon ion-chevron-right"
                />

            );

        }


        return (
            <BigInputMoment
                moment={mom}
                onChange={handler}
                prevMonthIcon="icon ion-chevron-left"
                nextMonthIcon="icon ion-chevron-right"
            />

        );


    }

    momentLabel(mom, invalid){


        if(!this.state.weekTimer){
            var borCol = "#464545";
            if(invalid)
                borCol = "red";


            return (
                <input
                    type="text"
                    value={mom.format('YYYY-MM-DD HH:mm')}
                    style={{paddingBottom:'10px', width:'60%', textAlign:"center", borderColor:borCol}}
                    className="form-control mystyle center-block" />
            );
        }

    }



    render() {

        //console.log(this.props);
        //console.log(this.state);

        if(this.props.TxPresets.TxPresetsList == undefined) return(<div/>);
        //get and format current time
        var showModal = this.state==null? false:this.state.showModal;

        return (
            <Modal isOpen={showModal} onRequestHide={this.modalClosed.bind(this)}>

                <ModalBody>
                    <div className="row">
                        {this.typeSelector()}
                    </div>

                    <div className="row">
                        <div className="col-lg-6 col-xs-12 text-center" style={{paddingHorizontal:"20px"}}>
                            <h3 style={{textAlign:"center",marginTop:"0px"}}> Begin</h3>
                            {this.momentLabel(this.state.beg,false)}
                            {this.inputMoment(this.state.beg,this.begChanged.bind(this))}
                        </div>

                        <div className="col-xs-12 visible-sm visible-xs visible-md" style={{height:"40px"}}/>

                        <div className="col-lg-6 col-xs-12 text-center" style={{paddingHorizontal:"20px"}}>
                            <h3 style={{textAlign:"center",marginTop:"0px"}}> End</h3>
                            {this.momentLabel(this.state.end,this.state.invalidDate)}
                            {this.inputMoment(this.state.end,this.endChanged.bind(this))}
                        </div>

                    </div>

                    <div className="row" style={{paddingLeft:"20px"}}>
                        {this.dayConfig()}
                        {this.timerConfig()}
                        {this.smsBox()}
                    </div>

                </ModalBody>

                <ModalFooter>
                    <button className='btn btn-default' onClick={this.modalClosed.bind(this)}>
                        Cancel
                    </button>
                    <button 
                        disabled={this.props.TxPresets.TxPresetsList.TxPreset == undefined}
                        className='btn btn-primary' 
                        onClick={this.saveDate.bind(this)}>
                        Save changes
                    </button>
                </ModalFooter>
            </Modal>
        );
    }
};

