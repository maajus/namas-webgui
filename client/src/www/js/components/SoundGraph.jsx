import React from 'react';
import ReactDOM from 'react-dom'

import { connect } from "react-redux"

const VOX1 = 190
const VOX2 = 380
const VOX3 = 690

const CANVAS_WIDTH = 1300


const DEFAULT_SCALE = 4
const VOX_COLOR  = "#0ABCC8"
const LINE_COLOR = "#9E9E9E"


@connect((store) => {
    return {
        data: store.OnlineAudio.data,
};
})


export default class SoundGraph extends React.Component {

    constructor(){
        super();
        this.x = 0;
        this.width = 0;
        this.vox = 0;
        this.draw_lines = true;
        this._isMounted = false;
        this.sm = false;
    };

    componentDidMount(){

        this._isMounted = true;
        this.draw_lines = true;
        window.addEventListener("resize", this.updateDimensions.bind(this));
    }

    componentWillUnmount(){

        this._isMounted = false;
        window.removeEventListener("resize", this.updateDimensions.bind(this));

    }

    updateDimensions(){
        if(!this._isMounted) return;
        this.clear();
        if(window.innerWidth < 992) this.sm = true;
        else this.sm = false;
    }

    componentWillReceiveProps(newProps){

        //console.log(newProps);

        if(!this._isMounted) return;
        //detect vox level change and clear graph (vox levels win)
        if(newProps.vox != this.vox){
            this.vox = newProps.vox;
            this.clear();
        }

        var incomingData = new Int16Array(newProps.data);
        var Val = {max:Math.max.apply(Math,incomingData),min:Math.abs(Math.min.apply(Math,incomingData))};

        if(isFinite(Val.max) && isFinite(Val.min))
            this.draw(Val);

        incomingData = [];

    }


    draw(Val){

        //if connected to tx
        if(this.props.connected === "2"){

            let canvas = ReactDOM.findDOMNode(this.refs.myCanvas);
            let ctx = canvas.getContext('2d');


            let maxValue = canvas.height*(Math.log10(Val.max)-2)/4;
            let minValue = -canvas.height*(Math.log10(Math.abs(Val.min))-2)/4;

            //console.log("max: "+Val.max+"     min "+Val.min);

            if (maxValue > canvas.height/2) maxValue = canvas.height/2;
            if(maxValue < 0) maxValue = 1;
            if (minValue < -canvas.height/2) minValue = -canvas.height/2;
            if(minValue>0) minValue = -1;

            //console.log("max: "+maxValue+"     min "+minValue);

            //if(maxValue == 0 && minValue == 0) return;

            var color = LINE_COLOR;

            if (this.props.vox > 0) {

                //calculate vox line y position
                var scale = 2;
                var vox1 = canvas.height*(Math.log10(VOX1)-2)/scale;
                var vox2 = canvas.height*(Math.log10(VOX2)-2)/scale;
                var vox3 = canvas.height*(Math.log10(VOX3)-2)/scale;


                //change sound line color if value is higher than selected vox level
                var vox1_color="#696969", vox2_color = "#696969", vox3_color="#696969";

                if (this.props.vox == 3) {
                    vox1_color = "white";
                    if((maxValue > vox3) || (Math.abs(minValue) > vox3))
                        color = VOX_COLOR;
                }
                if (this.props.vox == 2) {
                    vox2_color = "white";
                    if((maxValue > vox2) || (Math.abs(minValue) > vox2))
                        color = VOX_COLOR;
                }
                if (this.props.vox == 1) {
                    vox3_color = "white";
                    if((maxValue > vox1) || (Math.abs(minValue) > vox1))
                        color = VOX_COLOR;
                }

                //redraw vox lines only on changes
                if(this.draw_lines){
                    ctx.font = "14px Sans-Serif";
                    //ctx.font = ctx.font.replace(/\d+px/, "14px");
                    ctx.setLineDash([1, 1]);

                    ctx.fillStyle = vox1_color;// 'rgb(200,0,0)';
                    ctx.strokeStyle = vox1_color;
                    ctx.beginPath();
                    ctx.moveTo(0,Math.round((canvas.height/2) - vox3) + 0.5);
                    ctx.lineTo(canvas.width,Math.round((canvas.height/2) - vox3) + 0.5);
                    ctx.moveTo(0,Math.round((canvas.height/2) + vox3)+0.5);
                    ctx.lineTo(canvas.width,Math.round((canvas.height/2) + vox3)+0.5);
                    ctx.stroke();
                    ctx.fillText("High",5,Math.round((canvas.height/2)-vox3-3));

                    ctx.fillStyle = vox2_color;// 'rgb(200,0,0)';
                    ctx.strokeStyle = vox2_color;
                    ctx.beginPath();
                    ctx.moveTo(0,Math.round((canvas.height/2) - vox2)+0.5);
                    ctx.lineTo(canvas.width,Math.round((canvas.height/2) - vox2)+0.5);
                    ctx.moveTo(0,Math.round((canvas.height/2) + vox2)+0.5);
                    ctx.lineTo(canvas.width,Math.round((canvas.height/2) + vox2)+0.5);
                    ctx.stroke();
                    ctx.fillText("Medium",5,Math.round((canvas.height/2)-vox2-3));


                    ctx.fillStyle = vox3_color;// 'rgb(200,0,0)';
                    ctx.strokeStyle = vox3_color;
                    ctx.beginPath();
                    ctx.moveTo(0,Math.round((canvas.height/2) - vox1)+0.5);
                    ctx.lineTo(canvas.width,Math.round((canvas.height/2) - vox1)+0.5);
                    ctx.moveTo(0,Math.round((canvas.height/2) + vox1)+0.5);
                    ctx.lineTo(canvas.width,Math.round((canvas.height/2) + vox1)+0.5);
                    ctx.stroke();
                    ctx.fillText("Low",5,Math.round((canvas.height/2)-vox1-3));
                    this.draw_lines++;
                    if(this.draw_lines > 2) this.draw_lines = false;
                }

            }else color = VOX_COLOR;

            //draw sound line
            ctx.setLineDash([]);
            ctx.strokeStyle = color;
            ctx.beginPath();
            ctx.moveTo(this.x,canvas.height/2-minValue);
            ctx.lineTo(this.x,canvas.height/2-maxValue);
            ctx.stroke();

            this.x++;
            this.width=canvas.offsetWidth;

            //reset to the begining
            //if(this.x >  canvas.offsetWidth){
            if(this.x > CANVAS_WIDTH){
                this.clear();
            }
        }
    }

    clear(){

        let canvas = ReactDOM.findDOMNode(this.refs.myCanvas);
        if(canvas == null) return;
        let ctx = canvas.getContext('2d');


        this.x = 0;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.draw_lines = true;



    }

    render() {

        let height = this.props.height;
        if(this.sm && this.props.smallBigger) height = height*2;
        return(
            <canvas 
                className="soundCanvas" 
                ref="myCanvas" 
                width={CANVAS_WIDTH} 
                height={height}
            >
            </canvas>
        );
    }


};

