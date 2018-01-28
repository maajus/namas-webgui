import React from "react";
import Button from "../components/Button";


var Buttons = {
    Reconnect: 0,
}

//export default class TopBar extends React.Component{
export default class NoConnection extends React.Component {

    reload(){

        location.reload()

    }

    render() {



        return (
            <div className="container-fluid jumbotron mainFrame">
                <div className="col-lg-12" style={{textAlign:"center", verticalAlign:"middle", paddingTop:"100px"}}>
                <h3> {this.props.text} </h3>
                <hr style={{width:"60%"}} />
                        <button
                            type="button"
                            className="btn btn-primary"
                                onClick={this.reload.bind(this)}>
                                Retry
                            </button>
 
            </div>
            </div>
        );
    }
};


