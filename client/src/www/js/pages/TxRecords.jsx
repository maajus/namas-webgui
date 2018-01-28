"use strict;"

import React from "react";
import Button from "../components/Button";


import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import { connect } from "react-redux"

import { fetchTxRecords } from "../actions/fetchActions";
import { sendCommand } from "../actions/fetchActions";



const Buttons = {
    MainMenu:1,
    Refresh:2,
}

//return style class for column if rec is new
function colClass(fieldValue, row, rowIdx, colIdx) {

    //return '';
    // fieldValue is column value
    // row is whole row object
    // rowIdx is index of row
    // colIdx is index of column
    if(row.is_new == "1"){
        return 'td-row-new';
    }
    return 'my-bootstraptable-tr';
}


@connect((store) => {

    return {
        TxRecords: store.TxRecords.data,
    };
})



export default class TxRecords extends React.Component {

    constructor(){
        super();
        this._isMounted = false;
        this.state = { height: '0px',Records:[] };
    };

    componentDidMount(){

        this._isMounted = true;
        this.updateDimensions();
        window.addEventListener("resize", this.updateDimensions.bind(this));


        //send request for timers data
        this.props.dispatch(fetchTxRecords());
    }

    componentWillUnmount(){

        window.removeEventListener("resize", this.updateDimensions.bind(this));
        this._isMounted = false;
    }

    componentWillReceiveProps(newProps){


        //console.log(newProps);
        if(newProps.TxRecords == undefined) return;

        if(newProps.TxRecords.RecordsList=="") this.setState({Records:[]});

        if(newProps.TxRecords.RecordsList != undefined){
            var Records = newProps.TxRecords.RecordsList.Record_info_Tx;


            //if single timer available put it to array
            if(Records.constructor == Array){

                for(var i=0; i<Records.length; i++){
                    var num = i+1;
                    var mode = "";
                    if(Records[i].is_new == "1")
                        mode = "NEW";
                    if(Records[i].multirec == "1")
                        mode+=" MULTI";
                    if(Records[i].is_part == "1")
                        mode+=" PART";

                    if(Records[i].audio_type == "3")
                        Records[i].channels = "Stereo";
                    else
                        Records[i].channels = "Mono";

                    Records[i].mode = mode;
                    Records[i].rec_nr = num.toString();
                }

                this.setState({Records:Records});

            }
            else{
                var mode = "";
                if(Records.is_new == "1")
                    mode = "NEW";
                if(Records.multirec == "1")
                    mode+=" MULTI";
                if(Records.is_part == "1")
                    mode+=" PART";

                if(Records.audio_type == "3")
                    Records.channels = "Stereo";
                else
                    Records.channels = "Mono";

                Records.mode = mode;
                Records.rec_nr = 1;

                this.setState({Records:[Records]});
            }
        }



    }

    updateDimensions() {

        if(!this._isMounted) return;
        this.setState({width: window.innerWidth, height: window.innerHeight });
    }



    //called by button childs
    buttonClick(id){

        switch(id){
            case Buttons.Refresh:
                this.refreshList();
                break;

            case Buttons.MainMenu:
                this.props.route.history.push('/download');
                break;
            default:
                console.log("No such button");
        }

    };

    refreshList(){
        //send request for timers data
        this.props.dispatch(fetchTxRecords());
    }


    //checkbox handeler, marks rec for deletion
    onRowSelect(row, isSelected, e){

        var temp = this.state.Records;
        temp[temp.indexOf(row)].selected = isSelected;
        this.setState({Records:temp});
    }



    onSelectAll(isSelected, rows) {

        var temp = this.state.Records;
        for(var i = 0; i<temp.length; i++){
            temp[i].selected = isSelected;
        }
        this.setState({Records:temp});
    }

    onRowDoubleClick(row){

        //console.log(row);

    }

    deleteClicked(){



        var recs = this.state.Records;
        var recs_2_del = [];
        

        //find selected recs
        for(var i=0; i<recs.length; i++){

            if(recs[i].selected == true){
                recs_2_del.push({TxRecord:{task:3, rec_nr:i+1}});
            }
        }
        //no records selected
        if(recs_2_del.length<=0) return;


        let ret = confirm("Records from 1 to "+recs_2_del[recs_2_del.length-1].TxRecord.rec_nr+" will be deleted");

        if(ret){
            this.props.dispatch(sendCommand("Set","DownloadFileToRx", {TxRecords:recs_2_del}));
            this.props.route.history.push('/download');
        }
    }

