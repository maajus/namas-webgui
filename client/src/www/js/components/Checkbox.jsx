import React from "react";

export default class Checkbox extends React.Component {

    constructor(){
        super();
        this.state = { isChecked: false };
    }

    componentDidMount(){

        this.setState({isChecked:this.props.checked});

    }

    componentWillReceiveProps(props){

        this.setState({isChecked:props.checked});

    }

    toggleCheckboxChange() {


        var isChecked = this.state.isChecked;
        isChecked= !isChecked;

        if(this.props.hasOwnProperty('handler')){
            this.props.handler(isChecked);
        }

    };

    render() {


        return (
            <div  width='50px' className="custom-checkbox" style={this.props.style}>
                    <input
                        type="checkbox"
                        id={this.props.label}
                        checked={this.state.isChecked}
                        disabled={this.props.disabled}
                        onChange={this.toggleCheckboxChange.bind(this)}
                    />
                    <label htmlFor={this.props.label} >
                        {this.props.label}
                    </label>

        </div>
        );
    }
}


