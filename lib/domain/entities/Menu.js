'use restrict';

module.exports = class {

	constructor(cornerId = null, foods, price, calorie) {
		this.cornerId = cornerId;
		this.foods = foods;
		this.price = price;
		this.calorie = calorie;
	}

};
