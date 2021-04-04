(function() {
    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
    const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)  
    console.log(vw, vh)  
    var width = 0.45*vw;
    var height = 0.8*vh;

    var svg = d3.select(".chart")
                .append("svg")
                .attr("height", height)
                .attr("width", width)
                .append("g")
                .attr("transform", "translate(0,0)")

    var defs = svg.append("defs");

    defs.append("pattern")
        .attr("id", "jon-snow")
        .attr("height", "100%")
        .attr("width", "100%")
        .attr("patternContentUnits", "objectBoundingBox")
        .append("image")
        .attr("width", 1)
        .attr("height", 1)
        .attr("preserveAspectRatio", "none")
        .attr("xmlns:xlink", "http://www.w3.org/1999/xlink")
        .attr("xlink:href", "img/skills/tools/aws.jpg");

    var radiusScale = d3.scaleSqrt().domain([1, 11]).range([10, 80])
    // console.log(svg)

    // the simulation is a collection of forces about where we want our circles to go and how we want our circles to interact
    var simulation = d3.forceSimulation()
                    .force("x", d3.forceX(width / 2).strength(0.05))
                    .force("y", d3.forceY(height / 2).strength(0.05))
                    .force("collide", d3.forceCollide(function(d) {
                        return radiusScale(d.size) + 1
                    }))

    d3.queue()
        .defer(d3.csv, "./skillset.csv")
        .await(ready)

    function ready (error, datapoints) {
        defs.selectAll(".skill-pattern")
            .data(datapoints)
            .enter().append("pattern")
            .attr("class", "skill-pattern")
            .attr("id", function(d) {
                return d.id
            })
            .attr("height", "100%")
            .attr("width", "100%")
            .attr("patternContentUnits", "objectBoundingBox")
            .append("image")
            .attr("width", 1)
            .attr("height", 1)
            .attr("preserveAspectRatio", "none")
            .attr("xmlns:xlink", "http://www.w3.org/1999/xlink")
            .attr("xlink:href", function(d){
                return d.img
            });


        var circles = svg.selectAll(".skills")
            .data(datapoints)
            .enter().append("circle")
            .attr("class", "skills")
            .attr("r", function(d){
                console.log(radiusScale(d.size))
                return radiusScale(d.size)
            })
            .attr("fill", function(d) {
                return "url(#" + d.id + ")"
            })
            .on("click", function(d) {
                console.log(d)
            })

        simulation.nodes(datapoints)
            .on('tick', ticked)

        function ticked() {
            circles
                .attr("cx", function(d) {
                    return d.x
                })
                .attr("cy", function(d) {
                    return d.y
                })
        }
    }
})();