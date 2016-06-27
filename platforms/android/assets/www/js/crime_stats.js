(function () {

    initializeCrimeStats = {

        init: function (geocompleteLatitude, geocompleteLongitude) {
			if (geocompleteLatitude == undefined) {

				app.locationService.getCurrentPosition(crimeResult, showError, {
					enableHighAccuracy: true,
					timeout: 2000
				});
			}
			else
			{
				var searched_position = {
					coords: {
						longitude: geocompleteLongitude,
						latitude: geocompleteLatitude
					}
				};
				crimeResult(searched_position, "searched");
			}
		}


	};


function crimeResult (position, searched) {
				var murder = ["'09A'", "'09B'", "'09C'"];
				var theft = ["'120'", "'220'", "'23D'", "'23F'", "'23G'", "'23H'", "'240'", "'280'", "'BURGLARY'", "'LARCENY/THEFT'", "'ROBBERY'", "'STOLEN PROPERTY'", "'VEICHLE THEFT'"];
				var subAbuse = ["'35A'", "'35B'", "'90D'", "'90E'", "'90G'", "'DRIVING UNDER THE INFLUENCE'", "'DRUG/NARCOTIC'", "'DRUNKENNESS'", "'LIQUOR LAWS'"];
				var assault = ["'13A'", "'13B'", "'13C'",  "'ASSAULT'"];
				var sexual = ["'11A'", "'11B'", "'11C'", "'11D'", "'90H'", "'SEX OFFENSES, FORCIBLE'", "'SEX OFFENSES, NON FORCIBLE'"];
				var other = ["'100'", "'290'", "'40A'", "'40B'", "'90B'", "'90C'", "'90J'", "'520'", "'DISORDERLY CONDUCT'", "'KIDNAPPING'", "'LOITERING'", "'OTHER OFFENSES'", "'PROSTITUTION'", "'SUSPICIOUS OCC'", "'TRESPASSING'", "'VANDALISM'", "'WEAPON LAWS'"];
				var crimeCodesQuery = murder + "," + theft + "," + subAbuse + "," + assault + "," + sexual + "," + other;
					
				var murderCount = 0;
				var theftCount = 0;
				var subAbuseCount = 0;
				var assaultCount = 0;
				var sexualCount = 0;
				var otherCount = 0;
								
				
				var radius = Number(localStorage.getItem('radius'))* 1600;
				var timespan = localStorage.getItem('timespan');
				var date = new Date();
				date.setMonth(date.getMonth() - Number(timespan));
				// .418Z
				var iso = date.toISOString();
				var asOf = iso.substring(0, iso.length - 5);


				var latitude = position.coords.latitude;
				var longitude = position.coords.longitude;
				

				var latlng = {lat: latitude, lng: longitude};
				var geocoder = new google.maps.Geocoder;
				var county;

				var alamedaCounty = 'Alameda County';
				var sanFranCounty = 'San Francisco County';

				geocoder.geocode({'location': latlng}, function(results, status) {
					if (results[1]) {
	
						county = findCounty(results[1].address_components);

						if (county === alamedaCounty || county === sanFranCounty) {

							var url = "";

							if (county == sanFranCounty)
							{
								url =
									'https://data.sfgov.org/resource/cuks-n6tp.json?$where=within_circle(location, '  +
									latitude +
									',' +
									longitude +
									','+
									radius+
									') AND category IN (' +
									crimeCodesQuery +
									") AND date > '" +
									asOf +
									"'&$group=category&$select=category,count(*)";
							}
							else if (county == alamedaCounty)
							{
								url =
									'https://data.acgov.org/resource/js8f-yfqf.json?$where=within_circle(location_1, ' +
									latitude +
									',' +
									longitude +
									"," +
									radius +
									") AND crimecode IN (" +
									crimeCodesQuery +
									") AND datetime > '" +
									asOf +
									"'&$group=crimecode&$select=crimecode,count(*)";
							}

							$.ajax({
								type: 'GET',
								url: url,
								contentType: "application/json",
								jsonp: '$jsonp',
								dataType: 'jsonp',
								success: function (json) {

									if (json) {

										$.each(json, function(i, crimes){

											var crimeCode;
											if(county == alamedaCounty) {
												crimeCode = crimes.crimecode;
											}
											else if(county == sanFranCounty)
											{
												crimeCode = crimes.category;
											}
											crimeCode = "'" + crimeCode + "'";
											var crimeCount = parseInt(crimes.count);
											if ($.inArray(crimeCode, murder) > -1)
											{
												murderCount += crimeCount;
											}
											if ($.inArray(crimeCode, theft) > -1)
											{
												theftCount += crimeCount;
											}
											if ($.inArray(crimeCode, subAbuse) > -1)
											{
												subAbuseCount += crimeCount;
											}
											if ($.inArray(crimeCode, assault) > -1)
											{
												assaultCount += crimeCount;
											}
											if ($.inArray(crimeCode, sexual) > -1)
											{
												sexualCount += crimeCount;
											}
											if ($.inArray(crimeCode, other) > -1)
											{
												otherCount += crimeCount;
											}
										});

										var crimeStatsData;
										if(county != sanFranCounty) {
											crimeStatsData = [[murderCount + ' Murders', murderCount],
												[theftCount+ ' Thefts',theftCount],
												[subAbuseCount+ ' Drug/Alcohol Cases',subAbuseCount],
												[assaultCount+ ' Assaults',assaultCount],
												[sexualCount+ ' Sexual Assaults',sexualCount],
												[otherCount+ ' Uncategorized Crimes',otherCount]];
										}
										else {
											crimeStatsData =
												[[theftCount + ' Thefts', theftCount],
													[subAbuseCount + ' Drug/Alcohol Cases', subAbuseCount],
													[assaultCount + ' Assaults', assaultCount],
													[sexualCount + ' Sexual Assaults', sexualCount],
													[otherCount + ' Uncategorized Crimes', otherCount]];
										}
										if (searched == undefined) {
											plotCrimeStats(crimeStatsData, "current-location-crime-chart");
										}
										else
										{
											plotCrimeStats(crimeStatsData, "search-location-crime-chart");

										}
										// plotCrimeStats(crimeStatsData);
									}
								}
							});

						} else {
							wrongLocation();// sorry no results for your county
						}

					} else {
						wrongLocation();// sorry no results for your location
					}


				})
			}

    function plotCrimeStats(data, elementId) {
		// TODO replace #crime-chart with variable like in rating
		statsHideLoader();
		$("#current-location-crime-chart").empty();
		$("#search-location-crime-chart").empty();
		$.jqplot.config.enablePlugins = true;

			var plot1 = $.jqplot(elementId, [data], {
		        gridPadding: {
		        	top: 0,
		        	bottom: 0,
		        	left: 0,
		        	right: 0
		        },

		        // gridDimensions: {
		        // 	height: 350,
		        // 	width: 236
		        // },

		        seriesDefaults: {
		        	marginTop: 0,
		            renderer:$.jqplot.PieRenderer,
		            rendererOptions: { padding: 30, showDataLabels: true, diameter: 200 },
		            seriesColors: [ "grey", "lightgrey", "#285727", "black", "#FED631", "#58B659", "white"]
		        },

		        legend: {
		            show:true, 
		            rendererOptions: { numberRows: 6 },
		            location:'s',
		            marginTop: 0
		        },  

		        grid: {
                 	background: 'transparent',
                 	borderColor: 'transparent', shadow: false, drawBorder: true
             	}    
		    });
			hideLoader(); 

    	
    }

	var radius = localStorage.getItem("radius");
	var timespan = localStorage.getItem("timespan");

	var currentRadiusDropdown = $('#select-native-11');
	var searchRadiusDropdown = $('#select-native-11-search');
	var currentTimespanDropdown = $('#select-native-12');
	var searchTimespanDropdown = $('#select-native-12-search');


	function dropdownAction(foo, bar) {
		if (radius === null) {
			localStorage.setItem('radius', '2');

			foo.val('2');
			foo.selectmenu('refresh');

		} else {
			foo.val(radius);
			foo.selectmenu('refresh');

		}

		if (timespan === null) {
			localStorage.setItem('timespan', '6');

			bar.val('6');
			bar.selectmenu('refresh');

		} else {
			bar.val(timespan);
			bar.selectmenu('refresh');

		}
	}

	$(".current-tab-stats").on("click", function () {
		dropdownAction(currentRadiusDropdown, currentTimespanDropdown);

	});
	$(".search-tab-stats").on("click", function () {
		dropdownAction(searchRadiusDropdown, searchTimespanDropdown);

	});


	$(document).on('pageshow', '#crimeStats', function (e, data) {
		clearError();
		statsShowLoader();
        setTimeout(function () {
			var latitude, longitude;

			$("#geocomplete-crimestats").geocomplete()
				.bind("geocode:result", function(event, result){
					latitude = result.geometry.location.lat();
					longitude = result.geometry.location.lng();
					initializeCrimeStats.init(latitude, longitude);
				})
				.bind("geocode:error", function(event, status){
					alert("ERROR: " + status);
				});


        	toggleInvertClass($("#crimeStats-footer"));

            initializeCrimeStats.init();

			currentRadiusDropdown.on('change', function () {
				statsShowLoader();
				localStorage.setItem('radius', $(this).val());
				initializeCrimeStats.init();
			});

			currentTimespanDropdown.on('change', function () {
				statsShowLoader();
				localStorage.setItem('timespan', $(this).val());
				initializeCrimeStats.init();
			});

			searchRadiusDropdown.on('change', function () {
				statsShowLoader();
				localStorage.setItem('radius', $(this).val());
				initializeCrimeStats.init(latitude, longitude);
			});

			searchTimespanDropdown.on('change', function () {
				statsShowLoader();
				localStorage.setItem('timespan', $(this).val());
				initializeCrimeStats.init(latitude, longitude);
			});

        }, 100);


    });

})($);
