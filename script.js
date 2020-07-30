var w = 1400;
var h = 700;
var padding = 75;

const eduURL = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json";
const countyURL = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json";
const color = ['#f0ebd8', '#748cab', '#3e5c76', '#1d2d44', '#0d1321', '#000000'];

// svgs
var canvas = d3.select("#canvas");
var legend = d3.select("#legend");
// div for creating tooltip
var tooltip = d3.select('body')
                    .append("div")
                    .attr("id", "tooltip")
                    .style("opacity", 0);

// load the data asynchronously
d3.queue()
    .defer(d3.json, eduURL)
    .defer(d3.json, countyURL)
    .awaitAll(ready);

function ready(error, response) { 
    if (error) throw error;
    // split response into two datasets
    var eduData = response[0];
    console.log(eduData);
    var countyData = topojson.feature(response[1], response[1].objects.counties).features;
    
    // make color scale
    var colorScale = d3.scaleQuantize()
        .domain(d3.extent(eduData.map((d) => {
            return d.bachelorsOrHigher;
        })))
        .range(color);

    // draw map
    canvas.selectAll('path')
        .data(countyData)
        .enter()
        .append('path')
        .attr('d', d3.geoPath())
        .attr('class', 'county')
        .attr('stroke', 'white')
        .attr('stroke-width', 0.25)
        .attr('fill', (d) => {
            let id = d.id;
            let county = eduData.find((county) => {
                return county.fips === id;
            });
            let percentage = county.bachelorsOrHigher;
            return colorScale(percentage);
        })
        .attr('data-fips', (d) => {
            return d.id;
        })
        .attr('data-education', (d) => {
            let id = d.id;
            let county = eduData.find((county) => {
                return county.fips === id;
            });
            return county.bachelorsOrHigher;
        })
        .on("mouseover", function (d) {
            var county = eduData.find((county) => {
                return county.fips === d.id;
            });
            d3.select(this).transition()
                .duration("0")
                .style("stroke", "black")
                .style("stroke-width", 3);
            console.log(tooltip);
            tooltip.transition()
                .duration("100")
                .style("opacity", 0.9);
            tooltip.html(county.area_name + ', ' + county.state + ': ' + county.bachelorsOrHigher + '%')
                .style("left", (d3.event.pageX + 25) + "px")
                .style("top", (d3.event.pageY - 20) + "px")
                .attr("data-education", county.bachelorsOrHigher);
        })
        .on("mouseout", function (d) {
            d3.select(this).transition()
                .duration("0")
                .style("stroke", '')
                .style("stroke-width", 0);
            tooltip.transition()
                .duration("100")
                .style("opacity", 0);
        });

    const legendWidth = 200;
    const legendHeight = 15;
    const legendCellWidth = legendWidth / color.length;

    legend.selectAll('rect')
        .data(color)
        .enter()
        .append('rect')
        .attr('width', legendCellWidth)
        .attr('height', legendHeight)
        .attr('y', 20)
        .attr('x', (d, i) => {
            return 600 + legendCellWidth * i;
        })
        .attr('fill', (d) => d)
        
    legend.selectAll('text')
        .data(color)
        .enter()
        .append('text')
        .text((d) => {
            console.log(d);
            console.log(colorScale.invertExtent(d));
            console.log(d3.format('%')(colorScale.invertExtent(d)[1] / 100));
            return d3.format('0.0%')(colorScale.invertExtent(d)[1] / 100);
        })
        .attr('x', (d, i) => {
            return 600 + legendCellWidth * (1 + i);
        })
        .attr('y', 50)
        .style('font-size', '12px');
}