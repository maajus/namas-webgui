import React from "react";
import Checkbox from "../../components/Checkbox";
import { connect } from "react-redux"

@connect((store) => {

    return {
        txstatus: store.TxStatus.data,
    };
})

export default class Triggers extends React.Component {

    constructor(props){
        super();

        this.state = {
            data: {ResetAlarm:0}//this.props.data./** Start value **/
        }; }; 

    componentDidMount(){

        var data = this.props.data;
        this.setState({data:data});

    }

    componentWillReceiveProps(newProps){

        if(newProps.txstatus.Alarm != undefined){
            this.setState({alarm:newProps.txstatus.Alarm});
        }

        this.setState({GPIO:newProps.GPIOdata, REC:newProps.RECdata});

    }




    dirChange(event){

        var data = this.state.GPIO;
        if(event.target.value == "dir1_in")
            data.direction0 = "0";
        if(event.target.value == "dir1_out")
            data.direction0 = "1";

        if(event.target.value == "dir2_in")
            data.direction1 = "0";
        if(event.target.value == "dir2_out")
            data.direction1 = "1";


        this.setState({GPIO:data});
        this.returnData();

    }
    
    funChange(event){

        var data = this.state.GPIO;

        if(event.target.value == "fun1_2")
            data.function0 = "0";
        if(event.target.value == "fun1_1")
            data.function0 = "1";

        if(event.target.value == "fun2_2")
            data.function1 = "0";
        if(event.target.value == "fun2_1")
            data.function1 = "1";


        this.setState({GPIO:data});
        this.returnData();

    }

    

    multiChange(val){

        var data = this.state.REC;
        data.multirec = val? "1":"0";
        this.setState({REC:data});
        this.returnData();

    }

     resetAlarmChange(value){

        var data = this.state.GPIO;
        data.ResetAlarm = value? "1":"0";
        this.setState({GPIO:data});
        this.returnData();
    }

    enableTrigger1(value){

        var data = this.state.GPIO;

        if(!value){
            data.direction0 = 1;
            data.function0 = 0;
        }
        else{
            data.direction0 = 0;
            data.function0 = 1;
        }

        this.setState({GPIO:data});
        this.returnData();

    }

    enableTrigger2(value){


        var data = this.state.GPIO;

        if(!value){
            data.direction1 = 1;
            data.function1 = 0;
         }
        else{
            data.direction1 = 0;
            data.function1 = 1;
        }


        this.setState({GPIO:data});
        this.returnData();


    }


    
    returnData(){
        this.props.callback({GPIO:this.state.GPIO, REC:this.state.REC}); //send data to parent
    }



