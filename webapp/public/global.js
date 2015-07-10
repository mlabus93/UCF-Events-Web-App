var tableData = [];


//var email, pass;

// DOM READY
$(document).ready(function() {

    /*$('#btnSignIn').click(function() {
        var email = $('#email').val();
        var pass = $('#password').val();

        $.post("/logon", {email:email,pass:pass}, function(data) {
            if (data === 'done') {
                window.location.href="/table";
            }
        });
    });*/


	// Populate table
	//populateTable();

	$('#btnSignIn').on('click', signIn);
    $('#btnLogIn').on('click', logIn);

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

	if ($('#email').val() === '' || $('#password').val() === '') {
        errorCount++;
    }

	if (errorCount === 0) {
        var email = $('#email').val();
        var pass = $('#password').val();

        $.post("/logon", {email:email,pass:pass}, function(data) {
            if (data === 'done') {
                window.location.href="/table";
            }
        });
	}

	else {
		alert('Error: invalid entry');
	}
}

function logIn() {

    var errorCount = 0;

    if ($('#emailLogIn').val() === '' || $('#passwordLogIn').val() === '') {
        errorCount++;
    }

    if (errorCount === 0) {
        var email = $('#emailLogIn').val();
        var pass = $('#passwordLogIn').val();

        $.post("/logon", {email:email,pass:pass}, function(data) {
            if (data === 'done') {
                window.location.href="/table";
            }
        });
    }

    else {
        alert('Error: invalid entry');
    }
}



