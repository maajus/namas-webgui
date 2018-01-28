"use strict";

import React from "react";
import ReactDOM from 'react-dom'
import { connect } from "react-redux"

//suscribe to redux store
@connect((store) => {

    return {
        data:store.TxStatus.data,
        loginStatus: store.Login.data.status,
    };
})



export default class RFBar extends React.Component {

    constructor(props){
        super(props);
        this.x = 0;
        this.width = 0;

    };


    componentWillReceiveProps(nextProps){

        let canvas = ReactDOM.findDOMNode(this.refs.rfBarCanvas);
        let ctx = canvas.getContext('2d');


        if(this.props.loginStatus != "0"){
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            return;
        }
        //if(!document.hasFocus()) return;


        if(nextProps.data.SignalStrength > 0){

            let value = Math.round(nextProps.data.SignalStrength*canvas.height/100);
            let status = nextProps.data.SignalStatus;
            ctx.fillStyle = "#0ABCC7";// 'rgb(200,0,0)';

            switch(status) {
                case "1":
                case "4":
                    ctx.strokeStyle = "red";
                    break;
                case "2":
                    ctx.strokeStyle = "green";
                    break;
                case "5":
                case "6":
                    ctx.strokeStyle = "gray";
                    break;
            }

            ctx.beginPath();
            ctx.moveTo(this.x,canvas.height);
            ctx.lineTo(this.x,canvas.height-value);
            ctx.stroke();
            this.x+=3;
            //console.log("x "+this.x+" width  "+canvas.offsetWidth);
            this.width=canvas.offsetWidth;
            if(this.x >  canvas.offsetWidth){
                this.x = 0;
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }


        }
        else{

            this.x = 0;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }


    }


    render() {
        return <canvas className="rfCanvas"
            ref="rfBarCanvas"
            width={this.width}
        >
        </canvas>;
    }


};

