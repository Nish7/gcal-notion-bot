const format = require('date-fns/format');
const { google } = require('googleapis');
const { OAuth2 } = google.auth;

const OAuth2Client = new OAuth2(
	process.env.OAUTH_CLIENTID,
	process.env.OAUTH_SECRET
);

OAuth2Client.setCredentials({
	refresh_token: process.env.REFRESH_TOKEN,
});

const calendar = google.calendar({ version: 'v3', auth: OAuth2Client });

module.exports = {
	getGoogleEvents: () => {
		return new Promise((resolve, reject) => {
			calendar.events.list({ calendarId: 'primary' }, (err, resp) => {
				if (err) reject(err);

				const items = resp.data.items.map(
					({ id, start, end, summary, description }) => ({
						id,
						start,
						end,
						summary,
						description,
					})
				);

				// console.log(items)
				resolve(items);
			});
		});
	},

	insertEvent: (evt, allDay) => {
		if (allDay) {
			evt = {
				...evt,
				start: {
					date: format(evt.start.dateTime, 'yyyy-MM-dd'),
					timeZone: 'Canada/Eastern',
				},
				end: {
					date: format(evt.end.dateTime, 'yyyy-MM-dd'),
					timeZone: 'Canada/Eastern',
				},
			};
		}

		return new Promise((resolve, reject) => {
			calendar.events.insert(
				{
					calendarId: 'primary',
					resource: evt,
				},
				(err) => {
					if (err) reject(err);
					resolve();
				}
			);
		});
	},

	updateEvent: (evt, allDay, id) => {
		if (allDay) {
			evt = {
				...evt,
				start: {
					date: format(evt.start.dateTime, 'yyyy-MM-dd'),
					timeZone: 'Canada/Eastern',
				},
				end: {
					date: format(evt.end.dateTime, 'yyyy-MM-dd'),
					timeZone: 'Canada/Eastern',
				},
			};
		}

		return new Promise((resolve, reject) => {
			calendar.events.update(
				{
					calendarId: 'primary',
					eventId: id,
					resource: evt,
				},
				(err) => {
					if (err) reject(err);
					resolve();
				}
			);
		});
	},
};
