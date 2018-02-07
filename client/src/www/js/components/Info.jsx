import React from "react";

const divStyle = {
  textAlign: 'center',
    padding:'0px',
};

var temp_icon = require('url!../../images/temp.png');
var humi_icon = require('url!../../images/humidity.png');
var light_icon = require('url!../../images/bulb.png');

const but_style = {height:'120px', width:'200px'};

export default class Button extends React.Component {

    constructor(){
        super();


    }

    onItemClick(id) {

            this.props.onClick(id); //call parent func
    }

        getIcon(){

                //return require('url!../../images/'+this.props.icon+'.png');

        };

    bulbIcon(){

        console.log(this.props.data);
        if(
            this.props.data.L0 == "1" ||
            this.props.data.L1 == "1" ||
            this.props.data.L2 == "1" ||
            this.props.data.L3 == "1" ||
            this.props.data.L4 == "1" ||
            this.props.data.L5 == "1" ||
            this.props.data.L6 == "1" ||
            this.props.data.L7 == "1"
        ){
            return <img src={light_icon} style={{marginRight:'1px',paddingTop:"10px"}}   width="40px" />
        }
        else
            return <span/>
    }

    render() {



        if(this.props.data == undefined) return <span/>;

        return (
            <div >
                <button 
                    style={{width:"100%", height:"150px",textAlign:"left", verticalAlign:"top"}}
                    className="btn btn-default" 
                    onClick={this.onItemClick.bind(this,this.props.id)}>

                    <div className="col-xs-6">
                        <label >{this.props.label}</label><br/>
                        <img src={temp_icon} style={{marginRight:'1px', paddingTop:"10px"}}   width="30px" />
                        <label >{this.props.data.T}</label><br/>
                        <img src={humi_icon} style={{marginRight:'1px',paddingTop:"10px"}}   width="30px" />
                        <label >{this.props.data.H}</label>
                    </div>
                    <div className="col-xs-6" style={{paddingTop:"15px"}}>
                        {this.bulbIcon()}
                    </div>

                </button>
            </div>
        );
    }
};

