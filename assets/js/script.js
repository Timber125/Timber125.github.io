/*
*		Initialization
*/

$('document').ready(function(){

	console.log("ok");
	console.log(date());

	init_welcomeDateTime();
	init_forecastheaders();
	loadClientData();
	//getClientLocation(getClientIP());

});


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
*		Global Variables
*
*/

months = ['Janunary','February','March','April','May','June','July','August','September','October','November','December'];
days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];


/*
*
*		Functions regarding Time & Date
*
*/

function date(){
	var d = new Date();
	return months[d.getMonth()]+' '+d.getDate()+' '+d.getFullYear()
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
	return days[d.getDay() + fromnow];
}



/*
*
*		Functions regarding geographical locations
*
*/

function loadClientData(){
	revealClientIP();
}

function revealClientIP(){
	$.ajax({
    	type: "GET",
    	url: "http://jsonip.com/?callback=?",
    	dataType: "json",
    	success: getLocation
   });
}

function handleIp(ip_json){
	console.log("ip: " + ip_json.ip);
	getLocation(ip_json.ip);
}

function getLocation(ip){
	$.ajax({
    	type: "GET",
    	url: "http://api.ipinfodb.com/v3/ip-city/?key=70977c7e2c2d4ef2ee6502ffce6d66156dd6b1ad98ed41f367365fdbf990c6a8&format=json",
    	dataType: "json",
    	success: geoparser
   });
}

function geoparser(json){
	console.log("lat:" + json.latitude);
	console.log("lon:" + json.longitude);
	console.log("city: " + json.cityName);
	console.log("region: " + json.regionName);
	console.log("country: " + json.countryName);

	$("#forecastHeader").html("Forecast for " + json.cityName + " - " + json.regionName + ", " + json.countryName);

	// parse weather data for this location

	revealClientWeather(json.longitude, json.latitude);
}

function revealClientWeather(lon, lat){
	$.ajax({
    	type: "GET",
    	url: "http://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=6d8dd0a5831d0506fda8140c8adf9677&mode=xml",
    	dataType: "xml",
    	success: weatherparser
   });
}

function weatherparser(xml){
	console.log(xml);

	var forecasts = xml.getElementsByTagName("time");
	console.log(forecasts);

	for(var i = 0; i < forecasts.length; i++){
		console.log(forecasts[i].getAttribute("from") + " - " + forecasts[i].getAttribute("to"));
	}

	/*for(var i = 0; i <= 3; i++){
		$("#day" + i).html(day(i));
		// Test purposes before API
		$("#day" + i + "temp").html("10°C - 23°C");
	}*/

}
