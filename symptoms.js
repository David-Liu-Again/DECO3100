//Below line taken from Week 8 tutorial slides
//const unpack = (data, key) => data.map(row => row[key]);

Plotly.d3.csv("data/smanxiety.csv", all_data => {
    //Unpack all coloumns
    
    const anxiety_data = all_data.slice(0,6);
    // console.log(anxiety_data);

    const frequency = unpack(all_data, 'Frequency');
    const anxiety = unpack(all_data, 'Total Anxiety');
    const social = unpack(all_data, 'Social Anxiety');
    const seperation = unpack(all_data, 'Seperation Anxiety');
    const ocd = unpack(all_data, 'OCD');

    const averages = all_data[6];
    const standardDevs = all_data[7];
    // Array containing descriptive text about each anxiety condition, to be displayed below the graph itself    
    const anxietyDescriptions = [
        `The results in these graphs are based on responses to <a href=”https://www.scaswebsite.com/portfolio/scas-child-overview/”>Spence Children's Anxiety Scale</a>.
        Young people self-reported the intensity of common anxiety symptoms on a 4-point scale of frequency. 
        `,
        `The overall anxiety score rates the intensity of symptoms across six different types of anxiety. These include:<ul>
        <li><a href="https://www.betterhealth.vic.gov.au/health/healthyliving/Generalised-anxiety-disorder">generalized anxiety disorder (GAD)</a></li>
        <li><a href="https://www.betterhealth.vic.gov.au/health/conditionsandtreatments/social-phobia">social phobia (anxiety when socialising or performing)</a></li>
        <li><a href="https://www.betterhealth.vic.gov.au/health/conditionsandtreatments/panic-disorder-and-agoraphobia">obsessive compulsive disorder (OCD)</a></li>
        </ul>`,
    `<a href="https://www.betterhealth.vic.gov.au/health/conditionsandtreatments/social-phobia">Social anxiety (social phobia)</a> is an anxiety disorder that affects 
    you think and act in social situations. It is a constant and exaggerated fear of being judged or humiliated by other people and can cause you
    to struggle in work, school and social life. The percentage scores above indicate the intensity of common social anxiety symptoms, such as:
    <ul>
        <li>Being afraid to take a test</li>
        <li>Being afraid to use public toilets or bathrooms</li>
        <li>Being afraid to present in front of your peers</li>
    </ul>`,
    `<a href="https://www.ncbi.nlm.nih.gov/books/NBK560793/#:~:text=Separation%20anxiety%20disorder%20(SAD)%20is,separation%20from%20an%20attachment%20figure.">Seperation anxiety disorder (SAD)</a> is an anxiety disorder wherein
    somebody becomes excessively worried or concerned when a loved one leaves them alone. It can affect both adults and children. Children might be anxious about their parents or guardian leaving, whereas adults
    might worry about their children, romantic partners or spouses.The percentage scores above indicate the intensity of common SAD symptoms, such as:
    <ul>
        <li>Being afraid of being home alone</li>
        <li>Worrying about being away from my parents</li>
        <li>Being scared of having to sleep on your own</li>
    </ul>`,
    `<a href="https://www.betterhealth.vic.gov.au/health/conditionsandtreatments/obsessive-compulsive-disorder">Obsessive compulsive disorder (OCD)</a> is an anxiety disorder wherein
    somebody experiences recurring, intrusive thoughts or impulses (obsessions). They also repeat certain rituals to calm obsession-related fears (compulsions). 
    However, the rituals are time-consuming and often reinforces the anxiety. People with OCD usually know that they act and think irrationally, but feel unable to control their urges.
    The percentage scores above indicate the intensity of common OCD symptoms, such as:
    <ul>
        <li>Repeatedly checking that things are done right (e.g. checking the door is locked)</li>
        <li>Thinking of special numbers or words to stop bad things from happening</li>
        <li>Being bothered by distressing images in your mind</li>
    </ul>
    `
    ];

    
    var annotationArray;



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

    var botLeft = {
        // Exists to stop graph from resizing itself
        x: [1],
        y: [0],
        line: {color: 'rgbA(55, 128, 191,0)'},
        marker: {
            color: 'RGBA(255, 215, 0,0)'
        },
        hoverinfo:'skip',
        visible:true,
        showlegend: false
    };

    var topRight = {
        // Exists to stop graph from resizing itself
        x: [6],
        y: [100],
        mode: 'lines+markers',
        line: {color: 'rgbA(55, 128, 191,0)'},
        marker: {
            color: 'RGBA(255, 215, 0,0)'
        },
        hoverinfo:'skip',
        visible:true,
        showlegend: false
    }

    // console.log(hoverShape);

    var data = [traceAnxiety, traceSocial, traceSeperation, traceOCD,botLeft,topRight];

    // Data setup
    for(let trace of data){
        if (trace === botLeft){
            continue;
        }
        trace.hovertemplate = "<b>Anxiety Type: </b>" + `${trace.name}<br>` //must use backtick
        + "<b>Score: </b>" + `%{y} %<br><extra></extra>` 
        trace.mode = "lines+markers";
        trace.marker.size = 8;
        // trace.line.width = 3;
        //trace.visible = false; // set all to invisible by default
    }

    function createShapes(traceType){
        // Get the average and standard deviation values for each anxiety type from data
        let average = averages[traceType];
        // console.log ("Average " + average);
        let sd = standardDevs[traceType];
        // console.log ("Standard Dev " + sd);
        
        //Create a line object representing the average anxiety score
        let averageLine = {type: 'line',
            xref: "x",
            x0: 1,
            y0: average,
            x1: 6,
            y1: average,
            line: {
            color: 'rgb(155, 228, 255)',
            width: 3
            },
            label:{
                text: "Average",
                textposition:"top left"
            }
        };

        // Calculate what one standard deviation above and below the average is
        let lowerBound = Number(average) - Number(sd);
        let upperBound = Number(average) + Number(sd);

        let label_y;
        if (traceType =="Seperation Anxiety"){
            // Place annotation below the line for the seperation anxiety graph, to prevent overlapping text
            label_y = parseInt(average)-3;
        }else{
            label_y = parseInt(average)+3;
        }
        // console.log("label_y ",label_y)

        let averageLabel = {
            x: 0.055,
            y: label_y,
            xref: 'paper',
            yref: 'y',
            text: 'Average',
            showarrow: false,
            font:{
                color: 'rgb(155, 228, 255)',
                size: '18px'
            }
        };



        annotationArray = [averageLabel];

        return [averageLine]
    }

    var updatemenus=[
        {
            // Adapted from https://plotly.com/javascript/custom-buttons/#update-button
            buttons: [
                {
                    args: [{'visible': [true, true, true, true,true,true]},
                    {'title': 'All Anxiety Types',
                    'yaxis': {'title': 'Anxiety Level (%)'},
                    'range': '[0, 100]',
                    'fixedrange': 'true',
                    'shapes': [],
                    'annotations': [],
                    'showlegend': true
                    }],
                    label: 'All',
                    method: 'update',
                },
                {
                    args: [{'visible': [true, false, false, false,true,true]},
                    {'title': 'Overall Anxiety',
                    'yaxis': {'title': 'Overall Anxiety Level (%)'},
                    'shapes' : createShapes("Total Anxiety"),
                    'annotations': annotationArray,
                    'showlegend': false
                    }],
                    label: 'Overall Anxiety',
                    method: 'update',
                },
                {
                    args: [{'visible': [false, true, false, false,true,true]},
                    {'title': 'Social Anxiety',
                    'yaxis': {'title': 'Social Anxiety Level (%)'},
                    'shapes' : createShapes("Social Anxiety"),
                    'annotations': annotationArray,
                    'showlegend': false    
                    }],
                    label: 'Social',
                    method: 'update'
                },
                {
                    args: [{'visible': [false, false, true, false,true,true]},
                    {'title': 'Seperation Anxiety',
                    'yaxis': {'title': 'Seperation Anxiety Level (%)'},
                    'shapes': createShapes("Seperation Anxiety"),
                    'annotations': annotationArray,
                    'showlegend': false
                }],
                    label: 'Seperation',
                    method: 'update'
                },
                {
                    args: [{'visible': [false, false, false, true,true,true]},
                    {'title': 'OCD',
                    'yaxis': {'title': 'OCD Level (%)'},
                    'shapes' : createShapes("OCD"),
                    'annotations': annotationArray,
                    'showlegend': false
                }],
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
                color: '#000000',
                type: "bold"
            },
            activecolor: 'rgb(255, 165, 0)', 
            bgcolor: 'rgba(255, 255, 255, 0.5)'
        }
    ]


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
            gridcolor: 'rgba(200, 200, 200, 0.4)', 
            gridwidth: 1,
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
            gridcolor: 'rgba(200, 200, 200, 0.4)', 
            gridwidth: 1,
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
        annotations: annotationArray,
        showlegend: false

    }

    Plotly.newPlot("symptoms",data,layout).then(function(){
        var myGraph = document.getElementById('symptoms');
        var buttons = myGraph.querySelectorAll(".updatemenu-button");

        var graphDescription= document.getElementById('symptoms_description');
        graphDescription.innerHTML = anxietyDescriptions[1];

        for (let i = 0; i < buttons.length; i++) {
            buttons[i].addEventListener("click", function(){
                graphDescription.innerHTML = anxietyDescriptions[i];
            })
        }
        // myGraph.on('plotly_restyle', function(eventData) {
        //     console.log('Relayout event data:', eventData);
        // });
    });

});
