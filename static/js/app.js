const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Fetch the JSON data
d3.json(url).then(function(data) {
  // Extract the necessary data
  const samples = data.samples;
  const metadata = data.metadata;

  // Get the dropdown menu
  const dropdownMenu = d3.select("#selDataset");

  // Populate the dropdown menu options
  samples.forEach(sample => {
    dropdownMenu
      .append("option")
      .text(sample.id)
      .property("value", sample.id);
  });

  // Update the chart based on the selected sample
  function updateChart(sampleId) {
    // Find the selected sample data
    const selectedSample = samples.find(sample => sample.id === sampleId);

    // Extract the top 10 OTUs
    const top10Values = selectedSample.sample_values.slice(0, 10).reverse();
    const top10Ids = selectedSample.otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse();
    const top10Labels = selectedSample.otu_labels.slice(0, 10).reverse();

    // Update the bar chart
    Plotly.newPlot("bar", [
      {
        type: "bar",
        x: top10Values,
        y: top10Ids,
        text: top10Labels,
        orientation: "h"
      }
    ]);
  }

  // Event listener for the dropdown menu
  dropdownMenu.on("change", function() {
    const selectedSampleId = this.value;
    updateChart(selectedSampleId);
  });

  // Call the updateChart function with the first sample ID initially
  const initialSampleId = samples[0].id;
  updateChart(initialSampleId);
});
