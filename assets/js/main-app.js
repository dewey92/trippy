//- List destinasi mau kemana aja
var Destinations = React.createClass({
	render: function() {
		var destList = this.props.destList; // bentuknya array
		var unList = this.props.unList;

		return (
			<div id="destinations">		
				<h3 className="text-center">My Destinations</h3>
				<div className="image-container">
					<img src="/images/Malang.jpg" className="img img-responsive" />
				</div>

				{ this.props.children }

				<ul className="list-unstyled">
					{destList.map(function( place, index ) {
						return (
							<li key={ place.id }>
								{place.name} -
								<span style={ {color: 'blue', cursor: 'pointer'} } 
									href="#" title="delete city"
									onClick={ unList.bind( null, place, index ) }> ga jadi kesini
								</span>
							</li>
						)
					})}
				</ul>
			</div>
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

var App = React.createClass({

	getInitialState: function () {
		return {
			destList: [],
			totalCost: 0
		};
	},

	//- pas user nambah destinasi
	addDestination: function( placeToAdd ) {

		//this.props.model.addDest(itemToAdd);
		//this.forceUpdate();
		var dst_tmp = this.state.destList;
		var tc_tmp = this.state.totalCost;

		var price = 0;

		// Kalo kategorinya kuliner
		if ( placeToAdd.category == 'Culinary' )
			price = 12000;
		else
			price = placeToAdd.day.friday.price;

		dst_tmp.push( placeToAdd );

		this.setState({
			destList: dst_tmp, // Nambahan tujuan wisata
			totalCost: tc_tmp + parseInt( price ) // Kalkulasi biaya total
		});

	},

	//- hapus destinasi
	deleteDestination: function( placeToDelete, index ) {

		//- pop up to ensure user to delete
		//- ## code ##

		var dst_tmp = this.state.destList;
		var tc_tmp = this.state.totalCost;

		var price = 0;

		// Kalo kategorinya kuliner
		if ( placeToDelete.category == 'Culinary' )
			price = 12000;
		else
			price = placeToDelete.day.friday.price;

		// Kalo dioper dari tombol popup di map
		if ( index == null ) {
			// Cari place_id nya di array
			for (var i = 0; i < this.state.destList.length; i++) {

				if ( this.state.destList[i].id === placeToDelete.id ) {
					index = i;
					break;
				}
			} // end for destList.length
		}
		// Kalo dioper dari daftar listnya
		else {
			// Cukup ubah state tombol aja
		}

		// hapus array
		dst_tmp.splice( index, 1 );

		console.log( dst_tmp );

		this.setState({
			destList: dst_tmp, // Nambahan tujuan wisata
			totalCost: tc_tmp - parseInt( price ) // Kalkulasi biaya total
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
		)
	}
});

// Inisialiasi
//var model = new DestModel('travel-app');

React.render(
	<App />,
	document.getElementById('wrap-app')
);