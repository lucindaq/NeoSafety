function editProfile(){
	//var user = [$("#userName").val(), $('input[name="radio-choice-2"]:checked').val(), $('input[name="radio-choice-1"]:checked').val()];
	//var usernameInput = $("#userName").val();
	var genderInput = $('input[name="radio-group-2"]:checked').val();
	var ageInput = $('input[name="radio-group-1"]:checked').val();
	/*if(usernameInput == "")
	{
		usernameInput = reminder;
	}
	*/
	if (genderInput != undefined)
	{
		localStorage.setItem("gender", genderInput);
	}
	if (ageInput != undefined)
	{
		localStorage.setItem("age", ageInput);	
	}
	//localStorage.setItem("user", usernameInput);
	
	
	//$('#username').html(localStorage.getItem("user"));
	//$('#gender').html(localStorage.getItem("gender"));
	//$('#age').html(localStorage.getItem("age"));
	$.mobile.pageContainer.pagecontainer("change", "#home", {transition: "pop"});
}

$(document).on('pageshow', '#profile', function (e, data) {
	
	window.localStorage.clear();

	toggleInvertClass($("#profile-footer"));


	var gender = localStorage.getItem("gender");
	var age = localStorage.getItem("age");

	$('input[name="radio-group-2"]').prop('checked', false);
	$("input[name='radio-group-2']").checkboxradio("refresh");

	$('input[name="radio-group-1"]').prop('checked', false);
	$("input[name='radio-group-1']").checkboxradio("refresh");


	if (gender != undefined) {
		$('input[name="radio-group-2"][value="'+gender+'"]').prop('checked', true);
		$("input[name='radio-group-2']").checkboxradio("refresh");
		
	}

	if (age != undefined) {
		$('input[name="radio-group-1"][value="'+age+'"]').prop('checked', true);
		$("input[name='radio-group-1']").checkboxradio("refresh");
	}


});