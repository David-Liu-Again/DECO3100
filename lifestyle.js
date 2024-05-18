// establishing global variables containing csv data
var age, anxiety, celebrity, fomo, lifestyleChart;

Plotly.d3.csv("data/smhabits.csv", habit_data => {
    //Unpack all coloumns
    age = unpack(habit_data, 'Age Group');
    anxiety = unpack(habit_data, 'Anxiety').map(Number);
    celebrity = unpack(habit_data, 'Celebrity').map(Number);
    fomo = unpack(habit_data, 'FOMO').map(Number);
    
    //Initialise Graphs
    //Chart 1: Celebrity Followers
    
        // Values = the percentages displayed on the radial graph
    
    // graph id  = The id tag on the div to be turned into a graph
    // Title = The title of the graph to be displayed

    /* Below is adapted from https://apexcharts.com/javascript-chart-demos/radialbar-charts/custom-angle-circle/ */
    
       
    var options = {
        series: values,
        labels: ages,
        chart: {
            height: 390,
            type: 'radialBar',
        },
        plotOptions: {
            radialBar: {
                offsetY: 0,
                startAngle: 0,
                endAngle: 270,
                hollow: {
                    margin: 5,
                    size: '30%',
                    background: 'transparent',
                    image: undefined,
                },
                dataLabels: {
                    name: {
                        show: true,
                    },
                    value: {
                        show: true,
                    }
                },
                barLabels: {
                    enabled: true,
                    useSeriesColors: true,
                    margin: 8,
                    fontSize: '16px',
                    formatter: function(seriesName, opts) {
                        return seriesName + ":  " + roundToOne(opts.w.globals.series[opts.seriesIndex]) +"%"
                    },
                },
            }
        },
        title: {
            text: title,
            align: 'left',
            margin: 10,
            offsetX: 0,
            offsetY: 0,
            floating: false,
            style: {
            fontSize:  '14px',
            fontWeight:  'bold',
            fontFamily:  'Roboto',
            color:  '#263238'
            },
        },
        colors: ['#1ab7ea', '#0084ff', '#39539E', '#0077B5'],
        responsive: [{
            breakpoint: 480,
            options: {
            legend: {
                show: false
            }
            }
        }]
    };

    lifestyleChart =  new ApexCharts(document.querySelector(graphid), options);

    lifestyleChart.render();

});


function updateComboGraph(graphNumber = -1){
        // This displays the three radial graphs and is called when a age group button is clicked or when the page is loaded
        // AgeBracket is an integer that indicates which age bracket is to be displayed
        // -1 = All age groups
        // 0 = 16-24
        // 1 = 25-34
        // 2 = 35-44
        // 3 = 45-54
        // 4 = 55-64

        // temporary variables to hold the data that will be displayed
        let celebrity_values = [];
        let anxiety_values = [];
        let fomo_values = [];
        let age_values = [];
        
        
        if (graphNumber == -1){
            // All Ages (the default value)
            // all data is displayed
            celebrity_values = celebrity;
            anxiety_values = anxiety;
            fomo_values = fomo;
            age_values = age;
        } else{
            // age Bracket is 0,1,2,3 or4
            // only 1 age bracket is displayed
            celebrity_values.push(celebrity[graphNumber]);
            anxiety_values.push(anxiety[graphNumber]);
            fomo_values.push(fomo[graphNumber]);
            age_values.push(age[graphNumber]);
        }
        console.log(celebrity_values);
        console.log(anxiety_values);
        console.log(fomo_values);
        console.log(age_values);

        //Chart 1: Celebrity Followers
        celebrityChart.updateOptions({
                series: celebrity_values,
                labels: age_values
            }, 
            false, true);

        //Chart 2: Prevalance of anxiety disorders
        anxietyChart.updateOptions({
                series: anxiety_values,
                labels: age_values
            }, 
            false, true);

        // //Chart 3: Fear of Missing Out
        fomoChart.updateOptions({
                series: fomo_values,
                labels: age_values
            }, 
            false, true);

}

// Retrieving an array contianing the buttons used to alter the graph data
let buttonParent = document.querySelector("#habit_buttonset");
let buttonArray = buttonParent.querySelectorAll("input"); // all buttons
console.log(buttonArray);

buttonArray.forEach(button =>{
    button.addEventListener("click", function(event) {
        let ageBracket = parseInt(button.getAttribute("value"));
        updateComboGraph(ageBracket);
    });
});