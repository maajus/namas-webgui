import React from "react";

var moment = require('moment');

var weekday=new Array(7);
weekday[0]="MO";
weekday[1]="TU";
weekday[2]="WE";
weekday[3]="TH";
weekday[4]="FR";
weekday[5]="SA";
weekday[6]="SU";

export default class WeekDayPicker extends React.Component {

    constructor(){

        super();
        var days = ["0","0","0","0","0","0","0"];
        this.state = {days:days};

    }

    componentDidMount(){

            var days = (parseInt(this.props.days)+128).toString(2).split('');
            days.shift();
            this.setState({days:days});
    }


    buttonClicked(index){

        var days = this.state.days;
        if(days[6-index] != 1) days[6-index] = "1";
        else days[6-index] = "0";

        this.setState({days:days});
        this.props.callback(parseInt(days.join(''),2));

    }

    createButton(nr,status){

        var style;
        let Class = "btn btn-primary";
        //if(status!=1) style = {background:'none'};
        if(status==1) Class = "btn btn-primary active";

        return (
            <button 
                type="button" 
                className={Class} 
                key={nr}
                onClick={this.buttonClicked.bind(this,nr)}
            >
                {weekday[nr]}
                
            </button>
        )
    }

    render() {

        //get and format current time
        //console.log(this.state.days);

        var buttons = [];
        for(var i = 0; i < 7; i++) buttons.push(this.createButton(i,this.state.days[6-i]))


        return (
            <div>
                <div className="btn-group btn-group" 
                    style={{border:"1px solid #464545",borderRadius:"6px"}}> 
                    {buttons}
                </div>
            </div>
        )
    }
};


