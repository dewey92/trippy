var cities = [
	{
		id: 1, cost: '50000', name: 'Jatim Park 1'
	}, {
		id: 2, cost: '75000', name: 'Jatim Park 2'
	}, {
		id: 3, cost: '3000', name: 'Museum Brawijaya'
	}, {
		id: 4, cost: '60000', name: 'Ecogreen'
	}, {
		id: 5, cost: '0', name: 'Malang Tempo Doeloe'
	}, {
		id: 6, cost: '17500', name: 'Oleh-oleh Lancar Jaya'
	}, {
		id: 7, cost: '4000', name: 'Ketan Legend'
	}
];

//- Wrapper nampilkan kota
var WrapCities = React.createClass({
	render: function() {
		var rows = this.props.data;
		var addList = this.props.addList;
		return (
			<div id="cities">
				<h3>Daptar Qota</h3>
				<ul className="list-inline">
					{rows.map(function(row) {
						return (
							<li>
								<input type="text" name="blabla" placeholder="isi waktu" className="form-control" />
								<button className="city btn" onClick={addList.bind(this, row)}>{row.name}</button>
							</li>
						)
					})}
				</ul>
			</div>
		);
	}
});

//- List destinasi mau kemana aja
var Destinations = React.createClass({
	render: function() {
		var myDestinations = this.props.destinationList; // bentuknya array
		var unList = this.props.unList;

		return (
			<div id="destinations">
				<h4>My Destinations</h4>
				<ul className="list-unstyled">
					{myDestinations.map(function(myDestination, index) {
						return (
							<li>
								{myDestination.name} [<span style={ {color: 'blue', cursor: 'pointer'} } href="#" title="delete city" onClick={unList.bind(this, myDestination, index)}>ga jadi kesini</span>]
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
				<h5>Rp. {this.props.totalCost},-</h5>
			</div>
		);
	}
});

var App = React.createClass({

	//- pas user nambah destinasi
	_addDestination: function(itemToAdd) {
		this.props.model.addDest(itemToAdd);

		this.forceUpdate();
	},

	//- hapus destinasi
	_deleteDestination: function(itemToDelete, index) {

		//- pop up to ensure user to delete
		//- ## code ##

		this.props.model.deleteDest(index);
		this.forceUpdate();
	},

	//- rendering
	render: function() {
		return(
			<div id="app">
				<MapComponent />
				
				<div id="input-search-box">
					<input type="text" name="search-place" id="search-place" className="form-control" />
				</div>
				<aside id="left">
					<div className="container-fluid">
						<Destinations destinationList={this.props.model.destList} unList={this._deleteDestination} />
						<br/>
						<Total totalCost={this.props.model.totalCost} />
					</div>
				</aside>
				<div id="right">
					<WrapCities data={cities} addList={this._addDestination} />
				</div>
			</div>
		)
	}
});

var model = new DestModel('travel-app');

React.render(
	<App model={model} />,
	document.getElementById('wrap-app')
);