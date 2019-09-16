/* Function takes in an array of trips which has a start and end date and returns an object containing all the trips with their start date, end date, and all the dates in between and a color associated with each unique trip */

const colors = [
	"red",
	"orange",
	"yellow",
	"green",
	"blue",
	"indigo",
	"lightgray"
];

Date.prototype.addDays = function(days) {
	let date = new Date(this.valueOf());
	date.setDate(date.getDate() + days);
	return date;
};

const convertDate = function(str) {
	let date = new Date(str),
		mnth = ("0" + (date.getMonth() + 1)).slice(-2),
		day = ("0" + date.getDate()).slice(-2);
	return [date.getFullYear(), mnth, day].join("-");
};

const getDates = function(startDate, stopDate, i) {
	let dateObj = {};
	let currentDate = new Date(startDate);
	let stop = new Date(stopDate);
	while (currentDate < stop) {
		currentDate = currentDate.addDays(1);
		dateObj[convertDate(currentDate)] = { color: colors[i] };
	}
	dateObj[startDate] = { startingDay: true, color: colors[i] };
	dateObj[stopDate] = {
		endingDay: true,
		color: colors[i]
	};
	dateObj.color = colors[i];
	return dateObj;
};

const markedDate = function(trips = []) {
	let tripsArr = [];
	for (let i = 0; i < trips.length; i++) {
		tripsArr.push({
			name: trips[i].name,
			location: trips[i].location,
			description: trips[i].description,
			markedDates: getDates(trips[i].starts_on, trips[i].ends_on, i)
		});
	}
	return tripsArr;
};

export default markedDate;
