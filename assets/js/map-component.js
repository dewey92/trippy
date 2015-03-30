var MapComponent = React.createClass({

	getInitialState: function() {
		return {
			map: null,
			marker: null,
			infowindow: null,
			loc: new google.maps.LatLng(-7.9812985,112.6319264)
		}
	},

	/*getDefaultProps: function() {
		return {
			center: this.state.loc,
			zoom: 17
		}
	},*/

	componentDidMount: function() {
		var mapOptions = {
			center: this.state.loc,
			zoom: 17,
			scrollwheel: true,
			zoomControl: true,
			panControl: false,
			streetViewControl: false,
			mapTypeControl: false,
			overviewMapControl: false,
			clickable: false
		};

		var map = new google.maps.Map(this.refs.gmap.getDOMNode(), mapOptions);

		// Buat handle inputan
		var input = document.getElementById('search-place');
		var autocomplete = new google.maps.places.Autocomplete(input);
		autocomplete.bindTo('bounds', map);

		var marker = new google.maps.Marker({
			position: this.state.loc,
			map: map,
			title: 'Event'
		});

		var infowindow = null;

		google.maps.event.addListener(autocomplete, 'place_changed', function() {
			infowindow.close();
			marker.setVisible(false);
			var place = autocomplete.getPlace();

			if (!place.geometry) {
				return;
			}

			// If the place has a geometry, then present it on a map.
			if (place.geometry.viewport) {
				map.fitBounds(place.geometry.viewport);
			} else {
				map.setCenter(place.geometry.location);
				map.setZoom(17);  // Why 17? Because it looks good.
			}
			marker.setIcon(/** @type {google.maps.Icon} */({
				url: place.icon,
				size: new google.maps.Size(71, 71),
				origin: new google.maps.Point(0, 0),
				anchor: new google.maps.Point(17, 34),
				scaledSize: new google.maps.Size(35, 35)
			}));
			marker.setPosition(place.geometry.location);
			marker.setVisible(true);

			var address = '';
			if (place.address_components) {
				address = [
					(place.address_components[0] && place.address_components[0].short_name || ''),
					(place.address_components[1] && place.address_components[1].short_name || ''),
					(place.address_components[2] && place.address_components[2].short_name || '')
				].join(' ');
			}

			infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
			infowindow.open(map, marker);
		});

		var request = {
			location: this.state.loc,
			radius: '500',
			types: [] // semua
		};

		infowindow = new google.maps.InfoWindow();
		service = new google.maps.places.PlacesService(map);
		service.nearbySearch(request, function callback(results, status) {
			if (status == google.maps.places.PlacesServiceStatus.OK) {
				for (var i = 0; i < results.length; i++) {
					var place = results[i];
					_createMarker(place);
				}
			}
		});

		var _createMarker = function(place) {
			var placeLoc = place.geometry.location;
			var marker = new google.maps.Marker({
				map: map,
				position: placeLoc
			});

			google.maps.event.addListener(marker, 'click', function() {
				infowindow.setContent('<h4>' + place.name + '</h4>');
				infowindow.open(map, this);
			});
		};

		// Update state
		this.setState({
			map: map,
			marker: marker,
			infowindow: infowindow
		});
	},

	/*componentDidUpdate: function (prevProps, prevState) {
		this.state.map.panTo(new google.maps.LatLng(this.state.loc));
	},*/

	render: function() {
		return (
			<div id="map-canvas" ref="gmap"></div>
		);
	}
});