import React from "react";
import Select from 'react-select';


var usb_options = [
    { value: '0', label: 'OFF' },
    { value: '2', label: 'PC' },
];



//export default class TopBar extends React.Component{
export default class USB extends React.Component {

    constructor(props){
        super();
        this.state = {
            data: {}//this.props.data.level /** Start value **/
        };
    };

    componentDidMount(){

        this.setState({data:this.props.data});

    }

    componentWillReceiveProps(newProps){

        this.setState({data:newProps.data});

    }


    //lang combobox changed
    onChange(val) {

        this.setState({data:val.value});
        this.returnData(val.value);
    }


    returnData(val){

        this.props.callback(val); //send data to parent

    }
    render() {

        //console.log(this.state.data);
        if(this.props.data != null) {

            return (
                <div className="container-fluid" style={{paddingBottom:"100px"}}>
                        <label>USB Slave: </label>
                <Select
                    name="form-field-name"
                    value={this.state.data}
                    options={usb_options}
                    onChange={this.onChange.bind(this)}
                    searchable={false}
                    clearable={false}
                    width="100px"
                />
            </div>
            );
        }else{
            return <span> </span>
        }
    }
};

