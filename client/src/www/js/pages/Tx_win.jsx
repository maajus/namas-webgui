'use strict';

import React from "react";
import Button from "../components/Button";
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import { connect } from "react-redux"

import { fetchTxPresets } from "../actions/fetchActions";
import { sendCommand } from "../actions/fetchActions";
import { getRxConfig } from "../actions/fetchActions";
import { connectingToTx } from "../actions/fetchActions";

import {decodeAes } from "../modules/Aes";
import {encodeAes } from "../modules/Aes";
import { Mode } from "../modules/Constants.js";
import { TX_TYPES } from "../modules/Constants.js";


const Buttons = {
    Connect:0,
    MainMenu:1,
    Refresh:2,
}


const powers = ['200mW','450mW','800mW'];
const powersO = ['5mW','20mW','50mW'];



const createAesEditor = (onUpdate, props) => (<AesEditor onUpdate={ onUpdate } {...props}/>);
const createFEditor = (onUpdate, props) => (<FEditor onUpdate={ onUpdate } {...props}/>);
const createPEditor = (onUpdate, props) => (<PEditor onUpdate={ onUpdate } {...props}/>);

//suscribe to redux store
@connect((store) => {

    return {
        TxPresets:store.TxPresets.data,
        RxStatus:store.RxStatus.data,
        RxConfig: store.RxConfig.data,
    };
})



export default class Tx_win extends React.Component {

    constructor(){
        super();
        this._isMounted = false;
        this.state = { TxPresets: []}; /* initial state */
        this.frequencies = ["412MHz","415MHz","418MHz"];
    };

    componentDidMount(){

        this._isMounted = true;
        this.props.dispatch( fetchTxPresets());
        this.props.dispatch(getRxConfig());

    }


    componentWillUnmount(){
        this._isMounted = false;
    }


    componentWillReceiveProps(newProps){


        if(newProps.TxPresets != undefined && newProps.TxPresets != this.props.TxPresets)
            this.setState({TxPresets:this.parseTableData(newProps.TxPresets.TxPresetsList.TxPreset)});

        if(newProps.RxStatus.IsConnectedToTx == Mode.R_COMMAND || newProps.RxStatus.IsConnectedToTx == Mode.R_DOWNLOAD)
            this.props.route.history.push('/download');

        if(newProps.RxStatus.IsConnectedToTx == Mode.R_AUTO_DOWNLOAD)
            this.props.route.history.push('/contdownload');

        if(newProps.RxStatus.IsConnectedToTx == Mode.R_ONLINE)
            this.props.route.history.push('/online');

        if(newProps.RxStatus.IsConnectedToTx == Mode.R_RFTEST)
            this.props.route.history.push('/rftest');

        if(newProps.RxStatus.IsConnectedToTx == Mode.R_TX_REC_CHECK)
            this.props.route.history.push('/');

        if(newProps.RxConfig != undefined)
            this.frequencies = [
                (parseInt(newProps.RxConfig.BASE_FREQ) + 7).toString() + "MHz",
                (parseInt(newProps.RxConfig.BASE_FREQ) + 10).toString() + "MHz",
                (parseInt(newProps.RxConfig.BASE_FREQ) + 13).toString() + "MHz"
            ]
    }


    //called by button childs
    buttonClick(id){

        switch(id){
            case Buttons.Connect:

                this.savePresets();
                this.connect();
                break;
            case Buttons.Refresh:
                this.refreshList();
                break;

            case Buttons.MainMenu:
                this.props.route.history.push('/');
                break;
            default:
                console.log("No such button");
        }

    };

    refreshList(){

        this.props.dispatch( fetchTxPresets());

    }

