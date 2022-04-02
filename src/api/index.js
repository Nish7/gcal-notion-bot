const express = require('express');
const router = express.Router();

const { getEvents } = require('../lib/notion');
const { getGoogleEvents, insertEvent, updateEvent } = require('../lib/gcal');
const { getDateTime } = require('../lib/time');

const delay = (time) => new Promise((res) => setTimeout(res, time));

router.get('/events', async (req, res) => {
	const events = await getEvents();
	const exis_events = await getGoogleEvents();

	const gcal_promises = [];

	for (let i = 0; i < events.length; i++) {
		const {
			title,
			course,
			start_date,
			end_date,
			task,
			notes,
			weight,
			scored,
			weightage,
			status,
		} = events[i];

		const summary = `${course}: ${title}`;
		const { start_datetime, end_datetime } = getDateTime(start_date, end_date);

		const evt = {
			summary,
			description: `Course: ${course} \nTask: ${task} \nWeight: ${weight} \nScores: ${scored} \nWeightage: ${weightage} \nStatus: ${status} \nNotes: ${notes}`,
			start: {
				...start_datetime,
				timeZone: 'Canada/Eastern',
			},
			end: {
				...end_datetime,
				timeZone: 'Canada/Eastern',
			},
		};

		const found_events = exis_events.filter(
			({ summary }) => summary == evt.summary
		);

		if (found_events.length > 0) {
			gcal_promises.push(updateEvent(evt, found_events[0].id));
		} else {
			gcal_promises.push(insertEvent(evt));
		}

		//! Note: Remove the if statement when inserting lots of new events; fine for updating
		if (i % 10 === 0) {
			await delay(1000);
		}
	}

	Promise.all(gcal_promises)
		.then(() => {
			return res
				.status(201)
				.json({ data: 'All Calendar events successfully created.' });
		})
		.catch((err) => {
			return res.status(400).json({ error: err });
		});
});


module.exports = router;