    //send cmd to download selected records
    downloadClicked(){


        var recs = this.state.Records;
        var recs_2_del = [];

        //find selected recs
        for(var i=0; i<recs.length; i++){

            if(recs[i].selected == true){
                recs_2_del.push({TxRecord:{task:1, rec_nr:i+1}});
            }
        }
        //no records selected
        if(recs_2_del.length<=0) return;

        this.props.dispatch(sendCommand("Set","DownloadFileToRx", {TxRecords:recs_2_del}));
        this.props.route.history.push('/download');
        //console.log(recs_2_del);

    }

    download_newClicked(){

        var recs = this.state.Records;
        var recs_2_del = [];

        //find selected recs
        for(var i=0; i<recs.length; i++){
            if(recs[i].is_new == "1"){
                recs_2_del.push({TxRecord:{task:1, rec_nr:i+1}});
            }
        }
        //no records selected
        if(recs_2_del.length<=0) return;

        this.props.dispatch(sendCommand("Set","DownloadFileToRx", {TxRecords:recs_2_del}));
        this.props.route.history.push('/download');


    }


    //create table component from state.TxPresets
    createTable(){
        var temp = this.state.Records;

        var selected = temp.map(function(record){

            if(record.selected == true){
                var num = parseInt(record.rec_nr);//need to reformat indexing
                return num.toString();
            }
        } );

        if(selected.length == 1) 
            if(selected[0] == "1")
                selected[0] = 1;


        var selectRowProp = {
            mode: 'checkbox',
            onSelect: this.onRowSelect.bind(this),
            onSelectAll: this.onSelectAll.bind(this),
            bgColor: '#0ABCC7',
            clickToSelect: true,
            hideSelectColumn: this.state.width < 992, //hide select col if win width < 992
            selected: selected
        };


        let noDataText = "Loading";
        //console.log(this.props.TxRecords);
        if(this.props.TxRecords == null) noDataText = "No records found";

        var options = {
            onRowDoubleClick: this.onRowDoubleClick.bind(this),
            noDataText: noDataText,
        };

        return (
            <BootstrapTable
                data={temp}
                selectRow={selectRowProp}
                striped={true}
                hover={true}
                bordered={false}
                maxHeight="400px"
                search
                tableHeaderClass='my-bootstraptable-header'
                options={options}
            >

            <TableHeaderColumn
                dataAlign='left'
                dataField='rec_nr'
                columnClassName={colClass}
                hidden={this.state.width < 992}
                isKey={true}
                width="10%"> Nr.</TableHeaderColumn>

            <TableHeaderColumn width="10%" dataAlign='center' columnClassName={colClass} dataField='tx_id'>ID</TableHeaderColumn>
            <TableHeaderColumn width="28%" dataAlign='center' columnClassName={colClass} dataField='begin' >Beginning</TableHeaderColumn>
            <TableHeaderColumn width="20%" dataAlign='center' columnClassName={colClass} dataField='duration' >Duration</TableHeaderColumn>
            <TableHeaderColumn width="13%" ataAlign='center' columnClassName={colClass} dataField='channels'>Ch</TableHeaderColumn>
            <TableHeaderColumn width="19%" dataAlign='center' columnClassName={colClass}  dataField='mode'>Mode</TableHeaderColumn>
        </BootstrapTable>
        )}

    render() {

        //var col_class = "col-md-2 col-sm-4 col-xs-6";
        return (
            <div className="container-fluid jumbotron mainFrame">

                <div className="col-lg-10" style={{padding:'0px'}}>

                    <h3> TX Records </h3>
                    <div className="btn-group btn-group-mano" >
                        <button type="button" className="btn btn-default btn-mano" onClick={this.deleteClicked.bind(this)}>
                            <span className="glyphicon glyphicon-remove"></span>Delete
                        </button>
                        <button type="button" className="btn btn-default btn-mano" onClick={this.downloadClicked.bind(this)}>
                            <span className="glyphicon glyphicon-download-alt"></span> Download
                        </button>
                        <button type="button" className="btn btn-default btn-mano" 
                            style={{width:"150px"}}
                            onClick={this.download_newClicked.bind(this)}>
                            <span className="glyphicon glyphicon-save"></span> Download New
                        </button>

                    </div>
                    <hr style={{marginTop:'5px'}} />
                    {this.createTable()}
                </div>
                <div className="col-lg-2 col-md-12 col-sm-12 col-xs-12 twoSideButtons">
                    <div className="col-lg-12 col-xs-6">
                        <Button id={Buttons.Refresh} label="Refresh" icon="Refresh"  onClick={this.buttonClick.bind(this)}/>
                    </div>
                    <div className="col-lg-12 col-xs-6">
                        <Button id={Buttons.MainMenu} label="Back" icon="Main_Menu"  onClick={this.buttonClick.bind(this)}/>
                    </div>

                </div>
            </div>
        );
    }
};

