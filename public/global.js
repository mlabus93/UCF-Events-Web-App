var tableData = [];



var latitude, longitude;
//var email, pass;

// DOM READY
$(document).ready(function() {

	// Populate table
	//populateTable();

    $('#btnRemoveEvent').toggle(false);

    $('#pub').prop("disabled", true);

    getUniversities();

    getRSOs();

    $('#events').on('click-row.bs.table', function (e, row, $element) {
        window.location = '/comments?id=' + row.event_id + '&name=' + row.event_name +
        "&lat=" + row.latitude + "&lng=" + row.longitude + "&loc=" + row.loc_name;
        var currentEventId = row.event_id;
    });


	$('#btnSignIn').on('click', signIn);
    $('#btnLogIn').on('click', logIn);
    $('#btnRegister').on('click', createAccount);
    $('#btnCreateEvent').on('click', createEvent);
    $('#btnCreateRSO').on('click', createRSO);
    $('#btnComment').on('click', postComment);
    $('#btnJoinEvent').on('click', joinEvent);
    $('#joinRSOs').on('click', joinRSOs);
    $('#btnRemoveEvent').on('click', removeEvent);
    $('#btnRemoveRSOs').on('click', removeRSOs);

    $('#pub').on('click', updateTablePublic);
    $('#pri').on('click', updateTablePrivate);
    $('#r').on('click', updateTableRSO);
    $('#btnJoinedEvents').on('click', updateJoinedEvents);

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
                window.location.href="/home";
            }
            if (data === 'fail') {
                alert('Invalid account login');
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
                window.location.href="/home";
            }
            if (data === 'fail') {
                alert('Invalid account login');
            }
        });
    }

    else {
        alert('Error: invalid entry');
    }
}

function getUniversities() {
    $.getJSON('/universityList', function(data){
        var options = '';
        for (var x = 0; x < data.length; x++) {
            options += '<option value="' + data[x]['uni_id'] + '">' + data[x]['uni_name'] + '</option>';
        }
        $('#universitySelect').html(options);
    });
}

function getUniversities() {
    $.getJSON('/universityList', function(data){
        var options = '';
        for (var x = 0; x < data.length; x++) {
            options += '<option value="' + data[x]['uni_id'] + '">' + data[x]['uni_name'] + '</option>';
        }
        $('#universitySelect').html(options);
    });
}

function getRSOs() {
    $.getJSON('/rsoList', function(data){
        var options = '<option value="null">None</option>';
        for (var x = 0; x < data.length; x++) {
            options += '<option value="' + data[x]['rso_id'] + '">' + data[x]['rso_name'] + '</option>';
        }
        $('#rsoSelect').html(options);
    });
}

function createAccount() {
    var errorCount = 0;

    if ($('#registerEmail').val() === '' || $('#registerPassword').val() === '' || $('#universitySelect').val() === '') {
        errorCount++;
    }

    if (errorCount === 0) {
        var email = $('#registerEmail').val();
        var pass = $('#registerPassword').val();
        var univ = $('#universitySelect').val();

        $.post("/registration", {email:email, pass:pass, univ:univ}, function(data) {
            if (data === 'done') {
                alert('Account created.');
                window.location.href = '/login';
            }
            if (data === 'fail') {
                alert('Registration failed, try again.');
            }
        });
    }
    else {
        alert('Please fill in all fields.');
    }
}

function updateTablePublic() {
    $('#pub').prop("disabled", true);
    $('#pri').prop("disabled", false);
    $('#r').prop("disabled", false);
    $('#btnJoinedEvents').prop("disabled", false);
    $('#events').bootstrapTable('refresh', {
    url: '/publicEvents'
    });
}

function updateTablePrivate() {
    $('#pri').prop("disabled", true);
    $('#pub').prop("disabled", false);
    $('#r').prop("disabled", false);
    $('#btnJoinedEvents').prop("disabled", false);
    $('#events').bootstrapTable('refresh', {
        url: '/privateEvents'
    });
}

function updateTableRSO() {
    $('#r').prop("disabled", true);
    $('#pub').prop("disabled", false);
    $('#pri').prop("disabled", false);
    $('#btnJoinedEvents').prop("disabled", false);
    $('#events').bootstrapTable('refresh', {
        url: '/rsoEvents'
    });
}

function updateJoinedEvents() {
    $('#btnJoinedEvents').prop("disabled", true);
    $('#pub').prop("disabled", false);
    $('#pri').prop("disabled", false);
    $('#r').prop("disabled", false);
    $('#events').bootstrapTable('refresh', {
    url: '/joinedEvents'
    });
}

