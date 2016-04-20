(function ($) {

    initializeMap = {

        init: function ($mapEl) {

            var self = this;
            navigator.geolocation.getCurrentPosition(function mapResult (position) {

                var location = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                // var location = new google.maps.LatLng('37.7060954','-122.0889962');

                self.map = new google.maps.Map($mapEl, {
                    mapTypeId: google.maps.MapTypeId.ROADMAP,
                    center:    location,
                    zoom:      12
                });

                 $.when(
                    searchPlaceMap('hospital', self.map, $("#hospitals tbody"), location),
                    searchPlaceMap('police', self.map, $("#police tbody"), location),
                    searchPlaceMap('fire_station', self.map, $("#fire tbody"), location)
                ).done();
            }, function (error) {
                alert('code: '    + error.code    + '\n' +
                    'message: ' + error.message + '\n');
            }, 
            {enableHighAccuracy: true}
            );


        }
    };

    var iconUri = 'http://merl.us/cdn/neosafety/icons/';
    var mapIcons = {
        hospital: iconUri + 'MapHospital.png',
        police: iconUri + 'MapPolice.png',
        fire_station: iconUri + 'MapFirefighter.png'
    };


    function searchPlaceMap (placeType, map, $tableTbody, location) {

        $($tableTbody).empty();

        /*verify location to search,
         *search radius
         *(alternately you can also search by setting bounds),
         *and type of places to search - in this case `hospital`
         */
        var request = {
            location: location,
            radius:   2400,
            type:     placeType,
            name:     placeType
        };

        var infowindow = new google.maps.InfoWindow();

        var service = new google.maps.places.PlacesService(map);

        var searchDeferred = $.Deferred();

        service.nearbySearch(request, function (searchResults, searchStatus) {

            if (searchStatus == google.maps.places.PlacesServiceStatus.OK) {

                var itemPromises = [];

                var totalResults = (searchResults.length > 4) ? 4 : searchResults.length;

                for (var i = 0; i < totalResults; i++) {
                    var searchResult = searchResults[i];
                    itemPromises.push(getDetailPromise(searchResult));
                }

                $.when.apply(this, itemPromises)
                    .then(searchDeferred.resolve);

                function getDetail(searchResult, detailResolve) {
                    askForDetail(searchResult, detailResolve);
                }

                function askForDetail(searchItem, resolve) {
                    setTimeout(function() {
                        service.getDetails(searchItem, function(detailResult, detailStatus) {

                            if (detailStatus == google.maps.places.PlacesServiceStatus.OK) {

                                createMarker(detailResult);
                                addToList(detailResult);
                                resolve();
                            } else if (detailStatus == google.maps.places.PlacesServiceStatus.OVER_QUERY_LIMIT) {
                                askForDetail(searchItem, resolve);
                            }

                        });

                    },200);

                }

                function getDetailPromise(searchResult) {
                    var deferred = $.Deferred();
                    deferred.done(getDetail(searchResult, deferred.resolve));
                    return deferred;
                }

            } else {
                searchDeferred.reject('search status not ok: ' + searchStatus);
            }
        });

        function addToList(place) {
      			var numbers = place.formatted_phone_number;
      			if (numbers === undefined)
      			{
      				numbers = "";
      			}
            $tableTbody.append($("<tr>\n")
                .append("<td>"+place.name+"</td>\n")
                .append("<td>"+place.formatted_address+"</td>\n")
                .append("<td class='phonecell'>"+ numbers +"</td>\n")
                .append("</tr>"));
            //$("#test").html("formatted_phone_number");
        }

        function createMarker(place) {

            console.log(place.icon);
            var placeLoc = place.geometry.location;
            var image = {
                url: mapIcons[placeType], // place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25)
            };
            var marker = new google.maps.Marker({
                map: map,
                icon: image,
                position: placeLoc
            });

            google.maps.event.addListener(marker, 'click', function () {
                infowindow.setContent(place.name);
                infowindow.open(map, this);
            });
        }

        return searchDeferred.promise();
    }


    $(document).on('pageshow', '#emergServ', function (e, data) {

        setTimeout(function () {
            toggleInvertClass($("#emergServ-footer"));

            initializeMap.init(document.getElementById('map-hospitals'));

        }, 100);


    });

})($);

