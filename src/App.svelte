<script>

	// Define the path as a list of locations
	// const path = ['Guatemala City', 'Los Angeles', 'San Francisco'];

	// Initialize the Geocoding service with your Google Maps API key
	// const geocoder = new google.maps.Geocoder();
	// const geocodingResults = [];

	// // Loop over the locations and get their coordinates
	// path.forEach(location => {
	// geocoder.geocode({ address: location }, (results, status) => {
	// 	if (status === 'OK') {
	// 	geocodingResults.push(results[0].geometry.location);
	// 	} else {
	// 	console.error(`Geocode was not successful for the following reason: ${status}`);
	// 	}
	// });
	// });

	function create_station_markers(station_data) {
		station_markers = marker_container
			.selectAll("circle")
			.data(station_data)
			.enter()
			.append("circle")
			.attr("r", 20)
			.style("fill", "#808080")
			.attr("stroke", "#808080")
			.attr("stroke-width", 1)
			.attr("fill-opacity", 0.4)
			.attr("name", function (d) {
				return d["name"];
			});
		position_station_markers();
	}

	function create_curve(station_data) {

		var curve_path = "M20,70 T80,100 T160,80 T200,90";

		curve = marker_container
			.selectAll("path")
			.data(station_data)
			.enter()
			.append("path")
			.attr("d",curve_path)  
             .attr("fill","none")  
             .attr("stroke","red")  
             .attr("stroke-width",2)  
             .attr("marker-start","url(#triangle)")  
             .attr("marker-mid","url(#triangle)")  
             .attr("marker-end","url(#triangle)")
			.attr("name", function (d) {
				return d["name"];
			});
		//position_station_markers();
	}
	


	function position_station_markers() {
		station_markers
			.attr("cx", function (d) {
				return project(d).x;
			})
			.attr("cy", function (d) {
				return project(d).y;
			});
	}
	function project(d) {
		return map.project(new mapboxgl.LngLat(+d.lon, +d.lat));
	}

    mapboxgl.accessToken = "pk.eyJ1IjoiaXNhYmVsYmFleiIsImEiOiJjbGdjajA0OW4wMDd5M2VwamJlenI1eHl1In0.5iu1gJj4fI7cATQyKv2-Eg";

	const map = new mapboxgl.Map({
		container: "map",
		style: "mapbox://styles/mapbox/light-v11", 
		center: [-91.0942, 20.3601], 
		zoom: 3, // starting zoom level
		minZoom: 3,
		maxZoom: 6,
	});

	// const map = new mapboxgl.Map({
	// 	container: "map",
	// 	style: "mapbox://styles/mapbox/light-v11", 
	// 	center: [-71.0942, 42.3601], 
	// 	zoom: 13, // starting zoom level
	// 	minZoom: 12,
	// 	maxZoom: 15,
	// });

	map.on("viewreset", position_line);
	map.on("move", position_line);
	map.on("moveend", position_line);

	let stationsFile =
		"https://raw.githubusercontent.com/isabelbaez/data-vis/main/src/data.json";
	let station_data = [];
	let station_markers;
	let curve;

	function lines() {
		var curve_path = "M20,70 T80,100 T160,80 T200,90";
		marker_container.append("path")  
             .attr("d",curve_path)  
             .attr("fill","none")  
             .attr("stroke","blue")  
             .attr("stroke-width",2)  
             .attr("marker-start","url(#triangle)")  
             .attr("marker-mid","url(#triangle)")  
             .attr("marker-end","url(#triangle)");  
	}

	const marker_container = d3
		.select(map.getCanvasContainer() )
		.append("svg")
		.attr("width", "100%")
		.attr("height", "100%")
		.style("position", "absolute")
		.style("z-index", 2);

	const pathMessages = [
		"El Salvador: On average, it takes individuals 1.53 attempts to complete their migration to the US",
		"El Salvador: On average, individuals that do not complete their journey to the US try 1.79 amount of times",
		"Honduras: On average, it takes individuals 1.40 attempts to complete their migration to the US",
		"Honduras: On average, individuals that do not complete their journey to the US try 1.88 amount of times",
		"Guatemala: On average, it takes individuals 1.67 attempts to complete their migration to the US",
		"Guatemala: On average, individuals that do not complete their journey to the US try 1.68 amount of times",
        ];