function updateComments() {
    $('#commentsTable').bootstrapTable('refresh', {
        url: '/currentEvent'
    });
}

function updateCurrentRSOs() {
    $('#currentRsoList').bootstrapTable('refresh', {
        url: '/currentRSO'
    });
    $('#currentRsoList').bootstrapTable('refresh');
}

function joinRSOs() {
    var selectedRSOs = $('#rsoList').bootstrapTable('getAllSelections');
    if (selectedRSOs.length > 0) {
        $.post('/joinRSO', {selectedRSOs:selectedRSOs}, function(data) {
            if (data === 'done') {
                alert('RSOs joined.');
                updateCurrentRSOs();
            }
            if (data === 'fail') {
                alert('Could not join RSOs.')
            }
            if (data === 'duplicate') {
                alert('Already joined one of the selected RSOs.');
            }
        });
    }
    else {
        alert('Please select at least one RSO to join.');
    }
}

function removeRSOs() {
    var selectedRSOs = $('#currentRsoList').bootstrapTable('getAllSelections');
    if (selectedRSOs.length > 0) {
        $.post('/removeRSOs', {selectedRSOs:selectedRSOs}, function(data) {
            if (data === 'done') {
                alert('RSOs removed.');
                updateCurrentRSOs();
            }
            if (data === 'fail') {
                alert('Could not remove RSOs.')
            }
        });
    }
    else {
        alert('Please select at least one RSO to join.');
    }
}

function createEvent() {
    var errorCount = 0;

    if ($('#inputLocation').val() === '' || $('#inputEventName').val() === '' || $('#inputCategory').val() === '' || 
        $('#inputStartDate').val() === '' || $('#inputStartTime').val() === '' || $('#eventDescription').val() === '') {
        errorCount++;
    }
    if (errorCount === 0) {
            var loc = $('#inputLocation').val();
            var eventName = $('#inputEventName').val();
            var category = $('#inputCategory').val();
            var startTime = $('#inputStartDate').val() + ' ' + $('#inputStartTime').val();
            var desc = $('#description').val();
            var radio = $('input[name=weeklyEvent]:checked').val();
            var rso = $('#rsoSelect').val();
            var eventType = $('#eventVisibility').val();
            $.post('/eventCreation', {
                loc:loc,
                eventName:eventName,
                category:category,
                startTime:startTime,
                desc:desc,
                radio:radio,
                rso:rso,
                eventType:eventType,
                longitude:longitude,
                latitude:latitude
            }, function(data) {
                if (data === 'done') {
                    alert('Event created.');
                    window.location.href = '/';
                }
                if (data === 'fail') {
                    alert('Failed to create event');
                }
            });
    }
    else {
        alert('Fill in all fields.');
    }
}

function createRSO() {
    var errorCount = 0;

    if ($('#rsoName').val() === '' || $('#rsoAdminEmail').val() === '' || $('#rsoEmail2').val() === '' ||
        $('#rsoEmail3').val() === '' || $('#rsoEmail4').val() === '' || $('#rsoEmail5').val() === '') {
        errorCount++;
    }

    if (errorCount === 0) {
        var rsoName = $('#rsoName').val();
        var email2 = $('#rsoEmail2').val();
        var email3 = $('#rsoEmail3').val();
        var email4 = $('#rsoEmail4').val();
        var email5 = $('#rsoEmail5').val();

        $.post('/rsoCreation', {rsoName:rsoName, email2:email2, email3:email3, email4:email4, email5:email5}, function(data) {
            if (data === 'done') {
                alert('RSO created succesfully.');
                window.location.href = '/';
            }
            if (data === 'duplicate') {
                alert('RSO with same name already exists.');
            }
            if (data === 'fail') {
                alert('RSO creation failed.');
            }
        });
    }
    else {
        alert('Please fill in all fields.');
    }
}

function postComment() {
    var errorCount = 0;

    if ($('#commentText').val() === '') {
        errorCount++;
    }
    if (errorCount === 0) {
        var comment = $('#commentText').val();

        $.post('/postComment', {comment:comment}, function(data) {
            $('#btnComment').text('Comment Posting');
            $('#btnComment').prop("disabled", true);
            if (data === 'done') {
                $('#btnComment').text('Post Comment');
                $('#btnComment').prop("disabled", false);
                updateComments();
            }
            if (data === 'fail') {
                alert('Comment failed to post.');
                $('#btnComment').text('Try Again?');
                $('#btnComment').prop("disabled", false);
            }
        });
    }
    else {
        alert('Please enter a comment.');
    }
}

