const express = require('express');
const router = express.Router();

const { getEvents } = require('../lib/notion');
const { insertEvent } = require('../lib/gcal');
const { getDateTime } = require('../lib/time');

router.get('/events', async (req, res) => {
	// const events = await getEvents();

	const events = [
		{
			title: 'Quiz 1 ',
			course: 'CPS412',
			start_date: '2022-01-28',
			end_date: null,
			task: 'Quiz',
			weight: 10,
			scored: 1,
			weightage: 0.1,
			status: true,
			notes: 'WIO: Computer Science as a Catalyst',
		},
		{
			title: 'Final Exam',
			course: 'MTH207',
			start_date: '2022-04-22T18:00:00.000-04:00',
			end_date: '2022-04-24T23:00:00.000-04:00',
			task: 'Exam',
			weight: 0,
			scored: null,
			weightage: 0.4,
			status: false,
		},
		{
			title: 'Midterm 1',
			course: 'MTH207',
			start_date: '2022-02-11',
			end_date: '2022-02-13',
			task: 'Exam',
			weight: 13.6665,
			scored: 0.9111,
			weightage: 0.15,
			status: true,
			notes: 'Till Chp 2.5 .. Including Chp1 (No Trig)',
		},
		{
			title: 'Final Exam',
			course: 'CPS412',
			start_date: '2022-04-19T15:00:00.000-04:00',
			end_date: null,
			task: 'Exam',
			weight: 0,
			scored: null,
			weightage: 0.2,
			status: false,
		},
	];

	events.forEach(
		({
			title: summary,
			course,
			start_date,
			end_date,
			task,
			weight,
			scored,
			weightage,
			status,
		}) => {
			const { start_datetime, end_datetime, allDay } = getDateTime(
				start_date,
				end_date
			);

			const evt = {
				summary,
				description: `Course: ${course} \n Task: ${task} \n Weight: ${weight} \n Scores: ${scored} \n Weightage: ${weightage} \n Status: ${status} `,
				start: {
					dateTime: start_datetime,
					timeZone: 'Canada/Eastern',
				},
				end: {
					dateTime: end_datetime,
					timeZone: 'Canada/Eastern',
				},
			};

			insertEvent(evt, allDay, res);
		}
	);

	return res.status(201).json({ data: 'Calendar event successfully created.' });
});


module.exports = router;
