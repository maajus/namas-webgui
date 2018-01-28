"use strict;"

import React from "react";
import Button from "../components/Button";
import DaySelector from "../components/DaySelector";
import TimerEditModal from "../pages/TimerEditModal";


import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import { connect } from "react-redux"

import { fetchTimerpad } from "../actions/fetchActions";
import { sendCommand } from "../actions/fetchActions";

var moment = require('moment');

const Buttons = {
    MainMenu:1,
    Add:2,
    Delete:3,
}



@connect((store) => {

    return {
        Timers: store.Timerpad.data.Timers,
    };
})


export default class Timerpad extends React.Component {

    constructor(){
        super();
        this.state = { Timers:[], ShowTimerEdit:false }; /* initial state */
        this._isMounted = false;
    };

    componentDidMount(){

        //send request for timers data
        this.props.dispatch(fetchTimerpad());
        this.updateDimensions();
        window.addEventListener("resize", this.updateDimensions.bind(this));

    }

    componentWillReceiveProps(newProps){

        if(newProps.Timers != null){

            var Timers = newProps.Timers.TxTimer;
            //if single timer available put it to array
            if(Timers.constructor == Array)
                this.setState({Timers:Timers});
            else
                this.setState({Timers:[Timers]});
        }


    }

    componentWillUnmount(){
        this._isMounted = false;
        window.removeEventListener("resize", this.updateDimensions.bind(this));
    }


    updateDimensions(){
        if(this._isMounted)
            this.setState({ width: window.innerWidth, height: window.innerHeight });
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
            beg:row.Beginning,
            days:row.Days,
            end:row.Ending,
            nr:row.Nr
        }});


    }


    dayFormatter(url, row) {
        return (
            <DaySelector days={row.Days}/>
        )
    };

    endDateFormatter(url, row) {

        let string = row.Ending;
        if(parseInt(row.Days) > 0) 
            string = moment(row.Ending).format('HH:mm');
        return (
            <span>{string}</span>
        )
    };

    begDateFormatter(url, row) {

        let string = row.Beginning;
        if(parseInt(row.Days) > 0) 
            string = moment(row.Ending).format('HH:mm');
        return (
            <span>{string}</span>
        )
    };



    createTable(){

        var temp = this.state.Timers;
        var selected = temp.map(function(timer){

            if(timer.selected == true)
                return timer.Nr;
        } );


        var selectRowProp = {
            mode: 'checkbox',
            onSelect: this.onRowSelect.bind(this),
            onSelectAll: this.onSelectAll.bind(this),
            bgColor: '#0ABCC7',
            selected: selected,
            //clickToSelect: true,
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
                options={options}
                trClassName='my-bootstraptable-tr'
                tableHeaderClass='my-bootstraptable-header'
                tableBodyClass='my-bootstrap-body'
                maxHeight="400px"

            >

            <TableHeaderColumn width='50px' dataAlign='left' dataField='Nr' hidden={this.state.width < 992} isKey={true}> Nr.
            </TableHeaderColumn>
            <TableHeaderColumn 
                dataAlign='center'  
                width="30%"  
                dataField='Beginning' 
                dataFormat={this.begDateFormatter}
            >Beginning</TableHeaderColumn>
            <TableHeaderColumn 
                dataAlign='center'  
                width="30%"  
                dataField='Ending' 
                dataFormat={this.endDateFormatter}
            >Ending</TableHeaderColumn>

            <TableHeaderColumn dataAlign='center'  dataField='Days' dataFormat={this.dayFormatter}>
                Repeat
            </TableHeaderColumn>
        </BootstrapTable>
        )}

    //add new tx timer to the end of list
    addTimer(){

        var temp = this.state.Timers;
        temp.push({
            Nr:temp.length+1,
            Beginning: moment().format('YYYY-MM-DD HH:mm'),
            Ending: moment().add(10,'m').format('YYYY-MM-DD HH:mm'),
            Days:0,
            selected: false,
        });

        this.setState({TxPresets:temp});
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
            timers.push({TxTimer:
                temp[i]
            })
        }

        var data = {Timers:timers};
        this.props.dispatch(sendCommand("Set","TimerPad",data));
        //console.log(data);
    }

    //modal timer edit closed
    TimerEditFinished(val,save){

        //console.log(val);
        var show = this.state.ShowTimerEdit;
        show.show=false;
        this.setState({ShowTimerEdit:show});
        //cancel was clicked
        if(!save) return;


        var temp = this.state.Timers;
        var nr = parseInt(val.nr)-1;
        temp[nr].Days = val.days.toString();
        //if(val.days = 0){
            temp[nr].Beginning = val.beg.format('YYYY-MM-DD HH:mm');
            temp[nr].Ending = val.end.format('YYYY-MM-DD HH:mm');
        //}
        //else{
            //temp[nr].Beginning = val.beg.format('HH:mm');
            //temp[nr].Ending = val.end.format('HH:mm');
        //}

        this.setState({Timers:temp});
        this.saveTimers();

    }

    timerModal(){

        if(this.state.ShowTimerEdit.show)
            return(
                <TimerEditModal
                    data={this.state.ShowTimerEdit}
                    callback={this.TimerEditFinished.bind(this)}
                    rxtimer={false}
                />
            );
        

    }

    render() {

        //console.log(this.state);
        return (
            <div className="container-fluid jumbotron mainFrame">

                <div className="col-lg-10" style={{padding:"0px", height:"460px"}}>

                    <h3> Timer Pad </h3>
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

