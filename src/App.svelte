<script>

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

	let arrowsFile = "../src/data.json";
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

</main>

