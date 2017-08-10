
	/**
	*
	*	Meteox adapter functions
	*
	**/

	meteoxtype = []
	for(var j = 0; j < 5; j++) {
		meteoxtype[j] = {};
		meteoxtype[j].name;
		meteoxtype[j].ext;
	}

	meteoxtype[0].name = "Temperature";
	meteoxtype[0].ext = ".temp.press";
	meteoxtype[1].name = "Rain";
	meteoxtype[1].ext = ".precip";
	meteoxtype[2].name = "Wind";
	meteoxtype[2].ext = ".wind.press.arrow";
	meteoxtype[3].name = "Lightning";
	meteoxtype[3].ext = ".li";
	meteoxtype[4].name = "Clouds";
	meteoxtype[4].ext = ".cld";
	
    meteoxtime = meteoxdate();

	function meteoxtype(i){
		return tolower(meteoxtype[i].name + meteoxtype[i]["ext"]);
	}

	function changeMeteoxType(){
		var type = document.getElementById("precip_type").value;
		console.log("type => " + type);
		$("#precip_type").val(type);
		var imgUrl = "https://www.niederschlagsradar.de/images.aspx?jaar=-6&type=" + clientdata.geolocation.meteoxcontinent + meteoxtype[type]["ext"] + "&datum=" + meteoxtime + "&cultuur=" + clientdata.geolocation.culture + "&continent=" + clientdata.geolocation.meteoxcontinent;
		
		var myInit = { 
			   method: 'GET',
               headers: new Headers(),
               mode: 'cors',
               cache: 'default' 
           };

		var myImage = document.querySelector('img');

		var idk = fetch(imgUrl, myInit).then(function(response) {
  			console.log("response");
  			console.log(response);
  			return response;
		});


		console.log(imgUrl);
		console.log(idk);

		$("#precipationmap").attr("src", imgUrl)
	}
	function meteoxUpdate(time){
		console.log("UPDATE FOR " + time);
		var id = "";
		id = time.split(":")[0] + time.split(":")[1];
		id = id.replace(/\//g,"");
		id = id.replace(/ /g, "");
		id = id.replace(/-/g, "");
		id = id.replace(/:/g, "");
		console.log(id);
		meteoxtime = id;
		changeMeteoxType();
	}

	function meteoxdate(){
		var d = new Date();
    	var hours = 3 * (Math.floor(d.getHours() / 3)); 
    	var day = d.getDate().toString().length == 1 ? '0' + d.getDate() : d.getDate();
    	var month = (parseInt(d.getMonth()) + 1).toString().length == 1 ? '0' + (parseInt(d.getMonth())+1) : (parseInt(d.getMonth())+1) ;
		return d.getFullYear() + month + day + hours + "00";
	}

	function time(){
		
		return d.getDay()+' '+hours+':'+minutes+ampm;
	}

	function meteoxContinent(countrycode){
		switch(country_continent[countrycode]){
			case("Europe"): return "europa";
			case("Asia"): return "azie";
			case("Africa"): return "afrika";
			case("North America"): return "nam";
			case("South America"): return "sam";
			case("Australia"): return "oceanie";
			case("Anctarctica"): return "oceanie";
			default: return "???";
		}
	}