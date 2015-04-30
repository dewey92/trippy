var MapComponent = React.createClass({

	render: function() {

		// buat marker
		var markers = this.props.places.map( function( place ) {

			var found = $.grep( this.props.destList, function( e ) { return e.id == place.id; } );
			var selected = ( ! found.length === 0 ) ? true : false;

			return (
				<Marker
					place={ place }
					selected={ selected } />
			);
		}, this );

		return (
			<Map city={ this.props.city }>
				{ markers }
			</Map>
		);
	}
});

var Map = React.createClass({

	componentDidMount: function () {

		var lat = parseFloat( this.props.city.lat );
		var lng = parseFloat( this.props.city.lng );

		var map = L.map('map-canvas', {
			center: [ lat, lng ],
			minZoom: 2,
			zoom: 13
		});

		// pake Tiles-nya CartoDB
		L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
			attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
		}).addTo( map );

	}

	render: function() {
		return(
			<div id="map-canvas" ref="map" className="open"></div>
		);
	}
});

var Marker = React.createClass({

	componentDidMount: function () {
		var marker = React.findDOMNode( this.refs.marker );
	},

	render: function() {

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
				selected={ selected } />,
			div
		);

		L.marker( [ parseFloat(place.loc.lat), parseFloat(place.loc.lng) ] )
			.addTo( this.props.map )
			.bindPopup( div );

		return null;
	}
});

var Popup = React.createClass({

	handleClick: function( e ) {

		// pas di buat nambah
		if( ! this.props.selected )
			this.props.addList( this.props.place );
		else // buat nge-delete
			this.props.unList( this.props.place, null );
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

		var btn = ( ! this.props.selected ) ? btnWantGo : btnCancelGo;
		console.log( this.props.selected );

		return (
			<div className="place-popup" ref={ place.id }>
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