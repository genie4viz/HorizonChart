import React, { Component, Fragment } from 'react';
import ResponsiveWrapper from './ResponsiveWrapper';
import Gauge from './Gauge';


class GaugeGraph extends Component {
  constructor(props){
    super(props);    
    const {parentWidth, parentHeight, params} = this.props;    
    this.state = {
      params: params,
      width: Math.max(parentWidth, 200),
      height: Math.max(parentHeight, 200)
    };
  };  
  componentWillReceiveProps(nextProps){    
    const {parentWidth, parentHeight, params} = nextProps;    
    this.setState({
      params: params,
      width: Math.max(parentWidth, 200),
      height: Math.max(parentHeight, 200)
    }); 
  }
  
  render() {
    return (
      <Fragment>
        <Gauge params={this.state.params} width={this.state.width} height={this.state.height} />
      </Fragment>
    );
  }
}

export default ResponsiveWrapper(GaugeGraph);
