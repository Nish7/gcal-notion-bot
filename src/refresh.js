const { getEvents } = require('./notion');
const { getGoogleEvents, insertEvent, updateEvent } = require('./gcal');
const { getDateTime } = require('./time');

const delay = (time) => new Promise((res) => setTimeout(res, time));

const refresh = async () => {
	const events = await getEvents();
	const exis_events = await getGoogleEvents();

	const gcal_promises = [];

	for (let i = 0; i < events.length; i++) {
		let {
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
		weight = weight + '/' + weightage * 100;
		scored = scored * 100 + '%';
		weightage = weightage * 100 + '%';
		status = status ? 'Done' : 'Left';
		notes = notes ?? '';
		const { start_dateTime, end_dateTime } = getDateTime(start_date, end_date);

		console.log(summary, start_dateTime, end_dateTime);

		const evt = {
			summary,
			description: `Course: ${course} \nStatus: ${status} \nTask: ${task} \nWeightage: ${weightage} \nScored: ${weight} \nPercentage: ${scored} \nNotes: ${notes}`,
			start: {
				...start_dateTime,
				timeZone: 'Canada/Eastern',
			},
			end: {
				...end_dateTime,
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
			console.log('All Calendar events successfully created.');
		})
		.catch((err) => {
			console.error('GCAL ERROR: ', err);
		});
};

module.exports = refresh;
