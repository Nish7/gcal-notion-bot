const { Client } = require('@notionhq/client');
const notion = new Client({ auth: process.env.NOTION_KEY });

const database_id = process.env.DATABASE_ID;

module.exports = {
	getEvents: async () => {
		try {
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

			return shaped_result;
		} catch (err) {
			console.error('Error:', err);
		}
	},
};
