document.addEventListener('DOMContentLoaded', function(){

	var distanceMax = 100; //km

	//var target = {"name": "Paris", "latitude" : 48.856578, "longitude" : 2.351828};
	//var target = {"name": "Lyon", "latitude" : 45.759723, "longitude" : 4.842223};
	var target = {"name": "Marseille", "latitude" : 43.296346, "longitude" : 5.369889}; 
	
	var status = document.querySelector("#status");
	var infos  = document.querySelector("#infos");

	//map 
	var map = L.map('myMap');
	map.setView([0, 0], 3);

	//pattern
	var mapPatternUrl = 'http://tile.openstreetmap.org/{z}/{x}/{y}.png';
	var tileLayer = L.tileLayer(mapPatternUrl);
	tileLayer.addTo(map);

	//target marker 
	var targetMarker = L.marker([target.latitude, target.longitude]);
	targetMarker.bindPopup(target.name);
	targetMarker.addTo(map);

	//target  circle
	var targetCircle = L.circle([target.latitude, target.longitude], distanceMax * 1000, {fillColor: "green", color: "green"});
	targetCircle.addTo(map);

	//marker
	var marker = L.marker([0, 0]);
	marker.bindPopup("Me.");
	marker.addTo(map);

	//accuracy circle
	var circle = L.circle([0, 0], 0);
	circle.bindPopup("Accuracy.");
	circle.addTo(map);

	function processPosition(event){
		status.innerHTML = "Lat : " + event.coords.latitude + "° Long : " + event.coords.longitude + "° Precision : " + event.coords.accuracy + "m.";
		var coords = [event.coords.latitude, event.coords.longitude] ;

		marker.setLatLng( coords );
		circle.setLatLng( coords );
		circle.setRadius(event.coords.accuracy);

		if ( ! map.getBounds().contains( coords ) ) {
			map.panTo(coords);
		}

		var distanceTarget = geoDistance(target.latitude, target.longitude, event.coords.latitude, event.coords.longitude);
		distanceTarget = round(distanceTarget);

		infos.innerHTML = "Distance from " + target.name + " : " + distanceTarget + "km.";

		if (distanceTarget < distanceMax) {
			infos.innerHTML += "<span class='win'>You win !</span>";
		} 
	}

	function errorPosition(){
		status.innerHTML = "No position.";
		marker.setLatLng( [0,0] );
		map.setView([0, 0], 3);
	}

	//location notifications
	var options = {"enableHighAccuracy": true, "maximumAge" : 0, "timeout" : Infinity};
	navigator.geolocation.watchPosition( processPosition, errorPosition, options );


});