(function ($) {

    initializeReport = {

        init: function ($mapEl) {

//moved variable 'self' to mapResult function
            navigator.geolocation.getCurrentPosition(mapResult, showError, {enableHighAccuracy: true});
        }
    };

    var iconUri = 'http://merl.us/cdn/howsafe/icons/';
    var mapIcons = {
        police: iconUri + 'police.png'
    };


function mapResult (position) {
                var self = this;
                var location = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

                self.map = new google.maps.Map($mapEl, {
                    mapTypeId: google.maps.MapTypeId.ROADMAP,
                    center:    location,
                    zoom:      12
                });

                $.when(searchPlaceMap('police', self.map, $("#report-table tbody"), location))
                  .done();

            }

    function searchPlaceMap (placeType, map, $tableTbody, location) {

        $($tableTbody).empty();

        /*verify location to search,
         *search radius
         *(alternately you can also search by setting bounds),
         *and type of places to search - in this case `hospital`
         */
        var request = {
            location: location,
            radius:   6000,
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
                rejectSearch('search status not ok: ' + searchStatus);
            }
        });

        function addToList(place) {
			var numbers = place.formatted_phone_number;
			if (numbers != undefined)
			{
				$tableTbody.append($("<tr>\n")
                .append("<td>"+"<img src='http://merl.us/cdn/neosafety/icons/MapPolice.png'/> &nbsp; &nbsp;" +place.name+"</td>\n")
                //.append("<td>"+place.formatted_address+"</td>\n")
                .append("<td class='phonecell'>"+ numbers +"</td>\n")
                .append("</tr>"));
			}
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


    $(document).on('pageshow', '#report', function (e, data) {

        setTimeout(function () {
            toggleInvertClass($("#report-footer"));
            initializeReport.init(document.getElementById('map-police'));

        }, 100);

        
    });

})($);

