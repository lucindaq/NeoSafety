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

function statsSetErrorClass() {
    if ($('#geocomplete-crimestats').val().length == 0){
        $('.error-message').addClass('no-error-class');
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
        if ($('#geocomplete').val().length == 0){
            $("#search-safety-gauge").hide();
            $('.error-message').addClass('no-error-class');
        } else {
            if ($('.rating-searched-error-message').hasClass('error-message-class')) {
                $('#rating-refresh-button').hide();
                $('#search-safety-gauge').hide();
            } else {
                wrongLocationClearError(".rating-searched-error-message");
                $(".ratingContent").show();
                $('#search-safety-gauge').show();

            }
        }
    });
    $(".search-tab-stats").on('click', function () {

        // $('#search-location-crime-chart').show();
        if ($('#geocomplete-crimestats').val().length == 0){
            $(".dropdowns").hide();
            $('.error-message').addClass('no-error-class');
        } else {
            if ($('.stats-searched-error-message').hasClass('error-message-class')) {
                $('#stats-dropdowns').hide();
                $("#search-location-crime-chart").hide();

            } else {
                wrongLocationClearError(".stats-searched-error-message");
                $(".stats-content").show();
            }
        }
    });

    $(".current-tab").on('click', function (){
        wrongLocationClearError(".rating-current-error-message");
        $('#current-safety-gauge').show();
        refreshRating();
    });
    $(".current-tab-stats").on('click', function() {
        wrongLocationClearError(".stats-current-error-message");
        refreshStats();
    });
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
    var newYorkCity = 'New York';
    var county;

    county = $.grep(addressComponents, function(addr) {
        return addr.long_name == alamedaCounty || addr.long_name == sanFranCounty || addr.long_name == newYorkCity;
    });

    if (county.length) {
        return county[0].long_name;
    }

}

$(document).on('pageshow', '#home', function (e, data) {
    toggleInvertClass();
});

var statsCurrentErrorMessage = $('.stats-current-error-message');
var statsSearchedErrorMessage = $('.stats-searched-error-message');
//todo make safety rating variables here
var homeErrorMessage = $('#error-message-home');

function showError() {
    $.mobile.navigate("#home");
    homeErrorMessage.removeClass('no-error-class');
    homeErrorMessage.addClass('error-message-class');
    homeErrorMessage.text("This app requires location services to be enabled.");
    $(".home-content").css("margin-top", 0);

}

function homeClearError() {
    homeErrorMessage.addClass('no-error-class');
    homeErrorMessage.removeClass('error-message-class');
    homeErrorMessage.text("");
    $(".home-content").css("margin-top", 0);
}

function wrongLocationClearError(errorClass) {
    
    if (errorClass == '.rating-current-error-message') {
        $('#rating-refresh-button').show();
    }
    
    var errorElem = $(errorClass);

    errorElem.addClass('no-error-class');
    errorElem.removeClass('error-message-class');
    errorElem.text("");
    // $(".home-content").css("margin-top", 0);
}

//
// function wrongLocationError() {
//     $.mobile.navigate("#home");
//     homeErrorMessage.removeClass('no-error-class');
//     homeErrorMessage.addClass('error-message-class');
//     homeErrorMessage.text("Data for this feature is currently unavailable in your location.");
//     $(".home-content").css("margin-top", 0);
//
// }

//used to be geolocation error
function ratingWrongLocationError(errorClass) {
    ratingHideLoader();

    var errorMessage = $(errorClass);
    
    $('#rating-refresh-button').hide();
    
    var currentChartRating = $("#current-safety-gauge");
    var searchedChartRating = $("#search-safety-gauge");

    currentChartRating.hide();
    searchedChartRating.hide();

    errorMessage.removeClass('no-error-class');
    errorMessage.addClass('error-message-class');
    errorMessage.text("Data for this feature is currently unavailable for this location.");
}

function statsWrongLocationError(errorClass) {
    statsHideLoader();

    var errorMessage = $(errorClass);
    
    $('.dropdowns').hide();

    var currentChart = $("#current-location-crime-chart");
    var searchedChart = $("#search-location-crime-chart");

    errorMessage.removeClass('no-error-class');
    errorMessage.addClass('error-message-class');
    errorMessage.text("Data for this feature is currently unavailable for this location.");

    currentChart.hide();
    searchedChart.hide();


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
