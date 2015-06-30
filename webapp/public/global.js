var tableData = [];

// DOM READY
$(document).ready(function() {

	// Populate table
	populateTable();

	$('#btnSignIn').on('click', signIn);


	// form sign in
	$('form[name="signin"]').on("submit", function (e) {
        // Find all <form>s with the name "register", and bind a "submit" event handler

        // Find the <input /> elements with the name "username" and "password"
        var username = $(this).find('input[name="email"]');
        var password = $(this).find('input[name="password"]');
        if ($.trim(username.val()) === "") {
            // If its value is empty
            e.preventDefault();    // Stop the form from submitting
            $("#formAlert").slideDown(400);    // Show the Alert
        }
        if ($.trim(password.val()) === "") {
        	// If value is empty
        	e.preventDefault();  // Stop form from submitting
        	$("#formAlert").slideDown(400);   // Show the alert
        }
        else {
            e.preventDefault();    // Not needed, just for demonstration
            $("#formAlert").slideUp(400, function () {    // Hide the Alert (if visible)
                alert("Would be submitting form");    // Not needed, just for demonstration
                username.val("");    // Not needed, just for demonstration
            });
        }
    });

    $(".alert").find(".close").on("click", function (e) {
        // Find all elements with the "alert" class, get all descendant elements with the class "close", and bind a "click" event handler
        e.stopPropagation();    // Don't allow the click to bubble up the DOM
        e.preventDefault();    // Don't let any default functionality occur (in case it's a link)
        $(this).closest(".alert").slideUp(400);    // Hide this specific Alert
    });

});

// FUNCTIONS

function populateTable() {

	var tableContent = '';

	$('table').bootstrapTable('showLoading');

	//$.getJSON('http://events.ucf.edu/this-month/feed.json', function(data) {
	$.getJSON('/ucfevents.json', function(data) {
		tableData = data;

		$.each(data, function() {
			tableContent += '<tr>';
			tableContent += '<td>' + this.title + '</td>';
			tableContent += '<td>' + this.description + '</td>';
			tableContent += '<td>' + this.location + '</td>';
			tableContent += '<td>' + this.starts + '</td>';
			tableContent += '<td>' + this.ends + '</td>';
			tableContent += '<td>' + this.category + '</td>';
			tableContent += '</tr>';
		});

		$('div table tbody').html(tableContent);
		$('table').bootstrapTable('hideLoading');
	});
	
}

function signIn() {

	var errorCount = 0;

	$('input').each(function(index, val) {
		if ($(this).val() === '') {
			errorCount++;
		}
	});

	if (errorCount === 0) {
		alert('Success');
	}

	else {
		alert('Error: invalid entry');
	}
}




