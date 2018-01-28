import React from "react";
import Select from 'react-select';

var gain_options = [
    { value: '0', label: 'OFF' },
    { value: '1', label: '0dB' },
    { value: '2', label: '2dB' },
    { value: '3', label: '4dB' },
    { value: '4', label: '6dB' },
    { value: '5', label: '8dB' },
    { value: '6', label: '10dB' },
    { value: '7', label: '12dB' }
];



export default class Audio extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            data: {}//this.props.data./** Start value **/
        }; }; 


    componentDidMount(){

        var data = this.props.data;
        this.setState({data:data});

    }


    channelsChange(event){

        var data = this.state.data;

        if(event.target.value == "mono_left")
            data.audio_type = "1";


        if(event.target.value == "mono_right")
            data.audio_type = "0";


        if(event.target.value == "stereo")
            data.audio_type = "3";

        this.setState({data:data});
        this.returnData();

    }

    gainChange(value){


        var data = this.state.data;
        data.audio_gain = value.value;

        this.setState({data:data});
        this.returnData();

    }



    returnData(){
        var data = this.state.data;
        this.props.callback(data); //send data to parent
    }



    render() {
        if(this.state.data != null) {

            //console.log(this.state.data)

            var mono_left ="", mono_right = "", stereo = "";
            if(this.state.data.audio_type == "1")
                mono_left = "active";
            if(this.state.data.audio_type == "0")
                mono_right = "active";
            if(this.state.data.audio_type == "2" || this.state.data.audio_type == "3")
                stereo = "active";

            return (
                <div className="container-fluid">


                    <div className="row">
                        <div className="col-lg-4">
                            <label style={{paddingLeft:"40px", paddingTop:"10px"}}> AUDIO: </label>
                        </div>
                        <div className="col-lg-8">
                            <div className="btn-group btn-group-justified" data-toggle="buttons">
                                <label className={"btn btn-primary " + mono_left} >
                                    <input 
                                        type="checkbox" 
                                        value="mono_left" 
                                        onChange={this.channelsChange.bind(this)}/> Mono Left
                                </label>
                                <label className={"btn btn-primary " + mono_right}>
                                    <input 
                                        type="checkbox" 
                                        value="mono_right" 
                                        onChange={this.channelsChange.bind(this)}/> Mono Right
                                </label>
                                <label className={"btn btn-primary " + stereo}>
                                    <input 
                                        type="checkbox" 
                                        value="stereo" 
                                        onChange={this.channelsChange.bind(this)}/> Stereo
                                </label>


                            </div>
                        </div>
                    </div>


                    <div className="row" style={{paddingTop:"50px"}}>
                        <div className="col-lg-4">
                            <label style={{paddingLeft:"40px", paddingTop:"10px"}}> GAIN: </label>
                        </div>

                        <div className="col-lg-8">
                            <Select
                                name="form-field-name"
                                value={gain_options[parseInt(this.state.data.audio_gain)]}
                                options={gain_options}
                                onChange={this.gainChange.bind(this)}
                                clearable={false}
                                searchable={false}
                            />

                    </div>
                </div>
            </div>
            );
        }else{
            return <span> </span>
        }
    }
};

