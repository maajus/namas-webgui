import React from "react";
import Button from "../components/Button";
import SoundGraph from "../components/SoundGraph";

var Buttons = {
    MainMenu:0,
}

export default class VoxLevels extends React.Component {

    constructor(){

        super();
        this.state = {level:1};

    };

    //called by button childs
    buttonClick(id){

        switch(id){
           case Buttons.MainMenu:
                this.props.route.history.push('/online');
                break;

            default:
                console.log("No such button");
        }

    };

    voxChange(event){

        var level = 1;
        if(event.target.value == "vox_medium")
            level = 2;
        if(event.target.value == "vox_high")
            level = 3;

        this.setState({level:level});

    }


    render() {

        var vox_low="", vox_medium="", vox_high="";
        switch(this.state.level){
            case 0:
            case 1:
                vox_low="active";
                break;
            case 2:
                vox_medium="active";
                break;
            case 3:
                vox_high="active";
                break;
        }

        return (
            <div className="container-fluid jumbotron mainFrame">

                <div className="col-lg-9 col-md-9 col-sm-12">
                    <div className="row"> 
                        <h3> Vox Levels </h3>
                        <hr style={{marginTop:'5px'}} />
                        <SoundGraph  connected={"2"} vox={this.state.level} height={810}/>
                        <div/>
                        <div className="row"> 


                            <div className="col-lg-2 col-xs-3 text-right">
                                <label className="my-label" style={{paddingTop:"7px"}}> Vox Level: </label>
                            </div>
                            <div className="col-lg-10 col-xs-9">
                                <div className="btn-group btn-group-justified" data-toggle="buttons" style={{paddingBottom:"40px"}}>
                                    <label className={"btn btn-primary " + vox_low} >
                                        <input 
                                            type="checkbox" 
                                            value="vox_low" 
                                            onChange={this.voxChange.bind(this)}/>  Low
                                    </label>
                                    <label className={"btn btn-primary " + vox_medium}>
                                        <input 
                                            type="checkbox" 
                                            value="vox_medium" 
                                            onChange={this.voxChange.bind(this)}/> Medium
                                    </label>
                                    <label className={"btn btn-primary " + vox_high}>
                                        <input 
                                            type="checkbox" 
                                            value="vox_high" 
                                            onChange={this.voxChange.bind(this)}/> High
                                    </label>
                                </div>
                            </div>
                        </div>



                    </div>
                </div>
                <div className="col-lg-3 col-md-3 col-sm-12 col-xs-12 oneSideButton">
                    <Button id={Buttons.MainMenu} label="Back" icon="Main_Menu"  onClick={this.buttonClick.bind(this)}/>
                </div>

            </div>
        );
    }
};

