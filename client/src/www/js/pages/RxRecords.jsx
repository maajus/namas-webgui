"use strict;"

import React from "react";
import Button from "../components/Button";
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';

import {
    Modal,
    ModalHeader,
    ModalTitle,
    ModalClose,
    ModalBody,
    ModalFooter
} from 'react-modal-bootstrap';

import { connect } from "react-redux"
import { fetchRxRecords } from "../actions/fetchActions";
import { sendCommand } from "../actions/fetchActions";

const dialogStyles = {
    base: {
        top: -800,
        transition: 'top 0.4s'
    },
    open: {
        top: 100
    },
    divWidth: {
        width:600
    }
}

const Buttons = {
    MainMenu:1,
    Refresh:2,
    Info:3,
}

@connect((store) => {

    return {
        RxRecords: store.RxRecords.data,
    };
})



export default class RxRecords extends React.Component {

    constructor(){
        super();

        this.moment = require('moment');

        this._isMounted = false;
        this.state = { height: '0px',Records:[], showModal:-1 };

    };

    componentDidMount(){

        this._isMounted = true;
        this.updateDimensions();
        window.addEventListener("resize", this.updateDimensions.bind(this));

        //send request for timers data
        this.props.dispatch(fetchRxRecords());

    }


    componentWillUnmount(){

        this._isMounted = false;
        window.removeEventListener("resize", this.updateDimensions.bind(this));
    }


    componentWillReceiveProps(newProps){

        //console.log(newProps);

        if(newProps.RxRecords.RecordsList != undefined){
            if(newProps.RxRecords.RecordsList == ""){ 
                this.setState({Records:[]});
                return;
            }

            var Records = newProps.RxRecords.RecordsList.Record_info;
            //if single timer available put it to array
            if(Records.constructor == Array)
                this.setState({Records:this.parseData(Records)});
            else
                this.setState({Records:this.parseData([Records])});
        }


    }


    updateDimensions(){

        if(this._isMounted)
            this.setState({width: window.innerWidth, height: window.innerHeight });
    }


    parseData(data){

        if(data.length <= 0 || data==undefined ) return ;

        var nr = 1;
        //change audio_type and multirec for each item
        return data.map( function(item) {

            item.nr = nr.toString();
            var filename_parts = item.filename.split("_");
            item.tx_id = filename_parts[0];
            item.audio_type = parseInt(filename_parts[3]) > 1 ? "Stereo":"Mono";
            if(parseInt(item.multirec) == 1)
                item.multirec = "MULTI";
            else
                item.multirec = item.filename.slice(-3) == "wav" ? "WAV":"DAT";

            nr++;
            return item;


        })

    }


    //called by button childs
    buttonClick(id){

        switch(id){
            case Buttons.Refresh:
                this.refreshList();
                break;
            case Buttons.MainMenu:
                this.props.route.history.push('/');
                break;

            case Buttons.Info:
                this.modalOpen();
                break;


            default:
                console.log("No such button");
        }

    };

    refreshList(){
        //send request for timers data
        this.props.dispatch(fetchRxRecords());
    }


    //request download file
    download(file) {

        // fake server request, getting the file url as response
        setTimeout(() => {
            const response = {
                file: '/private/'+file,
            };
            // server sent the url to the file!
            // now, let's download:
            window.location.href = response.file;
            // you could also do:
            // window.open(response.file);
        }, 100);
    }

    //checkbox handeler, marks rec for deletion
    onRowSelect(row, isSelected, e){

        var temp = this.state.Records;
        temp[temp.indexOf(row)].selected = isSelected;
        this.setState({Records:temp});
    }

    //sellects, deselets all rows
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

    //delete selected records
    deleteClicked(){

        var recs = this.state.Records;
        var recs_2_del = [];

        //find selected recs
        for(var i = 0; i<recs.length; i++){

            if(recs[i].selected == true){
                recs_2_del.push({RxRecord:{task:1, recordFileName:recs[i].filename}});
            }
        }
        //no records selected
        if(recs_2_del.length<=0) return;


        let ret = confirm("Delete selected records?");

        if(ret){
            this.props.dispatch(sendCommand("Set","RecordsInRx",{ RxRecords:recs_2_del}));
            this.refreshList();
        }

    }


    downloadClicked(){

        var recs = this.state.Records;

        //find selected recs
        for(var i = 0; i<recs.length; i++){

            if(recs[i].selected == true){
                this.download(recs[i].filename);
            }
        }

    }

    modalOpen(){

        var recs = this.state.Records;

        //find selected recs
        for(var i = 0; i<recs.length; i++){

            if(recs[i].selected == true){
                this.setState({Records:recs, showModal:i});
                return;
            }
        }
    }


    modalClosed(){
        var recs = this.state.Records;
        this.setState({Records:recs,showModal:-1});
    }



