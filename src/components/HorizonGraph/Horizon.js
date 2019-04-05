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
        // console.log(nextProps.height)
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
        const { width, height, data} = this.state;
        // console.log(height, "drawChart")
        let gd = this.matching(data),
            dividerStyle = data.dividerStyle,
            tooltipStyle = data.tooltipStyle,
            dimen = {width: width - 40, height: height - 20},
            total = d3.entries(d3.entries(data.value)[0].value)[0].value,
            step = dimen.width / total, sz = 15,
            legend = d3.keys(data.value)[0];
        
        d3.select(this.el).selectAll("*").remove();        
        let graph = d3.select(this.el);            

        const tooltip = graph.append('g');

        graph
            .append('path')
            .attr("stroke-width", dividerStyle.borderWidth)
            .attr("stroke", "grey")
            .attr("d", 'M0,' + dimen.height * 0.5 + 'l' + dimen.width + ',0');

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
                // console.log(strPath)
                return strPath;
            })                
            .attr("fill", d => d.color)
            .attr("cursor", "pointer")
            .on("mouseover", (d, i) => {
                let mov = 0;
                for(let p = 0; p < i; p++){
                    mov += step * gd[p].value;
                }
                d3.select('.' + legend + d.label)
                    .attr('transform', 'translate(0, -3)scale(1, 1.2)');
                
                tooltip.attr('transform', `translate(${mov + (step * d.value)/2},0)`).call(callout, d);
            })
            .on("mouseout", (d) =>{
                d3.select('.' + legend + d.label)                    
                    .attr('transform', 'translate(0, 0)scale(1, 1)');
                tooltip.call(callout, null);
            });
            function callout(g, d) {
                if (!d) return g.style('display', 'none');

                const w = tooltipStyle.width, h = tooltipStyle.height;
                g.style('display', null)
                    .style('pointer-events', 'none')
                    .style('font', '10px sans-serif');

                var defs = graph.append("defs");
                var filter = defs.append("filter")
                    .attr("id", "drop-shadow")
                    .attr("height", "108%");
                
                filter.append("feGaussianBlur")
                    .attr("in", "SourceAlpha")
                    .attr("stdDeviation", 1)
                    .attr("result", "blur");
                filter.append("feOffset")
                    .attr("in", "blur")
                    .attr("dx", 2)
                    .attr("dy", 2)                    
                    .attr("result", "offsetBlur");
                var feMerge = filter.append("feMerge");                
                feMerge.append("feMergeNode")
                    .attr("in", "offsetBlur")
                feMerge.append("feMergeNode")
                    .attr("in", "SourceGraphic");

                g.append('path')
                    .attr("d", 'M0,0l-8,-12l-' + (w/2 - 8) + ',0l0,-' + h + 'l' + w + ',0l0,' + h + 'l-' + (w/2-8) + ',0L0,0Z')
                    .attr('fill', 'white')
                    .attr('stroke', 'grey')
                    // .attr('stroke-width', 3)
                    .attr('stroke-linejoin', 'round')
                    // .style("filter", "url(#drop-shadow)")
                    .attr('transform', "translate(0,-4)")

                g.append('path')
                    .attr("d", 'M-' + (w/2 - 18)+ ',-' + (h) + 'l10,0')
                    .attr("stroke-width", 12)
                    .attr("stroke-linecap","round")
                    .attr("stroke", d.color)

                g.append('text')
                    .attr('x', -w/2 + 40)
                    .attr('y', -h + 4)                    
                    .style('font-size', 16)                    
                    .text(d.label);
                g.append('text')
                    .attr('x', -w/2 + 6)
                    .attr('y', -h + 26)
                    .style('font-weight', 'bold')
                    .style('font-size', 13)                    
                    .text(d.value);
                g.append('text')
                    .attr('x', -w/2 + 38)
                    .attr('y', -h + 26)                    
                    .style('font-size', 14)
                    .text('(' + Math.ceil(100 * d.value/ total) + '%)');
              }
        
    }
    render() {
        const {height, data} = this.state;
        let legend = d3.keys(data.value)[0];
        
        return  <g className="chartArea">
                    <g className="legend" transform={`translate(0, ${height * 0.3})`}>
                        <text x="30" y="0" alignmentBaseline="hanging" textAnchor="start">{legend}</text>
                    </g>
                    <g className="graphArea" ref={el => this.el = el} transform={`translate(20, ${height * 0.7})`}/>
                </g>;
    }
}


export default Horizon;