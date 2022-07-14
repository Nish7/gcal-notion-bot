const format = require('date-fns/format');
const addHours = require('date-fns/addHours');
const addDays = require('date-fns/addDays');

module.exports = {
	getDateTime: (start_dateTime, end_dateTime) => {
		const isTime = start_dateTime.split('T').length > 1;

		const tm = {
			start_dateTime: {},
			end_dateTime: {},
		};

		if (isTime && !end_dateTime) {
			// 2022-01-20T00:00:00 - null
			tm['start_dateTime']['dateTime'] = new Date(start_dateTime.replace('+05:30','-04:00'));
			tm['end_dateTime']['dateTime'] = addHours(new Date(start_dateTime.replace('+05:30','-04:00')), 1);
		} else if (!isTime && !end_dateTime) {
			// 2022-01-20 - null
			tm['start_dateTime']['date'] = format(
				new Date(start_dateTime + 'T00:00:00-04:00'),
				'yyyy-MM-dd'
			);

			tm['end_dateTime']['date'] = tm['start_dateTime']['date'];
		} else if (isTime && end_dateTime) {
			// 2022-01-20T00:00:00 - 2022-01-20T00:00:00
			tm['start_dateTime']['dateTime'] = new Date(start_dateTime);
			tm['end_dateTime']['dateTime'] = new Date(end_dateTime);
		} else if (!isTime && end_dateTime) {
			// 2022-01-20 - 2022-01-20
			tm['start_dateTime']['date'] = format(
				new Date(start_dateTime + 'T00:00:00-04:00'),
				'yyyy-MM-dd'
			);
			tm['end_dateTime']['date'] = format(
				addDays(new Date(end_dateTime + 'T00:00:00-04:00'), 1),
				'yyyy-MM-dd'
			);
		}

		console.log(tm);
		return tm;
	},
};
