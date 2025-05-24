import { Client } from "@notionhq/client";
const notion = new Client({ auth: process.env.NOTION_KEY });

const database_id = process.env.DATABASE_ID;

export const getEvents = async () => {
  /**
   * Retrieves events from a Notion database.
   *
   * @async
   * @function getEvents
   * @returns {Promise<Array<{
   *   title: string,
   *   course: string,
   *   start_date: string,
   *   end_date: string,
   *   task: string,
   *   weight: number,
   *   scored: number,
   *   weightage: number,
   *   status: boolean,
   *   notes: string
   * }>>} An array of event objects with properties extracted from the Notion database
   * @throws {Error} If there's an issue with the Notion API request
   */
  try {
    const { results } = await notion.databases.query({
      database_id,
      sorts: [
        {
          property: "Dates",
          direction: "ascending",
        },
      ],
    });

    return results
      .map(({ properties: p }) => ({
        title: p.Name?.title[0]?.plain_text,
        course: p.Course?.select?.name,
        start_date: p.Dates?.date?.start,
        end_date: p.Dates?.date?.end,
        task: p.Task?.multi_select[0]?.name,
        weight: p.Weight?.formula?.number,
        scored: p.Scored?.number,
        weightage: p.Weightage?.number,
        status: p.Status?.checkbox,
        notes: p.Notes?.rich_text[0]?.plain_text,
      }))
      .filter((e) => e.title && e.start_date);
  } catch (err) {
    console.error("Error:", err);
  }
};
