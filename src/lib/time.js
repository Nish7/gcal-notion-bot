const { zonedTimeToUtc } = require('date-fns-tz');
const addHours = require('date-fns/addHours');

module.exports = {
	getDateTime: (start_dateTime, end_dateTime) => {
		// assumed that end_datetime has a timeaswell: behavior from notion
		const isTime = start_dateTime.split('T').length > 1;

		if (isTime && !end_dateTime) {
			return {
				start_datetime: zonedTimeToUtc(start_dateTime, 'Canada/Eastern'),
				end_datetime: addHours(
					zonedTimeToUtc(start_dateTime, 'Canada/Eastern'),
					1
				),
				allDay: false,
			};
		} else if (!isTime && !end_dateTime) {
			return {
				start_datetime: zonedTimeToUtc(start_dateTime, 'Canada/Eastern'),
				end_datetime: zonedTimeToUtc(start_dateTime, 'Canada/Eastern'),
				allDay: true,
			};
		} else {
			return {
				start_datetime: zonedTimeToUtc(start_dateTime, 'Canada/Eastern'),
				end_datetime: zonedTimeToUtc(end_dateTime, 'Canada/Eastern'),
				allDay: !isTime,
			};
		}
	},
};
