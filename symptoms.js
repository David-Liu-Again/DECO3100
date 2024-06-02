Plotly.d3.csv("data/smanxiety.csv", all_data => {
    
    //Unpack all columns, leaving out the last row, as we process that later
    const anxiety_data = all_data.slice(0,6);
    const frequency = unpack(all_data, 'Frequency');
    const anxiety = unpack(all_data, 'Total Anxiety');
    const social = unpack(all_data, 'Social Anxiety');
    const seperation = unpack(all_data, 'Seperation Anxiety');
    const ocd = unpack(all_data, 'OCD');

    // We parse the last row, which represents the average score for each anxiety type
    const averages = all_data[6];

    // Array containing descriptive text about each anxiety condition, to be displayed above the graph itself    
    const anxietyDescriptions = [
        `The results in these graphs are based on responses to <a href="https://www.scaswebsite.com/portfolio/scas-child-overview/" target="_blank">Spence Children's Anxiety Scale</a>.
        <br> Young people self-reported the intensity of common anxiety symptoms. 
        `,
        `The overall anxiety score rates the intensity of symptoms across six different types of anxiety. These include:<ul>
        <li><a href="https://www.betterhealth.vic.gov.au/health/healthyliving/Generalised-anxiety-disorder" target="_blank">generalized anxiety disorder (GAD)</a></li>
        <li><a href="https://www.betterhealth.vic.gov.au/health/conditionsandtreatments/social-phobia" target="_blank">social phobia (anxiety when socialising or performing)</a></li>
        <li><a href="https://www.betterhealth.vic.gov.au/health/conditionsandtreatments/panic-disorder-and-agoraphobia" target="_blank">obsessive compulsive disorder (OCD)</a></li>
        </ul>`,
    `<a href="https://www.betterhealth.vic.gov.au/health/conditionsandtreatments/social-phobia" target="_blank">Social anxiety (social phobia)</a> is an anxiety disorder that affects 
    you think and act in social situations. It is a constant and exaggerated fear of being judged or humiliated by other people and can cause you
    to struggle in work, school and social life. The percentage scores above indicate the intensity of common social anxiety symptoms, such as:
    <ul>
        <li>Being afraid to take a test</li>
        <li>Being afraid to use public toilets or bathrooms</li>
        <li>Being afraid to present in front of your peers</li>
    </ul>`,
    `<a href="https://www.ncbi.nlm.nih.gov/books/NBK560793/#:~:text=Separation%20anxiety%20disorder%20(SAD)%20is,separation%20from%20an%20attachment%20figure." target="_blank">Seperation anxiety disorder (SAD)</a> is an anxiety disorder wherein
    somebody becomes excessively worried or concerned when a loved one leaves them alone. It can affect both adults and children. Children might be anxious about their parents or guardian leaving, whereas adults
    might worry about their children, romantic partners or spouses. The percentage scores above indicate the intensity of common SAD symptoms, such as:
    <ul>
        <li>Being afraid of being home alone</li>
        <li>Worrying about being away from my parents</li>
        <li>Being scared of having to sleep on your own</li>
    </ul>`,
    `<a href="https://www.betterhealth.vic.gov.au/health/conditionsandtreatments/obsessive-compulsive-disorder" target="_blank"">Obsessive compulsive disorder (OCD)</a> is an anxiety disorder wherein
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

    //Array for the average annotation, that is updated when user clicks on graph's button
    var annotationArray;


    // Establish traces
    var traceAnxiety = {
        mode: 'lines+markers',
        x: frequency,
        y: anxiety,
        name: 'Overall Anxiety',
        marker: {
            color: 'RGB(123, 160, 255)'
        },
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
        line:{
            width: 3
        }
    }

    var botLeft = {
        // Invisible Data Point in the bottom left of the graph
        // To stop graph from resizing itself, as Plotly is erratic 
        x: [1],
        y: [0],
        line: {color: 'rgbA(55, 128, 191,0)'},
        marker: {
            color: 'RGBA(255, 215, 0,0)'
        },
        // Totally hidden from the user
        hoverinfo:'skip',
        visible:true,
        showlegend: false
    };

    var topRight = {
        // Invisible Data Point in the top right of the graph
        // To stop graph from resizing itself, as Plotly is erratic 
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

    var data = [traceAnxiety, traceSocial, traceSeperation, traceOCD,botLeft,topRight];

    // Data setup
    for(let trace of data){
        if (trace === botLeft || trace === topRight ){
            continue;
        }

        trace.hovertemplate = "<b>Anxiety Type: </b>" + `${trace.name}<br>` 
        + "<b>Score: </b>" + `%{y} %<br><extra></extra>` 

        trace.mode = "lines+markers";
        trace.marker.size = 14;
    }

    // Below function is called when a graph button is pressed (except show all button)
    // It displays a line representing the average score for that anxiety type
    function createAverageLine(traceType){

        // Get the average for the currently displayed anxiety type
        let average = averages[traceType];
        
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

        // This variable specifies the y position of the annotation reading "average"
        let label_y;

        if (traceType =="Seperation Anxiety"){
            // Place annotation below the line for the seperation anxiety graph, to prevent overlapping text
            label_y = parseInt(average)-3;
        }else{
            label_y = parseInt(average)+3;
        }

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

        // We store the new annotation to a global variable so that it can be displayed
        annotationArray = [averageLabel];

        // We return the line shape, so that it can be displayed
        return [averageLine]
    }

    var updatemenus=[
        {
            // Adapted from https://plotly.com/javascript/custom-buttons/#update-button
            buttons: [
                {
                    // Display All Graphs Button
                    args: [{'visible': [true, true, true, true,true,true]},
                    {'title': 'All Anxiety Types',
                    'yaxis': {'title': 'Anxiety Level (%)'},
                    'range': '[0, 100]',
                    'fixedrange': 'true',
                    'shapes': [],
                    'annotations': [],
                    // We only show a legend here as there are multiple graphs
                    'showlegend': true
                    }],
                    label: 'All',
                    method: 'update',
                },
                {
                    // Overall Anxiety Button
                    args: [{'visible': [true, false, false, false,true,true]},
                    {'title': 'Overall Anxiety',
                    'yaxis': {'title': 'Overall Anxiety Level (%)'},
                    'shapes' : createAverageLine("Total Anxiety"),
                    'annotations': annotationArray,
                    'showlegend': false
                    }],
                    label: 'Overall Anxiety',
                    method: 'update',
                },
                {
                    // Social Anxiety Button
                    args: [{'visible': [false, true, false, false,true,true]},
                    {'title': 'Social Anxiety',
                    'yaxis': {'title': 'Social Anxiety Level (%)'},
                    'shapes' : createAverageLine("Social Anxiety"),
                    'annotations': annotationArray,
                    'showlegend': false    
                    }],
                    label: 'Social',
                    method: 'update'
                },
                {
                    // Seperation Anxiety Button
                    args: [{'visible': [false, false, true, false,true,true]},
                    {'title': 'Seperation Anxiety',
                    'yaxis': {'title': 'Seperation Anxiety Level (%)'},
                    'shapes': createAverageLine("Seperation Anxiety"),
                    'annotations': annotationArray,
                    'showlegend': false
                    }],
                    label: 'Seperation',
                    method: 'update'
                },
                {
                    // OCD Button
                    args: [{'visible': [false, false, false, true,true,true]},
                    {'title': 'OCD',
                    'yaxis': {'title': 'OCD Level (%)'},
                    'shapes' : createAverageLine("OCD"),
                    'annotations': annotationArray,
                    'showlegend': false
                    }],
                    label: 'OCD',
                    method: 'update'
                },
            ],

            // positioning and styling of the graph
            direction: 'left',
            xanchor: 'left',
            x: 0,
            yanchor: 'top',
            y: 1.15,
            pad: {'r': 0, 't': 0},
            showactive: true,
            type: 'buttons',
            active: 0,
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
        // Transperant background
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        
        hovermode: 'closest',
        
        updatemenus: updatemenus,
        
        dragmode: false,

        hoverlabel: {
            // Styling for the hover label
            bgcolor: "#FFF",
            bordercolor: null,
            font: {
                family: 'Arial, monospace',
                size: 14,
                color: '#00000'
            }
        },

        xaxis:{
            title: 'Frequency of Social Media Use ',
            fixedrange: true,
            gridcolor: 'rgba(200, 200, 200, 0.4)', 
            gridwidth: 1,
            tickmode: "array",
            tickvals: [1,2,3,4,5,6],
            fixedrange: true,
            //Frequency of social media use (1 = Once a week or less, 2 = Several 
            //times a week, 3 = About 1-4 times per day, 4 = About 
            //5-10 times per day,  5 = More than 10 times a day,  6 = Constantly)
            ticktext: ['Once a week or less', 'Several times a week', '1-4 times per day','5-10 times per day', 'Over 10 times per day', 'Constantly'],
            tickfont:{
                size: 16
            },
            ticklen: 10
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

        margin:{
            t: 100,
        },

        title: {
            text:'All Anxiety Types',
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
            color: graphTextColor
        },

        autosize: true,

        // no annotations initially
        annotations: []

    }

    Plotly.newPlot("symptoms",data,layout,{displayModeBar: false}).then(function(){
        // Use a callback function to add event listeners to the buttons after they are added to the DOM by Plotly
        var myGraph = document.getElementById('symptoms');
        var buttons = myGraph.querySelectorAll(".updatemenu-button");

        //Updating the description box above the graph according to which graph is being displayed
        var graphDescription= document.querySelector('#symptoms_description p');
        graphDescription.innerHTML = anxietyDescriptions[0];

        for (let i = 0; i < buttons.length; i++) {
            buttons[i].addEventListener("click", function(){
                graphDescription.innerHTML = anxietyDescriptions[i];
            })
        }
    });

});
