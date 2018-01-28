import React from "react";
import Slider from 'react-rangeslider';

export default class SliderM extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      value: 10 /** Start value **/
    };
      console.log("render");
  }

  handleChange(value) {
    this.setState({
      value: value
    });
  }

  render() {
    let { value } = this.state;
    return (
        <div>
          <Slider
          value={value}
          orientation="horizontal"
          onChange={this.handleChange.bind(this)}
        />
          <div>Value: {value}</div>
        </div>
    );
  }
}
