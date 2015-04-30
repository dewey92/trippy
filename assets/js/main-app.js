//- List destinasi mau kemana aja
var Destinations = React.createClass({

	handleClick: function( obj ) {
		this.props.unList( obj );
	},

	render: function() {
		return (
			<div id="destinations">
				<h3 className="text-center">My Destinations</h3>
				<div className="image-container">
					<img src="/images/Malang.jpg" className="img img-responsive" />
				</div>

				{ this.props.children }

				<ul className="list-unstyled">
					{ this.props.destList.map( function( obj, index ) {
						return (
							<li key={ obj.props.place.id }>
								{ index + '. ' + obj.props.place.name } -
								<span style={ { color: 'blue', cursor: 'pointer' } }
									href="#" title="delete city"
									onClick={ this.handleClick.bind( this, obj ) }> ga jadi kesini
								</span>
							</li>
						)
					}, this ) }
				</ul>
			</div>
		);
	}
});

// Control search
var Control = React.createClass({

	handleSubmit: function( e ) {
		e.preventDefault();

		var value = React.findDOMNode( this.refs.inputCity ).value;
		this.props.handleSubmit( value );
	},

	render: function() {
		return(
			<form action="#" method="get" onSubmit={ this.handleSubmit }>
				<div className="form-group">
					<label htmlFor="searchCity" className="sr-only">Search City</label>
					<div className="input-group">
						<input type="text" id="searchCity" className="form-control" ref="inputCity" placeholder="Type city" />
						<div className="input-group-btn">
							<input className="btn btn-danger" type="submit" value="Search" />
						</div>
					</div>
				</div>
			</form>
		);
	}
});

//- Total biaya perjalanan
var Total = React.createClass({
	//rendering
	render: function() {
		return (
			<div id="total">
				<h4>Total <span className="pull-right">Rp. {this.props.totalCost},-</span></h4>
			</div>
		);
	}
});

// Main app
var App = React.createClass({

	getInitialState: function () {
		return {
			destList: [],
			totalCost: 0,
		};
	},

	//- pas user nambah destinasi
	addDestination: function( elem ) {

		var dst_tmp = this.state.destList;
		var tc_tmp = this.state.totalCost;

		var price = ( elem.props.place.category == 'Culinary' ) ? 12000 : elem.props.place.day.friday.price;

		dst_tmp.push( elem );

		elem.setState({ selected: ! elem.state.selected });

		this.setState({
			destList: dst_tmp, // Nambahan tujuan wisata
			totalCost: tc_tmp + parseInt( price ) // Kalkulasi biaya total
		});

	},

	//- hapus destinasi
	deleteDestination: function( elem ) {

		//- pop up to ensure user to delete
		//- ## code ##

		// Cari array di destList
		for (var i = 0; i < this.state.destList.length; i++) {

			if ( this.state.destList[i].props.place.id === elem.props.place.id ) {
				index = i;
				break;
			}
		} // end for destList.length

		var price = ( elem.props.place.category == 'Culinary' ) ? 12000 : elem.props.day.friday.price;

		// delete arraynya
		this.state.destList.splice( index, 1 );
		this.setState({
			destList  : this.state.destList,
			totalCost : this.state.totalCost - price
		});

		// ubah state buttonnya
		elem.setState({
			selected : ! elem.state.selected 
		});

	},

	componentDidMount: function () {

		// Set toggle
		$('#toggle-dest-list').click( function() {
			$('#map-canvas').toggleClass('open');
			$('#wrap-dest-list').toggleClass('open');
		});

	},

	//- rendering
	render: function() {

		return(
			<div id="app">
				<div id="control">
					<div className="container">
						<div className="row">
							<div className="col-md-6 col-md-offset-3">
								<Control />
							</div>
						</div>
					</div>
				</div>
				<div id="main-app">
					<MapComponent
						addList={ this.addDestination }
						unList={ this.deleteDestination } />

					<aside id="wrap-dest-list" className="open">
						<div id="dest-list">
							<div className="container-fluid">
								<Destinations
									destList={ this.state.destList }
									unList={ this.deleteDestination } >

									<Total totalCost={ this.state.totalCost } />

								</Destinations>
							</div>
						</div>
						<div id="toggle-dest-list">
							<span className="fa fa-chevron-right"></span>
							<span>My Trips</span>
						</div>
					</aside>
				</div>
			</div>
		)
	}
});

// Inisialiasi
//var model = new DestModel('travel-app');

$(document).ready(function() {

	// Ambil dari URI
	var pathArray = window.location.pathname.split( '/' );
	if( pathArray[2] == '') pathArray[2] = 'Malang';

	$.get( "http://localhost:1337/places/" + pathArray[2], function( data ) {
		city       = data.city;
		places     = data.places;

		console.log( city );
		React.render(
			<App />,
			document.getElementById('wrap-app')
		);
	});

});