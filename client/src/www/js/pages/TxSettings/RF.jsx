import React from "react";
import Slider from 'react-rangeslider';

var BASE_FREQ = 405;

//export default class TopBar extends React.Component{
export default class RF extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            data: {}//this.props.data.level /** Start value **/
        };
    };

    componentDidMount(){

        var data = {};
        if(this.props.freq != undefined){
            data.f1 = parseInt(this.props.freq.F1);
            data.f2 = parseInt(this.props.freq.F2);
            data.f3 = parseInt(this.props.freq.F3);
            data.timeout = parseInt(this.props.timeout);

            this.setState({data:data});
        }

    }

    componentWillReceiveProps(newProps){


        var data = {};
        if(newProps.freq != undefined){
            data.f1 = parseInt(newProps.freq.F1);
            data.f2 = parseInt(newProps.freq.F2);
            data.f3 = parseInt(newProps.freq.F3);
            data.timeout = parseInt(newProps.timeout);

            this.setState({data:data});
        }




    }


    f2Change(value){

        var data = this.state.data;
        data.f2 = value;
        this.setState({data:data});
        this.returnData();
    }

    f3Change(value){

        var data = this.state.data;
        data.f3 = value;
        this.setState({data:data});
        this.returnData();
    }

    timeoutChange(value){

        var data = this.state.data;
        data.timeout = value;
        this.setState({data:data});
        this.returnData();
    }



    returnData(){


        var data = this.state.data;
        this.props.callback(data); //send data to parent


    }

    render() {
        if(this.props.timeout != null) {

            return (
                <div className="container-fluid" >
                    <label> F1: {"    "}<b>{this.state.data.f1*0.2+BASE_FREQ}  MHz</b></label>
                    <br/>
                    <label> F2: {' '}<b>{this.state.data.f2*0.2+BASE_FREQ}  MHz</b></label>
                    <Slider
                        value={this.state.data.f2}
                        min={35}
                        max={65}
                        orientation="horizontal"
                        tooltip={false}
                        onChange={this.f2Change.bind(this)}
                    />

                <label> F3: {' '}<b>{this.state.data.f3*0.2+BASE_FREQ} MHz </b></label>
                    <Slider
                        value={this.state.data.f3}
                        min={35}
                        max={65}
                        orientation="horizontal"
                        tooltip={false}
                        onChange={this.f3Change.bind(this)}
                    />

                <label> TX Turn OFF Timeout:{' '}<b> {this.state.data.timeout} min</b></label>
                    <Slider
                        value={this.state.data.timeout}
                        min={1}
                        max={15}
                        orientation="horizontal"
                        tooltip={false}
                        onChange={this.timeoutChange.bind(this)}
                    />



            </div>
            );
        }else{
            return <span> </span>
        }
    }
};

