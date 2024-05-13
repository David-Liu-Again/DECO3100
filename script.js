const unpack = (data, key) => data.map(row => row[key]);

Plotly.d3.csv("femalepop1.csv", population_data => {
    const aus = unpack(population_data, 'Australia')
    const china = unpack(population_data, 'China')
    const uk = unpack(population_data, 'United Kingdom')
    const usa = unpack(population_data, 'United States')
    const germany = unpack(population_data, 'Germany')
    const year = unpack(population_data, 'Year')
    
    var traceAus = {
        x: year,
        y: aus,
        name: 'Australia',
        mode: 'lines+markers',
        
    }

    var traceChi = {
        x: year,
        y: china,
        name: 'China',
        mode: 'lines+markers',
        
    }

    var traceUk = {
        x: year,
        y: uk,
        name: 'United Kingdom',
        mode: 'lines+markers',
        
    }

    var traceUs = {
        x: year,
        y: usa,
        name: 'United States of America',
        mode: 'lines+markers',
        
    }

    var traceGer = {
        x: year,
        y: germany,
        name: 'Germany',
        mode: 'lines+markers',
        
    }

    var data = [traceAus, traceChi, traceUk, traceUs, traceGer];

    data.forEach(trace => {
        trace.hovertemplate = "<b>Country: </b>" + `${trace.name}<br>` //must use backtick
        + '<b>Year: </b>%{x}<br>' + '<b>Population: </b>%{y:.2f%}%<extra></extra>';
    })
    var updatemenus = [{
        type: 'buttons',
        showactive: false, //determines whether the currently active button or menu item should be highlighted or not
        x: 0,
        y: 0,
        xanchor: 'right',
        yanchor: 'top',
        direction: 'left',
        pad: {'r': 20, 't': 60},

        buttons: [
        {
            label: 'Play',
            args: [null, {
                frame: {duration: 1000},
                transition:{duration: 500},
                fromcurrent: true, // is used to specify whether the animation should continue from the current frame or start from the beginning.
                mode: "afterall" // When mode is set to 'next', Plotly will advance the animation to the next frame in sequence
            }],
            method: 'animate'
        },
        {
            label: 'Pause',
            method: 'animate',
            args: [null, {
                frame: {duration: 0},
                mode: "immediate", // When mode: 'immediate' is used, all frames between the current frame and the target frame are skipped, and the target frame is displayed immediately
                transition:{duration: 0}
            }],
        }],
    }];

    /*function frameUpdate(mode){
        data.forEach(trace =>{
            trace.mode = mode;
        });
        console.log("frameUpdate called with " + mode);
    } */

    var frames = [{
            name: 'lines',
            // traces: [0,1,2,3,4,5],
            data: Array(data.length).fill({mode: 'lines'})
        },
        {
            name: 'lines+markers',
            // traces: [0,1,2],
            data: Array(data.length).fill({mode: 'lines+markers'})
        },
        {
            name: 'markers',
            // traces: [0,1,2],
            data: Array(data.length).fill({mode: 'markers'}) // specifies what will change
        },

    ]

    var layout = {

        //hover
        hovermode: 'closest',
        updatemenus: updatemenus,
        hoverlabel: {
            // bgcolor: "#FFF",
            bordercolor: null,
            font: {
                family: 'Arial, monospace',
                size: 14,
                color: '#ffffff'
            }
        },

        annotations: [
            /* {
                x: 1970,
                y: 52.63183,
                text: 'Annotation Text',
                showarrow: true,
                arrowhead: 7,
                ax: 0,
                ay: -40
            } */
            
        ],

        //slider
        sliders:[{
            pad:{t:30},
            currentvalue:{
                //specify the appearance and behaviour of sliders value level in here
                font:{
                    color:'#888',
                    size: 20
                }
            },

            steps:[{
                label: "Lines",
                method: "animate",
                args:[["lines"],{
                    mode: "immediate",
                    transition:{duration:0}
                }]
            },
            {
                label: "Lines+Markers",
                method: "animate",
                args:[["lines+markers"],{
                    mode: "immediate",
                    transition:{duration:0}
                }]
            },
            {
                label: "Markers",
                method: "animate",
                args:[["markers"],{
                    mode: "immediate",
                    transition:{duration:0}
                }]
                
            }]
        }]
    }

    Plotly.newPlot("interactivePlotly",data,layout).then(function(){
        Plotly.addFrames('interactivePlotly', frames)
    });

})