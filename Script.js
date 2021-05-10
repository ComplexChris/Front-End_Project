// Create a Dropzone object
// Capture path and store data of file locally

// Use Pantry ( https://getpantry.cloud/apiv1/pantry/809cff74-8863-45df-a7b8-44641613bcf8/basket/testBasket )
// Use that to create and store variables from GoFile

// Submit another Post request to Pantry with update object
// {fileName:[path, apiKey, ID]}

/*
$(document).ready(function(){
    $("form").submit(function(e){
        
        const inst =  new Breweries}
        e.preventDefault()
    });
}); */

const __version__ = "2.3.7"
console.log(__version__)

function Callback(e){
    console.log(e)
    if( e.submitter.value==="Reset" ){
        const inp_els = $(".field .user_input")
        inp_els.each( function(index, element){
            element.value = ""
        })
    }
    else{
        const inst = new Breweries(true)
    }
    e.preventDefault()
}

//$(".field .user_input").on("submit")
// Can also do $(submit_form)

console.log("DTGHDGH")
$(".user_input").keyup( function(e){
    if(e.key==="enter"){
        console.log("Button pressed")
        $(".submit_action").click()
        return false;
    }
    else{
        console.log("Else")
    }
} )



var mymap = L.map('mapid').setView([51.505, -0.09], 13);

const accessToken = `pk.eyJ1IjoiZHNyaGJlc2RodCIsImEiOiJja28ybTdmcWswYzZzMm5vZWhlMXgycmYwIn0.ytCcEncWblj5F0JMOWEptw`
L.tileLayer(`https://api.mapbox.com/styles/v1/dsrhbesdht/tiles/{z}/{x}/{y}?access_token=${accessToken}`, {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: accessToken
}).addTo(mymap);

var marker = L.marker([51.5, -0.09]).addTo(mymap);

var circle = L.circle([51.508, -0.11], {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5,
    radius: 500
}).addTo(mymap);

var polygon = L.polygon([
    [51.509, -0.08],
    [51.503, -0.06],
    [51.51, -0.047]
]).addTo(mymap);

marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();
circle.bindPopup("I am a circle.");
polygon.bindPopup("I am a polygon.");

var popup = L.popup()
    .setLatLng([51.5, -0.09])
    .setContent("I am a standalone popup.")
    .openOn(mymap);

    function onMapClick(e) {
    alert("You clicked the map at " + e.latlng);
}

mymap.on('click', onMapClick);

function onMapClick(e) {
    alert("You clicked the map at " + e.latlng);
}

mymap.on('click', onMapClick);

var popup = L.popup();

function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(mymap);
}

mymap.on('click', onMapClick);


class Breweries{
    constructor(search=false){
        this.CACHE = {}
        if( search ){
            this.input_map = this.getInputs()
            this.URL = this.getURL( this.input_map )
            this.API_Results = this.invokeGet( this.URL )
            console.log("URL: " + this.URL)
            //this.Final = this.
        }
    }

    getInputs( elements_path=".field .user_input" ){ // elements_path="input.user_input", extra="" ){
          // Gets data from all input fields
          // $("form.submit_search_form input.user_input")
        const inp_els = $(elements_path)
        
        const input_map = {}
        inp_els.each( function(index, element){
            const key = element.name
            const val = element.value
            input_map[key] = val
        })
        return(input_map);
    }

    getURL(input_map){
        // Iterates over an object and appends key-value pairs to API URL if valid argument
        //const apiURL = "https://cors-anywhere.herokuapp.com/http://api.openbrewerydb.org/breweries?"
        const apiURL = "https://api.openbrewerydb.org/breweries?per_page=75&"
        const parameters = ["by_city", "by_distance", "by_postal", "page", "by_type", "by_state", "by_name"]

        let newURL = apiURL
        for(let key in input_map){
            if( parameters.includes(key) && input_map[key]!==undefined ){
                let val = input_map[key].replace(" ","%20")
                newURL += `${key}=${val}&`
            }
            else{
                console.log(`${key}=${input_map[key]} - was not a valid key`)
            }
        }
        return(newURL);
    }

    invokeGet(URL){
        $.get(URL, (data) => {this.parseGet(data)} )
    }
    parseGet(raw){
        console.log("Candy? \n",  raw)
        let response = raw // JSON.parse( raw )
        if(response.length<1){
            alert("No matches found for that query. \nPlease try another search")
            return
        }
        else{
            const container = $("div.container-display")
            container.empty()
            for(let item of response){
                if( String(item.id).length<1){
                    continue
                }
                else{
                    setTimeout( () => {
                        this.CACHE[item.id] = item
                        this.makeEntry(item, container) } ,
                    200)
                }
            }
            $(".container-display").css("text-shadow", " inset 15px 14px 2px maroon" )
        }
    }

    makeEntry(obj, parent){
        // Takes an entry from a $.get response and create a card with the data
        // Defaults to appending to the Display container
        const template = {id:"", name:"", city:"", state:"", postal_code:"", brewery_type:"", website_url:"", phone:""}
        for(let item in obj){
            if(item in template && obj[item] !== null){
                template[item] = obj[item]
            }
        }
        // Uses standard structure for displaying elements
        //const $header = $('<div/>', {class: "title", text=template.name})
        parent.append([
            $('<div/>', {class: "brewery-card"}).append(  [     
                $('<div/>', {class: "brewery-header", text:template.name, id:template.id  }),       // Header for top of entry
                $("<br>"),  
                $('<div/>', {class: "details", text:`| Location: ${template.city}, ${template.state}, \n${template.postal_code}`}),      // Span for displaying additional content
                $('<div/>', {class: "details", text:`|  Type: ${template.brewery_type}`} ),  
                (template.phone==="") ? "" : $('<a/>', {class: "details", href:`tel:${template.phone}`, text:`|  Phone Number: ${template.phone}`, target:"_blank"} ) ,  
                $("<br>"),  
                (template.website_url==="") ? "" : $('<a/>', {class: "details", text:`|  Website: ${template.website_url}`, href:template.website_url, target:"_blank"} ) 
            ])  // Closer for div element
        ])  // Closer for parent object
    }
}

class CountryDB{
    constructor(){
        this.URL = $.get("http://www.geonames.org/childrenJSON?geonameId=6252001&callback=listPlaces&style=long&noCacheIE=1619738789140")
        this.STATES = this.GetCountries()
        
    }
}