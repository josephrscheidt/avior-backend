module.exports = {
	daysBetween: function (date1, date2) {
		var one_day = 1000 * 60 * 60 * 24;

		var date1_ms = date1.getTime();
		var date2_ms = date2.getTime();

		var difference_ms = date2_ms - date1_ms;

		return Math.round(difference_ms/one_day);
	},

	getWeekDates: function(date){

		var datetime = (date) ? new Date(date) : new Date();
		
		let day = datetime.getDay();

		let start = new Date(datetime.setDate(datetime.getDate() - day));
		
		let end = new Date(datetime.setDate(start.getDate() + 6));

		return {'startDate' : start.toJSON().slice(0, 10), 'endDate': end.toJSON().slice(0, 10)};
	},

	getWeek: function(mainDate, compareDate = ''){

		var datetime = (compareDate != '') ? new Date(compareDate) : new Date();

		var start_date_ms = Date.parse(this.getWeekDates(mainDate).startDate);

		var datetime_ms = datetime.getTime();

		var one_week = 1000 * 60 * 60 * 24 * 7;

		var week = Math.floor( (datetime_ms - start_date_ms) / one_week );

		return week;
	},

	formatDate(date) {

		var d = new Date(date),
		month = '' + (d.getMonth() + 1),
		day = '' + d.getDate(),
		year = d.getFullYear();

		if (month.length < 2) month = '0' + month;
		if (day.length < 2) day = '0' + day;

		return [year, month, day].join('-');
	}

}