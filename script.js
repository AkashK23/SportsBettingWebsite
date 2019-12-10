
//const axios = require('axios')


//Get Odds from the 3rd party api The-Odds-Api for upcoming football games

// An api key is emailed to you when you sign up to a plan
const api_key = 'b1eac66fa719b3b2658e9ef93cbb43b6'



// To get odds for a sepcific sport, use the sport key from the last request
//   or set sport to "upcoming" to see live and upcoming across all sports


//e29fd820d31529137a4df765b855f50cc8db6de4
let sport_key = "americanfootball_nfl"
export async function getOdds(id) {
    const odds = await axios.get('https://api.the-odds-api.com/v3/odds', {
        params: {
            api_key: api_key,
            sport: sport_key,
            region: 'us', // uk | us | au
            mkt: 'h2h' // h2h | spreads | totals
        }
    });
    return odds.data.data;
    // .then(response => {
    //     // odds_json['data'] contains a list of live and 
    //     //   upcoming events and odds for different bookmakers.
    //     // Events are ordered by start time (live events are first)
    //     // console.log(
    //     //     `Successfully got ${response.data.data.length} events`,
    //     //     `Here's the first event:`
    //     // )
    //     // console.log(JSON.stringify(response.data.data[0]))
    //     for (let i = 0; i < response.data.data.length; i++) {
    //         console.log(JSON.stringify(response.data.data[i]))
    //         console.log();
    //     }

    //     // Check your usage
    //     console.log()
    //     console.log('Remaining requests', response.headers['x-requests-remaining'])
    //     console.log('Used requests', response.headers['x-requests-used'])
    //     return response.data.data;
    //     //return odds.data;
    // }).catch(error => {
    //     console.log('Error status', error.response.status)
    //     console.log(error.response.data)
    // })
    
};



//Get the results from NFL XML File

var url = 'http://www.nfl.com/liveupdate/scorestrip/ss.xml';
var xhttp = new XMLHttpRequest();

xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
        xmlParser(this);
    }
}

xhttp.open("GET", url, true);
xhttp.send();

function xmlParser(xml) {
    var xmlDoc = xml.responseXML;
    var counter = 0;
    var myString = "";
    var gameObj = {};
    var xmlGames = [];
    while (counter < xmlDoc.getElementsByTagName('g').length) {
        myString += " " + xmlDoc.getElementsByTagName('g')[counter].getAttribute('hnn');
        console.log(xmlDoc.getElementsByTagName('g')[counter].getAttribute('hnn'));
        
        gameObj["homeTeam"] = xmlDoc.getElementsByTagName('g')[counter].getAttribute('hnn');
        gameObj["visitorTeam"] = xmlDoc.getElementsByTagName('g')[counter].getAttribute('vnn');
        gameObj["Day"] = xmlDoc.getElementsByTagName('g')[counter].getAttribute('d');
        gameObj["Time"] = xmlDoc.getElementsByTagName('g')[counter].getAttribute('t');
        gameObj["progress"] = xmlDoc.getElementsByTagName('g')[counter].getAttribute('q');
        counter++;
        //gameObj["visitorTeam"] = xmlDoc.getElementsByTagName('g')[counter].getAttribute('gnn');
    }

    console.log(xmlDoc.getElementsByTagName('g')[0]);
}

console.log("hi");
async function printOdds() {
    var gameOdds = [];
    let result = await getOdds();
    console.log(result);
    //let result = result.data;
    for (let i = 0; i < result.length; i++) {
        var odds = {};
        console.log(result[0])
        odds["Home"] = result[i].home_team;
        if (odds["Home"] === result[i].teams[0]) {
            odds["odds"] = avgOdds(result[i].sites, 0);
            odds["Away"] = result[i].teams[1];
        } else {
            odds["odds"] = avgOdds(result[i].sites, 1);
            odds["Away"] = result[i].teams[0];
        }
        odds["date"] = getDate(result[i].commence_time);
        
        gameOdds.push(odds);
    }
    console.log(gameOdds);
}

function getDate(UNIX_timestamp) {
    var a = new Date(UNIX_timestamp * 1000);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
    return time;
}

function avgOdds(sites, home) {
    let firstOdd = 0;
    let secondOdd = 0;
    for (let i = 0; i < sites.length; i++) {
        firstOdd += sites[i].odds.h2h[0];
        secondOdd += sites[i].odds.h2h[1];
    }
    if (home === 0) {
        return [firstOdd/sites.length, secondOdd/sites.length];
    }
    return [secondOdd/sites.length, firstOdd/sites.length];
    
}
printOdds();



$(document).ready(function(){

    var $statusKey = $('.status-key');
    var $statusAjax = $('.status-ajax');
    var intervalId;
    
    // Fake ajax request. Just for demo
    function make_ajax_request(e){
        var that = this;
        $statusAjax.html('That\'s enough waiting. Making now the ajax request');
       
        intervalId = setTimeout(function(){
           $statusKey.html('Type here. I will detect when you stop typing');
           $statusAjax.html('');
           $(that).val(''); // empty field
        },2000);
      }
    
    // Event handlers to show information when events are being emitted
      $('.autocomplete')
        .on('keydown', function (){  
        
          $statusKey.html('Waiting for more keystrokes... ');
        clearInterval(intervalId);             
        })
       
    
    // Display when the ajax request will happen (after user stops typing)
      // Exagerated value of 1.2 seconds for demo purposes, but in a real example would be better from 50ms to 200ms
    $('.autocomplete').on('keydown',
         _.debounce(make_ajax_request, 1300));
    });
