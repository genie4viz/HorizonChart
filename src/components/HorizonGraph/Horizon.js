import React, {Component} from 'react';
import * as d3 from "d3";

class Horizon extends Component {
    constructor(props) {
        super(props);
        this.state = {
            width: this.props.width,
            height: this.props.height,
            params: this.props.params
        }
    }
    componentWillReceiveProps(nextProps) {        
        this.setState({
            width: nextProps.width,
            height: nextProps.height,
            params: nextProps.params
        });
    }
    componentDidMount() {
        this.drawChart();
    }
    componentDidUpdate() {
        this.drawChart();
    }
    drawChart() {
        const { width, height, params} = this.state;        
        let svgDimen = {width: width * 0.8, height: height * 0.8},
            rateSize = Math.min(svgDimen.width, svgDimen.height),
            n = 100,
            base_radius = rateSize * 0.5,
            pi = Math.PI,            
            base_endAngle =  pi * 2 / 3,
            base_startAngle = -base_endAngle,
            base_field = d3.range(base_startAngle, base_endAngle, (pi * 4 / 3) / n),
            base_scale = d3.scaleLinear().domain([0, n]).range([base_startAngle, base_endAngle]),
            linearColor = d3.scaleLinear().range([params.startColor, "yellow" ,params.endColor]).domain([0, n/2, n]),
            //inner guage
            endAngle = (params.endAngle - 90) * pi / 180,
            startAngle = base_startAngle,//(params.startAngle - 90) * pi / 180,
            radius = base_radius - params.arc_w - 10,
            field = d3.range(startAngle, endAngle, (pi * 4 / 3) / n),
            scale = d3.scaleLinear().domain([0, n]).range([startAngle, endAngle]);
        
        d3.select(this.el).selectAll("*").remove();

        //outer arc
        let base_arc = d3.arc()
            .innerRadius(base_radius - 2)
            .outerRadius(base_radius)
            .cornerRadius(1)
            .startAngle((d, i) => base_scale(i))
            .endAngle((d, i) => base_scale(i + 1));

        d3.select(this.el).append('g')
            .selectAll('path')
            .data(base_field)
            .enter()
            .append('path')
            .attr('stroke', (d, i) => linearColor(i))
            .attr('stroke-width', params.arc_w)
            .attr('fill', (d, i) => linearColor(i))
            .attr('d', base_arc);
        
        //inner arc        
        let arc = d3.arc()
            .innerRadius(radius - 2)
            .outerRadius(radius)
            .cornerRadius(1)
            .startAngle((d, i) => scale(i))
            .endAngle((d, i) => scale(i + 1));

        d3.select(this.el).append('g')
            .selectAll('path')
            .data(field)
            .enter()
            .append('path')
            .attr('stroke', (d, i) => params.fillerColor)
            .attr('stroke-width', params.arc_w * 0.7)
            .attr('fill', (d, i) => params.fillerColor)
            .attr('d', arc);

        //draw hexagon
        // let hr = params.HexStyle.Radius;
        d3.select(this.el)
            .append('path')
            .attr("fill", "#ddd")
            .attr("stroke", "#aaa")
            .attr("stroke-width", 10)
            .attr("stroke-linejoin", "round")
            .attr("d", () => {
                let hr = radius * 0.5;                
                let str_path = 'M0,' + (-hr * Math.cos(0)) 
                + 'L' + hr * Math.cos(pi/6) + ',' + (-hr * Math.sin(pi/6)) 
                + 'L' + hr * Math.cos(pi/6) + ',' + (hr * Math.sin(pi/6)) 
                + 'L0,' + hr * Math.cos(0) 
                + 'L' + (-hr * Math.cos(pi/6)) + ',' + (hr * Math.sin(pi/6))
                + 'L' + (-hr * Math.cos(pi/6)) + ',' + (-hr * Math.sin(pi/6))
                + 'L0,' + (-hr * Math.cos(0)) + 'Z';                
                return str_path;
            });
            
        let textRate = rateSize / params.ValueStyle.TextSize;
        d3.select(this.el)
            .append('text')            
            .style("text-anchor", "middle")
            .style("alignment-baseline", "central")
            .attr("font-weight", 600)
            .style("font-size", rateSize * 0.17)
            .attr('fill', '#041e44')
            .text(params.Value);
    }
    render() {
        const {width, height} = this.state;
        
        return  <svg width={width} height={height}>
                    <g width={width} className="HorizonChart" transform={`translate(${width / 2}, ${height / 2})`} ref={el => this.el = el}></g>            
                </svg>
    }
}


export default Horizon;