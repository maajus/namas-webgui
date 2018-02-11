"use strict;"

import React from "react";
import Button from "../components/Button";
import { connect } from "react-redux"
//import Switch from 'react-bootstrap-switch';
import { sendCommand } from "../actions/fetchActions";
import ToggleButton from 'react-toggle-button'



const Buttons = {
    Save:0,
    MainMenu:1,
}

var td_style = {
    paddingTop: '.1em',
    paddingBottom: '.5em',
    textAlign:'left',
}



@connect((store) => {

    return {
        data:store.Status.data.Bedroom,
    };
})


export default class Bedroom extends React.Component {

    constructor(){
        super();
        this.state = {data:{H:0, L0:0, L1:0,L2:0,L3:0,L4:0,L5:0,L6:0,L7:0, T:0}};
    };

    componentDidMount(){

        this._isMounted = true;

    }

    componentWillReceiveProps(newProps){

        if(this.props.data == undefined)
            this.setState({data:newProps.data});

    }


    //called by button childs
    buttonClick(id){

        switch(id){
            case Buttons.Save:
                this.sendData();
                this.props.route.history.push('/');
                break;
            case Buttons.MainMenu:
                this.props.route.history.push('/');
                break;
            default:
                console.log("No such button");
        }
    };


    handleToggle(name,state) {

        this.props.dispatch(sendCommand("Set","Light",{Bedroom:name}));
        //let obj = "L"+name;
        //let data = this.state.data;
        //data[obj] = state;
        //this.setState({data:data});
    }



    render() {

        //console.log(this.props.data);

        if(this.props.data == undefined) return <span/>

        return (
            <div className="container-fluid">
                <h3 style={{paddingRight:"15px"}}> Miegamasis </h3>
                <hr style={{padding:'10px', margin:'0px'}} />

                <div className="col-xs-12 col-lg-9">

                    <table  className="table" style={{paddingLeft:"30px"}}>
                        <tbody>

                            <tr>
                                <td style={td_style} className="my-label">Temperatūra: </td>
                                <td style={td_style} >{this.props.data.T} °C </td>
                            </tr>

                            <tr>
                                <td style={td_style} className="my-label">Dregmė: </td>
                                <td style={td_style} >{this.props.data.H} % </td>
                            </tr>


                            <tr>
                                <td style={td_style} className="my-label">Justo lempa: </td>
                                <td style={td_style} >
                                    <ToggleButton
                                        value={ this.props.data.L0 == "1" }
                                        onToggle={this.handleToggle.bind(this,0)} />
                                </td>
                            </tr>

                            <tr>
                                <td style={td_style} className="my-label">Pagrindinės šviesos: </td>
                                <td style={td_style} >
                                    <ToggleButton
                                        value={ this.props.data.L2 == "1" }
                                        onToggle={this.handleToggle.bind(this,2)} />
                                </td>
                            </tr>

                            <tr>
                                <td style={td_style} className="my-label">Simos lempa: </td>
                                <td style={td_style} >
                                    <ToggleButton
                                        value={ this.props.data.L1 == "1" }
                                        onToggle={this.handleToggle.bind(this,1)} />
                                </td>
                            </tr>

                        </tbody>
                    </table>


                </div>


                <div className="col-lg-3 col-md-12 col-sm-12 col-xs-12">
                <hr className="visible-xs visible-sm visible-md "/>
                    <div className="col-xs-12">
                        <Button
                            id={Buttons.MainMenu}
                            label="Main Menu"
                            icon="Main_Menu"
                            onClick={this.buttonClick.bind(this)}/>
                    </div>
                </div>
            </div>
        );
    }
};

