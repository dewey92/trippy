/*It's a model for destination list*/

var DestModel = function(key) {
	this.key = key;
	this.destList = [];
	this.totalCost = 0;
}

DestModel.prototype.addDest = function (obj) {
	this.destList.push(obj); // Nambahan tujuan wisata
	this.totalCost += parseInt(obj.cost); // Kalkulasi biaya total
}

DestModel.prototype.deleteDest = function (index) {
	/*var index = 0,
			dl = this.destList;

	for (var i = 0, len = dl.length; i < len; i++) {
		if (dl[i].id === obj.id) {
			index = i;
			i = len;
		}
	};

	// buang satu list nya
	dl.splice(index, 1);
	this.destList = dl;*/
	this.totalCost -= parseInt(this.destList[index].cost); // Kurangi biaya total
	this.destList.splice(index, 1);
}

DestModel.prototype.destroyDest = function () {
	this.destList = [];
	this.totalCost = 0;
}

DestModel.prototype.reorderDest = function () {
	this.destList = this.destList.filter(function (candidate) {
		return candidate !== destList;
	});
}