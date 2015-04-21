/**
 * PlaceController
 *
 * @description :: Server-side logic for managing places
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	


	/**
	 * `PlaceController.city()`
	 */
	cityInformation: function (req, res) {

		var cityName = req.param('cityName');

		City.find({
			name: cityName
		}).exec( function(err, cityInfo) {
			return res.render('main-app', {
				cityInfo: cityInfo,
				cityName: cityName
			});
		});

	},

	/**
	 * `PlaceController.getPlacesByCity()`
	 */
	getPlacesByCity: function (req, res) {

		var cityName = req.param('cityName');

		// Ambil coordinates kotanya
		City.findOne({
			name : cityName
		})
		.exec( function(err, city) {

			// Cari tempat sekitar
			Place.find({
				city : cityName
			})
			.exec( function(err2, places) {

				return res.json({
					city: city,
					places: places
				});
			});

		});

	},


	/**
	 * `PlaceController.create()`
	 */
	create: function (req, res) {
		return res.json({
			todo: 'create() is not implemented yet!'
		});
	},


	/**
	 * `PlaceController.update()`
	 */
	update: function (req, res) {
		return res.json({
			todo: 'update() is not implemented yet!'
		});
	},


	/**
	 * `PlaceController.delete()`
	 */
	delete: function (req, res) {
		return res.json({
			todo: 'delete() is not implemented yet!'
		});
	}
};

