import React from "react";

let saved_log = "";

//export default class TopBar extends React.Component{
export default class LogArea extends React.Component {

    constructor(props){
        super(props);
        this.Data = "";
        this.state = {Log:"" }; /* initial state */


    };

    componentDidMount(){

        //this.parseLog(this.props.value);
        this.setState({Log:saved_log});
    }

    componentWillUnmount() {

        saved_log = this.state.Log;
    }

    componentWillReceiveProps(new_props){

        if(new_props.value == undefined) return;
        //show only new messages
        if(this.Data != new_props.value){
            this.parseLog(new_props.value);
            this.Data = new_props.value;
        }

    }

componentDidUpdate() {

        var textarea = document.getElementById("log");
        if(textarea != null ){
            textarea.scrollTop = textarea.scrollHeight;
        }
}

    parseLog(Log){

        if(Log.length <= 0) return;

        var log = this.state.Log;
        if(log.length>0)
            log = log+'\n';
        log = log + Log;
        this.setState({Log:log});
    }

    render() {

        //rows={this.props.rows}


        return (
                   <textarea
                        className="form-control noresize my-label" 
                        style={{paddingBottom:"5px", paddingBottom:"5px", height:this.props.rows}}
                        readOnly="true"
                        value={this.state.Log}
                        id="log">
                    </textarea>
        );
    }
};


LogArea.defaultProps = {
    rows:"5"
};


