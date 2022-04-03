const format = require('date-fns/format');
const { zonedTimeToUtc } = require('date-fns-tz');
const addHours = require('date-fns/addHours');
const addDays = require('date-fns/addDays');

module.exports = {
	getDateTime: (start_dateTime, end_dateTime) => {
		// assumed that end_datetime has a timeaswell: behavior from notion
		const isTime = start_dateTime.split('T').length > 1;

		if (isTime && !end_dateTime) {
			return {
				start_datetime: {
					dateTime: zonedTimeToUtc(start_dateTime, 'Canada/Eastern'),
				},
				end_datetime: {
					dateTime: addHours(
						zonedTimeToUtc(start_dateTime, 'Canada/Eastern'),
						1
					),
				},
			};
		} else if (!isTime && !end_dateTime) {
			return {
				start_datetime: {
					date: format(
						zonedTimeToUtc(start_dateTime, 'Canada/Eastern'),
						'yyyy-MM-dd'
					),
				},
				end_datetime: {
					date: format(
						zonedTimeToUtc(start_dateTime, 'Canada/Eastern'),
						'yyyy-MM-dd'
					),
				},
			};
		} else {
			if (isTime) {
				return {
					start_datetime: {
						dateTime: zonedTimeToUtc(start_dateTime, 'Canada/Eastern'),
					},
					end_datetime: {
						dateTime: zonedTimeToUtc(end_dateTime, 'Canada/Eastern'),
					},
				};
			} else {
				return {
					start_datetime: {
						date: format(
							zonedTimeToUtc(start_dateTime, 'Canada/Eastern'),
							'yyyy-MM-dd'
						),
					},
					end_datetime: {
						date: format(
							addDays(zonedTimeToUtc(end_dateTime, 'Canada/Eastern'), 1),
							'yyyy-MM-dd'
						),
					},
				};
			}
		}
	},
};
