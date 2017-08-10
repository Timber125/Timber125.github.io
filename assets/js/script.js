/*
*
*		Author: Timber Lefief 
*
*/

 function urlB64ToUint8Array(base64String) {
      const padding = '='.repeat((4 - base64String.length % 4) % 4);
      const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

      const rawData = window.atob(base64);
      const outputArray = new Uint8Array(rawData.length);

      for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
      }
    return outputArray;
}

/*
*
*		Global Variables
*
*/

months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];



/*
*		Initialization
*/

$('document').ready(function(){

	init_forecastheaders();
	init_welcomeDateTime();
	loadClientData();
	navigator.serviceWorker && navigator.serviceWorker.register('serviceworker.js').then(function(registration) {
  		console.log('Serviceworker registrated with scope ', registration.scope);
	});

	navigator.serviceWorker && navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {  
  		serviceWorkerRegistration.pushManager.getSubscription()  
    	.then(function(subscription) {  
     		 if (subscription) {
        		console.info('Got existing', subscription);
        		window.subscription = subscription;
        		return;  // got one, yay
      		}

      		const applicationServerKey = urlB64ToUint8Array("BOoQr9M6XrQptej0Efc6NKKgybdavI3Hp1NHAVwI9InO_JBsm4FHUbqLd-NB66WVh6qp3gyVrBSaTJnj3dXgdqY");
      		serviceWorkerRegistration.pushManager.subscribe({
          		userVisibleOnly: true,
          		applicationServerKey,
      		})
        	.then(function(subscription) { 
          		console.info('Newly subscribed to push!', subscription);
          		window.subscription = subscription;
        	});
    	});
}	);
});

function init_thundermap(){
	$("#precip_type").val(3);
	$("#precip_type")[0].onchange = changeMeteoxType;
	$("#precip_type")[0].style = "cursor: pointer";
	changeMeteoxType();
}


function init_forecastheaders(){

	for(var i = 0; i <= 3; i++){
		$("#day" + i).html(day(i));
		// Test purposes before API
		$("#day" + i + "temp").html("?°? - ?°?");
	}

}

function init_welcomeDateTime(){

	$("#welcome_date").html(date());
	$("#welcome_time").html(time());
}



/*
*
*		Functions regarding Time & Date
*
*/

function date(){
	var d = new Date();
	return months[d.getMonth()]+' '+d.getDate()+' '+d.getFullYear()
}


// For compatibility with openweatherAPI
function firstFromDate(){
	var d = new Date();
    var hours = 3 * (Math.floor(d.getHours() / 3)); 
    var day = d.getDate().toString().length == 1 ? '0' + d.getDate() : d.getDate();
    var month = (parseInt(d.getMonth()) + 1).toString().length == 1 ? '0' + (parseInt(d.getMonth())+1) : (parseInt(d.getMonth())+1) ;
	return d.getFullYear() + "-" + month + "-" + day + "T" + hours + "00:00";
}

function time(){
	var d = new Date(),
    minutes = d.getMinutes().toString().length == 1 ? '0'+d.getMinutes() : d.getMinutes(),
    hours = d.getHours().toString().length == 1 ? '0'+d.getHours() : d.getHours(),
    ampm = d.getHours() >= 12 ? 'pm' : 'am';
	return days[d.getDay()]+' '+hours+':'+minutes+ampm;
}

function today(){
	return day(0);
}

function day(fromnow){
	var d = new Date();
	return days[(d.getDay() + fromnow) % 7];
}



/*
*
*		Functions regarding geographical locations
*
*/

function loadClientData(){
	// gps coords available? -> skip IP
	// denied? -> ip location fallback

	navigator.geolocation.getCurrentPosition(
		function(position){
			var lat = position.coords.latitude;
            var lon = position.coords.longitude; 
            geoparserGPS(lon, lat);

		},
		function(error){
			revealClientIP();
		}

	);

	
}

function revealClientIP(){
	$.ajax({
    	type: "GET",
    	url: "https://jsonip.com/?callback=?",
    	dataType: "json",
    	success: getLocation
   });
}

function handleIp(ip_json){
	getLocation(ip_json.ip);
}

function getLocation(ip){
	clientdata.ip = ip;
	$.ajax({
    	type: "GET",
    	url: "https://api.ipinfodb.com/v3/ip-city/?key=70977c7e2c2d4ef2ee6502ffce6d66156dd6b1ad98ed41f367365fdbf990c6a8&format=json",
    	dataType: "json",
    	success: geoparserIP
   });
}

function geoparserGPS(lon, lat){
	revealClientWeather(lon, lat);
}

function geoparserIP(json){


	updateClientData(json.longitude, json.latitude, json.cityName, json.regionName, json.countryName, json.countryCode, 2)

	revealClientWeather(json.longitude, json.latitude);

}



