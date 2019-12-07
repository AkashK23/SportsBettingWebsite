const axios = require('axios')

//Get Odds from the 3rd party api The-Odds-Api for upcoming football games

// An api key is emailed to you when you sign up to a plan
const api_key = 'b1eac66fa719b3b2658e9ef93cbb43b6'

// Get a list of in season sports
// axios.get('https://api.the-odds-api.com/v3/sports', {
//     params: {
//         api_key: api_key
//     }
// }).then(response => {

//     console.log(
//         `Successfully got ${response.data.data.length} sports.`,
//         `Here's the first sport:`
//     )

//     console.log(response.data.data[0])
// })
//     .catch(error => {
//         console.log('Error status', error.response.status)
//         console.log(error.response.data)
//     })

// To get odds for a sepcific sport, use the sport key from the last request
//   or set sport to "upcoming" to see live and upcoming across all sports

let sport_key = "americanfootball_nfl"

axios.get('https://api.the-odds-api.com/v3/odds', {
    params: {
        api_key: api_key,
        sport: sport_key,
        region: 'us', // uk | us | au
        mkt: 'h2h' // h2h | spreads | totals
    }
}).then(response => {
    // odds_json['data'] contains a list of live and 
    //   upcoming events and odds for different bookmakers.
    // Events are ordered by start time (live events are first)
    console.log(
        `Successfully got ${response.data.data.length} events`,
        `Here's the first event:`
    )
    // console.log(JSON.stringify(response.data.data[0]))
    for (let i = 0; i < response.data.data.length; i++) {
        console.log(JSON.stringify(response.data.data[i]))
        console.log();
    }

    // Check your usage
    console.log()
    console.log('Remaining requests', response.headers['x-requests-remaining'])
    console.log('Used requests', response.headers['x-requests-used'])

})
    .catch(error => {
        console.log('Error status', error.response.status)
        console.log(error.response.data)
    })


//Get the results from NFL XML File

var url = 'http://www.nfl.com/liveupdate/scorestrip/ss.xml';
var xhttp = new XMLHttpRequest();

xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
        myFunction(this);
    }
}

xhttp.open("GET", url, true);
xhttp.send();

function myFunction(xml) {
    var xmlDoc = xml.responseXML;
    var counter = 0;
    var myString = "";

    while (counter < xmlDoc.getElementsByTagName('g').length) {
        myString += " " + xmlDoc.getElementsByTagName('g')[counter].getAttribute('hnn');
        counter++;
    }

    document.getElementById('root').innerHTML = myString;
}