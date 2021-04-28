// Create a Dropzone object
// Capture path and store data of file locally

// Use Pantry ( https://getpantry.cloud/apiv1/pantry/809cff74-8863-45df-a7b8-44641613bcf8/basket/testBasket )
// Use that to create and store variables from GoFile

// Submit another Post request to Pantry with update object
// {fileName:[path, apiKey, ID]}


/*
$(document).ready(function(){
    $(".submit_search").click( (e) => {
            console.log(e)
        alert("SDFGSWRFG") })
    })
    \
*/

//$( "form" ).submit( ( event ) => {console.log(event) })
/*
$(document).ready( () => {
    const brew_types = ["micro", "nano", "regional", "brewpub", "large", "planning", "bar", "contract", "proprietor", "closed"]        
    for(let item of brew_types){
        let $option = $("<option>", {value:item, text:item} ) ;
        $("select.user_input").append( $option );
    }
    
} )
/*
$(document).ready(function(){
    $("form").submit(function(e){
        
        const inst =  new Breweries}
        e.preventDefault()
    });
}); */


function Callback(e){
    const inst =  new Breweries(true)
    e.preventDefault()
}

$(".submit_search_form").keypress( function(e){
    if(e.which===13){
        $(".submit_action").click()
        return false;
    }
} )


class Breweries{
    constructor(search=false){
        this.CACHE = {}
        if( search ){
            this.input_map = this.getInputs()
            this.URL = this.getURL( this.input_map )
            this.API_Results = this.invokeGet( this.URL )
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
        const apiURL = "https://api.openbrewerydb.org/breweries?"
        const types = ["micro", "nano", "regional", "brewpub", "large", "planning", "bar", "contract", "proprietor", "closed"]
        const parameters = ["by_city", "by_distance", "by_postal", "page", "by_type", "by_state" ]

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
                $('<div/>', {class: "details", text:`| Location: ${template.city}, ${template.state}, \n${template.postal_code}`}),      // Span for displaying additional content
                $('<div/>', {class: "details", text:`|  Type: ${template.brewery_type}`} ),  
                (template.phone==="") ? "" : $('<div/>', {class: "details", text:`|  Phone Number: ${template.phone}`} ) ,      
                (template.website_url==="") ? "" : $('<a/>', {class: "details", text:`|  Website: ${template.website_url}`, href:template.website_url, target:"_blank"} ) 
            ])  // Closer for div element
        ])  // Closer for parent object
    }
}