var migration_path = [  [-89.2090, 13.6929], // San Salvador, El Salvador
  [-90.5349, 14.6349], // Guatemala City, Guatemala
  [-92.6443, 16.7370], // San Cristóbal de las Casas, Chiapas, Mexico
  [ -97.6833, 18.3584 ], // tehuacan
  [-99.1332, 19.4326], // Mexico City, Mexico
//   [-100.3161, 25.6866], // Monterrey, Mexico
[ -103.4068, 25.5428 ], //torreon
  [-106.4847, 31.7392], // Ciudad Juárez, Mexico
  [-106.4425, 31.7776], // El Paso, Texas
  [-106.7538, 32.3199], // Las Cruces, New Mexico
];

var migration_path12 = [  [-89.2090, 13.6929], // San Salvador, El Salvador
  [-90.5349, 14.6349], // Guatemala City, Guatemala
  [-92.6443, 16.7370], // San Cristóbal de las Casas, Chiapas, Mexico
  [ -97.6833, 18.3584 ], // tehuacan
  [-99.1332, 19.4326], // Mexico City, Mexico
//   [-100.3161, 25.6866], // Monterrey, Mexico
];


var migration_path2 = [  [-87.2068, 14.0818], // Tegucigalpa, Honduras
  [-88.0256, 15.5047], // San Pedro Sula, Honduras
  [-89.0336, 15.4752], // Flores, Guatemala
  [-91.1353, 16.9299], // Palenque, Mexico
  [ -93.0327, 18.0042 ], // 
  [ -94.5336, 17.9970 ], // coatzacoalcos
  [-98.7624, 20.1011], // Pachuca de Soto, Hidalgo, Mexico
  [ -99.0108, 21.9843 ], // ciudad valles
  [-98.1077, 29.5410], // Laredo, Texas, USA
  [-98.4936, 29.4241], // San Antonio, Texas, USA
];


var migration_path22 = [  [-87.2068, 14.0818], // Tegucigalpa, Honduras
  [-88.0256, 15.5047], // San Pedro Sula, Honduras
  [-89.0336, 15.4752], // Flores, Guatemala
  [-91.1353, 16.9299], // Palenque, Mexico
  [ -93.0327, 18.0042 ], //
];

var migration_path3 = [     [ -90.5328, 14.6248 ], // Guatemala City, Guatemala
[
    -96.7216,
    17.0594
  ], // oaxaca
  [ -99.9089, 16.8531 ], // Acapulco, Mexico
  [ -104.8214, 21.1524 ], // Guadalajara, Mexico
  [ -104.3674, 22.1565 ], // Aguascalientes, Mexico
  // Mazatlán, Mexico
  [ -106.4207, 23.2494 ],
  [ -107.9181, 25.4788], //Mocorito
  [ -109.9347, 27.4856 ], //Ciudad Obregon
  [ -110.9778, 29.0729], //Hermosillo
  [ -110.9265, 32.2217 ]// Tucson
];


