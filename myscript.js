var departurecode = "";
var arrivalcode = "";
var inbounddate = "";
var outbounddate = "";
var currency = "";
var sorted_cheapest_to_expensive = true;

var apilink =
  "https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browsedates/v1.0/US/";

var quotes = [];
var json_response = null;
var carrier_dict = {};

var ul = document.getElementById("holder");

function clearData() {
  quotes = [];
  json_response = null;
  carrier_dict = {};
}

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
      //
      for (var key in json_response.Carriers) {
        carrier_dict[json_response.Carriers[key]["CarrierId"]] =
          json_response.Carriers[key]["Name"];
      }

      for (var key2 in json_response.Quotes) {
        quotes.push(json_response.Quotes[key2]);
      }

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

function displayQuotes() {
  ul.innerHTML = "";
  for (var i = 0; i < quotes.length; i++) {
    var myString = "";
    var li = document.createElement("div");
    li.style.color = "Black";
    if (i === 0 && sorted_cheapest_to_expensive) {
      // case of the cheapest option being at the top
      myString += "Cheapest Option<br>";
      li.style.color = "Green";
    } else if (i === quotes.length - 1 && !sorted_cheapest_to_expensive) {
      //case of the cheapest option being at the bottom
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
