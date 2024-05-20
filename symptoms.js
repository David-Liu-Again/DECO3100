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
    console.log(averages);
    // console.log(averages['Social Anxiety']);
    const standardDevs = all_data[7];
    console.log(standardDevs);


    var traceAnxiety = {
        x: frequency,
        y: anxiety,
        name: 'Overall Anxiety',
        marker: {
            color: 'rgba(0,0,255,0.6)'
        },
        visible: true
    }

    var traceSocial = {
        x: frequency,
        y: social,
        name: 'Social Anxiety',
        marker: {
            color: 'rgba(0,50,255,0.6)'
        },
        visible: false
    }

    var traceSeperation = {
        x: frequency,
        y: seperation,
        name: 'Seperation Anxiety',
        marker: {
            color: 'rgba(50,50,255,0.6)'
        },
        visible: false
    }

    var traceOCD = {
        x: frequency,
        y: ocd,
        name: 'OCD',
        marker: {
            color: 'rgba(0,100,255,0.6)'
        },
        visible: false
    }

    var data = [traceAnxiety, traceSocial, traceSeperation, traceOCD];

    // Data setup
    data.forEach(trace => {
        trace.hovertemplate = "<b>Anxiety Type: </b>" + `${trace.name}<br>` //must use backtick
        + "<b>Score: </b>" + `%{y} %<br><extra></extra>` 
        trace.mode = "lines+markers";
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
            opacity: 0.5,
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
                     'shapes': []
                    }],
                    label: 'All',
                    method: 'update',
                },
                {
                    args: [{'visible': [true, false, false, false]},
                    {'title': 'Overall Anxiety',
                    'shapes' : createShapes("Total Anxiety")
                    }],
                    label: 'Overall Anxiety',
                    method: 'update',
                },
                {
                    args: [{'visible': [false, true, false, false]},
                    {'title': 'Social Anxiety',
                    'shapes' : createShapes("Social Anxiety")}],
                    label: 'Social',
                    method: 'update'
                },
                {
                    args: [{'visible': [false, false, true, false]},
                    {'title': 'Seperation Anxiety',
                    'shapes': createShapes("Seperation Anxiety")}],
                    label: 'Seperation',
                    method: 'update'
                },
                {
                    args: [{'visible': [false, false, false, true]},
                    {'title': 'OCD',
                    'shapes' : createShapes("OCD")}],
                    label: 'OCD',
                    method: 'update'
                },
            ],
            direction: 'left',
            pad: {'r': 0, 't': 0},
            showactive: true,
            type: 'buttons',
            x: 0.15,
            xanchor: 'left',
            y: 1,
            yanchor: 'top',
            active: 1
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

        margin:{
            t:10
        },

        title: {
            text:'Overall Anxiety',
            font: {
                family: 'Arial',
                size: 24
            },
            y: 0.85
        }
    }

    Plotly.newPlot("symptoms",data,layout);
})