var migration_path32 = [     [ -90.5328, 14.6248 ], // Guatemala City, Guatemala
[
    -96.7216,
    17.0594
  ], // oaxaca
  [ -99.9089, 16.8531 ], // Acapulco, Mexico
];


	// create a D3 line generator
	var line = d3.line()
	.curve(d3.curveCatmullRom.alpha(0.5)) // set the curve type
	.x(function(d) { return map.project([d[0], d[1]]).x; }) // convert longitude to x position
	.y(function(d) { return map.project([d[0], d[1]]).y; }); // convert latitude to y position
	
	// add the path element to the map
	var path = marker_container
	.attr('class', 'curved-path')
	.append('path')
	.datum(migration_path)
	.attr('d', line) // set the path coordinates using the line generator
	.style('fill', 'none')
	.style('stroke', 'blue')
	.style('stroke-width', 6);

	var path1 = marker_container
	.attr('class', 'curved-path')
	.append('path')
	.datum(migration_path12)
	.attr('d', line) // set the path coordinates using the line generator
	.style('fill', 'none')
	.style('stroke', 'orange')
	.style('stroke-width', 6);

	var path2 = marker_container
	.attr('class', 'curved-path')
	.append('path')
	.datum(migration_path2)
	.attr('d', line) // set the path coordinates using the line generator
	.style('fill', 'none')
	.style('stroke', 'blue')
	.style('stroke-width', 6);

	var path22 = marker_container
	.attr('class', 'curved-path')
	.append('path')
	.datum(migration_path22)
	.attr('d', line) // set the path coordinates using the line generator
	.style('fill', 'none')
	.style('stroke', 'orange')
	.style('stroke-width', 6);

	var path3 = marker_container
	.attr('class', 'curved-path')
	.append('path')
	.datum(migration_path3)
	.attr('d', line) // set the path coordinates using the line generator
	.style('fill', 'none')
	.style('stroke', 'blue')
	.style('stroke-width', 6);

	var path32 = marker_container
	.attr('class', 'curved-path')
	.append('path')
	.datum(migration_path32)
	.attr('d', line) // set the path coordinates using the line generator
	.style('fill', 'none')
	.style('stroke', 'orange')
	.style('stroke-width', 6);

	function position_line() {
		path.attr('d', line);
		path1.attr('d', line);
		path2.attr('d', line);
		path3.attr('d', line);
		path22.attr('d', line);
		path32.attr('d', line);
	}

	path.on('mouseover', function() {
            d3.select(this)
            .style('stroke', 'green')
            .style('stroke-width', 4);
            showMessage(0, 'blue');
        }).on('mouseout', function() {
            d3.select(this)
            .style('stroke', 'blue')
            .style('stroke-width', 6);
            hideMessage();
        });
	
	path1.on('mouseover', function() {
            d3.select(this)
            .style('stroke', 'green')
            .style('stroke-width', 4);
            showMessage(1, 'orange');
        }).on('mouseout', function() {
            d3.select(this)
            .style('stroke', 'orange')
            .style('stroke-width', 6);
            hideMessage();
        });

	path2.on('mouseover', function() {
		d3.select(this)
		.style('stroke', 'green')
		.style('stroke-width', 4);
		showMessage(2, 'blue');
	}).on('mouseout', function() {
		d3.select(this)
		.style('stroke', 'blue')
		.style('stroke-width', 6);
		hideMessage();
	});

	path22.on('mouseover', function() {
		d3.select(this)
		.style('stroke', 'green')
		.style('stroke-width', 4);
		showMessage(3, 'orange');
	}).on('mouseout', function() {
		d3.select(this)
		.style('stroke', 'orange')
		.style('stroke-width', 6);
		hideMessage();
	});

	path3.on('mouseover', function() {
		d3.select(this)
		.style('stroke', 'green')
		.style('stroke-width', 4);
		showMessage(4, 'blue');
	}).on('mouseout', function() {
		d3.select(this)
		.style('stroke', 'blue')
		.style('stroke-width', 6);
		hideMessage();
	});

	path32.on('mouseover', function() {
		d3.select(this)
		.style('stroke', 'green')
		.style('stroke-width', 4);
		showMessage(5, 'orange');
	}).on('mouseout', function() {
		d3.select(this)
		.style('stroke', 'orange')
		.style('stroke-width', 6);
		hideMessage();
	});

	function showMessage(index, color) {
		const message = pathMessages[index];
		const tooltipContainer = d3.select("#toolTip");
		const tooltip = tooltipContainer.append("div")
			.attr("class", "tooltip")
			.style("opacity", 0)
			.style("background-color", "white")
			.style("padding", "8px")
			.style("border", "5px solid #2C666E")
			.style("border-radius", "4px")
			.style("position", "absolute")
			.style("z-index", 3)
			.style("color", color)
			.style("font-weight", "bold");
		tooltip.transition()
			.duration(200)
			.style("opacity", 1);
		tooltip.html(message);

		const tooltipWidth = tooltip.node().offsetWidth;
		const tooltipHeight = tooltip.node().offsetHeight;

		const mouseX = d3.event.pageX;
		const mouseY = d3.event.pageY;

		const tooltipLeft = mouseX + 200;
		const tooltipTop = mouseY - tooltipHeight - 100;

		tooltip.style("left", tooltipLeft + "px")
			.style("top", tooltipTop + "px");
	}

	function hideMessage() {
		d3.selectAll('.tooltip').remove();
	}
</script>

<main>
</main>
