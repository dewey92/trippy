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
				<MapComponent addList={this._addDestination} />
				
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
			</div>
		)
	}
});

// Inisialiasi
var model = new DestModel('travel-app');

React.render(
	<App model={model} />,
	document.getElementById('wrap-app')
);