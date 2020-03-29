const functionPlotter = require("../index.js");
functionPlotter({
    target: "#test",
    data: [
        {
            fn: "x * x"
        },
        {
            fn: "1 / x"
        }
    ]
});