function updateClientData(lon, lat, city, region, country, countrycode, trust){
	if(trust >= clientdata.trustworthiness){
		clientdata.geolocation.lat = lat;
		clientdata.geolocation.lon = lon;
		clientdata.geolocation.city = city;
		clientdata.geolocation.region = region;
		clientdata.geolocation.country = country;
		clientdata.geolocation.countryCode = countrycode;
		clientdata.geolocation.continent = country_continent[clientdata.geolocation.countryCode];
		clientdata.geolocation.meteoxcontinent = meteoxContinent(clientdata.geolocation.countryCode);
		clientdata.geolocation.culture = "en-GB-mx";	
		if(trust == 1){
			clientdata.geolocation.origin = "GPS";
			clientdata.geolocation.origindesc = "High accuracy";
		}else{
			clientdata.geolocation.origin = "IP";
			clientdata.geolocation.origindesc = "Medium accuracy - please disable proxies.";
		}
		if(clientdata.trustworthiness < 1){
			// if clientdata is set, we can initialize the thundermap.
			init_thundermap();
		}
	}

	clientdata.trustworthiness = trust;
}


/*
*
*
*	Weather functions
*
*/


function revealClientWeather(lon, lat){

	clientdata.lastpoll = new Date();
	
	$.ajax({
    	type: "GET",
    	url: "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=6d8dd0a5831d0506fda8140c8adf9677&mode=xml",
    	dataType: "xml",
    	success: weatherparser
   });
}



function weatherparser(xml){

	var forecasts = xml.getElementsByTagName("time");

	var location = xml.getElementsByTagName("location");
	var lon = location[1].getAttribute("longitude");
	var lat = location[1].getAttribute("latitude");
	var cityName = location[0].getElementsByTagName("name")[0].innerHTML;
	var countryCode = location[0].getElementsByTagName("country")[0].innerHTML;

	updateClientData(lon, lat, cityName, "", countryCode, countryCode, 1);
	weatherdata = {};
	$("#weatherfeed").html("");
	$("#forecastHeader").html("Forecast for " + clientdata.geolocation.city + " " + clientdata.geolocation.region + ", " + clientdata.geolocation.country);
	$("#origin").html("<i class=\"fa fa-info-circle fa-fw\" title=\"" + clientdata.geolocation.origindesc + "\"></i><strong>" + clientdata.geolocation.origin + "-based location</strong>")


	dates = {};
	seq=-1;

	// ensure prediction starts with today
	time.date1 = firstFromDate().split("T")[0];
	seq++;
    dates[time.date1] = {};
    dates[time.date1]["min"] = 1000;
    dates[time.date1]["max"] = -1000;
    dates["day" + seq] = time.date1;
    dates[time.date1]["seq"] = seq;

	for(var i = 0; i < forecasts.length; i++){
		from = forecasts[i].getAttribute("from");
		to = forecasts[i].getAttribute("to");
		time = {}
		time.date1 = from.split("T")[0];
		time.date2 = to.split("T")[0];
		time.from = from.split("T")[1];
		time.to = to.split("T")[1];
		temperature = forecasts[i].getElementsByTagName("temperature")[0];
		symbol = forecasts[i].getElementsByTagName("symbol")[0].getAttribute("var");
		temperature = addCelciusValue(temperature);
		tempint = Math.ceil(temperature.getAttribute("celciusvalue"))
		tablerow = "<tr>" + 
            "<td><i class=\"fa fa-clock-o w3-text-blue w3-large\" onclick=\"meteoxUpdate('"+time.date1 + time.from+"')\" style=\"cursor: pointer\"></i></td>" +
            "<td>" + "<img class=\"weathersymbol\" src=\"https://openweathermap.org/img/w/" + symbol + ".png\" style=\"height:60%;width:auto;\">" +"</td>" +
            "<td>" + time.date1.substr(5).replace("-", "/") + ' ' + time.from.substr(0, 5) + "</td>" +
            "<td>" + forecasts[i].getElementsByTagName("clouds")[0].getAttribute("value") + "</td>" +
            "<td>" + tempint + "° C" + "</td>" +
          "</tr>";
        $("#weatherfeed").append(tablerow);

        if(!(time.date1 in dates)){
        	seq++;
        	dates[time.date1] = {};
        	dates[time.date1]["min"] = 1000;
        	dates[time.date1]["max"] = -1000;
        	dates["day" + seq] = time.date1;
        	dates[time.date1]["seq"] = seq;
        }

        if(tempint > dates[time.date1]["max"]) dates[time.date1]["max"] = tempint;
        if(tempint < dates[time.date1]["min"]) dates[time.date1]["min"] = tempint;



	}

	for(var key in dates){
		if(!(key.substr(0, 3) === "day")){
			d = key.substr(8);
			m = key.substr(5).split("-")[0];
			$("#day" + dates[key]["seq"]).html(day(dates[key]["seq"]) + " " + d + " / " + m)
			$("#day" + dates[key]["seq"] + "temp").html(dates[key]["min"] + "°C - " + dates[key]["max"] + "°C");
		}
	}

	function addCelciusValue(xml_temperature){
		var unit = xml_temperature.getAttribute("unit");
		var value = xml_temperature.getAttribute("value");
		if(unit === ("kelvin")){
			var newvalue = -273.15 + parseInt(value);
			xml_temperature.setAttribute("celciusvalue", newvalue);
			return xml_temperature;
		}
		if(unit === ("fahrenheit")){
			var newvalue = (parseInt(value) - 32) / (9/5);
			xml_temperature.setAttribute("celciusvalue", newvalue);
			return xml_temperature;
		}
		if(unit === ("celcius")){
			xml_temperature.setAttribute("celciusvalue", value);
			return xml_temperature;
		}

		xml_temperature.setAttribute("celciusvalue", "unit " + unit + " not recognized for celcius conversion.");
		return xml_temperature;

	}

}
