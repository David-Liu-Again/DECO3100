// establishing global variables containing csv data
var currentGraphIndex = 0;
var lifestyleChart;
// var age, anxiety, celebrity, fomo, lifestyleChart;

// Function to unpack the first column of the datasety
const unpackFirst = (data) => data.map(row => Object.values(row)[0]);

// initalise empty array to hold the graph data
let fileNames = [
    "friends.csv",
    "family.csv",
    "humanitarian.csv",
    "religious.csv",
    "sport.csv",
    "union.csv"
]
let database = [null,null,null,null,null,null]
let graphTitles = [
    "The Importance of Friends",
    "The Importance of Family",
    "The Importance of Humanitarian Volunteering",
    "The Importance of Religious Volunteering",
    "The Importance of Sport Volunteering",
    "The Importance of Union Membership"
]

// Initialise a dataless graph
// on click
// Update the "current graph" index in the backend and frontend
// For each graph
// Update the graph to display the data

// Used chatGPT to assist with writing a callback function and dealing with asynchronicity

function unpackCSV(index, callback){
    // unpack the data if it hasn't been done already
    Plotly.d3.csv("data/lifestyle/" + fileNames[index], life_data => {
        let independentVar = unpackFirst(life_data);
        // Unpack all columns
        let health = unpack(life_data, 'health').map(Number);
        let lifeSatisfaction = unpack(life_data, 'life satisfaction').map(Number);
        
        let newGraphData = [independentVar, health, lifeSatisfaction];
        
        if (database[index] != null) {
            throw new Error('Attempting to overwrite database');
        }

        database[index] = newGraphData;

        // Call the callback function after the database has been updated
        if (callback) {
            callback(newGraphData);
        }
    });
}


// Initialise default data to be displayed to the user
unpackCSV(currentGraphIndex, (newGraphData) => {
    console.log('New graph data:', newGraphData);
    console.log('Database:', database);

    var options = {
        series: [{
                name: 'Health',
                type: 'column',
                data: newGraphData[1],
            }, {
                name: 'Life Satisfaction',
                type: 'column',
                data: newGraphData[2],
            }],
        chart: {
            height: 350,
            type: 'line',
            foreColor: '#FFFFFF'
        },
        stroke: {
            width: [0, 4]
        },
        colors: ['#1ab7ea',  '#FFA07A',],
        title: {
            //Update this
            text: graphTitles[currentGraphIndex],
            style: {
                fontSize:  '14px',
                fontWeight:  'bold',
                fontFamily:  'Roboto',
                color:  '#FFFFFF'
            },
        },
        dataLabels: {
            enabled: false,
            //enabledOnSeries: [1]
        },
        labels: newGraphData[0],
        xaxis: {
            //type: 'datetime'
        },
        yaxis: {
            title: {
                text: 'Health and Life Satisfaction (%)',
            },
            stepSize: 20,
            min:0,
            max: 80,
            decimalsInFloat:0
        },
        tooltip: {
            shared:false,
            theme:  'dark',
            y: {
                formatter: function(value) {
                    return roundToOne(value) + "%"
                },
                
            },
            style: {
                fontSize:  '14px',
                fontWeight:  'bold',
                fontFamily:  'Roboto',
                color:  '#000000'
            },
        }
    };

    lifestyleChart = new ApexCharts(document.querySelector("#lifestyle"), options);
    lifestyleChart.render();
});


function updateComboGraph(newGraphNumber){
        // This displays the lifestyle graphs and is called when a lifestyle button is clicked
        // GraphNumber indicates which graph to be dislpayed
        //Possible Values
        // 0 = Importance of Family
        // 1 = Importance of Friends
        // 2 = Importance of Humanitarian Volunteering
        // 3 = Importance of Religious Volunteering
        // 4 = Importance of Sport Volunteering
        // 5 = The Importance of Union Membership
        let newGraphData;
        
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

        //update back and forward buttons
}

function displayNewData(newGraphData){
    console.log("New graph data: ", newGraphData);
    lifestyleChart.updateOptions({
        series: [{
            data: newGraphData[1],
        }, {
            data: newGraphData[2],
        }],
        labels: newGraphData[0],
        title: {
            text: graphTitles[currentGraphIndex]
        },
    }, 
    false, true);
}

// // Retrieving an array contianing the buttons used to alter the graph data
let lifestyleFieldset = document.querySelector("#lifestyle_buttonset");
let lifestyleRadioArray = lifestyleFieldset.querySelectorAll("input"); // all buttons
console.log(lifestyleRadioArray);

lifestyleRadioArray.forEach(button =>{
    button.addEventListener("click", function(event) {
        console.log(button.name, button.value);
        let ageBracket = parseInt(button.getAttribute("value"));
        updateComboGraph(ageBracket);
    });
});