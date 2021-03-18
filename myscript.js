var departurecode = "";
var arrivalcode = "";
var inbounddate = "";
var outbounddate = "";
var currency = "";
var sorted_cheapest_to_expensive = true;
// Initialized variables and necessary fields for later.
var apilink =
  "https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browsedates/v1.0/US/";

//These data structures will hold information from the quotes.
var quotes = [];
var json_response = null;
var carrier_dict = {};

//This is where the results will be displayed (inside a div that I called holder).
var ul = document.getElementById("holder");

//Clears data structure data.
function clearData() {
  quotes = [];
  json_response = null;
  carrier_dict = {};
}

//This method gets the inputted information from the user, and checks that the input is valid. It then updates all the fields,
//and calls getQuote(), which calls the API.
function getFields() {
  clearData();

  departurecode = document.getElementById("depaprt").value;
  arrivalcode = document.getElementById("arraprt").value;
  outbounddate = document.getElementById("depdate").value;
  inbounddate = document.getElementById("arrdate").value;
  currency = document.getElementById("curr").value;
  if (
    departurecode === "" ||
    arrivalcode === "" ||
    outbounddate === "" ||
    currency === ""
  ) {
    document.getElementById("title").innerHTML = "Please fill out all fields!";
  } else {
    document.getElementById("title").innerHTML =
      "Fetching Prices for " + departurecode + " to " + arrivalcode;
    //
    getQuote();
  }
}

//GetQuote() creates a link that calls the API to get the prices. Once it gets them, it parses important data into the data structures.
function getQuote() {
  console.log(
    apilink +
      currency +
      "/en-US/" +
      departurecode +
      "-sky/" +
      arrivalcode +
      "-sky/" +
      outbounddate +
      "?inboundpartialdate=" +
      inbounddate
  );
  const data = null;
  const xhr = new XMLHttpRequest();
  xhr.withCredentials = true;

  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === this.DONE) {
      json_response = JSON.parse(this.responseText);
      // The response is converted into a JSON Object, which makes it easier to manipulate quote data.
      // A carrier dictionary is used to map carrier Id's to their respective airline names.
      for (var key in json_response.Carriers) {
        carrier_dict[json_response.Carriers[key]["CarrierId"]] =
          json_response.Carriers[key]["Name"];
      }
      // The quotes list holds all of our quotes, including the prices for all available flights.
      for (var key2 in json_response.Quotes) {
        quotes.push(json_response.Quotes[key2]);
      }
      // Display Quotes is then called, which displays the results to the user.
      displayQuotes();
    }
  });

  xhr.open(
    "GET",
    apilink +
      currency +
      "/en-US/" +
      departurecode +
      "-sky/" +
      arrivalcode +
      "-sky/" +
      outbounddate +
      "?inboundpartialdate=" +
      inbounddate
  );

  xhr.setRequestHeader(
    "x-rapidapi-key",
    "d0bcb5cfb9mshaa1d18dc85382f2p1f8834jsn684f69910081"
  );
  xhr.setRequestHeader(
    "x-rapidapi-host",
    "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com"
  );

  xhr.send(data);
}

//The following five functions deal with the bonus deliverable. If the user hits the dropdown "Sort By" button, it toggles the sorting
//of quotes in the order they specified. It then re-displays the quotes.

function showSortingOptions() {
  document.getElementById("myDropdown").classList.toggle("show");
}

function sortQuotesAscending() {
  quotes.sort(function (a, b) {
    return a.MinPrice - b.MinPrice;
  });
}
function sortQuotesDescending() {
  quotes.sort(function (a, b) {
    return b.MinPrice - a.MinPrice;
  });
}

function mostExpensive() {
  sorted_cheapest_to_expensive = false;
  sortQuotesDescending();
  displayQuotes();
  showSortingOptions();
}
function leastExpensive() {
  sorted_cheapest_to_expensive = true;
  sortQuotesAscending();
  displayQuotes();
  showSortingOptions();
}

// This goes through our quotes and determines the cheapest quote, and highlights that quote in green so the user can easily tell it is cheapest.
// It also uses the earlier created carrier dictionary to match each flight with its airliner name, and it uses the quote list to match each flight
// with its actual cost. Every quote is loaded onto a div which is basically like a tile. Each tile is then added to the div 'holder' which shows 
// the results to the user.

function displayQuotes() {
  ul.innerHTML = "";
  for (var i = 0; i < quotes.length; i++) {
    var myString = "";
    var li = document.createElement("div");
    li.style.color = "Black";
    if (i === 0 && sorted_cheapest_to_expensive) {
      // case of the cheapest option being at the top (when we sort cheapest to most expensive)
      myString += "Cheapest Option<br>";
      li.style.color = "Green";
    } else if (i === quotes.length - 1 && !sorted_cheapest_to_expensive) {
      //case of the cheapest option being at the bottom (when we sort most expensive to cheapest)
      myString += "Cheapest Option<br>";
      li.style.color = "Green";
    }
    var carrier = carrier_dict[quotes[i].OutboundLeg.CarrierIds[0]];
    var cost = quotes[i].MinPrice;
    myString += cost + " " + currency + " - " + carrier + "<br>";
    var pan = document.createElement("div");
    pan.className = "panel panel-default";
    li.className = "panel-body";
    li.innerHTML = myString;

    pan.append(li);
    ul.append(pan);
  }
}
