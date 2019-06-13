function buildMetadata(sample) {
  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  var dataUrl="/metadata/"+sample;

  console.log(dataUrl);
  // Use d3 to select the panel with id of `#sample-metadata`
  d3.json(dataUrl).then(function(response){
    console.log(response);
    var metadata_Sample= d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    metadata_Sample.selectAll("p").remove();

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    for(var key in response){
        if(response.hasOwnProperty(key)){
            metadata_Sample.append("p").text(key + ":   " + response[key]);
        }
    }
    buildGauge(response.WFREQ);
});

}  
    
function pieChart(sample){
  console.log("Now plotting Pie Chart");
  var descriptions=[];
  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json("/samples/" + sample).then(function(response){
    console.log('Plot Pie Inside');
    console.log(response);
      var pieIds=response['otu_ids'].slice(0,11);
      var pieValues=response['sample_values'].slice(0,11);
      var pieLabels=response['otu_labels'].slice(0,11);
      // @TODO: Build a Pie Chart
      // HINT: You will need to use slice() to grab the top 10 sample_values,
      // otu_ids, and labels (10 each). 
      var trace1 = { 
          values: pieValues,
          labels: pieIds,
          type:"pie",
          name:"Total Samples",
          textinfo:"percent",
          text: pieLabels,
          textposition: "inside",
          hoverinfo: 'label+value+text+percent'
      }
      var data=[trace1];
      var layout={
          title: "<b>Total Samples: " + sample + "</b>"
          
      }
      Plotly.newPlot("pie",data,layout);
  })
}

 // @TODO: Build a Bubble Chart using the sample data
function bubbleChart(sample){
  console.log("Plotting Scatter Plot");
      // @TODO: Use `d3.json` to fetch the sample data for the plots
      d3.json("/samples/"+sample).then(function(response){
      console.log(response)
      var scatter_description = response['otu_labels'];
      console.log(scatter_description.slice(0,10))

      var trace1 = {
          x: response['otu_ids'],
          y: response['sample_values'],
          marker: {
              size: response['sample_values'],
              color: response['otu_ids'].map(d=>100+d*20),
              colorscale: "Earth"
          },
          type:"scatter",
          mode:"markers",
          text: scatter_description,
          hoverinfo: 'x+y+text',
      };
      console.log("trace1" + trace1)
      var data = [trace1];
      console.log(data)
      var layout = {
          xaxis:{title:"OTU ID",zeroline:true, hoverformat: '.2r'},
          yaxis:{title: "Total Bacteria",zeroline:true, hoverformat: '.2r'},
          height: 500,
          width:1200,
          margin: {
              l: 100,
              r: 10,
              b: 70,
              t: 10,
              pad: 5
            },
          hovermode: 'closest',
      };
      console.log(layout)
      Plotly.newPlot("bubble",data,layout);
      
  })
}

//init function to execute on first load of index.html.
function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  Plotly.d3.json("/names",function(error,response){
    if(error) console.warn(error);
    var dropdown_select = Plotly.d3.select("#selDataset");

   for(var i=0;i<response.length;i++){
       dropdown_select.append("option").attr("value",response[i]).text(response[i]);
   }
   console.log(response)
   optionChanged(response[0]);
  });
}

function optionChanged(newSample) {
  console.log("new sample: " + newSample )
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);

  pieChart(newSample);
  
  bubbleChart(newSample);
}

// Initialize the dashboard
init();
