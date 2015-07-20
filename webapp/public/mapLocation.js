function initialize() {
	var curLat = $('#curLat1').val();
    var curLng = $('#curLng1').val();
    var lt = parseFloat(curLat);
    var lg = parseFloat(curLng);
	var mapOptions = {
		center: { lat: lt, lng: lg},
		zoom: 8
	};
	var map = new google.maps.Map(document.getElementById('map-location'), mapOptions);
}

google.maps.event.addDomListener(window, 'load', initialize);