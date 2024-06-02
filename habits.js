// Establishing global variables
var age, anxiety, celebrity, fomo, anxietyChart, celebrityChart,fomoChart;
// Colours for each series in the chart
const radialColours = [
    "#EE82EE", 
    "#FF69B4", 
    "#8000FF", 
    "#FFC300", 
    "#DDA0DD"  
]

Plotly.d3.csv("data/smhabits.csv", habit_data => {
    //Unpack all coloumns
    age = unpack(habit_data, 'Age Group');
    anxiety = unpack(habit_data, 'Anxiety').map(Number);// convert to float from string
    celebrity = unpack(habit_data, 'Celebrity').map(Number);
    fomo = unpack(habit_data, 'FOMO').map(Number);
    
    //Initialise Graphs

    //Chart 1: Celebrity Followers
    celebrityChart = generateRadialGraph(celebrity, "#habits_celeb" , "Use SM to follow celebrities or influencers");
    celebrityChart.render();

    //Chart 2: Prevalance of anxiety disorders
    anxietyChart = generateRadialGraph(anxiety,  "#habits_anxiety", "Prevalance of anxiety disorders");
    anxietyChart.render();

    // //Chart 3: Fear of Missing Out
    fomoChart = generateRadialGraph(fomo, "#habits_fomo", "Use SM to avoid missing out on things");
    fomoChart.render()
});

function generateRadialGraph(values, graphid, title){
    // Initalises a new radial graph

    // Parameters
    // Values = the percentages to be displayed on the radial graph
    // graph id  = The id tag on the div to be turned into a graph
    // Title = The title of the graph to be displayed

    /* Below is adapted from https://apexcharts.com/javascript-chart-demos/radialbar-charts/custom-angle-circle/ */
       
    var options = {
        series: values,
        labels: age,
        chart: {
            height: 390,
            type: 'radialBar',
            foreColor: '#000000',
            toolbar:{
                show: false
            }
        },

        plotOptions: {
            radialBar: {
                offsetY: 0,
                startAngle: 0,
                endAngle: 360,
                hollow: {
                    // Fill in the hollow centre of the ring
                    margin: 5,
                    size: '30%',
                    background: '#FFFFFF',
                },
                dataLabels: {
                    name: {
                        show: true,
                    },
                    value: {
                        show: true,
                    }
                },
            }
        },

        title: {
            text: title,
            align: 'center',
            margin: 10,
            offsetX: 0,
            offsetY: 0,
            floating: false,
            style: {
                fontSize:  '16px',
                fontWeight:  'bold',
                fontFamily:  'Roboto',
                color:  '#FFFFFF'
            },
        },

        colors: radialColours,

        font: {
                family: 'Arial',
                size: 18,
                color: '#00000'
        },

        legend: {
            // We only show the legend for the central graph of the three, to avoid repetition
            show: (graphid == '#habits_anxiety'),
            showForSingleSeries: false,
            position: 'bottom',
            horizontalAlign: 'center', 
            floating: false,
            fontSize: '16px',
            fontFamily: 'Helvetica, Arial',
            fontWeight: 400,
            labels: {
                colors: '#FFFFFF'
            },
        }
    };

    return new ApexCharts(document.querySelector(graphid), options);
}

function roundToOne(num) {
    // function adapted from mplungjan (https://stackoverflow.com/questions/11832914/how-to-round-to-at-most-2-decimal-places-if-necessary)
    return +(Math.round(num + "e+1")  + "e-1");
}

function updateGraphs(ageBracket = -1){
        // Updates the radial graphs when a radial button is clicked
        // Parameter ageBracket represents the currently selected radial button:
        // ageBracket = -1 is All Ages (the default value)
        // ageBracket = 0 is 16-24
        // ageBracket = 1 is 25-34
        // ageBracket = 2 is 35-44
        // ageBracket = 3 is 45-54
        // ageBracket = 4 is 55-64

        // temporary variables to hold the data that will be displayed
        let celebrity_values = [];
        let anxiety_values = [];
        let fomo_values = [];
        let age_values = [];
        let colour_values = [];
        
        if (ageBracket == -1){
            // all data is displayed
            celebrity_values = celebrity;
            anxiety_values = anxiety;
            fomo_values = fomo;
            age_values = age;
            colour_values = radialColours
        } else{
            // age Bracket must be 0, 1, 2, 3 or 4
            celebrity_values.push(celebrity[ageBracket]);
            anxiety_values.push(anxiety[ageBracket]);
            fomo_values.push(fomo[ageBracket]);
            age_values.push(age[ageBracket]);
            colour_values.push(radialColours[ageBracket]);
        }

        //Chart 1: Celebrity Followers
        celebrityChart.updateOptions({
                series: celebrity_values,
                labels: age_values,
                colors: colour_values
            }, 
            false, true);

        //Chart 2: Prevalance of anxiety disorders
        anxietyChart.updateOptions({
                series: anxiety_values,
                labels: age_values,
                colors: colour_values,
                legend: {
                    // We only show the legend for the central graph whilst it has multiple series displayed
                    show: (ageBracket == -1)
                }
            }, 
            false, true);

        // //Chart 3: Fear of Missing Out
        fomoChart.updateOptions({
                series: fomo_values,
                labels: age_values,
                colors: colour_values
            }, 
            false, true);
}

// Retrieving an array containing the radio buttons 
let habitFieldset = document.querySelector("#habit_buttonset");
let habitRadioArray = habitFieldset.querySelectorAll("input"); // all buttons

habitRadioArray.forEach(button =>{
    // Attaching event listeners to each radio button, so that they can alter the graph data
    button.addEventListener("click", function(event) {
        let ageBracket = parseInt(button.getAttribute("value"));
        updateGraphs(ageBracket);
    });
});