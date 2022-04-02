const format = require('date-fns/format');
const addHours = require('date-fns/addHours');
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

function addEvent(evt, allDay, res) {
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

	calendar.events.insert(
		{
			calendarId: 'primary',
			resource: evt,
		},
		(err) => {
			if (err) {
				console.error(err);
				return res
					.status(500)
					.json({ error: 'Error Creating Calender Event:' + err });
			}
		}
	);
}

module.exports = {
	insertEvent: (evt, allDay, res) => {
		calendar.events.list(
			{
				resource: {
					timeMin: evt.start.dateTime,
					timeMax: addHours(evt.end.dateTime, 1),
					items: [
						{
							id: 'primary',
						},
					],
				},
			},
			(err, resp) => {
				if (err) return console.error(err);

				console.log(resp.data.calendars?.primary);

				if (resp.data.calendars?.primary?.busy.length == 0) {
					addEvent(evt, allDay, res);
				} else {
					return res.status(401).json({ error: `Sorry I'm busy...` });
				}
			}
		);
	},
};
