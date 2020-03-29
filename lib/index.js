const util = require("./util.js");
const d3 = require("d3");
const createGraph = require("./graphs/index.js")

const DEFAULT_WIDTH = 400;
const DEFAULT_HEIGHT = 400;

function plot(options, removePrevious = true) {

    if(!options){
        util.error("called without options, returning immediately.");
        return null;
    }

    if(!options.target) {
        util.error("called without options.target, returning immediately. options: ", options);
        return null;
    }

    const target = d3.select(options.target);
    if(target.empty()) {
        util.error(`options.target (${options.target}) not found, returning immediately.`);
        return;
    }

    if(removePrevious)
        target.selectAll(".function-plotter").remove();

    let meta = {};
    meta.paddingLeft = 35;
    meta.paddingBottom = 10;

    if(options.width !== undefined) {
        if(options.width <= meta.paddingLeft) {
            util.error(`options.width <= ${meta.paddingLeft} (${options.width}), returning immediately.`);
            return null;
        } else {
            meta.svgWidth = options.width - meta.paddingLeft;
        }
    } else {
        meta.svgWidth = DEFAULT_WIDTH;
    }
    meta.width = meta.svgWidth - meta.paddingLeft;

    if(options.height !== undefined) {
        if(options.height <= meta.paddingBottom) {
            util.error(`options.height <= ${meta.paddingBottom} (${options.height}), returning immediately.`);
            return null;
        } else {
            meta.svgWidth = options.height - meta.paddingBottom;
        }
    } else {
        meta.svgHeight = DEFAULT_HEIGHT;
    }
    meta.height = meta.svgHeight - meta.paddingBottom;

    const originalScaleX = meta.scaleX = d3.scaleLinear()
        .domain([-7, 7])
        .range([0, meta.width])
    ;

    const originalScaleY = meta.scaleY = d3.scaleLinear()
        .domain([7, -7]) //Start and End flipped, because in svg 0 height is top
        .range([0, meta.height])
    ;

    const svg = target.append("svg")
        .attr("class", "function-plotter")
        .attr("width", meta.svgWidth)
        .attr("height", meta.svgHeight)
        .attr("viewBox", [0, 0, meta.svgWidth, meta.svgHeight]);

    const defs = svg.append("defs");

    const clipPathContentId = `clipPathContent-${options.target.split(/#|. /).join("")}`;
    const clipPathContent = defs.append("clipPath")
        .attr("id", clipPathContentId);
    
    clipPathContent.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", meta.width)
        .attr("height", meta.height);

    svg.append("style").html(
        ".function-plotter .domain{stroke:black;opacity:0.1;" +
        ".function-plotter .tick line{stroke:black;opacity:0.1;}"
    );

    const main = svg.append("g")
        .attr("class", "main");

    const content = main.append("g")
        .attr("class", "content")
        .attr("transform", `translate(${meta.paddingLeft}, ${-meta.paddingBottom})`)
        .attr("clip-path", `url(#${clipPathContentId})`);

    const leftAxis = main.append("g")
        .attr("transform", `translate(${meta.paddingLeft}, ${-meta.paddingBottom})`)

    const bottomAxis = main.append("g")
        .attr("transform", `translate(${meta.paddingLeft}, ${meta.height - meta.paddingBottom})`)

    const xAxis = content.append("path")
        .attr("stroke", "black")
        .attr("opacity", 0.2);

    const yAxis = content.append("path")
        .attr("stroke", "black")
        .attr("opacity", 0.2);
    
    graphs = [];
    if(options.data) {
        for(let i = 0; i < options.data.length; i++)
            graphs.push(createGraph(content, options.data[i], i));
    }

    function draw() {

        const y0 = meta.scaleY(0);
        const x0 = meta.scaleX(0);

        const xAxisPath = d3.path();
        xAxisPath.moveTo(0, y0);
        xAxisPath.lineTo(meta.width, y0);
        xAxis.attr("d", xAxisPath);

        const yAxisPath = d3.path();
        yAxisPath.moveTo(x0, 0);
        yAxisPath.lineTo(x0, meta.height);
        yAxis.attr("d", yAxisPath);

        leftAxis.call(d3.axisLeft(meta.scaleY))
        bottomAxis.call(d3.axisBottom(meta.scaleX));

        for(let i = 0; i < graphs.length; i++)
            graphs[i].draw(meta);
    }

    function zoomed() {
        const transform = d3.event.transform;

        meta.scaleX = transform.rescaleX(originalScaleX);
        meta.scaleY = transform.rescaleY(originalScaleY);

        draw();
    }

    svg.call(d3.zoom()
        .extent([[0, 0], [meta.svgWidth, meta.svgHeight]])
        .scaleExtent([-Infinity, Infinity])
        .on("zoom", zoomed)
    );

    draw();

    return svg.node();
}

module.exports = plot;
module.exports.plot = plot;