    connect(){

        var temp = this.state.TxPresets;
        var selected = -1;
        var count = 0;

        for (var i = temp.length -1; i >= 0; i--){
            if(temp[i].selected == true){
                selected = i;
                count++;
            }
        }

        if(count > 1 || count == 0) return;
        //console.log("Selected "+temp[selected].ID);
        if(selected<0) return;




        //this.props.dispatch(connectingToTx(true));

        if(this.props.location.query.mode == "online"){
            this.props.route.history.push('/online');
            var tx = {TxId:temp[selected].ID, Mode:Mode.R_ONLINE};
            this.props.dispatch(sendCommand("Set", "ConnectToTx", tx));
        }

        if(this.props.location.query.mode == "rf"){
            if(temp[selected].Type == TX_TYPES.TX_TYPE_ONLINE
                || temp[selected].Type == TX_TYPES.TX_TYPE_ONLINE_1_2
                || temp[selected].Type == TX_TYPES.TX_TYPE_ONLINE_2_4)
            {
                alert("Only Online mode is available for this tx");
                return;
            }
            this.props.route.history.push('/rftest');
            var tx = {TxId:temp[selected].ID, Mode:Mode.R_RFTEST};
            this.props.dispatch(sendCommand("Set", "ConnectToTx", tx));
        }

        if(this.props.location.query.mode == "download"){
            if(temp[selected].Type == TX_TYPES.TX_TYPE_ONLINE
                || temp[selected].Type == TX_TYPES.TX_TYPE_ONLINE_1_2
                || temp[selected].Type == TX_TYPES.TX_TYPE_ONLINE_2_4)
            {
                alert("Only Online mode is available for this tx");
                return;
            }
            this.props.route.history.push('/download');
            var tx = {TxId:temp[selected].ID, Mode:Mode.R_COMMAND};
            this.props.dispatch(sendCommand("Set", "ConnectToTx", tx));
        }

        if(this.props.location.query.mode == "contdownload"){
            if(temp[selected].Type == TX_TYPES.TX_TYPE_ONLINE
                || temp[selected].Type == TX_TYPES.TX_TYPE_ONLINE_1_2
                || temp[selected].Type == TX_TYPES.TX_TYPE_ONLINE_2_4)
             {
                alert("Only Online mode is available for this tx");
                return;
            }
            this.props.route.history.push('/contdownload');
            var tx = {TxId:temp[selected].ID, Mode:Mode.R_AUTO_DOWNLOAD};
            this.props.dispatch(sendCommand("Set", "ConnectToTx", tx));
        }

        if(this.props.location.query.mode == "state"){
            if(temp[selected].Type == TX_TYPES.TX_TYPE_ONLINE
                || temp[selected].Type == TX_TYPES.TX_TYPE_ONLINE_1_2
                || temp[selected].Type == TX_TYPES.TX_TYPE_ONLINE_2_4)
            {
                alert("Only Online mode is available for this tx");
                return;
            }
            this.props.route.history.push('/');
            var tx = {TxId:temp[selected].ID, Mode:Mode.R_TX_REC_CHECK};
            this.props.dispatch(sendCommand("Set", "ConnectToTx", tx));
        }

    }


    parseTableData(data){

        if(data == null) return [];
        if(data == undefined) return [];
        var rows = [];

        if(data.constructor == Array){

            for(let i = 0; i<data.length; i++){

                let key = decodeAes(data[i].EncryptionKey,this.props.RxConfig.KEY);
                let power = data[i].Type == TX_TYPES.TX_TYPE_ONLINE ?
                    powersO[data[i].Power-1] : powers[data[i].Power-1];

                rows.push({
                    nr:i+1,
                    selected:false,
                    Name:data[i].Name,
                    ID:data[i].ID,
                    Type:data[i].Type,
                    EncryptionKey:key,
                    EncryptionKeyEcho:(new Array(key.length + 1).join("●")),
                    Freq:this.frequencies[data[i].Frequency.Selected-1],
                    Freqs:data[i].Frequency,
                    Power:power,
                })
            }
        }
        else{

            if(data.ID != null){

                let key = decodeAes(data.EncryptionKey,this.props.RxConfig.KEY);
                let power = data.Type == TX_TYPES.TX_TYPE_ONLINE ?
                    powersO[data.Power-1] : powers[data.Power-1];


                rows.push({
                    nr:"1",
                    Name:data.Name,
                    ID:data.ID,
                    Type:data.Type,
                    EncryptionKey:key,
                    EncryptionKeyEcho:new Array(key.length + 1).join("●"),
                    Freq:this.frequencies[data.Frequency.Selected-1],
                    Freqs:data.Frequency,
                    Power:power

                })
            }
        }

        return rows;

    }


    onAfterSaveCell(row, cellName, cellValue) {

        row.Freqs.Selected = String(this.frequencies.indexOf(row.Freq)+1);
        this.state.TxPresets[row.nr-1] = row;
        this.savePresets();
    }



