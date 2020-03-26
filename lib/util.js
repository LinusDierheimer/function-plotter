const DEFAULT_COLORS = [
    "steelblue",
    "red",
    "green",
    "orange",
    "purple",
    "yellow",
    "brown",
    "magenta",
    "cyan"
];

export function getColor(index) {
    while(index > DEFAULT_COLORS.length)
        index -= DEFAULT_COLORS.length;
    return DEFAULT_COLORS[index];
}

function buildMessage(message) {
    return `function-plotter: ${message}`;
}

export function error(message, ...optional) {
    console.error(buildMessage(message), optional);
}

export function warning(message, ...optional) {
    console.warn(buildMessage(message), optional);
}