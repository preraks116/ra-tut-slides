(function anim() {
    ////////////////////
    //// simulation ////
    ////////////////////
    var gamma = 50,
    c = 25,
    dt = 0.004,
    x = 1,
    y = 0,
    rn = d3.random.normal(0, Math.sqrt(dt));
    function evolve_simulation() {
        for (var i=0; i<2; i++) {
            var rho = Math.sqrt(x*x + y*y),
            r = rho - 1,
            a = gamma*(1 - rho*rho),
            b = -gamma*c*r*r + 1;
            x += (x*a - b*y)*dt + sigma*rn();
            y += (y*a + b*x)*dt + sigma*rn();
        }
    }
    /////////////////////////
    //// animation setup ////
    /////////////////////////
    var width = 250,
    height = width,
    mw = 30,
    cNa = "#F24533", // orange 242,69,51
    cK = "#0080FF", // blue 0,128,255
    linecolor = d3.interpolateRgb(cK, cNa);
    var g = d3.select("#animation").node().getContext("2d"); 
    g.fillStyle = "rgba(255, 255, 255, 0.05)"; // for fading curves
    g.strokeStyle = linecolor(0);
    g.lineWidth = 4;
    var svg = d3.select("#svgAxes")
    // .attr("width", width)
    // .attr("height", height)
        .style("margin-bottom", mw + "px")
        .style("margin-top", mw + "px"),
    //// limit cycle ////
    circ_trans = (width - 2*mw)/2 + mw;
    svg.append("g").attr("transform", "translate(" + mw + ", "+ -mw + ")")
        .append("circle")
        .attr("r", (width-2*mw)/2.4)
        .attr("transform", "translate(" + circ_trans + "," + circ_trans +")")
        .style("fill", "none").style("opacity", 0.3);
    //// axes ////
    scx = d3.scale.linear()
        .domain([-1.2, 1.2])
        .range([mw, width - 1.01*mw]),
    scy = d3.scale.linear()
        .domain([-1.2, 1.2])
        .range([height - mw, mw]),
    xyline = d3.svg.line()
        .x(function(d, i) { return scx(d.x); })
        .y(function(d, i) { return scy(d.y); }),
    svg.append("g").attr("class", "axis")
        .attr("transform", "translate(" + mw + "," + (height-mw) + ")")
        .call(d3.svg.axis().scale(scx).orient("bottom").tickValues([-1, 0, 1]));
    svg.append("g").attr("class", "axis")
        .attr("transform", "translate(" + mw + "," + (-mw) + ")")
        .call(d3.svg.axis().scale(scy).orient("left").tickValues([-1, 0, 1]));
    //// simulation trajectory ///
    var drawFlag = true,
    frameRate = 20;
    d3.timer(function () {if (drawFlag) {draw();}}, frameRate);
    g.globalCompositeOperation = "source-over";
    function draw() {
        g.fillRect(0, 0, width, height); // fades all existing curves by a set amount determined by fillStyle above
        g.beginPath();
        g.moveTo(scx(x)+mw, scy(y)); 
        for (var i=0; i<5; i++) {evolve_simulation();}
        g.lineTo(scx(x)+mw, scy(y)); 
        g.stroke(); 
    }
    //// events ////
    var slider = document.querySelector("#slider"),
    sigma = slider.value/100;
    document.getElementById("sliderValue").innerHTML = sigma.toPrecision(2);
    slider.addEventListener("input", 
    	function () {
		sigma = slider.value/100;
		document.getElementById("sliderValue").innerHTML = sigma.toPrecision(2);
		g.strokeStyle = linecolor(sigma/0.5);
	  }, false);
})()