    fileInfo(rec_nr){

        if(rec_nr < 0 || rec_nr == undefined) return;

        var recs = this.state.Records;
        var EndDate = this.moment(recs[rec_nr].filename.split("_")[2], 'YYYY.MM.DD.HH.mm').format('YYYY-MM-DD HH:mm:ss');
        var Channels = 1;
        if(recs[rec_nr].audio_type == "Stereo") Channels = 2;

        //console.log(recs);
        if(recs.length == 0) return;

        return(
            <div>
                <label style={{wordWrap: "break-word"}} className="my-label">File name:&nbsp;<b>{recs[rec_nr].filename}</b></label><br/>
                <label className="my-label">Recorded with TX ID:&nbsp;<b>{recs[rec_nr].tx_id}</b></label><br/>
                <label className="my-label">Begin:&nbsp;<b>{recs[rec_nr].begin}</b></label><br/>
                <label className="my-label">End:&nbsp;<b>{EndDate}</b></label><br/>
                <label className="my-label">Duration:&nbsp;<b>{recs[rec_nr].duration} </b></label><br/>
                <label className="my-label">Size:&nbsp; <b> {recs[rec_nr].Size/1024/1024} MB</b></label><br/>
                <label className="my-label">Channels:&nbsp; <b> {Channels} </b></label><br/>
                <label className="my-label">Created:&nbsp; <b> {recs[rec_nr].created} </b></label><br/>
                <label style={{wordWrap: "break-word"}} className="my-label">SHA: <b>{recs[rec_nr].sha256}</b></label><br/>
            </div>

        )
    }


    //create table component from state.TxPresets
    createTable(){

        var temp = this.state.Records;
        var selected = temp.map(function(rec){

            if(rec.selected == true)
                return rec.nr;
        } );


        var selectRowProp = {
            mode: 'checkbox',
            clickToSelect: true,
            onSelect: this.onRowSelect.bind(this),
            onSelectAll: this.onSelectAll.bind(this),
            bgColor: '#0ABCC7',
            hideSelectColumn: this.state.width < 992, //hide select col if win width < 992
            selected: selected
        };

        let noDataText = "Loading";
        if(this.props.RxRecords.RecordsList == "") noDataText = "No records found";

        var options = {
            onRowDoubleClick: this.onRowDoubleClick.bind(this),
            noDataText: noDataText,
        };

        return (
            <BootstrapTable
                data={this.state.Records}
                selectRow={selectRowProp}
                striped={true}
                hover={true}
                bordered={false}
                search
                trClassName='my-bootstraptable-tr'
                tableHeaderClass='my-bootstraptable-header'
                tableBodyClass='my-bootstrap-body'
                options={options}
                maxHeight="400px"
            >

            <TableHeaderColumn
                dataAlign='left'
                dataField='nr'
                hidden={this.state.width < 992}
                isKey={true}
                width="10%"> Nr.</TableHeaderColumn>

            <TableHeaderColumn dataAlign='center'  dataField='tx_id' width="10%">ID</TableHeaderColumn>
            <TableHeaderColumn dataAlign='center'  dataField='begin' width="28%">Beginning</TableHeaderColumn>
            <TableHeaderColumn dataAlign='center'  dataField='duration' width="20%">Duration</TableHeaderColumn>
            <TableHeaderColumn dataAlign='center'  dataField='audio_type' width="13%">Ch</TableHeaderColumn>
            <TableHeaderColumn dataAlign='center'  dataField='multirec' width="19%">Mode</TableHeaderColumn>
        </BootstrapTable>
        )}


    render() {


        //var col_class = "col-md-2 col-sm-4 col-xs-6";
        return (
            <div className="container-fluid jumbotron mainFrame">

                <div className="col-lg-10" style={{padding:'0px'}}>

                    <h3> RX Records </h3>
                    <div className="btn-group btn-group-mano">
                        <button type="button" className="btn btn-default btn-mano" onClick={this.deleteClicked.bind(this)}>
                            <span className="glyphicon glyphicon-remove"></span>Delete
                        </button>
                        <button type="button" className="btn btn-default btn-mano" onClick={this.downloadClicked.bind(this)}>
                            <span className="glyphicon glyphicon-floppy-disk"></span> Download
                        </button>
                    </div>
                    <hr style={{marginTop:'5px'}} />
                    {this.createTable()}
                </div>


                <div className="col-lg-2 threeSideButtons">

                    <div className="col-lg-12 col-md-4 col-xs-4">
                        <Button id={Buttons.Refresh} label="Refresh" icon="Refresh"  onClick={this.buttonClick.bind(this)}/>
                    </div>
                    <div className="col-lg-12 col-md-4 col-xs-4">
                        <Button id={Buttons.Info} label="Info" icon="file_info"  onClick={this.buttonClick.bind(this)}/>
                    </div>

                    <div className="col-lg-12 col-md-4 col-xs-4">
                        <Button id={Buttons.MainMenu} label="Main Menu" icon="Main_Menu"  onClick={this.buttonClick.bind(this)}/>
                    </div>

                </div>

                <Modal
                    size="modal-lg"
                    isOpen={this.state.showModal>=0}
                    onRequestHide={this.modalClosed.bind(this)}
                    dialogStyles={dialogStyles}
                >
                    <ModalHeader>
                        <ModalClose onClick={this.modalClosed.bind(this)}/>
                        <ModalTitle>File info</ModalTitle>
                    </ModalHeader>
                    <ModalBody >
                        {this.fileInfo(this.state.showModal)}
                    </ModalBody>
                    <ModalFooter>
                        <button className='btn btn-default' onClick={this.modalClosed.bind(this)}>
                            Close
                        </button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
};


