import React from "react";
import Select from 'react-select';


var lang_options = [
    { value: 'English', label: 'English' },
];



//export default class TopBar extends React.Component{
export default class Lang extends React.Component {

    constructor(props){
        super(props);

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
        if(this.props.data != null) {

            return (
                <div className="container-fluid" style={{paddingBottom:"100px"}}>
                        <label>RX Language: </label>
                <Select
                    name="form-field-name"
                    value={this.state.data}
                    options={lang_options}
                    onChange={this.onChange.bind(this)}
                    searchable={false}
                    clearable={false}
                />
            </div>
            );
        }else{
            return <span> </span>
        }
    }
};

