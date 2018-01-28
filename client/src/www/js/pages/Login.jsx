import React from 'react';
import { login } from "../actions/fetchActions";
import { connect } from "react-redux"
import Checkbox from "../components/Checkbox";

@connect((store) => {

    return {
        loginStatus: store.Login.data.status,
    };
})


 
export default class LoginPage extends React.Component {

    constructor(){
        super();
        this.state = {rememberMe:false};
        this.pass = "", this.user = "";
    }

handleKeyPress(e) {
    if (e.key === 'Enter') {
        this.submit();
    }
  }

    submit(){

        var token="";
        //generate token
        if(this.state.rememberMe){
            token = (Math.floor(Math.random() * (Number.MAX_SAFE_INTEGER + 1))).toString()
            document.cookie = "token="+token+";secure";
        }

        //document.cookie = "user=123123123";
        if(this.user !="" && this.pass!="")
            this.props.dispatch(login(this.user,this.pass,token));

    }

    remeberEnabled(value){

        this.setState({rememberMe:value});

    }

    userChanged(event){

        this.user = event.target.value;

    }

    passChanged(event){

        this.pass = event.target.value;

    }

    warnMesassage(){

        switch(this.props.loginStatus){
            case "2":
                return (<label className="my-label" style={{color:"red"}}> Wrong password  </label>);
                break;
            case "4":
                return (<label className="my-label" style={{color:"red"}}> Wrong username  </label>);
                break;

            default:
                return null;
        }

    }


    render() {
        return (
            <div className="container-fluid jumbotron mainFrame">
                <h2 style={{padding:"20px"}}> Login </h2>
                <div className="col-lg-12" 
                    style={{width:"350px", verticalAlign:"middle", paddingTop:"50px", paddingLeft:"30px"}}>
                    {this.warnMesassage()}
                    <div className="form-group">
                        <label for="usr">Name:</label>
                        <input type="text" className="form-control" id="usr" onChange={this.userChanged.bind(this)}/>
                    </div>
                    <div className="form-group">
                        <label for="pwd">Password:</label>
                        <input 
                            type="password" 
                            className="form-control" 
                            id="pwd" 
                            onKeyPress={this.handleKeyPress.bind(this)}  
                            onChange={this.passChanged.bind(this)}/>
                        
                    </div>
                    <Checkbox label="Remember me" 
                        checked={this.state.rememberMe} 
                        style={{paddingBottom:"20px"}}
                        handler={this.remeberEnabled.bind(this)}/>
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={this.submit.bind(this)}
                    >
                        Login
                    </button>

                </div>
            </div>
        );
    }


}


