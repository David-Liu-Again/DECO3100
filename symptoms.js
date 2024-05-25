//Below line taken from Week 8 tutorial slides
//const unpack = (data, key) => data.map(row => row[key]);

Plotly.d3.csv("data/smanxiety.csv", all_data => {
    //Unpack all coloumns
    
    const anxiety_data = all_data.slice(0,6);
    console.log(anxiety_data);

    const frequency = unpack(all_data, 'Frequency');
    const anxiety = unpack(all_data, 'Total Anxiety');
    const social = unpack(all_data, 'Social Anxiety');
    const seperation = unpack(all_data, 'Seperation Anxiety');
    const ocd = unpack(all_data, 'OCD');

    const averages = all_data[6];
    // console.log(averages);
    // console.log(averages['Social Anxiety']);
    const standardDevs = all_data[7];
    // console.log(standardDevs);

    // Array containing descriptive text about each anxiety condition, to be displayed below the graph itself    
    const anxietyDescriptions= ["AnxietyAll","Anxiety1","Anxiety2","Anxiety3"]


    var traceAnxiety = {
        mode: 'lines+markers',
        x: frequency,
        y: anxiety,
        name: 'Overall Anxiety',
        marker: {
            color: 'RGB(123, 160, 255)'
        },
        visible: true,
        line:{
            width: 3
        }
    }

    var traceSocial = {
        mode: 'lines+markers',
        x: frequency,
        y: social,
        name: 'Social Anxiety',
        marker: {
            color: 'RGB(255, 85, 85)'
        },
        visible: false,
        line:{
            width: 3
        }
    }

    var traceSeperation = {
        mode: 'lines+markers',
        x: frequency,
        y: seperation,
        name: 'Seperation Anxiety',
        marker: {
            color: 'RGB(200, 150, 255)'
        },
        visible: false,
        line:{
            width: 3
        }
    }

    var traceOCD = {
        mode: 'lines+markers',
        x: frequency,
        y: ocd,
        name: 'OCD',
        marker: {
            color: 'RGB(255, 215, 0)'
        },
        visible: false,
        line:{
            width: 3
        }
    }

    var data = [traceAnxiety, traceSocial, traceSeperation, traceOCD];

    // Data setup
    data.forEach(trace => {
        trace.hovertemplate = "<b>Anxiety Type: </b>" + `${trace.name}<br>` //must use backtick
        + "<b>Score: </b>" + `%{y} %<br><extra></extra>` 
        trace.mode = "lines+markers";
        trace.marker.size = 8;
        // trace.line.width = 3;
        //trace.visible = false; // set all to invisible by default
    })

    // traceAnxiety.visible = true;

    // console.log(data);

    function createShapes(traceType){
        // Get the average and standard deviation values for each anxiety type from data
        let average = averages[traceType];
        console.log ("Average " + average);
        let sd = standardDevs[traceType];
        console.log ("Standard Dev " + sd);
        
        //Create a line object representing the average anxiety score
        let averageLine = {type: 'line',
            xref: "paper",
            x0: 0,
            y0: average,
            x1: 1,
            y1: average,
            line: {
            color: 'rgb(55, 128, 191)',
            width: 3
            },
            label:{
                text: "Average",
                textposition:"top left"
            }
        };

        // Calculate what one standard deviation above and below the average is
        let lowerBound = Number(average) - Number(sd);
        console.log(lowerBound);
        let upperBound = Number(average) + Number(sd);
        console.log(upperBound);

        //Create a rectangle object representing 1 standard deviation above/below the horizontal line
        let sdRect = {
            // rectangle line
            type: 'rect',
            // x-reference is assigned to the x-values
            xref: 'paper',
            // y-reference is assigned to the plot paper [0,1]
            x0: 0,
            y0: lowerBound,
            x1: 1,
            y1: upperBound,
            fillcolor: '#d3d3d3',
            opacity: 0.2,
            line: {
                width: 0
            },
            zindex: -1
        };

        return [averageLine,sdRect]
    }

    var updatemenus=[
        {
            // Adapted from https://plotly.com/javascript/custom-buttons/#update-button
            buttons: [
                {
                    args: [{'visible': [true, true, true, true]},
                    {'title': 'All Anxiety Types',
                    'yaxis': {'title': 'Anxiety Level (%)',
                    'range': '[0, 100]',
                    'fixedrange': 'true'
                    },
                     'shapes': []
                    }],
                    label: 'All',
                    method: 'update',
                },
                {
                    args: [{'visible': [true, false, false, false]},
                    {'title': 'Overall Anxiety',
                    'yaxis': {'title': 'Overall Anxiety Level (%)'},
                    'shapes' : createShapes("Total Anxiety")
                    }],
                    label: 'Overall Anxiety',
                    method: 'update',
                },
                {
                    args: [{'visible': [false, true, false, false]},
                    {'title': 'Social Anxiety',
                    'yaxis': {'title': 'Social Anxiety Level (%)'},
                    'shapes' : createShapes("Social Anxiety")}],
                    label: 'Social',
                    method: 'update'
                },
                {
                    args: [{'visible': [false, false, true, false]},
                    {'title': 'Seperation Anxiety',
                    'yaxis': {'title': 'Seperation Anxiety Level (%)'},
                    'shapes': createShapes("Seperation Anxiety")}],
                    label: 'Seperation',
                    method: 'update'
                },
                {
                    args: [{'visible': [false, false, false, true]},
                    {'title': 'OCD',
                    'yaxis': {'title': 'OCD Level (%)'},
                    'shapes' : createShapes("OCD")}],
                    label: 'OCD',
                    method: 'update'
                },
            ],
            direction: 'left',
            pad: {'r': 0, 't': 0},
            showactive: true,
            type: 'buttons',
            x: 0,
            xanchor: 'left',
            y: 1.15,
            yanchor: 'top',
            active: 1,
            font: {
                family: 'Arial',
                size: 18,
                color: '#000000'
            },
            bgcolor: "#FFFFFF"
        }
    ]

    // var annotations = [
    //     {
    //       text: 'Platform:',
    //       x: 0.05,
    //       y: 1.085,
    //       yref: 'paper',
    //       align: 'left',
    //       showarrow: false
    //     }
    // ]

    var layout = {
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        //hover
        hovermode: 'closest',
        updatemenus: updatemenus,
        scene:{
            camera:{
                eye:{
                    x: 1,
                    y:0.5,
                    z: 1
                }
            }
        },
        uirevision:'true',
        dragmode: false,
        // annotations: annotations,
        hoverlabel: {
            bgcolor: "#FFF",
            bordercolor: null,
            font: {
                family: 'Arial, monospace',
                size: 14,
                color: '#00000'
            }
        },
        shapes: createShapes("Total Anxiety"),
        xaxis:{
            title: 'Frequency of Social Media Use ',
            fixedrange: true,
            tickmode: "array",
            tickvals: [1,2,3,4,5,6],
            ticktext: ['Once a week or less', 'Several times a week', '1-4 times per day','5-10 times per day', 'Over 10 times per day', 'Constantly']
            //Frequency SM Use (1 = Once a week or less, 2 = Several 
            //times a week, 3 = About 1-4 times per day, 4 = About 
            //5-10 times per day,  5 = More than 10 times a day,  6 = Constantly)
        },

        yaxis:{
            title: 'Anxiety Score (%)',
            tickmode: "linear",
            tick0: 0,
            dtick: 20,
            tickwidth: 0,
            range: [0, 100],
            fixedrange: true
        },

        xaxis:{
            fixedrange:true
        },

        margin:{
            t:10
        },

        title: {
            text:'Overall Anxiety',
            font: {
                family: 'Arial',
                size: 24
            },
            y: 0.935,
            x: 0.5
        },
        font: {
            family: 'Arial',
            size: 18,
            color: '#FFFFFF'
        },
        autosize: true,
        margin: {
          t: 100,
        },
    }

    Plotly.newPlot("symptoms",data,layout);
})
