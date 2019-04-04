import React, {Component} from 'react';
import * as d3 from "d3";

class Horizon extends Component {
    constructor(props) {
        super(props);
        this.state = {
            width: this.props.width,
            height: this.props.height,
            data: this.props.data
        }        
    }
    componentWillReceiveProps(nextProps) {        
        this.setState({
            width: nextProps.width,
            height: nextProps.height,
            data: nextProps.data
        });
    }
    matching(data){        
        let colors = d3.entries(data.categories), t_values = d3.entries(data.value),
            s_values = d3.entries(t_values[0].value), matched = [];
        
        for(let i = 1; i < s_values.length; i++){            
            matched.push({
                label: s_values[i].key,
                value: s_values[i].value,
                color: colors[i - 1].value
            });
        }
        return matched;
    }
    componentDidMount() {
        this.drawChart();
    }
    componentDidUpdate() {
        this.drawChart();
    }
    drawChart() {
        const { width, data} = this.state;
        let gd = this.matching(data),
            total = d3.entries(d3.entries(data.value)[0].value)[0].value,
            step = width / total,
            g_y = 15;
            
        d3.select(this.el).selectAll("*").remove();
        
        for(let i = 0; i < gd.length; i++){
            d3.select(this.el)
                .append('path')
                .attr("d", () => {
                    let mov = 0;
                    for(let p = 0; p < i; p++){
                        mov += step * gd[p].value;
                    }
                    return 'M' + mov + ',0l0,' + g_y + 'l' + step * gd[i].value + ',0l0,' + (-g_y) + 'l-' + step * gd[i].value + ',0z';
                })                
                .attr("fill", gd[i].color);
        }        
    }
    render() {
        const {height, data} = this.state;
        let legend = d3.keys(data.value)[0];
        
        return  <g className="chartArea">
                    <g className="legend" transform={`translate(0, ${height * 0.3})`}>
                        <text x="30" y="0" alignmentBaseline="hanging" textAnchor="start">{legend}</text>
                    </g>
                    <g className="graphArea" ref={el => this.el = el} transform={`translate(0, ${height * 0.7})`}/>
                </g>;
    }
}


export default Horizon;