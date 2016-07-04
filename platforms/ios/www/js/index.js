/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */


var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        initNativeGeolocation();
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');
//        navigator.splashscreen.hide();

        console.log('Received Event: ' + id);
    },

    callAnotherPage: function(url) {
        window.location = url;
    }

};

// BEFORE the deviceready event has fired:

// Check if HTML5 location support exists
app.geolocation = false;
if(navigator.geolocation) {
    app.geolocation = navigator.geolocation;
}

function initNativeGeolocation() {
    // AFTER the deviceready event:

    if(app.geolocation) {
        app.locationService = app.geolocation; // native HTML5 geolocation
    }
    else {
        app.locationService = navigator.geolocation; // cordova geolocation plugin
    }
}


$(document).ready(function(){
    if(localStorage.getItem("gender") == undefined || localStorage.getItem("age") == undefined)
    {
        $("#go-button").attr("href", "#profile");
    }
    $("#go-button").on("click", function() {
        $("[data-role=footer]").toolbar();

    });

    window.location.hash = 'home';
    $.mobile.initializePage();

    $(".search-tab").on('click', function () {
        if (!$('#geocomplete').val().length){
            $("#search-safety-gauge").hide();
        }
    });
    $(".search-tab-stats").on('click', function () {

        $('#search-location-crime-chart').show();

        if (!$('#geocomplete-crimestats').val().length){
            $("#stats-dropdowns").hide();
        }
    });

    $(".current-tab").on('click', function (){
        refreshRating();
        $('#current-safety-gauge').show();
    });
    $(".current-tab-stats").on('click', refreshStats);
});

function refreshRating() {
    ratingShowLoader();
    initializeRating.init();
}
function refreshStats() {
    statsShowLoader();
    initializeCrimeStats.init();
}


function toggleInvertClass(element) {
    $(".custom-logo").removeClass("inverted");
    if (element != undefined) {
        $(element).addClass("inverted");
    }   
}

function findCounty(addressComponents) {

    var alamedaCounty = 'Alameda County';
    var sanFranCounty = 'San Francisco County';
    var county;

    county = $.grep(addressComponents, function(addr) {
        return addr.long_name == alamedaCounty || addr.long_name == sanFranCounty;
    });

    if (county.length) {
        return county[0].long_name;
    }

}

$(document).on('pageshow', '#home', function (e, data) {
    toggleInvertClass();
});

var errorMessage = $('.error-message');

function showError() {
    $.mobile.navigate("#home");
    errorMessage.removeClass('no-error-class');
    errorMessage.addClass('error-message-class');
    errorMessage.text("This app requires location services to be enabled");
    $(".home-content").css("margin-top", 0);

}

function clearError() {
    errorMessage.addClass('no-error-class');
    errorMessage.removeClass('error-message-class');
    errorMessage.text("");
    $(".home-content").css("margin-top", 0);
}

function wrongLocation() {
    $.mobile.navigate("#home");
    errorMessage.removeClass('no-error-class');
    errorMessage.addClass('error-message-class');
    errorMessage.text("Data for this feature is currently unavailable in your location");
    $(".home-content").css("margin-top", 0);

}

function wrongGeolocation() {
    ratingHideLoader();

    $('#stats-dropdowns').hide();

    errorMessage.show();

    var currentChartRating = $("#current-safety-gauge");
    var searchedChartRating = $("#search-safety-gauge");

    currentChartRating.hide();
    searchedChartRating.hide();

    var currentChart = $("#current-location-crime-chart");
    var searchedChart = $("#search-location-crime-chart");

    currentChart.hide();
    searchedChart.hide();

    errorMessage.removeClass('no-error-class');
    errorMessage.addClass('error-message-class');
    errorMessage.text("Data for this feature is currently unavailable for this location");
}


function hideLoader() {
    $(".content").show();
    $(".loader").hide();
}

function ratingHideLoader() {
    $(".ratingContent").show();
    $("#search-safety-gauge").show();

    $(".loader").hide();
}

function ratingShowLoader() {
    $(".ratingContent").hide();
    $(".loader").show();

}

function statsHideLoader() {
    $(".stats-content").show();
    $("#stats-dropdowns").show();
    $("#current-stats-dropdown").show();

    $(".loader").hide();
}

function statsShowLoader() {
    $(".stats-content").hide();
    $(".loader").show();
}
