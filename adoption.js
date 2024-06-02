Plotly.d3.csv("data/smadoption.csv", adoption_data => {
    // Unpack all columns
    const age = unpack(adoption_data, 'Age');
    const facebook = unpack(adoption_data, 'Facebook');
    const instagram = unpack(adoption_data, 'Instagram');
    const tiktok = unpack(adoption_data, 'TikTok');
    const twitter = unpack(adoption_data, 'Twitter');
    const youtube = unpack(adoption_data, 'YouTube');

    // Establish traces
     var traceFacebook = {
         y: age,
         x: facebook,
         name: 'Facebook',
         marker: {
            color: 'rgb(0, 174, 239)'
        }
    }

    var traceInsta = {
        y: age,
        x: instagram,
        name: 'Instagram',
        marker: {
            color: 'RGB(255, 105, 180)'
        }
    }

    var traceTiktok = {
        y: age,
        x: tiktok,
        name: 'Tiktok',
        marker: {
            color: 'RGB(128, 0, 255)'
        }
    }
    
    var traceTwitter = {
        y: age,
        x: twitter,
        name: 'Twitter',
        marker: {
            color: 'rgb(255, 195, 0)'
        }
    }

    var traceYoutube = {
        y: age,
        x: youtube,
        name: 'Youtube',
        marker: {
            color: 'rgb(255, 85, 85)'
        }
    }

    var data = [traceFacebook, traceInsta, traceTiktok, traceTwitter, traceYoutube];

    // Data setup
    data.forEach(trace => {
        trace.hovertemplate = "<b>Platform: </b>" + `${trace.name}<br>` 
        + "<b>Age Group: </b>" + `%{y}<br>` 
        + "<b>Adoption Rate: </b>" + `%{x} %<br><extra></extra>` ;
        trace.type = "bar";
        // Specify that we want a horizontal bar graph, as it is more intuitive for visuallising percentages
        trace.orientation = 'h';
    })


    var updatemenus=[
        {
            // Adapted from https://plotly.com/javascript/custom-buttons/#update-button
            buttons: [
                {
                    // View All Traces Button
                    args: [{'visible': [true, true, true, true, true, true]},
                    {'title': 'All'}],
                    label: 'All',
                    method: 'update',
                    active:false
                },
                {
                    // View Facebook Button
                    args: [{'visible': [true, false, false, false, false]},
                    {'title': 'Facebook'}],
                    label: 'Facebook',
                    method: 'update'
                },
                {
                    // View Instagram Button
                    args: [{'visible': [false, true, false, false, false]},
                    {'title': 'Instagram'}],
                    label: 'Instagram',
                    method: 'update'
                },
                {
                    // View TikTok Button
                    args: [{'visible': [false, false, true, false, false]},
                    {'title': 'TikTok'}],
                    label: 'TikTok',
                    method: 'update'
                },
                {
                    // View Twitter Button
                    args: [{'visible': [false, false, false, true, false]},
                    {'title': 'Twitter'}],
                    label: 'Twitter',
                    method: 'update'
                },
                {
                    // View Youtube Button
                    args: [{'visible': [false, false, false, false, true]},
                    {'title': 'Youtube'}],
                    label: 'Youtube',
                    method: 'update'
                },
            ],

            // Set positioning and styling of buttons
            xanchor: 'left',
            yanchor: 'top',
            direction: 'left',
            x: 0.15,
            y: 1,
            pad: {'r': 0, 't': 0},
            showactive: true,
            type: 'buttons',
            //Any is active initially
            active: 0,
            activecolor: 'rgb(0,0,0)',
            bgcolor: 'rgba(255, 255, 255, 0.5)', 
            font: {
                family: 'Arial',
                size: 18,
                color: graphTextColor
            }
        }
    ]

    var annotations = [
        {
          text: 'Platform:',
          x: 0.07,
          y: 0.99,
          yref: 'paper',
          xref: 'paper',
          align: 'left',
          showarrow: false,
          font:{
            color: graphTextColor,
            size: '22px'
        }
        }
    ]

     var layout = {
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',

        updatemenus: updatemenus,
        annotations: annotations,
        
        hovermode: 'closest',
        hoverlabel: {
            bgcolor: "#FFF",
            bordercolor: null,
            font: {
                family: 'Arial',
                size: 18,
                color: '#00000'
            }
        },

        xaxis:{
            title: 'Total Adoption Rate (%)',
            fixedrange: true
        },

        yaxis:{
            title:{
                text: 'Age Bracket',
                standoff: 5  
            }, 
            fixedrange: true,
            range: [-0.5, 6],
            tickmode: "linear",
            tick0: 0,
            dtick: 1,
            tickwidth: 0,
        },

        margin:{
            // Creating space for the buttons
            t:10
        },

        title: {
            text:'Any Social Media',
            font: {
                family: 'Arial',
                size: 24
            },
            y: 0.86
        },

        font: {
            family: 'Arial',
            size: 18,
            color: graphTextColor
        },
    }

     Plotly.newPlot("adoption",data,layout, {displayModeBar: false});
})