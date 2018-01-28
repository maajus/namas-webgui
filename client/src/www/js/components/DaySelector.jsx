import React from "react";

var weekday=new Array(7);
weekday[0]="MO";
weekday[1]="TU";
weekday[2]="WE";
weekday[3]="TH";
weekday[4]="FR";
weekday[5]="SA";
weekday[6]="SU";

export default class DaySelector extends React.Component {

    constructor(props){

        super();
        var days = [false,false,false,false,false,false,false];
        this.state = {days};
    }

    componentDidMount(){

        var days = (parseInt(this.props.days)+128).toString(2).split('');
        days.shift();
        this.setState({days:days});
    }

    componentWillReceiveProps(nextProps){

        var days = (parseInt(nextProps.days)+128).toString(2).split('');
        days.shift();
        this.setState({days:days});
    }

    createButton(nr,status){

        var style = {background: 'none', color:'white'};
        if(status!=1) style = {background: 'none',color:'gray'};

        return (
            <button 
                type="button" 
                className="btn btn-primary"
                key={nr}
                style={style}>
                <label style={{padding:"0px", paddingTop:"3px"}} className="daySelector">{weekday[nr]}</label>
            </button>
        )
    }



    render() {

        var buttons = [];
        for(var i = 0; i < 7; i++) buttons.push(this.createButton(i,this.state.days[6-i]))

        return (
            <div>
                <div className="btn-group btn-group-xs">
                    {buttons}
                </div>
            </div>
        )
    }
}
