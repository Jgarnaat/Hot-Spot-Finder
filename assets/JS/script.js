//alternate header for when there are too many requests
//const headers = {'Authorization': 'Basic QUlEZjQ2ZjQ2MmI1ZTZiMjZiYTc3YTFjMjBkM2Y5ZTE5ZmM6ZjIzZGFlMzdlOGQ2OGNlNGQzYmVhMzFmOGExZDk1ZTY='}
let map;
const headers = {'Authorization': 'Basic QUlEMzE5ZTFiZmJkNGEwYWI5ZDg4YWZlMmNiMGEwNzc0MGQ6NjgyMzQ2YTNhYTU2ZTliYzM1MjE0NjJmNzIxNzkyYjg='}
var myPosition = {lat: 42.68348312,lng: -84.50691223};
var zip = document.querySelector('#search-bar');
var searchBtn = document.querySelector('#search-button');
var recentSearch = document.getElementById('recent-searches');
var address = document.getElementById('address');
var addressResult = [];
var recent = [];

//Initialize map
async function initMap() {
  const { Map } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
   
  const map = new Map(document.getElementById("map"), {
    zoom: 12,
    center: myPosition,
    mapId: "Wifi_map",});
  }


// The Search function
  async function search() {

  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
  const { Map } = await google.maps.importLibrary("maps");
  const map = new Map(document.getElementById("map"), {
    zoom: 12,
    center: myPosition,
    mapId: "Wifi_map",});
    var zip = document.querySelector('#search-bar');
    console.log(zip.value);
    localSave(zip.value);


//Fetch from the  wigle API
  fetch("https://api.wigle.net/api/v2/network/search?onlymine=false&freenet=true&paynet=false&variance=0.02&postalCode=" + zip.value +"&resultsPerPage=10", { headers })
    .then(function(response) {
      return response.json();
     })
    .then(function(data){
      console.log(data.results[0].trilat, data.results[0].trilong)

    map.setCenter({lat:data.results[0].trilat, lng:data.results[0].trilong});
    
    for (let i = 0; i < 10; i++) {
        var lat= data.results[i].trilat
        var lon= data.results[i].trilong
        var wifiName = data.results[i].ssid
        var state = data.results[i].region
        var cityName = data.results[i].city
        var road = data.results[i].road

        if (houseNumber != null){
          var houseNumber = data.results[i].housenumber}
          else{
            var houseNumber = ''
          };

        var postalCode = data.results[i].postalcode;
        
        new google.maps.Marker({
          position: {lat: lat,lng: lon},
          icon: "./assets/images/icon.png",
          title: wifiName,
          map});
          window.data=data;

//Appends hotspot location search results
        var searchResultsList = document.getElementById("search-results");
        
        var card = searchResultsList.appendChild(document.createElement("div"));
          card.classList.add('card', 'col-sm-12', 'col-lg-6');
        
        var cardBody = card.appendChild(document.createElement("div"));
          cardBody.classList.add('card-body');
        
        var cardTitle = cardBody.appendChild(document.createElement("h3"));
          cardTitle.classList.add('card-title');
        
        var cardIcon = cardBody.appendChild(document.createElement("img"));
          cardIcon = cardTitle.insertAdjacentElement('beforebegin', cardIcon);
          cardIcon.setAttribute("src", "./assets/images/icon.png");
          cardIcon.classList.add('search-icon');
          cardTitle.innerHTML =wifiName;
        
        var hotspotAddress = cardBody.appendChild(document.createElement("p"));
          hotspotAddress.classList.add('search-result');
          hotspotAddress.innerHTML = houseNumber + ' ' + road + ', ' + cityName + ', ' + state + ' ' + postalCode;
      }
    });
  }

//The function to save to the local storage

  function localSave(zip){
    console.log("local save");
   var recent = JSON.parse(localStorage.getItem('recent'))
    if (recent === null || undefined){
      console.log("save null");
      var recent = [zip];
      localStorage.setItem("recent",JSON.stringify(recent));
      localLoad();
      return}
    else{
      console.log("saving");
      recent.unshift(zip);
      console.log("else");};
    if(recent.length > 5){
        recent.pop();
        console.log("load pop");
        }
    localStorage.setItem("recent", JSON.stringify(recent));
    console.log("stored");
    
    localLoad()};  
  
// The function for the load of the local Storage    

    function localLoad(){
      var recent = JSON.parse(localStorage.getItem("recent"));
      console.log(recent);
      document.getElementById("saved-searches").textContent='';
        for (let i = 0; i < 5 ; i++) {
          if (recent[i] === null) {
            console.log("null load");
      }
      else {
      var savedSearchesList = document.getElementById("saved-searches");
      var savedSearch = savedSearchesList.appendChild(document.createElement("button"));
      savedSearch.classList.add('saved-search');
      savedSearch.innerHTML = recent[i];
      savedSearch.addEventListener('click', search);
        }
      }  
    }

// Initialization functions and event listener
localLoad();
window.initMap=initMap;

searchBtn.addEventListener("click", search);
