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



//   [ -101.6850, 21.1218 ], // León, Mexico
//   [ -101.9942, 20.9176 ], // San Miguel de Allende, Mexico
//   [ -100.9783, 22.1566 ], // San Luis Potosí, Mexico
//   [ -100.8213, 23.7333 ], // Zacatecas, Mexico
//   [ -110.3108, 24.1390 ] // Hermosillo, Mexico
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
	.style('stroke-width', 4);

	var path1 = marker_container
	.attr('class', 'curved-path')
	.append('path')
	.datum(migration_path12)
	.attr('d', line) // set the path coordinates using the line generator
	.style('fill', 'none')
	.style('stroke', 'orange')
	.style('stroke-width', 5.6);

	var path2 = marker_container
	.attr('class', 'curved-path')
	.append('path')
	.datum(migration_path2)
	.attr('d', line) // set the path coordinates using the line generator
	.style('fill', 'none')
	.style('stroke', 'blue')
	.style('stroke-width', 4);

	var path22 = marker_container
	.attr('class', 'curved-path')
	.append('path')
	.datum(migration_path22)
	.attr('d', line) // set the path coordinates using the line generator
	.style('fill', 'none')
	.style('stroke', 'orange')
	.style('stroke-width', 7);

	var path3 = marker_container
	.attr('class', 'curved-path')
	.append('path')
	.datum(migration_path3)
	.attr('d', line) // set the path coordinates using the line generator
	.style('fill', 'none')
	.style('stroke', 'blue')
	.style('stroke-width', 4);

	var path32 = marker_container
	.attr('class', 'curved-path')
	.append('path')
	.datum(migration_path32)
	.attr('d', line) // set the path coordinates using the line generator
	.style('fill', 'none')
	.style('stroke', 'orange')
	.style('stroke-width', 4);

	function position_line() {
		path.attr('d', line);
		path1.attr('d', line);
		path2.attr('d', line);
		path3.attr('d', line);
		path22.attr('d', line);
		path32.attr('d', line);
	}
</script>

<main>
</main>


<!-- <script>

    mapboxgl.accessToken = "pk.eyJ1IjoiaXNhYmVsYmFleiIsImEiOiJjbGdjajA0OW4wMDd5M2VwamJlenI1eHl1In0.5iu1gJj4fI7cATQyKv2-Eg";
	const map = new mapboxgl.Map({
		container: "map",
		style: "mapbox://styles/mapbox/light-v11", 
		center: [-91.0942, 20.3601], 
		zoom: 4.5, // starting zoom level
		minZoom: 4.5,
		maxZoom: 6,
	});

	function create_arrows(arrow_data) {
		arrow_data = marker_container
			.selectAll("circle")
			.data(arrow_data)
			.enter()
			.append("circle")
			.attr("r", 5)
			.style("fill", "#808080")
			.attr("stroke", "#808080")
			.attr("stroke-width", 1)
			.attr("fill-opacity", 0.4)
			.attr("name", function (d) {
				return d["name"];
			});
			position_arrow_markers();
	}

	function position_arrow_markers() {
		arrow_markers
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

	let arrowsFile = "https://raw.githubusercontent.com/isabelbaez/data-vis/main/src/data.json";
	let arrow_data = [];
	let station_markers;

	fetch(arrowsFile)
		.then((response) => response.json())
		.then((d) => (arrow_data = d.data.arrows))

	const marker_container = d3
	.select(map.getCanvasContainer() )
	.append("svg")
	.attr("width", "100%")
	.attr("height", "100%")
	.style("position", "absolute")
	.style("z-index", 2);
	
</script>

<main>

</main> -->

