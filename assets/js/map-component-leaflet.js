var MapComponent = React.createClass({

	/*getDefaultProps: function() {
		return {
			center: [-7.977124, 112.634029],
			city: {},
			places: []
		};
	},*/

	componentDidMount: function () {

		// Ambil dari URI
		var pathArray = window.location.pathname.split( '/' );
		if( pathArray[2] == '') pathArray[2] = 'Malang';

		me = this;

		$.get( "http://localhost:1337/places/" + pathArray[2], this.mainProcess);

	},

	mainProcess: function( data ) {

		var city = data.city;
		var places = data.places;

		var lat = parseFloat(city.loc.lat);
		var lng = parseFloat(city.loc.lng);

		var map = this.map = L.map('map-canvas', {
			center: [ lat, lng ],
			minZoom: 2,
			zoom: 13
		});

		// pake Tiles-nya Default OSM
		/*L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: '&copy; <a href="http://osm.org/copyright" title="OpenStreetMap" target="_blank">OpenStreetMap</a>'
		}).addTo( map );*/

		// pake Tiles-nya MapQuest
		/*L.tileLayer('http://{s}.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.png', {
			attribution: '&copy; <a href="http://osm.org/copyright" title="OpenStreetMap" target="_blank">OpenStreetMap</a>',
			subdomains: ['otile1', 'otile2', 'otile3', 'otile4']
		}).addTo( map );*/

		// pake Tiles-nya CartoDB
		L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
			attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
		}).addTo( map );

		// bikin markernya
		this.createMarker( places );

		// autocomplete
		/*map.addControl( new L.Control.Search({
			url: 'http://nominatim.openstreetmap.org/search?format=json&q={s}',
			jsonpParam: 'json_callback',
			propertyName: 'display_name',
			propertyLoc: ['lat','lon'],
			circleLocation: false,
			markerLocation: false,			
			autoType: false,
			autoCollapse: true,
			minLength: 2,
			zoom:17
		})
		.on('search_locationfound', function(e) {
			e.layer.setStyle({fillColor: '#3f0'});
		}) 
		);*/

	},

	createMarker: function( places ) {

		//var me = this;

		places.map( function( place, index ) {

			var div = document.createElement( 'div' );
			setInterval( function() {
				if( div )
					clearInterval();
			}, 2);
			React.render(
				<Popup
					key={ place.id }
					place={ place }
					addList={ this.props.addList }
					unList={ this.props.unList }
					index={ index } />,
				div
			);

			L.marker( [ parseFloat(place.loc.lat), parseFloat(place.loc.lng) ] )
				.addTo( this.map )
				.bindPopup( div );

		}, this);
	},

	/*createPopup: function( place, index ) {
		place.photo = '';

		return (
			<div className="place-popup">
				<h3>{ place.name }</h3>
				<img src={ "/img/place/" + place.photo } className="img img-responsive" />
				<p>Category: { place.category }</p>
				<ul className="list-inline">
					<li>
						<button type="button" className="btn btn-block btn-default">I have been here</button>
					</li>
					<li>

						<ButtonGo btnClick={ this.props.addList.bind( null, place ) } />

					</li>
				</ul>
			</div>
		);
	},*/

	render: function() {
		return (
			<div id="map-canvas" ref="map" className="open"></div>
		);
	}
});

var Popup = React.createClass({
	getInitialState: function () {
		return {
		   selected: false
		};
	},

	handleClick: function( e ) {

		// pas di buat nambah
		if( ! this.state.selected )
			this.props.addList( this.props.place );
		else // buat nge-delete
			this.props.unList( this.props.place, null );

		this.setState({
			selected: ! this.state.selected
		});
	},

	render: function() {

		var place = this.props.place;
		var btnWantGo = <button type="button"
											className={ "btn btn-sm btn-block btn-primary" }
											onClick={ this.handleClick }>
												<span className="fa fa-heart-o"></span>&nbsp;I wanna go here
										</button>;
		var btnCancelGo = <button type="button"
											className={ "btn btn-sm btn-block btn-danger" }
											onClick={ this.handleClick }>
												<span className="fa fa-trash-o"></span>&nbsp;Cancel
										</button>;

		var btn = ( ! this.state.selected ) ? btnWantGo : btnCancelGo;

		return (
			<div className="place-popup">
				<h3>{ place.name }</h3>
				<div className="image-container">
					<img src="/images/Batu.jpg" className="img img-responsive" />
				</div>
				<p>Category: { place.category }</p>
				<ul className="list-inline">
					<li>
						<button type="button" className="btn btn-sm btn-block btn-default">I have been here</button>
					</li>
					<li>{ btn }</li>
				</ul>
			</div>
		);
	}
});