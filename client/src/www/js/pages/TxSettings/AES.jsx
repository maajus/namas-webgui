import React from "react";
import {encodeAes } from "../../modules/Aes";
import { connect } from "react-redux"

@connect((store) => {

    return {
        RxConfig: store.RxConfig.data,
    };
})



export default class AES extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            data:""//this.props.data./** Start value **/
        }; }; 


    
     keyChange(event){

        this.setState({data:event.target.value});
        this.returnData(event.target.value);

    }

    inputClicked(){
        if(this.state.data == "")
            this.returnData("");
    }

    
    returnData(val){

        var data = encodeAes(val, this.props.RxConfig.KEY);
        this.props.callback(data); //send data to parent
    }




    render() {


            //console.log(this.state.data)

         
            return (
                <div className="container-fluid">

                <label style={{paddingTop:'5px', width:"90%"}}> 
                    AES Key:
                    <br/>
                    <input 
                        type="text" 
                        style={{width:"100%"}}
                        value={this.state.data} 
                        maxLength="6"
                        className="form-control mystyle"
                        onClick={this.inputClicked.bind(this)}
                        onChange={this.keyChange.bind(this)} />
                </label><br/>

                </div>
            );
    }
};

