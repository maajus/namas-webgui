import React from "react";
import Checkbox from "../../components/Checkbox";
import Select from 'react-select';

var timeout_options = [
    { value: '0', label: '1min' },
    { value: '1', label: '5min' },
    { value: '2', label: '45min' },
    { value: '3', label: '60min' }
];


var level_options = [
    { value: '0', label: 'Low' },
    { value: '1', label: 'Medium' },
    { value: '2', label: 'High' } ];



export default class VOX extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            data: {}//this.props.data./** Start value **/
        }; 
    }


    componentDidMount(){

        var data = this.props.data;
        this.setState({data:data});
    }


    voxChange(val){

        var data = this.state.data;
        data.vox = val? "1":"0";
        if(val) data.multirec  = "1";
        this.setState({data:data});
        this.returnData();

    }

    multiChange(val){

        var data = this.state.data;
        data.multirec = val? "1":"0";
        this.setState({data:data});
        this.returnData();

    }

    timeoutChange(val){

        var data = this.state.data;
        data.vox_timeout=val.value;
        this.setState({data:data});
        this.returnData();
    }

    levelChange(val){

        var data = this.state.data;
        data.vox_level=val.value;
        this.setState({data:data});
        this.returnData();
    }


    returnData(){
        var data = this.state.data;
        this.props.callback(data); //send data to parent
    }



    render() {

        //console.log(this.state.data)
        if(this.state.data != null) {

            return (
                <div className="container-fluid">
                    <Checkbox
                        label="VOX"
                        checked={parseInt(this.state.data.vox)}
                        handler={this.voxChange.bind(this)}/>

                    <Checkbox
                        label="MultiREC"
                        checked={parseInt(this.state.data.multirec)}
                        handler={this.multiChange.bind(this)}/>

                    <div className="row" style={{paddingTop:"30px"}}>
                        <div className="col-lg-4">
                            <label style={{paddingLeft:"35px", paddingTop:"10px"}}> VOX TIMEOUT: </label>
                        </div>

                        <div className="col-lg-8">
                            <Select
                                name="form-field-name"
                                value={timeout_options[parseInt(this.state.data.vox_timeout)]}
                                options={timeout_options}
                                onChange={this.timeoutChange.bind(this)}
                                clearable={false}
                                searchable={false}
                            />
                    </div>
                </div>



                <div className="row" style={{paddingTop:"20px"}}>
                    <div className="col-lg-4">
                        <label style={{paddingLeft:"35px", paddingTop:"10px"}}> VOX LEVEL: </label>
                    </div>

                    <div className="col-lg-8">
                        <Select
                            name="form-field-name"
                            value={level_options[parseInt(this.state.data.vox_level)]}
                            options={level_options}
                            onChange={this.levelChange.bind(this)}
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

