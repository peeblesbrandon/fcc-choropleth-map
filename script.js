var w = 1000;
var h = 700;
var padding = 75;

eduURL = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json",
countyURL = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json"
color = ["#ef5350", "#EC407A", "#AB47BC", "#7E57C2", "#5C6BC0", "#42A5F5", "#26C6DA", "#26A69A", "#D4E157", "#FFEE58", "#FFA726"];

// svg for plot
var svg = d3.select("#chart")
            .append("svg")
            .attr("height", h)
            .attr("width", w)
// div for creating tooltip
var tooltipDiv = d3.select("#chart")
                    .append("div")
                    .attr("id", "tooltip")
                    .attr("class", "tooltip")
                    .style("opacity", 0);

Promise.all([
    d3.json(eduURL),
    d3.json(countyURL)
]).then(function(err, json) {
    if (err) {
        throw err;
    }
    console.log(json[0]);
    console.log(json[1]);
})