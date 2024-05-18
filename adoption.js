//Below line taken from Week 8 tutorial slides
//const unpack = (data, key) => data.map(row => row[key]);

Plotly.d3.csv("data/smadoption.csv", adoption_data => {
    //Unpack all coloumns
    const age = unpack(adoption_data, 'Age');
    const any = unpack(adoption_data, 'Any');
    const facebook = unpack(adoption_data, 'Facebook');
    const instagram = unpack(adoption_data, 'Instagram');
    const tiktok = unpack(adoption_data, 'TikTok');
    const twitter = unpack(adoption_data, 'Twitter');
    const youtube = unpack(adoption_data, 'YouTube');

    var traceAny= {
        y: age,
        x: any,
        name: 'Any Social Media',
        marker: {
            color: 'rgba(0,0,255,0.6)'
        },
    }


     var traceFacebook = {
         y: age,
         x: facebook,
         name: 'Facebook',
         marker: {
            color: 'rgba(0,100,255,0.6)'
        },
        
    }

    var traceInsta = {
        y: age,
        x: instagram,
        name: 'Instagram',
        marker: {
            color: 'rgba(100,0,255,0.6)'
        },
    
    }

    var traceTiktok = {
        y: age,
        x: tiktok,
        name: 'Tiktok',
        marker: {
            color: 'rgba(100,100,255,0.6)'
        },
        
    }

    var traceTwitter = {
        y: age,
        x: twitter,
        name: 'Twitter',
        marker: {
            color: 'rgba(0,50,255,0.6)'
        },
    }

    var traceYoutube = {
        y: age,
        x: youtube,
        name: 'Youtube',
        marker: {
            color: 'rgba(100,0,255,0.6)'
        },
    }

    var data = [traceAny, traceFacebook, traceInsta, traceTiktok, traceTwitter, traceYoutube];

    // Data setup
    data.forEach(trace => {
        trace.hovertemplate = "<b>Platform: </b>" + `${trace.name}<br>` //must use backtick
        + "<b>Age Group: </b>" + `%{y}<br>` 
        + "<b>Adoption Rate: </b>" + `%{x} %<br><extra></extra>` ;
        trace.type = "bar";
        trace.orientation = 'h';
        trace.visible = false; // set all to invisible by default
    })

    traceAny.visible = true;

    console.log(data);


    var updatemenus=[
        {
            // Adapted from https://plotly.com/javascript/custom-buttons/#update-button
            buttons: [
                {
                    args: [{'visible': [true, true, true, true, true, true]},
                    {'title': 'All'}],
                    label: 'All',
                    method: 'update',
                    active:false
                },
                {
                    args: [{'visible': [true, false, false, false, false, false]},
                    {'title': 'Any Social Media'}],
                    label: 'Any Social Media',
                    method: 'update',
                    active: true
                },
                {
                    args: [{'visible': [false, true, false, false, false, false]},
                    {'title': 'Facebook'}],
                    label: 'Facebook',
                    method: 'update'
                },
                {
                    args: [{'visible': [false, false, true, false, false, false]},
                    {'title': 'Instagram'}],
                    label: 'Instagram',
                    method: 'update'
                },
                {
                    args: [{'visible': [false, false, false, true, false, false]},
                    {'title': 'TikTok'}],
                    label: 'TikTok',
                    method: 'update'
                },
                {
                    args: [{'visible': [false, false, false, false, true, false]},
                    {'title': 'Twitter'}],
                    label: 'Twitter',
                    method: 'update'
                },
                {
                    args: [{'visible': [false, false, false, false, false, true]},
                    {'title': 'Youtube'}],
                    label: 'Youtube',
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

    var annotations = [
        {
          text: 'Platform:',
          x: 0.05,
          y: 1.085,
          yref: 'paper',
          align: 'left',
          showarrow: false
        }
    ]

     var layout = {
        //hover
        hovermode: 'closest',
        updatemenus: updatemenus,
        annotations: annotations,
        hoverlabel: {
            bgcolor: "#FFF",
            bordercolor: null,
            font: {
                family: 'Arial, monospace',
                size: 14,
                color: '#00000'
            }
        },

        xaxis:{
            title: 'Total Adoption Rate (%)',
            fixedrange: true
        },

        yaxis:{
            title: 'Age Bracket',
            tickmode: "linear",
            tick0: 0,
            dtick: 1,
            tickwidth: 0,
            range: [0.5, 6],
            fixedrange: true
        },

        margin:{
            t:10
        },

        title: {
            text:'Any Social Media',
            font: {
                family: 'Arial',
                size: 24
            },
            y: 0.85
        }
    }

     Plotly.newPlot("adoption",data,layout);
})