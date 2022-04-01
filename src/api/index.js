const express = require('express');
const router = express.Router();
const { Client } = require('@notionhq/client');
const notion = new Client({ auth: process.env.NOTION_KEY });
const database_id = process.env.DATABASE_ID;
const { google } = require('googleapis');
const { OAuth2 } = google.auth;

const OAuth2Client = new OAuth2(
	process.env.OAUTH_CLIENTID,
	process.env.OAUTH_SECRET
);

OAuth2Client.setCredentials({
	refresh_token:
		'1//04dcksgB0SppTCgYIARAAGAQSNgF-L9IrY7OJGtSeTA8jxsztjIEalnAG7Ls9Pk2cxSO3ZJxlaPkABAR-7FZee-RPGVYAtZWDYA',
});
const calendar = google.calendar({ version: 'v3', auth: OAuth2Client });

// get calendar
router.get('/gcal', (req, res) => {

	const start_date = new Date('04/01/2022, 12:00:00');
	const end_date = new Date('04/01/2022, 13:00:00');

	var evt = {
		summary: 'Google I/O 2015',
		location: '800 Howard St., San Francisco, CA 94103',
		description: "A chance to hear more about Google's developer products.",
		start: {
			dateTime: start_date,
		},
		end: {
			dateTime: end_date,
		},
	};

	calendar.freebusy.query(
		{
			resource: {
				timeMin: start_date,
				timeMax: end_date,
				items: [
					{
						id: 'primary',
					},
				],
			},
		},
		(err, resp) => {
			if (err) return res.status(500).json({ error: err });

			const eventArr = resp.data.calendars.primary.busy;

			// Check if event array is empty which means we are not busy
			if (eventArr.length === 0) {
				// If we are not busy create a new calendar event.
				calendar.events.insert(
					{ calendarId: 'primary', resource: evt },
					(err) => {
						// Check for errors and log them if they exist.
						if (err) {
							return res
								.status(500)
								.json({ error: 'Error Creating Calender Event:' + err });
						}

						// Else log that the event was created.
						return res
							.status(201)
							.json({ data: 'Calendar event successfully created.' });
					}
				);
			} else {
				// If event array is not empty log that we are busy.
				return res.status(401).json({ error: `Sorry I'm busy...` });
			}
		}
	);
});

// GET retrieve the database
router.get('/retrieve', async (req, res) => {
	const response = await notion.databases.retrieve({ database_id });
	res.json({
		response,
	});
});

// GET - Query the database
router.get('/data', async (req, res) => {
	const { results } = await notion.databases.query({
		database_id,
		sorts: [
			{
				property: 'Dates',
				direction: 'ascending',
			},
		],
	});

	const shaped_result = results
		.map((e) => {
			const {
				Dates,
				Task,
				Weight,
				Weightage,
				Scored,
				Status,
				Notes,
				Course,
				Name,
			} = e.properties;

			return {
				title: Name?.title[0]?.plain_text,
				course: Course?.select?.name,
				start_date: Dates?.date?.start,
				end_date: Dates?.date?.end,
				task: Task?.multi_select[0]?.name,
				weight: Weight?.formula?.number,
				scored: Scored?.number,
				weightage: Weightage?.number,
				status: Status?.checkbox,
				notes: Notes?.rich_text[0]?.plain_text,
			};
		})
		.filter((e) => e.title && e.start_date);

	res.json({ length: shaped_result.length, shaped_result });
});


module.exports = router;
