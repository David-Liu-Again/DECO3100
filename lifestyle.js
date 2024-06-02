// establishing global variables
var currentGraphIndex = 0; // integer indicating the current graph being displayed (friends or family)
var lifestyleChart;

// Function to unpack the first column of the dataset only
const unpackFirst = (data) => data.map(row => Object.values(row)[0]);

// Array to hold the file names of the data 
let fileNames = [
    "friends.csv",
    "family.csv"
];

// Initalise array to hold the graph data 
let database = [null,null];

let graphTitles = [
    "The Importance of Friends",
    "The Importance of Family",
]

// Initialise a dataless graph
// on click
// Update the "current graph" index in the backend and frontend
// For each graph
// Update the graph to display the data

function unpackCSV(index, callback){
    // unpacks data for a specified graph, unless it has been done already
    // We don't uppack every graph upfront, only when it is displayed
    // This saves time when loading the page initially

    // Parameters
    // Index = integer denoting which graph to fetch data for (0= friends, 1 = family)
    // Callback = callback function

    Plotly.d3.csv("data/lifestyle/" + fileNames[index], life_data => {
        //independent variable
        let independentVar = unpackFirst(life_data);
        // dependent variable
        let lifeSatisfaction = unpack(life_data, 'life satisfaction').map(Number);
        
        let newGraphData = [independentVar, lifeSatisfaction];
        
        if (database[index] != null) {
            // The current graph has been loaded already, we throw an error
            throw new Error('Attempting to overwrite database');
        }

        // Add new graph to the database
        database[index] = newGraphData;

        // Call the callback function after the database has been updated
        if (callback) {
            callback(newGraphData);
        }
    });
}


// Initialise default data to be displayed to the user
unpackCSV(currentGraphIndex, (newGraphData) => {
    var options = {
        series: [{
                name: 'Life Satisfaction',
                type: 'column',
                data: newGraphData[1],
            }],

        chart: {
            height: 600,
            foreColor: graphTextColor,
            toolbar:{
                show: false
            }
        },

        stroke: {
            width: [0, 4]
        },

        colors: ['#1ab7ea'],

        title: {
            text: graphTitles[currentGraphIndex],
            align: 'center',
            margin: 10,
            offsetX: 0,
            offsetY: 0,
            floating: false,
            style: {
                fontSize:  '36px',
                fontWeight:  'bold',
                fontFamily:  'Roboto',
                color:  graphTextColor
            },
        },

        dataLabels: {
            enabled: false,
        },

        labels: newGraphData[0],

        xaxis:{
            title: {
                text: 'Individual Opinion on ' + (currentGraphIndex==0 ? "Friends" : "Family"),
                style: {
                    fontSize: '24px',
                    fontFamily: 'Helvetica, Arial, sans-serif',
                    fontWeight: 600,
                    cssClass: 'apexcharts-yaxis-title',
                }
            }
        },

        yaxis: {
            title: {
                text: 'Life Satisfaction (%)',
                style: {
                    fontSize: '24px',
                    fontFamily: 'Helvetica, Arial, sans-serif',
                    fontWeight: 600,
                    cssClass: 'apexcharts-yaxis-title',
                }
            },
            stepSize: 20,
            min:0,
            max: 100,
            decimalsInFloat:0,
            style: {
                fontSize: '40px',
                fontWeight: 400,
            },
        },

        tooltip: {
            shared:false,
            theme:  'dark',
            y: {
                formatter: function(value) {
                    // Round the percentage shown in the tool tip to one decimal place
                    return roundToOne(value) + "%"
                },
                
            }
        },

        font: {
            family: 'Arial',
            size: 30,
            color: '#00000'
        },
    };

    lifestyleChart = new ApexCharts(document.querySelector("#lifestyle"), options);
    lifestyleChart.render();
});


function updateLifestyleGraph(newGraphNumber){
        // This displays the lifestyle graphs and is called when one of the radio buttons is clicked
        // GraphNumber indicates which graph to be dislpayed
        //Possible Values
        // 0 = Importance of Family
        // 1 = Importance of Friends

        let newGraphData;
        
        //Update the global variable
        currentGraphIndex = newGraphNumber;

        //Display the new data
        if (database[currentGraphIndex] == null){
            //unpack the csv data if this is the first instance of it being displayed
            unpackCSV(currentGraphIndex, (newGraphData) => {
                displayNewData(newGraphData);
            });
        } else{
            //Data has already been unpacked, so we just fetch it and display it
            newGraphData = database[currentGraphIndex];
            displayNewData(newGraphData);
        }
}

function displayNewData(newGraphData){
    lifestyleChart.updateOptions({
        series: [{
            data: newGraphData[1],
        }],
        labels: newGraphData[0],
        title: {
            text: graphTitles[currentGraphIndex]
        },
        xaxis:{
            title: {
                text: 'Individual Opinion on ' + (currentGraphIndex==0 ? "Friends" : "Family"),
            }
        }
    }, 
    false, true);
}

// Retrieving an array containing the radio buttons used to alter the graph data
let lifestyleFieldset = document.querySelector("#lifestyle_buttonset");
let lifestyleRadioArray = lifestyleFieldset.querySelectorAll("input"); // all buttons
console.log(lifestyleRadioArray);

lifestyleRadioArray.forEach(button =>{
    // Attaching event listeners to each radio button, so that they can alter the graph data
    button.addEventListener("click", function(event) {
        let ageBracket = parseInt(button.getAttribute("value"));
        updateLifestyleGraph(ageBracket);
    });
});