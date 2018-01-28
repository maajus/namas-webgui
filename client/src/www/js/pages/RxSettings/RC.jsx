import React from "react";
import ReactModal from 'react-modal';
import Checkbox from "../../components/Checkbox";
import {
    Modal,
    ModalHeader,
    ModalTitle,
    ModalClose,
    ModalBody,
    ModalFooter
} from 'react-modal-bootstrap';


import { sendCommand } from "../../actions/fetchActions";
import { connect } from "react-redux"



@connect((store) => {
    return {
    };
})

export default class RC extends React.Component {

    constructor(){


        super();
        this.state = {rc:false};

    }


    //get rx settings
    refresh(){

        this.props.refresh();

    }

    componentDidMount(){

      if(this.props.data != undefined)
        this.setState({enabled:this.props.data});



    }

    //enter rc pair mode
    enablePair(){

        if(this.state.enabled == "0")
            return;
        this.setState({showModal:true});
        this.props.dispatch(sendCommand("Set", "CommandToRx", {RemotePair:1}));
    }

    disablePair(){
        this.props.dispatch(sendCommand("Set", "CommandToRx", {RemotePair:0}));

    }
    //forget all remotes
    forgetRemotes(){

        if(this.state.enabled == "0")
            return;
        this.props.dispatch(sendCommand("Set", "CommandToRx", {RemoteClear:1}));
    }


    modalClosed(){

        this.setState({showModal:false});
        this.disablePair();

    }


    rcEnabled(val){

        var enabled = val? "1":"0";
        this.setState({enabled:enabled});
        this.props.callback(enabled); //send data to parent

    }



    render() {


        //get and format current time
        var showModal = this.state==null? false:this.state.showModal;

        let buttonsEnabled = "btn btn-default";
        if(this.state.enabled == "0")
            buttonsEnabled = "btn btn-default disabled";

        return (
            <div className="container" style={{padding:'10px'}}>
                <Checkbox label="Keyfob function ON" 
                    checked={parseInt(this.state.enabled)} 
                    handler={this.rcEnabled.bind(this)}/>
                <hr style={{marginBottom:'0px'}}/>


                <div className="center-block text-center">
                    <button
                        type="button"
                        className={buttonsEnabled}
                        style={{
                            maxWidth:'160px',
                            margin:'15px',
                            height:'80px',
                            width:'170px',
                            fontSize:"14px",
                            whiteSpace:'normal !important'}}
                            onClick={this.enablePair.bind(this)}>
                            Start pairing
                        </button>
                        <button
                            type="button"
                            className={buttonsEnabled}
                            style={{
                                margin:'20px',
                                maxWidth:'160px',
                                height:'80px',
                                width:'170px',
                                margin:'15px',
                                fontSize:"14px",
                                whiteSpace:'normal !important'}}
                                onClick={this.forgetRemotes.bind(this)}>
                                Forget all remotes
                            </button>
                        </div>


                        <Modal isOpen={showModal} onRequestHide={this.modalClosed.bind(this)}>
                            <ModalHeader>
                                <ModalClose onClick={this.modalClosed.bind(this)}/>
                                <ModalTitle>RC Pair</ModalTitle>
                            </ModalHeader>
                            <ModalBody>
                                <i className="icon ion-home"></i>

                                <label style={{paddingBottom:'50px'}}>
                                   Waiting for KeyFob to pair. While holding lower button shortly press upper button.
                                </label>

                            </ModalBody>
                            <ModalFooter>

                                <button className='btn btn-primary' onClick={this.modalClosed.bind(this)}>
                                    Stop Pairing
                                </button>
                            </ModalFooter>
                        </Modal>


                    </div>
        );
    }
};