function joinEvent() {

    var eventName = $('#eventHeader').text();

    $.post('/joinEvent', {}, function(data) {
        if (data === 'done') {
            $('#btnJoinEvent').text('Joined');
            $('#btnJoinEvent').prop("disabled", true);
            $('#btnRemoveEvent').toggle(true);
        }
        if (data === 'fail') {
            alert('Failed to join event.');
            $('#btnJoinEvent').text('Try again');
        }
        if (data === 'duplicate') {
            $('#btnJoinEvent').text('Already Joined');
            $('#btnJoinEvent').prop("disabled", true);
            $('#btnRemoveEvent').toggle(true);
        }
    });
}

function removeEvent() {
    $.post('/removeEvent', {}, function(data) {
        if (data === 'done') {
            $('#btnJoinEvent').text('Join Event »');
            $('#btnRemoveEvent').toggle(false);
            $('#btnJoinEvent').prop("disabled", false);
        }
        if (data === 'fail') {
            alert('Failed to remove event.');
            $('#btnRemoveEvent').text('Try again');
        }
    });
}

function initializeMap() {

    if (document.getElementById('map-canvas') === null) {
        return;
    }

    var markers = [];
    var marker;
    var defaultLatLng = new google.maps.LatLng(28.60359, -81.200060);

    var mapOptions = {
        zoom: 15,
        center: defaultLatLng,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }

    
    var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    var defaultMarker = new google.maps.Marker({
        position: defaultLatLng,
        map: map,
        title: 'Drag Me!',
        draggable: true
    });

    latitude = defaultMarker.position.lat().toFixed(9);
    longitude = defaultMarker.position.lng().toFixed(9);

    // Create the search box and link it to the UI element.
    var input = /** @type {HTMLInputElement} */(
        document.getElementById('pac-input'));

    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    var searchBox = new google.maps.places.SearchBox(
        /** @type {HTMLInputElement} */(input));

    // [START region_getplaces]
    // Listen for the event fired when the user selects an item from the
    // pick list. Retrieve the matching places for that item.
    google.maps.event.addListener(searchBox, 'places_changed', function() {
        var places = searchBox.getPlaces();

        defaultMarker.setMap(null);

        if (places.length == 0) {
            return;
        }
        for (var i = 0, marker; marker = markers[i]; i++) {
            marker.setMap(null);
        }

        // For each place, get the icon, place name, and location.
        markers = [];
        var bounds = new google.maps.LatLngBounds();
        for (var i = 0, place; place = places[i]; i++) {
            var image = {
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25)
            };

            // Create a marker for each place.
            marker = new google.maps.Marker({
                map: map,
                title: place.name,
                position: place.geometry.location,
                draggable: true
            });

            latitude = marker.position.lat().toFixed(9);
            longitude = marker.position.lng().toFixed(9);

            markers.push(marker);

            bounds.extend(place.geometry.location);

            google.maps.event.addListener(marker, 'dragend', function(evt) {
                latitude = evt.latLng.lat().toFixed(9);
                longitude = evt.latLng.lng().toFixed(9);
            });
        }

        map.fitBounds(bounds);

        var listener = google.maps.event.addListener(map, "idle", function() { 
            if (map.getZoom() > 16) map.setZoom(16); 
            google.maps.event.removeListener(listener); 
        });

    });
    // [END region_getplaces]

    // Bias the SearchBox results towards places that are within the bounds of the
    // current map's viewport.
    google.maps.event.addListener(map, 'bounds_changed', function() {
        var bounds = map.getBounds();
        searchBox.setBounds(bounds);
    });

    /*if (marker != null) {
        google.maps.event.addListener(marker, 'dragend', function(evt) {
            latitude = evt.latLng.lat().toFixed(6);
            longitude = evt.latLng.lng().toFixed(6);
        });
    }*/

    google.maps.event.addListener(defaultMarker, 'dragend', function(evt) {
        latitude = evt.latLng.lat().toFixed(9);
        longitude = evt.latLng.lng().toFixed(9);
    });

}

function initializeCurrent() {
    if (document.getElementById('map-location') === null) {
        return;
    }
    var curLat = $('#curLat1').val();
    var curLng = $('#curLng1').val();
    var lt = parseFloat(curLat);
    var lg = parseFloat(curLng);
    var latlng = new google.maps.LatLng(lt,lg);
    var mapOptions = {
        center: latlng,
        zoom: 16
    };
    var currentMap = new google.maps.Map(document.getElementById('map-location'), mapOptions);


    var currentMarker = new google.maps.Marker({
        position: latlng,
        map: currentMap
    });
}

google.maps.event.addDomListener(window, 'load', initializeCurrent);

google.maps.event.addDomListener(window, 'load', initializeMap);




