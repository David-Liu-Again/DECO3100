const graphTextColor = "#3381B9";

//Below line taken from Week 8 tutorial slides
const unpack = (data, key) => data.map(row => row[key]);

Plotly.d3.csv("data/smtime.csv", usage_data => {
    //Unpack all coloumns
    const year = unpack(usage_data, 'Year');
    const global = unpack(usage_data, 'Global');
    // const la = unpack(usage_data, 'Latin America');
    // const mea = unpack(usage_data, 'Middle East & Africa');
    const ap = unpack(usage_data, 'Asia-Pacific');
    // const na = unpack(usage_data, 'North America');
    // const eu = unpack(usage_data, 'Europe');
    // console.log("Eu" + eu);



    var traceGlobal = {
        x: year,
        y: global,
        name: 'Global',
        mode: 'lines+markers',
        marker: {
            color: 'rgb(255, 105, 97)'
        },
    }


    //  var traceLa = {
    //      x: year,
    //      y: la,
    //      name: 'Latin America',
    //      mode: 'lines+markers',
    //      marker: {
    //         color: 'rgb(255, 179, 71)'
    //     },
        
    // }

    // var traceMea = {
    //     x: year,
    //     y: mea,
    //     name: 'Middle East & Africa',
    //     mode: 'lines+markers',
    //     marker: {
    //         color: 'rgb(177, 156, 217)'
    //     },
    // }

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

    // var traceNa = {
    //     x: year,
    //     y: na,
    //     name: 'North America',
    //     mode: 'lines+markers',
    //     marker: {
    //         color: 'rgb(159, 226, 191)',
    //     },
    // }

    // var traceEu = {
    //     x: year,
    //     y: eu,
    //     name: 'Europe',
    //     mode: 'lines+markers',
    //     marker: {
    //         color: 'rgb(245, 160, 120)',
    //     },
    // }

    var data = [traceGlobal,  traceAp];

    // Data setup
    data.forEach(trace => {
        // let hours = Math.floor(trace.y/ 60);
        // let minutes = trace.y % 60;
        // let usageText = `${hours} hours and ${remainingMinutes} minutes`;

        // Set up custom text to display minutes and hours acurately
        trace.customdata = trace.y.map(minutes => (Math.floor(minutes/60) + " hours " + minutes%60 + " minutes "));
        trace.hovertemplate = "<b>Region: </b>" + `${trace.name}<br>` //must use backtick
        + '<b>Year: </b>%{x}<br>' + '<b>Average Usage: %{customdata}<extra></extra>';
        trace.marker.size = 8;
        // Convert y to hours
        trace.y = trace.y.map(minutes => minutes/60);
    })


    // var updatemenus = [{
    //     type: 'buttons',
    //     showactive: false, //determines whether the currently active button or menu item should be highlighted or not
    //     x: 0,
    //     y: 0,
    //     xanchor: 'right',
    //     yanchor: 'top',
    //     direction: 'left',
    //     pad: {'r': 20, 't': 60},

    //     buttons: [
    //     {
    //         label: 'Play',
    //         args: [null, {
    //             frame: {duration: 1000},
    //             transition:{duration: 500},
    //             fromcurrent: true, // is used to specify whether the animation should continue from the current frame or start from the beginning.
    //             mode: "afterall"  //When mode is set to 'next', Plotly will advance the animation to the next frame in sequence
    //         }],
    //         method: 'animate'
    //         },
    //         {
    //             label: 'Pause',
    //             method: 'animate',
    //             args: [null, {
    //                 frame: {duration: 0},
    //                 mode: "immediate", //When mode: 'immediate' is used, all frames between the current frame and the target frame are skipped, and the target frame is displayed immediately
    //                 transition:{duration: 0}
    //             }],
    //         }],
    //  }];

    //  function frameUpdate(mode){
    //      data.forEach(trace =>{
    //          trace.mode = mode;
    //      });
    //      console.log("frameUpdate called with " + mode);
    // }

    //  var frames = [{
    //          name: 'lines',
    //           traces: [0,1,2,3,4,5],
    //          data: Array(data.length).fill({mode: 'lines'})
    //      },
    //      {
    //          name: 'lines+markers',
    //           traces: [0,1,2],
    //          data: Array(data.length).fill({mode: 'lines+markers'})
    //      },
    //      {
    //          name: 'markers',
    //           traces: [0,1,2],
    //          data: Array(data.length).fill({mode: 'markers'})  //specifies what will change
    //      },

    //  ]

     var layout = {
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
         //hover
         hovermode: 'closest',
        //  updatemenus: updatemenus,
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
         },

         yaxis:{
            title: 'Average daily usage time (hours)',
            tickmode: "linear",
            tick0: 0,
            dtick: 1,
            tickwidth: 0,
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

         //slider
        //  sliders:[{
        //      pad:{t:30},
        //      currentvalue:{
        //          //specify the appearance and behaviour of sliders value level in here
        //          font:{
        //              color:'#888',
        //              size: 20
        //          }
        //      },

        //      steps:[{
        //          label: "Lines",
        //          method: "animate",
        //          args:[["lines"],{
        //              mode: "immediate",
        //              transition:{duration:0}
        //          }]
        //      },
        //      {
        //          label: "Lines+Markers",
        //          method: "animate",
        //          args:[["lines+markers"],{
        //              mode: "immediate",
        //              transition:{duration:0}
        //          }]
        //      },
        //      {
        //          label: "Markers",
        //          method: "animate",
        //          args:[["markers"],{
        //              mode: "immediate",
        //              transition:{duration:0}
        //          }]
                
        //      }]
        //  }]
     }

     Plotly.newPlot("usage",data,layout, {displayModeBar: false});
})