    render() {
        if(this.state.GPIO != null) {

            let alarm = "No alarms";
            if(this.state.alarm == "1")
                alarm = "Trigger 1";
            if(this.state.alarm == "2")
                alarm = "Trigger 2";
            if(this.state.alarm == "3")
                alarm = "Trigger 1&2";

            var fun1 = {}, fun2 = {}; //Button labels depends on direction selected
            var dir1_in = "", dir1_out ="",fun1_1 = "", fun1_2 ="";
            var dir2_in = "", dir2_out ="",fun2_1 = "", fun2_2 ="";

            if(this.state.GPIO.direction0 == "1"){
                dir1_out = "active" 
                fun1.name1 = "High"
                fun1.name2 = "Low"
            }
            else{
                dir1_in = "active"
                fun1.name1 = "REC"
                fun1.name2 = "Alarm"
            }

            if(this.state.GPIO.function0 == "1")
                fun1_1 = "active"
            else
                fun1_2 = "active"




            if(this.state.GPIO.direction1 == "1"){
                dir2_out = "active"
                fun2.name1 = "High"
                fun2.name2 = "Low"
            }
            else{
                dir2_in = "active"
                fun2.name1 = "REC"
                fun2.name2 = "Alarm"
            }

            if(this.state.GPIO.function1 == "1")
                fun2_1 = "active"
            else
                fun2_2 = "active"

            //trigger checkboxes
            let trig1="1", trig2="1";
            if(this.state.GPIO.direction0 == "1" && this.state.GPIO.function0 == "0")
                trig1 = "0";
            if(this.state.GPIO.direction1 == "1" && this.state.GPIO.function1 == "0")
                trig2 = "0";

            return (
                <div className="container-fluid">


 
                    <Checkbox 
                        label="TRIGGER 1" 
                        checked={parseInt(trig1)}
                        handler={this.enableTrigger1.bind(this)}/>

                   
                    <div className="row">
                        <div className="col-lg-4 col-md-4 col-sm-4 col-xs-4">
                            <label style={{paddingLeft:"40px", paddingTop:"10px"}}> Direction: </label>
                        </div>
                        <div className="col-lg-8 col-md-8 col-sm-8 col-xs-8">
                            <div className="btn-group btn-group-justified" data-toggle="buttons">
                                <label className={"btn btn-primary " + dir1_in} >
                                    <input 
                                        type="checkbox" 
                                        value="dir1_in" 
                                        onChange={this.dirChange.bind(this)}/> Input
                                </label>
                                <label className={"btn btn-primary " + dir1_out}>
                                    <input 
                                        type="checkbox" 
                                        value="dir1_out" 
                                        onChange={this.dirChange.bind(this)}/> Output
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-lg-4 col-md-4 col-sm-4 col-xs-4">
                            <label style={{paddingLeft:"40px", paddingTop:"10px"}}> Function: </label>
                        </div>
                        <div className="col-lg-8 col-md-8 col-sm-8 col-xs-8">
                            <div className="btn-group btn-group-justified" data-toggle="buttons">
                                <label className={"btn btn-primary " + fun1_1} >
                                    <input 
                                        type="checkbox" 
                                        value="fun1_1" 
                                        onChange={this.funChange.bind(this)}/> {fun1.name1}
                                </label>
                                <label className={"btn btn-primary " + fun1_2}>
                                    <input 
                                        type="checkbox" 
                                        value="fun1_2" 
                                        onChange={this.funChange.bind(this)}/> {fun1.name2}
                                </label>
                            </div>
                        </div>
                    </div>


                    <Checkbox 
                        style={{paddingTop:"50px"}}
                        label="TRIGGER 2" 
                        checked={parseInt(trig2)}
                        handler={this.enableTrigger2.bind(this)}/>


                    <div className="row">
                        <div className="col-lg-4 col-md-4 col-sm-4 col-xs-4">
                            <label style={{paddingLeft:"40px", paddingTop:"10px"}}> Direction: </label>
                        </div>
                        <div className="col-lg-8 col-md-8 col-sm-8 col-xs-8">
                            <div className="btn-group btn-group-justified" data-toggle="buttons">
                                <label className={"btn btn-primary " + dir2_in} >
                                    <input 
                                        type="checkbox" 
                                        value="dir2_in" 
                                        onChange={this.dirChange.bind(this)}/> Input
                                </label>
                                <label className={"btn btn-primary " + dir2_out}>
                                    <input 
                                        type="checkbox" 
                                        value="dir2_out" 
                                        onChange={this.dirChange.bind(this)}/> Output
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-lg-4 col-md-4 col-sm-4 col-xs-4">
                            <label style={{paddingLeft:"40px", paddingTop:"10px", paddingBottom:"30px"}}> Function: </label>
                        </div>
                        <div className="col-lg-8 col-md-8 col-sm-8 col-xs-8">
                            <div className="btn-group btn-group-justified" data-toggle="buttons">
                                <label className={"btn btn-primary " + fun2_1} >
                                    <input 
                                        type="checkbox" 
                                        value="fun2_1" 
                                        onChange={this.funChange.bind(this)}/> {fun2.name1}
                                </label>
                                <label className={"btn btn-primary " + fun2_2}>
                                    <input 
                                        type="checkbox" 
                                        value="fun2_2" 
                                        onChange={this.funChange.bind(this)}/> {fun2.name2}
                                </label>
                            </div>
                        </div>
                    </div>

                    <label style={{paddingTop:"10px", paddingBottom:"10px"}}> Alarm state: {alarm}</label>
                    <Checkbox 
                        label="Reset alarm" 
                        checked={parseInt(this.state.GPIO.ResetAlarm)}
                        handler={this.resetAlarmChange.bind(this)}/>

                    <Checkbox 
                        label="MultiREC" 
                        checked={parseInt(this.state.REC.multirec)} 
                        handler={this.multiChange.bind(this)}/>
                </div>
            );
        }else{
            return <span> </span>
        }
    }
};

