import React from "react";

const divStyle = {
  textAlign: 'center',
    padding:'0px',
};

const but_style = {height:'120px', width:'120px'};

export default class Button extends React.Component {

    constructor(){
        super();

this.pStyle = {
    marginTop:'3px',
    marginBottom:'30px',
};



    }

    onItemClick(id) {

        if(this.props.enabled)
            this.props.onClick(id); //call parent func
    }

        getIcon(){

            if(this.props.enabled)
                return require('url!../../images/'+this.props.icon+'.png');
            else
                return require('url!../../images/disabled/'+this.props.icon+'.png');

        };

    render() {

        let style;
        if(!this.props.enabled)
            style= {...this.pStyle, color:"gray"};
        else 
            style= {...this.pStyle, color:"white"};


        return (
            <div style={divStyle}>
                <button className="btn btn-default button-big" onClick={this.onItemClick.bind(this,this.props.id)}>
                    <img src={this.getIcon()} className="button-big-image"/>
                    <br/>
                </button>
                <br/>
                <label className="my-label" style={style} >{this.props.label}</label>
            </div>
        );
    }
};

Button.defaultProps = {
  enabled: true,
};
