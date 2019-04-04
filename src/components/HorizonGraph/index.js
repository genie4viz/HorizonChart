import React, { Component} from 'react';
import ResponsiveWrapper from './ResponsiveWrapper';
import Horizon from './Horizon';

class HorizonGraph extends Component {
  constructor(props){
    super(props);    
    const {parentWidth, parentHeight, params} = this.props;    
    this.state = {
      params: params,
      width: Math.max(parentWidth, 400),
      height: Math.max(parentHeight, 200)
    };
  };  
  componentWillReceiveProps(nextProps){    
    const {parentWidth, parentHeight, params} = nextProps;
    this.setState({
      params: params,
      width: Math.max(parentWidth, 400),
      height: Math.max(parentHeight, 200)
    }); 
  }
  
  render() {
    const {width, height, params} = this.state;    
    let margins = {left: 20, right: 20, bottom: 20, top: 20},
        svgDimen = {width: width - margins.left - margins.right, height: height - margins.top - margins.bottom},
        categoryCount = params.value.length + 1,
        h_step = svgDimen.height / categoryCount,
        datas = [], categories = [];
    
    JSON.parse(JSON.stringify(params.categories), (key, value) => {      
      categories.push({
        label: key,
        value: value
      });
    });
    categories.pop();//pop end empty node

    params.value.forEach((e) => {
      datas.push({
        value: e, 
        categories: params.categories, 
        dividerStyle: params.dividerStyle, 
        tooltipStyle: params.tooltipStyle
      });
    });
    return (
      <svg width={svgDimen.width} height={svgDimen.height} transform={`translate(${(width - svgDimen.width) / 2}, ${(height - svgDimen.height) / 2})`}>
        {datas.map((v, i) => (
          <g className={"Horizon" + i} key={i} transform={`translate(0, ${h_step * i})`}>
            <Horizon data={v} width={svgDimen.width} height={h_step}/>
          </g>
        ))}
        <g className="legend" transform={`translate(0, ${h_step * (categoryCount - 1) + h_step/2})`}>
          {categories.map((v, i) => (
            <g key={i}>
              <circle cx={svgDimen.width * (i + 1) / (categories.length + 2)} cy="0" r="5" fill={v.value} />            
              <text x={svgDimen.width * (i + 1) / (categories.length + 2) + 10} y="0" alignmentBaseline="central" textAnchor="start">{v.label}</text>
            </g>
          ))}
        </g>
      </svg>
    );
  }
}

export default ResponsiveWrapper(HorizonGraph);
