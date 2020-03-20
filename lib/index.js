const d3 = require("d3");
const util = require("./util.js");
const coordsystem = require("./coordsystem.js")
const graph = require("./graph.js");

const DEFAULT_WIDTH = 400;
const DEFAULT_HEIGHT = 400;

function plot(options) {

    if(!options){
        util.error("called without options, returning immediately.");
        return;
    }

    if(!options.target) {
        util.error("called without options.target, returning immediately. options: ", options);
        return;
    }

    const container = d3.select(options.target);
    if(container.empty()) {
        util.error(`options.target (${options.target}) not found, returning immediately.`);
        return;
    }

    let meta = {
        options: options
    };

    if(options.width !== undefined) {
        if(options.width <= 0) {
            util.error(`options.width <= 0 (${options.width}), returning immediately.`);
            return;
        } else {
            meta.width = options.width;
        }
    } else {
        meta.width = DEFAULT_WIDTH;
    }

    if(options.height !== undefined) {
        if(options.height <= 0) {
            util.error(`options.height <= 0 (${options.height}), returning immediately.`);
            return;
        } else {
            meta.width = options.height;
        }
    } else {
        meta.height = DEFAULT_HEIGHT;
    }

    meta.scaleXStart = -19;
    meta.scaleXEnd   =  19;
    meta.scaleYStart = -19;
    meta.scaleYEnd   =  19;

    const svg = container.append("svg")
        .attr("class", "function-plotter")
        .attr("width", meta.width)
        .attr("height", meta.height)
        .attr("viewBox", [0, 0, meta.width, meta.height])
    ;

    meta.svg = svg;

    const main = svg.append("g")
        .attr("class", "main")
    ;

    const content = main.append("g")
        .attr("class", "content")
    ;

    coordsystem(meta, main, content);

    if(options.data) {
        for(let i = 0; i < options.data.length; i++) 
            graph(options.data[i], meta, content);
    }

    const paths = content.selectAll("path")
        .attr("transform", d => `translate(${d})`);

    svg.call(d3.zoom()
        .extent([[0, 0], [meta.width, meta.height]])
        .scaleExtent([1, 8])
        .on("zoom", zoomed)
    );

    function zoomed() {
        const {transform} = d3.event;
        paths.attr("transform", d => `translate(${transform.apply(d)})`);
    }

    return svg.node();
}

module.exports = plot;
module.exports.plot = plot;