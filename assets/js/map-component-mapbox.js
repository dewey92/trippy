var MapComponent = React.createClass({

	/*getDefaultProps: function() {
		return {
			map: L.map('map-canvas', {
				center: [-7.9812985, 112.6319264],
				minZoom: 2,
				zoom: 17
			})
		};
	},*/

	componentDidMount: function() {

		// access token
		L.mapbox.accessToken = 'pk.eyJ1IjoiZGV3ZXk5MiIsImEiOiJuQXZWRVRRIn0.26SIZA1jsp9-fMfipAjywg';

		// bikin map-nya
		var map = L.mapbox.map('map-canvas', 'dewey92.lmj1bbo4')
			.setView([-7.977124, 112.634029], 17)
			.addControl(L.mapbox.geocoderControl('mapbox.places', {
				autocomplete: true,
			}));

		// autocomplete
		var geocoder = L.mapbox.geocoder('mapbox.places');
		geocoder.query('Malang, Jawa Timur, Indonesia', function(err, data) {
			if (data.lbounds) {
				map.fitBounds(data.lbounds);
			} else if (data.latlng) {
				map.setView([data.latlng[0], data.latlng[1]], 17);
			}
		})

	},

	_createMarker: function() {
		for (var i = 0; i < markers.length; i++) {
			var marker = L.marker()
				.addTo( map )
				.bindPopup( React.render( this._createPopup(place), document.createElement('div') ) );
		}
	},

	_createPopup: function(place) {
		place.photo = '';

		return (
			<div className="place-popup">
				<h3>{place.name}</h3>
				<img src={"/img/place/" + place.photo} className="img-responsive"></img>
				<div className="row">
					<div className="col-sm-6">
						<button type="button" class="btn btn-block btn-default">I have been here</button>
					</div>
					<div className="col-sm-6">
						<button type="button" class="btn btn-block btn-danger" onclick={this.props.addList(place )}>I wanna go here</button>
					</div>
				</div>
			</div>
		);
	},

	render: function() {
		return (
			<div id="map-canvas" ref="map"></div>
		);
	}
});