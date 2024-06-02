const graphTextColor = "#3381B9";

// Below line taken from Week 8 tutorial slides
// It is referenced in subsequent JS files as well
const unpack = (data, key) => data.map(row => row[key]);

Plotly.d3.csv("data/smtime.csv", usage_data => {
    //Unpack all necessary coloumns
    const year = unpack(usage_data, 'Year');
    const global = unpack(usage_data, 'Global');
    const ap = unpack(usage_data, 'Asia-Pacific');


    // Establish traces
    var traceGlobal = {
        x: year,
        y: global,
        name: 'Global',
        mode: 'lines+markers',
        marker: {
            color: 'rgb(255, 105, 97)'
        },
    }

    var traceAp = {
            x: year,
            y: ap,
            name: 'Australia and Asia-Pacific Region',
            mode: 'lines+markers',
            marker: {
                color: 'rgb(119, 221, 119)',
                size: 30
            },
    }

    var data = [traceGlobal,  traceAp];

    // Data setup
    data.forEach(trace => {

        // Set up custom text to display minutes and hours acurately
        trace.customdata = trace.y.map(minutes => (Math.floor(minutes/60) + " hours " + minutes%60 + " minutes "));

        // Set up a custom label to be shown when a marker is hovered over
        trace.hovertemplate = "<b>Region: </b>" + `${trace.name}<br>` //must use backtick
        + '<b>Year: </b>%{x}<br>' + '<b>Average Usage:</b> %{customdata}<extra></extra>';
        
        trace.marker.size = 8;

        // Convert y to hours
        trace.y = trace.y.map(minutes => minutes/60);
        
    })

     var layout = {

        //transperant background
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',

        hovermode: 'closest',
         hoverlabel: {
            bgcolor: "#FFF",
             bordercolor: null,
             font: {
                 family: 'Arial, monospace',
                 size: 14,
                 color: '#00000'
             }
         },

         xaxis:{
            dtick: 1,
            title: 'Year',
            gridcolor: graphTextColor, 
            gridwidth: 1,
            fixedrange: true
         },

         yaxis:{
            title: 'Average daily usage time (hours)',
            tickmode: "linear",
            tick0: 0,
            dtick: 1,
            tickwidth: 0,
            // We specify the range of the y-axis to avoid cropping out certain data points
            range: [0.9, 4],
            fixedrange: true,
            gridcolor: graphTextColor, 
            gridwidth: 1,
         },

         margin:{
            pad:0,
            t:20
         },
         autosize: true,
         automargin: true,

         font: {
            family: 'Arial',
            size: 18,
            color: graphTextColor
        }

     }

    //We specify that the display mode bar ( with zoom, crop options) be hidden so that it doesn't distract from the graph
     Plotly.newPlot("usage",data,layout, {displayModeBar: false});
})