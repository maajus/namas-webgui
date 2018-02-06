import React from "react";
import Checkbox from "../../components/Checkbox";
import { sendCommand } from "../../actions/fetchActions";
import { connect } from "react-redux"


@connect((store) => {

    return {
        data:store.Settings.data,
    };
})



export default class System extends React.Component {

    //get rx settings
    refresh(){

        this.props.refresh();

    }


    restartRX(){

        let ret = confirm("Are you sure you want to restart RX?");
        if(ret) 
            this.props.dispatch(sendCommand("Set","CommandToRx", {RestartRx:1}));

    }


    doorLightClicked(val){

        var data = this.props.data;
        data.door_light = val? "1":"0";
        this.setState({data:data});
    }

    doorSirenClicked(val){

        var data = this.props.data;
        data.door_siren = val? "1":"0";
        this.setState({data:data});
    }

    pirLcdClicked(val){

        var data = this.props.data;
        data.pir_lcd = val? "1":"0";
        this.setState({data:data});
    }




    render() {

        //get and format current time
        //console.log(this.props.data);


        //var perc = (100-(this.props.data.FreeMemory/this.props.data.TotalMemory)*100).toFixed(2);
        //var used = this.props.data.TotalMemory - this.props.data.FreeMemory;
        //if(used < 6) used = 0;

        console.log(this.props.data);

        return (
            <div className="container-fluid">
                <Checkbox 
                    label="Door light" 
                    checked={parseInt(this.props.data.door_light)} 
                    handler={this.doorLightClicked.bind(this)}/>
                <Checkbox 
                    label="Door siren" 
                    checked={parseInt(this.props.data.door_siren)} 
                    handler={this.doorSirenClicked.bind(this)}/>
                <Checkbox 
                    label="PIR LCD" 
                    checked={parseInt(this.props.data.pir_lcd)} 
                    handler={this.pirLcdClicked.bind(this)}/>



            </div>



            );
    }
};

//<div className="col-xs-12 col-lg-6 col-md-6 col-sm-6" style={{textAlign:"center",paddingBottom:"15px"}}>
//<button
//type="button"
//className="btn btn-primary"

//style={{width:"90%" ,height:"90px"}}
//onClick={this.transportMode.bind(this)}>
//Enter transport mode
//</button>
//</div>

