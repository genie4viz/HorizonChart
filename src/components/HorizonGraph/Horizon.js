import React, {Component} from 'react';
import * as d3 from "d3";

class Horizon extends Component {
    constructor(props) {
        super(props);
        this.state = {
            width: this.props.width,
            height: this.props.height,
            data: this.props.data,
            height_pos: this.props.height_pos
        }        
    }
    static getDerivedStateFromProps(nextProps) {
        
        return {
            width: nextProps.width,
            height: nextProps.height,
            data: nextProps.data,
            height_pos: nextProps.height_pos
        };
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

        var defs = graph.append("defs");
        var filter = defs.append("filter")
            .attr("id", "drop-shadow")
            .attr("height", "125%");
        filter.append("feGaussianBlur")
            .attr("in", "SourceAlpha")
            .attr("stdDeviation", 1.3)
            .attr("result", "blur");
        
        filter.append("feOffset")
            .attr("in", "blur")
            .attr("dx", 2.1)
            .attr("dy", 2.1)
            .attr("result", "offsetBlur");
        var feMerge = filter.append("feMerge");
        feMerge.append("feMergeNode")
            .attr("in", "offsetBlur")
        feMerge.append("feMergeNode")
            .attr("in", "SourceGraphic");

        graph
            .append('path')
            .attr("stroke-width", dividerStyle.borderWidth)
            .attr("stroke", "grey")
            .attr("d", 'M0,' + (dividerStyle.margin + 15) + 'l' + dimen.width + ',0');

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
            .on("mouseover", (d, i) => {                
                let mov = 0;
                for(let p = 0; p < i; p++){
                    mov += step * gd[p].value;
                }
                d3.select('.' + legend + d.label)
                    .attr('transform', 'translate(0, -3)scale(1, 1.2)');

                tooltip.attr('transform', `translate(${mov + (step * d.value)/2},0)`).call(callout, d);
                tooltip.raise();
            })
            .on("mouseout", (d) =>{
                d3.select('.' + legend + d.label)                    
                    .attr('transform', 'translate(0, 0)scale(1, 1)');
                tooltip.call(callout, null);
            });
        function callout(g, d) {
            if (!d){
                g.selectAll("*").remove();
                return g.style('display', 'none');                
            } 

            const w = tooltipStyle.width, h = tooltipStyle.height;
            g.style('display', null)
                .style('pointer-events', 'none')
                .style('font', '10px sans-serif');
            
            g.append('path')
                .attr("d", 'M0,0l-8,-12l' + (-(w/2 - 8)) + ',0l0,' + (-h) + 'l' + w + ',0l0,' + (h) + 'l' + (-(w/2 - 8)) + ',0L0,0Z')
                .attr('fill', data.tooltipStyle.background)
                .attr('stroke', 'grey')
                .style("filter", "url(#drop-shadow)");

            g.append('path')
                .attr("d", 'M' + (-w/4 - 5) + ',' + (-h*3/4 - 12) + 'l10,0')
                .attr("stroke-width", 12)
                .attr("stroke-linecap","round")
                .attr("stroke", d.color);

            g.append('text')
                .attr('x', w/4)
                .attr('y', (-h*3/4 - 12))
                .attr('text-anchor', 'middle')
                .attr('alignment-baseline', 'central')
                .style('font-size', 14)
                .text(d.label);
            g.append('text')
                .attr('x', -w/4)
                .attr('y', -(h/4 + 12))
                .attr('text-anchor', 'middle')
                .attr('alignment-baseline', 'central')
                .style('font-weight', 'bold')
                .style('font-size', 13)
                .text(d.value);
            g.append('text')
                .attr('x', w/4)
                .attr('y', -(h/4 + 12))
                .attr('text-anchor', 'middle')
                .attr('alignment-baseline', 'central')
                .style('font-size', 14)
                .text('(' + Math.ceil(100 * d.value/ total) + '%)');
        }

    }
    render() {
        const {height, data} = this.state;
        let legend = d3.keys(data.value)[0];        
        return  <g className="chartArea">
                    <g className="legend" transform={`translate(0, ${height * 0.4})`}>
                        <text x="10" y="0" alignmentBaseline="hanging" textAnchor="start" style={{fill:data.textStyle.fontColor, fontFamily: data.textStyle.fontFamily, fontSize: data.textStyle.fontSize}}>{legend}</text>
                    </g>
                    <g className="graphArea" ref={el => this.el = el} transform={`translate(0, ${height * 0.7})`}/>
                </g>;
    }
}


export default Horizon;