    //checkbox handeler, marks preset for deletion
    onRowSelect(row, isSelected, e){

        var temp = this.state.TxPresets;
        if(temp[row.nr-1].selected == undefined)
            temp[row.nr-1].selected = true;
        else
            temp[row.nr-1].selected = !temp[row.nr-1].selected;

        this.setState({TxPresets:temp});

    }

    onSelectAll(isSelected, rows) {

        var temp = this.state.TxPresets;
        for(var i = 0; i<temp.length; i++){

            temp[i].selected = isSelected;

        }
        this.setState({TxPresets:temp});
    }

    rowChanged(row){

        var temp = this.state.TxPresets;
        temp[row.nr-1] = row;
        this.setState({TxPresets:temp});
        this.savePresets();

    }


    //create table component from state.TxPresets
    createTable(){

        var temp = this.state.TxPresets;
        var selected = temp.map(function(preset){

            if(preset.selected == true)
                return preset.nr;

        } );

        const cellEditProp = {
            mode: 'dbclick',
            afterSaveCell: this.onAfterSaveCell.bind(this),  // a hook for after saving cell
            blurToSave: true,
        };

        var selectRowProp = {
            mode: 'checkbox',
            onSelect: this.onRowSelect.bind(this),
            onSelectAll: this.onSelectAll.bind(this),
            bgColor: '#0ABCC7',
            clickToSelectAndEditCell: true,
            selected: selected
        };

        var options = {
            onRowClick: this.onRowSelect.bind(this),
        }
        /*     customEditor={ { getElement: createPEditor, customEditorParameters: { value: "", callback:this.rowChanged.bind(this) } } }*/

        return (

            <BootstrapTable
                data={this.state.TxPresets}
                selectRow={selectRowProp}
                cellEdit={cellEditProp}
                options={options}
                striped={true}
                hover={false}
                bordered={false}
                trClassName='my-bootstraptable-tr'
                tableHeaderClass='my-bootstraptable-header'
            >

            <TableHeaderColumn width='40px' dataAlign='left' dataField='nr'  isKey={true}>
                Nr.
            </TableHeaderColumn>
            <TableHeaderColumn dataAlign='center' dataField='Name'>Name</TableHeaderColumn>
            <TableHeaderColumn dataAlign='center'  dataField='ID'>TX id</TableHeaderColumn>
            <TableHeaderColumn
                dataAlign='center'
                dataField='EncryptionKeyEcho'
                customEditor={ { getElement: createAesEditor, customEditorParameters: { value: "", callback:this.rowChanged.bind(this) } } }
            >
                AES key
            </TableHeaderColumn>
            <TableHeaderColumn dataAlign='center'  dataField='Freq' editable={{type: 'select', options:{values:this.frequencies}}}>
                Freq
            </TableHeaderColumn>
            <TableHeaderColumn
                dataAlign='center'
                dataField='Power'
                editable={{type: 'select', options:{values:powers}}}
            >
                Power
            </TableHeaderColumn>
        </BootstrapTable>
        )}


    //add new tx preset to the end of list
    addTx(){

        var temp = this.state.TxPresets;
        if(temp.length >= 20) return;
        temp.push({
            nr:this.state.TxPresets.length+1,
            Name:"Name",
            ID:"10000",
            Key:'N/A',
            EncryptionKey:"",
            Freq:this.frequencies[1],
            Freqs:[{F1:"35"},{F2:"50"},{F3:"65"},{Selected:"1"}],
            Power:powers[0]
        });

        this.setState({TxPresets:temp});
        this.savePresets();
        this.refreshList();

    }

    removeTx(){

        var temp = this.state.TxPresets;

        for (var i = temp.length -1; i >= 0; i--){
            if(temp[i].selected == 1){
                temp.splice(i,1);
            }

        }

        for(var i = 0; i<temp.length; i++){
            temp[i].nr = i+1;
        }

        this.setState({TxPresets:temp});
        this.savePresets();

    }

    //format and send preset list
    savePresets(){

        var temp = this.state.TxPresets;
        var presets = [];

        for(var i = 0; i<temp.length; i++){

            let power = String((powers.indexOf(temp[i].Power))+1);
            if(power == "0")
                power = String((powersO.indexOf(temp[i].Power))+1);

            //console.log(power);

            presets.push({TxPreset:{
                Name:temp[i].Name,
                ID:temp[i].ID,
                EncryptionKey:encodeAes(temp[i].EncryptionKey,this.props.RxConfig.KEY),
                Frequency:temp[i].Freqs,
                Power:power
            }})
        }

        var data = {TxPresetsList:presets};
        this.props.dispatch(sendCommand("Set","TxPresets", data));
        this.refreshList();
    }


