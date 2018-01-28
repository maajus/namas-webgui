"user strict;"

import React from "react";
import Button from "../components/Button";
import DaySelector from "../components/DaySelector";
import TimerEditModal from "../pages/TimerEditModal";

import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import { connect } from "react-redux"
import { fetchRxTimers } from "../actions/fetchActions";
import { sendCommand } from "../actions/fetchActions";


const Buttons = {
    MainMenu:1,
    Add:2,
    Delete:3,
}

var moment = require('moment');


@connect((store) => {

    return {
        Timers: store.RxTimers.data.Timers,
    };
})



export default class RxTimers extends React.Component {

    constructor(){
        super();
        this.state = { Timers:[], ShowTimerEdit:false, width:'0', height:'0' }; /* initial state */
        this._isMounted = false;
    };

    componentDidMount(){

        this._isMounted = true;
        //send request for timers data
        this.props.dispatch(fetchRxTimers());
        this.updateDimensions();
        window.addEventListener("resize", this.updateDimensions.bind(this));
    }

    componentWillUnmount(){
        this._isMounted = false;
        window.removeEventListener("resize", this.updateDimensions.bind(this));
    }

    updateDimensions(){
        if(this._isMounted)
            this.setState({ width: window.innerWidth, height: window.innerHeight });
    }


    componentWillReceiveProps(newProps){

        if(newProps.Timers != null && newProps.Timers.RxTimer != undefined){

            var Timers = newProps.Timers.RxTimer;
            //if single timer available put it to array
            if(Timers.constructor == Array)
                this.setState({Timers:Timers});
            else
                this.setState({Timers:[Timers]});
        }
    }



    //called by button childs
    buttonClick(id){

        switch(id){
            case Buttons.Add:
                this.addTimer();
                break;

            case Buttons.Delete:
                this.removeTimer();
                break;

            case Buttons.MainMenu:

                this.props.route.history.push('/');
                break;

            default:
                console.log("No such button");
        }

    };


    //checkbox handeler, marks preset for deletion
    onRowSelect(row, isSelected, e){
        var temp = this.state.Timers;

        if(temp[row.Nr-1].selected == undefined)
            temp[row.Nr-1].selected = true;
        else
            temp[row.Nr-1].selected = !temp[row.Nr-1].selected;


        this.setState({Timers:temp});
    }


    onSelectAll(isSelected, rows) {

        var temp = this.state.Timers;
        for(var i = 0; i<temp.length; i++){
            temp[i].selected = isSelected;
        }
        this.setState({Timers:temp});
    }

    onRowDoubleClick(row){

        //console.log(row);
        this.setState({ShowTimerEdit:{
            show:true,
            beg:row.StartTimestamp,
            days:row.Days,
            end:row.EndTimestamp,
            txid:row.TxId,
            upload:row.Action.Upload_new,
            smsNotifications:row.Action.SMS_notify,
            interruptTX:row.Action.Interrupt,
            nr:row.Nr,
            invalidDay:false,
            invalidDate:false,

        }});

    }


    dayFormatter(url, row) {
        return (
            <DaySelector days={row.Days}/>
        )
    };


    //add new tx timer to the end of list
    addTimer(){

        var temp = this.state.Timers;
        if(temp.length >= 10){
            alert("Max 10 Rx timers");
            return;
        }
        temp.push({
            Nr:temp.length+1,
            Name:"Timer"+(temp.length+1),
            StartTimestamp: moment().add(5,'m').format('YYYY-MM-DD HH:mm'),
            EndTimestamp: moment().add(10,'m').format('YYYY-MM-DD HH:mm'),
            Days:0,
            TxId:"",
            Enabled:"1",
            Action:{Upload_new:"0", Interrupt:"1", Download_new:"1"},
            selected: false,
        });

        this.setState({Timers:temp});
        this.saveTimers();

    }

    //remove selected timers from array
    removeTimer(){
        var temp = this.state.Timers;

        for (var i = temp.length -1; i >= 0; i--){
            if(temp[i].selected == 1){
                temp.splice(i,1);
            }

        }
        for(var i = 0; i<temp.length; i++){
            temp[i].nr = i+1;
        }

        this.setState({Timers:temp});
        this.saveTimers();
    }

    //format and send timer list
    saveTimers(){

        var temp = this.state.Timers;
        var timers = [];

        for(var i = 0; i<temp.length; i++){
            timers.push({RxTimer:
                temp[i]
            })
        }

        var data = {Timers:timers};
        this.props.dispatch(sendCommand("Set","RxTimers",data));
        //console.log(data);
    }

