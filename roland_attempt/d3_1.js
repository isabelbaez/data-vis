// Load the data from the JSON file
d3.json("1-revised.json").then(function(data) {
  // Filter the data to include only "TOT" country
  const filteredData = data.filter(d => d.country === "GT");

  // Define the dimensions of the chart
  const margin = { top: 20, right: 20, bottom: 30, left: 40 };
  const width = 500 - margin.left - margin.right;
  const height = 300 - margin.top - margin.bottom;

  // Create an SVG element and set its dimensions and margins
  const svg = d3.select("#chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Create the x and y scales for the chart
  const xScale = d3.scaleBand()
    .range([0, width])
    .domain(filteredData.map(d => d.avg_log_income))
    .padding(0.1);

  const yScale = d3.scaleLinear()
    .range([height, 0])
    .domain([0, 1]);

  // Create the area generator
  const areaGenerator = d3.area()
    .x(d => xScale(d.avg_log_income) + xScale.bandwidth() / 2)
    .y0(height)
    .y1(d => yScale(d.migrated_yn_1 / d.total_count))
    .curve(d3.curveCardinal);

  // Add the area to the chart
  svg.append("path")
    .datum(filteredData)
    .attr("class", "area")
    .attr("d", areaGenerator);

  // Add the x-axis to the chart
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale));

  // Add the y-axis to the chart
  svg.append("g")
    .call(d3.axisLeft(yScale));
});
