import React from "react";

export default class Switch extends React.Component {

    constructor(){
        super();
        this.state = { isChecked: false };
    }

    toggleCheckboxChange() {

        var isChecked = this.state.isChecked;
        isChecked= !isChecked;

        if(this.props.hasOwnProperty('handler')){
            this.props.handler(isChecked);
        }

    };

    componentWillReceiveProps(newProps){

        this.setState({isChecked:newProps.value});
        //console.log(newProps);

    }

    render() {



        return (
            <div className="row">
                <div className="col-xs-3 " style={{paddingTop:'4px', textAlign:'right'}}>
                    <label className="my-label"> {this.props.label}</label>
                </div>
                <div className="col-xs-9">
                    <label className="switch">
                        <input type="checkbox" 
                            checked={this.state.isChecked} 
                            onChange={this.toggleCheckboxChange.bind(this)}/>
                        <div className="slider round"></div>
                    </label>
                </div>
            </div>
        );
    }
}


