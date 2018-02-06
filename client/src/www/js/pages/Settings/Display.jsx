import React from "react";
import Slider from 'react-rangeslider';
import Select from 'react-select';


var dim_options = [
    { value: 'off', label: 'off' },
    { value: '10s', label: '10s' },
    { value: '30s', label: '30s' },
    { value: '1min', label: '1min' },
    { value: '5min', label: '5min' }
];

var off_options = [
    { value: 'off', label: 'off' },
    { value: '30s', label: '30s' },
    { value: '1min', label: '1min' },
    { value: '5min', label: '5min' },
    { value: '20min', label: '20min' },
    { value: '60min', label: '60min' }
];



//export default class TopBar extends React.Component{
export default class Display extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            data: {}//this.props.data.level /** Start value **/
        };
    };

    componentDidMount(){
        


        if(this.props.data.backlight_level == undefined) return;
        var data = {};
        data.dim_timeout=dim_options[this.props.data.backlight_dim_timeout].value;
        data.off_timeout=off_options[this.props.data.backlight_off_timeout].value;
        data.level = this.props.data.backlight_level;
        
        this.setState({data:data});


    }

    componentWillReceiveProps(newProps){

        if(newProps.data.backlight_level == undefined) return;
        var data = {};
        data.dim_timeout=dim_options[newProps.data.backlight_dim_timeout].value;
        data.off_timeout=off_options[newProps.data.backlight_off_timeout].value;
        data.level = newProps.data.backlight_level;
        
        this.setState({data:data});


    }


    levelChange(value){

        var data = this.state.data;
        data.level = value;
        this.setState({data:data});
        this.returnData();

    }

    //off combobox changed
    dimChange(val) {
        
        var data = this.state.data;
        data.dim_timeout = val.value;
        this.setState({data:data});
        this.returnData();
    }   

    //dim combobox changed
    offChange(val) {
         var data = this.state.data;
        data.off_timeout = val.value;
        this.setState({data:data});
        this.returnData();
    }


    returnData(){


        var data = {};
        data.backlight_level = this.state.data.level.toString();

        //convert string to index
        var dim = dim_options.map(function(e) {
            return e.value; 
        }).indexOf(this.state.data.dim_timeout).toString();


        if(dim == "off") dim = "0";
        data.backlight_dim_timeout = dim;


        //convert string to index
        var off = off_options.map(function(e) {
            return e.value; 
        }).indexOf(this.state.data.off_timeout).toString();

        if(off == "off") off = "0";
        data.backlight_off_timeout = off;

        this.props.callback(data); //send data to parent


    }

    render() {
        if(this.props.data != null) {

            return (
                <div className="container-fluid" >
                    <label> Brightness: {(this.state.data.level*100/32).toFixed(0)} %</label>
                    <Slider
                        value={parseInt(this.state.data.level)}
                        min={1}
                        max={32}
                        orientation="horizontal"
                        tooltip={false}
                        onChange={this.levelChange.bind(this)}
                    />

                <label> Dim display: </label>
                <Select
                    name="form-field-name"
                    value={this.state.data.dim_timeout}
                    options={dim_options}
                    searchable={false}
                    onChange={this.dimChange.bind(this)}
                    clearable={false}
                />

            <label style={{paddingTop:'20px'}}> Turn OFF display: </label>
            <Select
                name="form-field-name"
                value={this.state.data.off_timeout}
                options={off_options}
                searchable={false}
                onChange={this.offChange.bind(this)}
                clearable={false}
            />
    </div>
            );
        }else{
            return <span> </span>
        }
    }
};