    //modal timer edit closed
    TimerEditFinished(val,save){

        //console.log("return");
        //console.log(val);
        var show = this.state.ShowTimerEdit;
        show.show=false;
        this.setState({ShowTimerEdit:show});
        if(!save) return;
        if(val.txid == undefined || val.txid == "") return;

        var temp = this.state.Timers;
        var nr = parseInt(val.nr)-1;
        if(temp.constructor == Array){
            temp[nr].StartTimestamp = val.beg.format('YYYY-MM-DD HH:mm');
            temp[nr].EndTimestamp = val.end.format('YYYY-MM-DD HH:mm');
            temp[nr].Days = val.days;
            temp[nr].Action.Interrupt = val.interruptTX;
            temp[nr].Action.Upload_new = val.upload;
            temp[nr].Action.SMS_notify = val.smsNotifications;
            temp[nr].TxId = val.txid;
        }
        else{

            temp.StartTimestamp = val.beg.format('YYYY-MM-DD HH:mm');
            temp.EndTimestamp = val.end.format('YYYY-MM-DD HH:mm');
            temp.Days = val.days;
            temp.Action.Interrupt = val.interruptTX==true ? "1":"0";
            temp.Action.SMS_notify = val.smsNotifications;
            temp.Action.Upload_new = val.upload ? "1":"0";
            temp.TxId = val.txid;
        }


        this.setState({Timers:temp});
        this.saveTimers();
    }

    endDateFormatter(url, row) {

        let string = row.EndTimestamp;
        if(parseInt(row.Days) > 0) 
            string = moment(row.Ending).format('HH:mm');
        return (
            <span>{string}</span>
        )
    };

    begDateFormatter(url, row) {

        let string = row.StartTimestamp;
        if(parseInt(row.Days) > 0) 
            string = moment(row.Ending).format('HH:mm');
        return (
            <span>{string}</span>
        )
    };



    timerModal(){

        if(this.state.ShowTimerEdit.show)
            return(
                <TimerEditModal
                    data={this.state.ShowTimerEdit}
                    callback={this.TimerEditFinished.bind(this)}
                    rxtimer={true}
                />
            );
        

    }



    //create table component from state.TxPresets
    createTable(){

        var temp = this.state.Timers;

        if(temp != undefined){
        var selected = temp.map(function(timer){

            if(timer.selected == true)
                return timer.Nr;
        } );

        }

        var selectRowProp = {
            mode: 'checkbox',
            onSelect: this.onRowSelect.bind(this),
            onSelectAll: this.onSelectAll.bind(this),
            bgColor: '#0ABCC7',
            selected: selected,
            hideSelectColumn: this.state.width < 992 //hide select col if win width < 992
        };

        var options = {
            onRowDoubleClick: this.onRowDoubleClick.bind(this),
            onRowClick: this.onRowSelect.bind(this)
        };


        return (
            <BootstrapTable
                data={this.state.Timers}
                selectRow={selectRowProp}
                striped={true}
                hover={true}
                bordered={false}
                trClassName='my-bootstraptable-tr'
                tableHeaderClass='my-bootstraptable-header'
                tableBodyClass='my-bootstrap-body'
                options={options}
                maxHeight="420px"
            >

            <TableHeaderColumn width='50px' dataAlign='left' dataField='Nr' hidden={this.state.width < 992} isKey={true}>
                Nr.
            </TableHeaderColumn>
            <TableHeaderColumn dataAlign='center' width="15%" dataField='Name' hidden={this.state.width < 992}>
                Name
            </TableHeaderColumn>
            <TableHeaderColumn 
                dataAlign='center' 
                width="28%" 
                dataField='StartTimestamp' 
                dataFormat={this.begDateFormatter}
            >Beginning</TableHeaderColumn>
            <TableHeaderColumn 
                dataAlign='center' 
                width="28%" 
                dataField='EndTimestamp' 
                dataFormat={this.endDateFormatter}
            >Ending</TableHeaderColumn>
            <TableHeaderColumn dataAlign='center'  dataField='Days' dataFormat={this.dayFormatter}>
                Repeat
            </TableHeaderColumn>
        </BootstrapTable>
        )}



    render() {

        //console.log(this.state.Timers);
        return (
            <div className="container-fluid jumbotron mainFrame">

                <div className="col-lg-10" style={{padding:"0px",height:"460px"}}>

                    <h3> RX Timers </h3>
                    <hr style={{marginTop:'5px'}} />
                    {this.createTable()}
                </div>

                <div className="col-lg-2 threeSideButtons">
                    <div className="col-lg-12 col-md-4 col-xs-4">
                        <Button id={Buttons.Add} label="Add" icon="New"  onClick={this.buttonClick.bind(this)}/>
                    </div>
                    <div className="col-lg-12 col-md-4 col-xs-4">
                        <Button id={Buttons.Delete} label="Delete" icon="Delete"  onClick={this.buttonClick.bind(this)}/>
                    </div>
                    <div className="col-lg-12 col-md-4 col-xs-4">
                        <Button id={Buttons.MainMenu} label="Main Menu" icon="Main_Menu"  onClick={this.buttonClick.bind(this)}/>
                    </div>
                </div>

                {this.timerModal()}

            </div>
        );
    }
};

