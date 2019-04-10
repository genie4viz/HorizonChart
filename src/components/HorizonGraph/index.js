import React, { Component} from 'react';
import ResponsiveWrapper from './ResponsiveWrapper';
import * as d3 from "d3";
import Horizon from './Horizon';

class HorizonGraph extends Component {
  constructor(props){
    super(props);    
    const {parentWidth, parentHeight, params} = this.props;    
    this.state = {
      params: params,
      width: Math.max(parentWidth, 400),
      height: Math.max(parentHeight, 400)
    };
  };  
  static getDerivedStateFromProps(nextProps, prevState){    
    const {parentWidth, parentHeight, params} = nextProps;
    return {
      params: params,
      width: Math.max(parentWidth, 400),
      height: Math.max(parentHeight, 400)
    };    
  }
  
  render() {
    const {width, height, params} = this.state;
    
    let margins = {left: params.margins.left, right: params.margins.right, bottom: params.margins.bottom, top: params.margins.top},
        svgDimen = {width: width - margins.left - margins.right, height: height - margins.top - margins.bottom},
        categoryCount = params.value.length + 1,
        h_step = svgDimen.height / categoryCount,
        datas = [];

    params.value.forEach((e) => {
      datas.push({
        value: e, 
        categories: params.categories, 
        dividerStyle: params.dividerStyle, 
        tooltipStyle: params.tooltipStyle,
        textStyle: params.textStyle        
      });
    });
    return (
      <svg width={width} height={height}>
        <g width={width} transform={`translate(${(params.margins.left)}, ${(height - svgDimen.height) / 2})`}>
          {datas.map((v, i) => (
            <g className={"Horizon" + i} key={i} transform={`translate(0, ${h_step * i})`}>
              <Horizon data={v} width={svgDimen.width} height={h_step} />
            </g>
          ))}
          <g className="legend" transform={`translate(0, ${h_step * (categoryCount - 1) + h_step/2})`}>
            {d3.entries(params.categories).map((v, i) => (
              <g key={i}>
                <circle cx={svgDimen.width * (i + 1) / (d3.entries(params.categories).length + 2)} cy="0" r={params.legendStyle.radius} fill={v.value} />            
                <text x={svgDimen.width * (i + 1) / (d3.entries(params.categories).length + 2) + params.legendStyle.radius + 5} y="0" alignmentBaseline="central" textAnchor="start"
                  style={{fontSize: params.legendStyle.fontSize, fontFamily: params.legendStyle.fontFamily, fill: params.legendStyle.textColor}}
                >{v.key}</text>
              </g>
            ))}
          </g>
        </g>
      </svg>
    );
  }
}

export default ResponsiveWrapper(HorizonGraph);
