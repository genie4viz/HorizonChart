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
            step = width / total, sz = 15,
            legend = d3.keys(data.value)[0];
            
        d3.select(this.el).selectAll("*").remove();        
        let graph = d3.select(this.el);

        graph.selectAll(".bars")
            .data(gd)
            .enter().append('path')
            .attr('class', d => legend + d.label)
            .attr("d", (d, i) => {
                let mov = 0, strPath = '';
                for(let p = 0; p < i; p++){
                    mov += step * gd[p].value;
                }                
                if(i == 0){
                    strPath += 'M' + sz/2 + ',0Q0,' + sz/2 + ',' + sz/2 + ',' + sz + 'l' + (step * d.value - sz/2) + ',0l0,' + (-sz) + 'l-' + (step * d.value - sz/2) + ',0z';
                }else if(i == gd.length - 1){
                    strPath += 'M' + mov + ',0l0,' + sz + 'l' + (step * d.value - sz/2) + ',0Q' + (mov + step * d.value) + ',' + sz/2 + ',' + (mov + step *d.value - sz/2) + ',0l-' + (step * d.value - sz/2) + ',0z';
                }else{
                    strPath += 'M' + mov + ',0l0,' + sz + 'l' + step * d.value + ',0l0,' + (-sz) + 'l-' + step * d.value + ',0z';
                }                    
                return strPath;
            })                
            .attr("fill", d => d.color)
            .attr("cursor", "pointer")
            .on("mouseover", (d) => {
                d3.select('.' + legend + d.label)                                        
                    .attr('transform', 'translate(0, -3)scale(1, 1.2)');
            })
            .on("mouseout", (d) =>{
                d3.select('.' + legend + d.label)                    
                    .attr('transform', 'translate(0, 0)scale(1, 1)')
            })
        
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