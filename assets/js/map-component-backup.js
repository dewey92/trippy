var Gmap = React.createClass({
	getInitialState: function () {
		return {
			 markers: []
		};
	},

	// buat map
	// buat marker

	render: function() {
		return (
			<MapComponent addList={this._addDestination} markers={markers} />
		);
	}
});

var MapComponent = React.createClass({
	tmp_map: null,

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

	_createMap: function() {
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

		// Batas hanya untuk indonesia aja
		var atasKiri = new google.maps.LatLng(5.997599, 94.460176);
		var bawahKanan = new google.maps.LatLng(-11.319401, 140.339082);
		var bounds = new google.maps.LatLngBounds(atasKiri, bawahKanan);
		map.fitBounds(bounds);

		this.setState({
			map: map
		});
	},

	_autoComplete: function() {
		var map = this.state.map;
		var marker = new google.maps.Marker({
			map: null
		});
		var _this = this;

		// Buat handle inputan
		var input = document.getElementById('search-place');
		var options = {
			componentRestrictions: {country: 'id'} // batesin indonesia aja
		}
		var autocomplete = new google.maps.places.Autocomplete(input, options);
		autocomplete.bindTo('bounds', map);

		// Ini handle kalo search-box nya di ubah2
		google.maps.event.addListener(autocomplete, 'place_changed', function() {

			// hapus semua marker dulu
			_clearMarkers();

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

			// tampilin daerah di sekitarnya ada apa aja
			_this._requestNearby(map, place.geometry.location);

			// update lokasi
			_this.setState({
				loc: place.geometry.location
			})
		});
	},

	_requestNearby: function(map, loc) {
		// Request mau nearbySearch 
		var request = {
			location: loc,
			radius: '5000',
			types: [] // semua
		};

		var infowindow = new google.maps.InfoWindow();
		var service = new google.maps.places.PlacesService(map);
		service.nearbySearch(request, function callback(results, status) {
			if (status == google.maps.places.PlacesServiceStatus.OK) {
				for (var i = 0; i < results.length; i++) {
					var place = results[i];
					// create and animate drop
					/*setTimeout(function() {
						_createMarker(place);
					}, i * 200);*/
					//_createMarker(place);
					_this._renderMarker(map, place.geometry.location, i); // render markernya
				}
			}
		});
	};

	componentDidMount: function() {

		var markers = [];
		var infowindow = new google.maps.InfoWindow();

		// fungsi buat mbikin marker
		/*var _createMarker = function(place) {
			var placeLoc = place.geometry.location;
			var marker = new google.maps.Marker({
				map: map,
				position: placeLoc,
				animation: google.maps.Animation.DROP
			});

			// masukin ke array markers[]
			markers.push(marker);

			google.maps.event.addListener(marker, 'click', function() {
				infowindow.setContent(
					'<h4>' + place.name + '</h4>' +
					'<button type="button" class="btn btn-block btn-danger" onClick="haha()">Add this</button>'
				);
				infowindow.open(map, this);
			});
		};*/

		var _clearMarkers = function() {
			for (var i = 0; i < markers.length; i++) {
				markers[i].setMap(null);
			}

			markers = [];
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
	_loadMap: function() {
		if ( !window.google ) {
			window.mapsCallback = this.mapsCallback;
			var src = "https://maps.googleapis.com/maps/api/js?v=3.exp&signed_in=true&libraries=places";
			var script = document.createElement('script');
			script.setAttribute('src', src);
			document.body.appendChild(script);
		} else {
			this.mapsCallback();
		}
	},

	_renderMarker: function(map, pos, i) {
		return(
			<MarkerComponent
				map={map}
				posotion={pos}
				key={i} />
		);
	}

	render: function() {
		return (
			<div id="map-canvas" ref="gmap"></div>
		);
	}
});

var MarkerComponent = React.createClass({
	componentDidMount: function () {
		var marker = new google.maps.Marker({
			map: this.props.map,
			position: this.props.position,
			animation: google.maps.Animation.DROP
		});

		// set onClick
		google.maps.event.addListener(marker, 'click', function() {
			infowindow.setContent(
				'<h4>' + place.name + '</h4>' +
				'<button type="button" class="btn btn-block btn-danger" onClick="haha()">Add this</button>'
			);
			infowindow.open(map, this);
		});
	},
	render: function() {
		return null;
	}
});

/*var InfoWindowComponent = React.createClass({
	render: function() {
		return (
			<div>
				<h4>{this.props.name}</h4>
				<button type="button" className="btn btn-block btn-danger">Add this</button>
			</div>
		);
	}
});*/