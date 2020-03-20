const d3 = require("d3");

function text(svg, x, y, text) {
    svg.append("text")
        .attr("x", x)
        .attr("y", y)
        .attr("fill", "black")
        .style("font-size", "x-small")
        .style("text-anchor", "end")
        .html(text)
    ;
}

const PADDING_LEFT = 25;
const PADDING_BOTTOM = 25;

function leftAxis(meta, main) {
    const g = main.append("g")
        .attr("class", "axis axis-left")
    ;
    
    g.append("line")
        .attr("x1", PADDING_LEFT)
        .attr("y1", 0)
        .attr("x2", PADDING_LEFT)
        .attr("y2", meta.height - PADDING_BOTTOM)
        .attr("stroke", "lightgrey")
    ;
}

function bottomAxis(meta, main) {
    const g = main.append("g")
        .attr("class", "axis axis-bottom")
    ;
    
    g.append("line")
        .attr("x1", PADDING_LEFT)
        .attr("y1", meta.height - PADDING_BOTTOM)
        .attr("x2", meta.width)
        .attr("y2", meta.height - PADDING_BOTTOM)
        .attr("stroke", "lightgrey")
    ;
}

function xAxis(meta, content) {
    const scaler = d3.scaleLinear()
        .domain([meta.scaleYStart, meta.scaleYEnd])
        .range([0, meta.height])
    ;
    
    let height = scaler(0);

    content.append("line")
        .attr("class", "axis axis-x")
        .attr("x1", 0)
        .attr("y1", height)
        .attr("x2", meta.width)
        .attr("y2", height)
        .attr("stroke", "grey")
    ;
}

function yAxis(meta, content) {
    const scaler = d3.scaleLinear()
        .domain([meta.scaleXStart, meta.scaleXEnd])
        .range([0, meta.width])
    ;
    
    let width = scaler(0);

    content.append("line")
        .attr("class", "axis axis-x")
        .attr("x1", width)
        .attr("y1", 0)
        .attr("x2", width)
        .attr("y2", meta.height)
        .attr("stroke", "grey")
    ;
}

function coordsystem(meta, main, content) {
    leftAxis(meta, main);    
    bottomAxis(meta, main);

    content.style("transform", `translate(${PADDING_LEFT}px, -${PADDING_BOTTOM}px)`);
    
    xAxis(meta, content);
    yAxis(meta, content);
}

module.exports = coordsystem;