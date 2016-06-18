(function () {

    initializeCrimeStats = {

        init: function () {

            app.locationService.getCurrentPosition(crimeResult, showError, {enableHighAccuracy: true, timeout: 2000});

		}


	};


function crimeResult (position) {
				var murder = ["'09A'", "'09B'", "'09C'", "'MURDER %26 NON-NEGL%2E MANSLAUGHTE'"];
				var theft = ["'120'", "'220'", "'23D'", "'23F'", "'23G'", "'23H'", "'240'", "'280'", "'BURGLARY'", "'LARCENY/THEFT'", "'ROBBERY'", "'STOLEN PROPERTY'", "'VEHICLE THEFT'", "'GRAND LARCENY'", "'GRAND LARCENY OF MOTOR VEHICLE'"];
				var subAbuse = ["'35A'", "'35B'", "'90D'", "'90E'", "'90G'", "'DRIVING UNDER THE INFLUENCE'", "'DRUG/NARCOTIC'", "'DRUNKENNESS'", "'LIQUOR LAWS'"];
				var assault = ["'13A'", "'13B'", "'13C'",  "'ASSAULT'", "'FELONY ASSAULT'"];
				var sexual = ["'11A'", "'11B'", "'11C'", "'11D'", "'90H'", "'SEX OFFENSES, FORCIBLE'", "'SEX OFFENSES, NON FORCIBLE'", "'RAPE'"];
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
        var newYorkCity = 'New York';

				geocoder.geocode({'location': latlng}, function(results, status) {
					if (results[1]) {

						county = findCounty(results[1].address_components);

						if (county === alamedaCounty || county === sanFranCounty || county === newYorkCity) {

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
              else if (county == newYorkCity)
              {
                url =
                  'https://data.cityofnewyork.us/resource/e4qk-cpnv.json?$where=within_circle(location_1, ' +
                  latitude +
                  ',' +
                  longitude +
                  "," +
                  radius +
                  ") AND offense IN (" +
                  crimeCodesQuery +
                  ") AND occurrence_date > '" +
                  asOf +
                  "'&$group=offense&$select=offense,count(*)";
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
                      else if(county == newYorkCity)
                      {
                        crimeCode = crimes.offense;
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
										if(county != sanFranCounty && county == alamedaCounty) {
											crimeStatsData = [[murderCount + ' Murders', murderCount],
												[theftCount+ ' Thefts',theftCount],
												[subAbuseCount+ ' Drug/Alcohol Cases',subAbuseCount],
												[assaultCount+ ' Assaults',assaultCount],
												[sexualCount+ ' Sexual Assaults',sexualCount],
												[otherCount+ ' Uncategorized Crimes',otherCount]];
										}
                    else if(county != sanFranCounty && county == newYorkCity) {
                      crimeStatsData = [[murderCount + ' Murders', murderCount],
                        [theftCount+ ' Thefts',theftCount],
                        [assaultCount+ ' Assaults',assaultCount],
                        [sexualCount+ ' Sexual Assaults',sexualCount]];
                    }
										else {
											crimeStatsData =
												[[theftCount + ' Thefts', theftCount],
													[subAbuseCount + ' Drug/Alcohol Cases', subAbuseCount],
													[assaultCount + ' Assaults', assaultCount],
													[sexualCount + ' Sexual Assaults', sexualCount],
													[otherCount + ' Uncategorized Crimes', otherCount]];
										}

										plotCrimeStats(crimeStatsData);
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

    function plotCrimeStats(data) {
		$("#crime-chart").empty();
		$.jqplot.config.enablePlugins = true;

			var plot1 = $.jqplot('crime-chart', [data], {
		        gridPadding: {
		        	top: 0,
		        	bottom: 10,
		        	left: 10,
		        	right: 10
		        },

		        gridDimensions: {
		        	height: 350,
		        	width: 236
		        },

		        seriesDefaults: {
		        	marginTop: 0,
		            renderer:$.jqplot.PieRenderer,
		            rendererOptions: { padding: 0, showDataLabels: true, diameter: 200 },
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


    $(document).on('pageshow', '#crimeStats', function (e, data) {
		clearError();
        setTimeout(function () {
            hideLoader();

			var radius = localStorage.getItem("radius");
			var timespan = localStorage.getItem("timespan");

			if (radius === null) {
				localStorage.setItem('radius', '2')

				$('#select-native-11').val('2');
				$('#select-native-11').selectmenu('refresh');

			} else {
				$('#select-native-11').val(radius);
				$('#select-native-11').selectmenu('refresh');

			}

			if (timespan === null) {
				localStorage.setItem('timespan', '6')

				$('#select-native-12').val('6');
				$('#select-native-12').selectmenu('refresh');

			} else {
				$('#select-native-12').val(timespan);
				$('#select-native-12').selectmenu('refresh');

			}

        	toggleInvertClass($("#crimeStats-footer"));
            initializeCrimeStats.init();


        }, 100);


        // function submitConfigurations() {
        // 	$('#crime-chart').empty();
        //     initializeCrimeStats.init();
        // }

		$('#select-native-11').on('change', function () {
			localStorage.setItem('radius', $(this).val());
            initializeCrimeStats.init();

		})

		$('#select-native-12').on('change', function () {
			localStorage.setItem('timespan', $(this).val());
            initializeCrimeStats.init();

		})
    });

})($);
