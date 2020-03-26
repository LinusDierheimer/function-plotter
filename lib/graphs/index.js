const util = require("../util.js");
const Line = require("./line.js");

module.exports = function(content, options, index) {
    switch (options.graphType) {
        case undefined: return new Line(content, options, index);
        case "line": return new Line(content, options, index);
        default: {
            util.warning(`unknown graph type: ${name}, falling back to line`);
            return new Line(content, options, index);
        }
    }
}