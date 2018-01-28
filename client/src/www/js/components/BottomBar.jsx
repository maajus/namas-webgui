import React from "react";

var style = {textAlign: 'center',verticalAlign:'middle', color:'gray', display:'block'};

export default class TopBar extends React.Component {
    render() {

        return (
            <div className="container-fluid jumbotron my-label mainBar" style = {{textAlign: 'center'}}>

                <label/>
                <label style={style}>Version 0.1.1 </label>
            </div>
        );
    }
};

// <label style={style}>Copyright © 2016 COMMESH </label>
