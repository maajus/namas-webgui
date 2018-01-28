"use strict;"

import React from "react";
import Button from "../components/Button";
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import { connect } from "react-redux"

import { fetchLog } from "../actions/fetchActions";
import { sendCommand } from "../actions/fetchActions";

const Buttons = {
    Delete:0,
    MainMenu:1,
    Refresh:2,
    Download:3,
}

//suscribe to redux store
@connect((store) => {

    return {
        Log:store.Log.data,
    };
})


export default class Log extends React.Component {

    constructor(){
        super();
        this.state = { LogEntries: []}; /* initial state */
    };

    componentDidMount(){

        //request log entries
        this.props.dispatch(fetchLog());
    }

    componentWillReceiveProps(newProps){

        if(newProps.Log != undefined && newProps.Log != this.props.Log)
            this.setState({LogEntries:this.parseTableData(newProps.Log.LogText)});
    }

    //called by button childs
    buttonClick(id){

        switch(id){
            case Buttons.Delete:
                this.props.dispatch(sendCommand("Set", "CommandToRx", {DeleteLog:1}));
                this.refreshList();
                break;
            case Buttons.Refresh:
                this.refreshList();
                break;

            case Buttons.Download:
                this.download("logfile");
                break;

            case Buttons.MainMenu:
                this.props.route.history.push('/');
                break;

            default:
                console.log("No such button");
        }

    };

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


    refreshList(){
        this.props.dispatch(fetchLog());
    }


    //split text to date and msg arrays
    parseTableData(Data){

        var rows = [];
        var date, msg;
        var data = Data.split("\n");

        rows = data.map(function(entry){

            date = entry.slice(1,20);
            msg = entry.slice(21,entry.length);
            return {date,msg}
        })

        return rows;
    }


    onRowSelect(row, isSelected, e){
    }


    //create table component from state.TxPresets
    createTable(){

        let noDataText = "Loading";

        const options = {
            paginationSize: 1,
            sizePerPage: 20,
            hideSizePerPage: true,
            noDataText: "Loading",
            page: 4,
            sortName: "date",
            sortOrder: "desc",
        };


        return (

            <BootstrapTable
                className="logTable"
                data={this.state.LogEntries}
                striped
                bordered={false}
                search
                options={options}
                height="425px"
                scrollTop={'Top'}
            >

            <TableHeaderColumn 
                width="125px" 
                dataAlign='left' 
                dataField='date' 
                dataSort={ true } 
                isKey={true}
            >
                Date
            </TableHeaderColumn>
            <TableHeaderColumn  dataAlign='left'  dataField='msg'>
                Message
            </TableHeaderColumn>
        </BootstrapTable>
        )}


    render() {

        return (
            <div className="wraper container-fluid jumbotron mainFrame">
                <div className="col-lg-10" style={{padding:"0px"}}>
                    <h3> System Log </h3>
                    <hr style={{paddingTop:'5px'}} />
                    {this.createTable()}
                </div>
                <div className="col-lg-2 threeSideButtons">
                    <div className="col-lg-12 col-md-4 col-xs-4">
                        <Button id={Buttons.Delete} label="Delete" icon="Connect"  onClick={this.buttonClick.bind(this)}/>
                    </div>
                    <div className="col-lg-12 col-md-4 col-xs-4">
                        <Button id={Buttons.Download} label="Download" icon="Save"  onClick={this.buttonClick.bind(this)}/>
                    </div>
                    <div className="col-lg-12 col-md-4 col-xs-4">
                        <Button id={Buttons.MainMenu} label="Main Menu" icon="Main_Menu"  onClick={this.buttonClick.bind(this)}/>
                    </div>
                </div>
            </div>
        );
    }
};

