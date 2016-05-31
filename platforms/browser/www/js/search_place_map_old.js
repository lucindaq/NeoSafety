(function () {

    SearchPlaceMap = {

        init: function (placeType, $mapEl, $tableTbody) {

            var self = this;

            navigator.geolocation.getCurrentPosition(function mapResult (position) {

                var location = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

                self.map = new google.maps.Map($mapEl, {
                    mapTypeId: google.maps.MapTypeId.ROADMAP,
                    center: location,
                    zoom: 12
                });

                /*verify location to search,
                 *search radius
                 *(alternately you can also search by setting bounds),
                 *and type of places to search - in this case `hospital`
                 */
                var request = {
                    location: location,
                    radius: 2400,
                    type: placeType,
                    name: placeType
                };

                self.infowindow = new google.maps.InfoWindow();

                var service = new google.maps.places.PlacesService(self.map);

                service.nearbySearch(request, function (results, status) {

                    if (status == google.maps.places.PlacesServiceStatus.OK) {

                        var totalResults = (results.length > 4) ? 4 : results.length;
                        for (var i = 0; i < totalResults; i++) {

                            service.getDetails(results[i], function(result, status) {

                                if (status == google.maps.places.PlacesServiceStatus.OK) {

                                    self.createMarker(result);
                                    self.addToList(result, $tableTbody)
                                }

                            });

                        }
                    }
                });

            }, function (error) {
                alert('code: '    + error.code    + '\n' +
                    'message: ' + error.message + '\n');
            });

        },

        addToList: function (place, tableTbody) {
            $(tableTbody).append($("<tr>\n")
                .append("<td>"+place.name+"</td>\n")
                .append("<td>"+place.formatted_address+"</td>\n")
                .append("<td>"+place.formatted_phone_number+"</td>\n")
                .append("</tr>"));
        },

        createMarker: function (place) {
            var self = this;
            var placeLoc = place.geometry.location;
            var marker = new google.maps.Marker({
                map: self.map,
                position: placeLoc
            });

            google.maps.event.addListener(marker, 'click', function () {
                self.infowindow.setContent(place.name);
                self.infowindow.open(self.map, this);
            });
        }
    };

    $(document).on('pageshow', '#emergServ', function (e, data) {

        setTimeout(function () {
            SearchPlaceMap.init('hospital', document.getElementById('map-hospitals'), $("#hospitals tbody"));
            SearchPlaceMap.init('police', document.getElementById('map-hospitals'), $("#police tbody"));
            SearchPlaceMap.init('fire_station', document.getElementById('map-hospitals'), $("#fire tbody"));
        }, 100);
    });



})($);