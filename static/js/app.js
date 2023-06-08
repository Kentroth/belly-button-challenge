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
    const selectedSample = samples.find(sample => sample.id === sampleId);
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

  // Update the bubble chart
  function updateBubbleChart(sampleId) {
    const selectedSample = samples.find(sample => sample.id === sampleId);
    const otuIds = selectedSample.otu_ids;
    const sampleValues = selectedSample.sample_values;
    const otuLabels = selectedSample.otu_labels;

    // Create the trace for the bubble chart
    const trace = {
      x: otuIds,
      y: sampleValues,
      text: otuLabels,
      mode: 'markers',
      marker: {
        size: sampleValues,
        color: otuIds,
        colorscale: 'Earth'
      }
    };

    // Define the layout for the bubble chart
    const layout = {
      title: 'OTU Bubble Chart',
      xaxis: { title: 'OTU ID' },
      yaxis: { title: 'Sample Values' },
      showlegend: false
    };

    // Create the bubble chart
    Plotly.newPlot('bubble', [trace], layout);
  }

  // Update the gauge chart
  function updateGaugeChart(sampleId) {
    const selectedMetadata = metadata.find(item => item.id === parseInt(sampleId));
    const washingFreq = parseInt(selectedMetadata.wfreq);

    // Create the data for the gauge chart
    const data = [
      {
        type: "indicator",
        mode: "gauge+number",
        value: washingFreq,
        title: { text: "Belly Button Washing Frequency<br>Scrubs per Week", font: { size: 24 } },
        gauge: {
          axis: { range: [null, 9] },
          steps: [
              { range: [0, 1], color: "#115f9a" },
              { range: [1, 2], color: "#1984c5" },
              { range: [2, 3], color: "#22a7f0" },
              { range: [3, 4], color: "#48b5c4" },
              { range: [4, 5], color: "#76c68f" },
              { range: [5, 6], color: "#a6d75b" },
              { range: [6, 7], color: "#c9e52f" },
              { range: [7, 8], color: "#d0ee11" },
              { range: [8, 9], color: "#f4f100" }
          ],
          threshold: {
            line: { color: "black", width: 6 },
            thickness: 1.0,
            value: washingFreq
          },
          bar: { color: "red", thickness: 0.6 },
        }
      }
    ];

    // Define the layout for the gauge chart
    const layout = {
      width: 500,
      height: 400,
      margin: { t: 0, b: 0 },
    };

    // Create the gauge chart
    Plotly.newPlot('gauge', data, layout);
  }

  function updateSampleMetadata(sampleId) {
    const selectedMetadata = metadata.find(item => item.id === parseInt(sampleId));
    const sampleMetadataContainer = d3.select("#sample-metadata");
    sampleMetadataContainer.html("");

    Object.entries(selectedMetadata).forEach(([key, value]) => {
      const metadataItem = sampleMetadataContainer
        .append("p")
        .text(`${key}: ${value}`);
    });
  }
  
  // Event listener for the dropdown menu
  dropdownMenu.on("change", function() {
    const selectedSampleId = this.value;
    updateChart(selectedSampleId);
    updateBubbleChart(selectedSampleId);
    updateGaugeChart(selectedSampleId);
    updateSampleMetadata(selectedSampleId);
  });

  // Function to handle the initial loading and setup
  function init() {
    const initialSampleId = samples[0].id;
    updateChart(initialSampleId);
    updateBubbleChart(initialSampleId);
    updateGaugeChart(initialSampleId);
    updateSampleMetadata(initialSampleId);
  }

  // Initialize the dashboard
  init();
});
