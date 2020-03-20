const d3 = require("d3");
const math = require("mathjs");
const util = require("./util.js");

function calculate(fn, x) {
    return math.evaluate(fn, {
        x: x
    });
}

function getCurveMethod(options) {
    switch (options.curve) {
        case "linear":   return d3.curveLinear;
        case "monoton":  return d3.curveMonotoneX;
        case "natural":  return d3.curveNatural;
        case "basis":    return d3.curveBasis;
        case "cardinal": return d3.curveCardinal;
        case "step":     return d3.curveStep;
        default: {
            if(options.curve !== undefined)
                util.error(`unknow curve type: ${options.curve}, defaulting to natural.`);
            return d3.curveNatural;
        }
    }
}

function graph(options, meta, main) {
    const data = [];
    const interval = options.interval || 1;

    const scaleX = d3.scaleLinear()
        .domain([0, meta.width])
        .range([meta.scaleXStart, meta.scaleXEnd])
    ;

    const scaleY = d3.scaleLinear()
        .domain([meta.scaleYStart, meta.scaleYEnd])
        .range([0, meta.height])
    ;

    const isDefined = d => d.y <= meta.height && d.y >= 0;

    for(let x = 0; x < meta.width + interval; x += interval) {
        const graphX = scaleX(x);
        const graphY = calculate(options.fn, graphX);
        const y = meta.height - scaleY(graphY);

        const point = {
            graphY: graphY,
            x: x,
            y: y
        }

        data.push(point);
    }

    for(let i = 1; i < data.length - 1; i++) {

        if(isDefined(data[i])) {

            if(!isDefined(data[i - 1])) {
                if(data[i].graphY < 0)
                    data[i].y = meta.height;
                else
                    data[i].y = 0;
            }

            if(!isDefined(data[i + 1])) {
                if(data[i].graphY < 0)
                    data[i].y = meta.height;
                else
                    data[i].y = 0;
            }

        }

    }

    const line = d3.line()
        .defined(isDefined)
        .x(d => d.x)
        .y(d => d.y )
        .curve(getCurveMethod(options))
    ;

    const container = main.append("g")
        .attr("class", "graph-container")
    ;
    
    const path  = container.append("path")
        .attr("class", "graph")
        .attr("stroke", "black")
        .attr("d", line(data))
        .attr("fill", "none")
        .attr("stroke-width", 1)
    ;
}

module.exports = graph;