    render() {

        return (
            <div className="container-fluid jumbotron nopadding mainFrame">

                <div className="col-lg-10">
                    <div className="row">
                        <h3 className="winName"> Select TX </h3>
                        <hr style={{marginTop:'5px'}} />
                        <div className="btn-group btn-group-mano" >
                            <button type="button" className="btn btn-default btn-mano" onClick={this.addTx.bind(this)}>
                                <span className="glyphicon glyphicon-plus"></span> Add
                            </button>
                            <button type="button" className="btn btn-default btn-mano" onClick={this.removeTx.bind(this)}>
                                <span className="glyphicon glyphicon-remove"></span>Remove
                            </button>
                        </div>
                        {this.createTable()}
                    </div>
                </div>

                <div className="col-lg-2 threeSideButtons">
                    <div className="col-lg-12 col-md-4 col-xs-4">
                        <Button id={Buttons.Connect} label="Connect" icon="Connect"  onClick={this.buttonClick.bind(this)}/>
                    </div>
                    <div className="col-lg-12 col-md-4 col-xs-4">
                        <Button id={Buttons.Refresh} label="Refresh" icon="Refresh"  onClick={this.buttonClick.bind(this)}/>
                    </div>
                    <div className="col-lg-12 col-md-4 col-xs-4">
                        <Button id={Buttons.MainMenu} label="Main Menu" icon="Main_Menu"  onClick={this.buttonClick.bind(this)}/>
                    </div>

                </div>
            </div>
        );
    }
};




class AesEditor extends React.Component {

    constructor(props) {
        super(props);
        this.state = { value:this.props.row.EncryptionKey};
    }

    valChanged(event){
        this.setState({value:event.target.value});
    }

    blur(){

        let temp = this.props.row;
        temp.EncryptionKey = this.state.value;
        temp.EncryptionKeyEcho = new Array(this.state.value.length + 1).join("●");

        this.props.onUpdate(temp.EncryptionKeyEcho);
        this.props.callback(temp);
    }

    focus() {
        this.refs.inputRef.focus();
    }

    handleKeyPress(e) {
        if (e.key === 'Enter') {
            this.blur();
        }
    }
    render() {
        return (
            <span>
                <input
                    ref='inputRef'
                    className={ ( this.props.editorClass || '') + ' form-control editor edit-text' }
                    style={ { display: 'inline', width: '90%' } }
                    type='text'
                    maxLength="6"
                    value={ this.state.value }
                    onKeyPress={this.handleKeyPress.bind(this)}
                    onBlur={ this.blur.bind(this) }
                    onChange={ this.valChanged.bind(this) } />
            </span>
        );
    }
}



class PEditor extends React.Component {

    constructor(props) {
        super(props);
        this.options = this.props.row.Type == TX_TYPES.TX_TYPE_ONLINE ? powersO : powers;
        /*        this.options = [*/
        //{value:opt[0],label:opt[0]},
        //{value:opt[1],label:opt[1]},
        //{value:opt[2],label:opt[2]}
        /*];*/
    }

    valChanged(event){

        this.props.onUpdate("");
        let row = this.props.row;
        row.Power = this.options[parseInt(event.target.value)];
        this.props.callback(row);

    }

    onBlur(bla){
        console.log(bla);
    }

    render() {

        return (

            <select
                className="form-control"
                onChange={this.valChanged.bind(this)}
                style={{height:"30px",padding:"2px",textAlign:"center",fontSize:"14px"}}
            >
                <option value="0" onBlur={this.onBlur()}>{this.options[0]}</option>
                <option value="1">{this.options[1]}</option>
                <option value="2">{this.options[2]}</option>
            </select>
        );
    }
}

/*              <Select*/
//name="form-field-name"
//options={this.options}
//onChange={this.valChanged.bind(this)}
//onBlur={this.onBlur.bind(this)}
//searchable={true}
//openOnFocus={true}
//clearable={false}
//autofocus={true}
//className="SelectInTable"
///>

