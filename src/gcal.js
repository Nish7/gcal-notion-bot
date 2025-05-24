import { google } from 'googleapis';
const { OAuth2 } = google.auth;

// Configuration constants
const CONFIG = {
    CALENDAR_ID: 'primary',
    API_VERSION: 'v3'
};

const OAuth2Client = new OAuth2(
	process.env.OAUTH_CLIENTID,
	process.env.OAUTH_SECRET
);

OAuth2Client.setCredentials({
	refresh_token: process.env.REFRESH_TOKEN,
});

const calendar = google.calendar({ version: 'v3', auth: OAuth2Client });

/**
 * Retrieves events from the user's primary Google Calendar.
 * @returns {Promise<Array<{id: string, start: Object, end: Object, summary: string, description: string}>>} 
 * A promise that resolves to an array of calendar events.
 * @throws {Error} If the API call fails
 */
export const getGoogleEvents = async () => {
    try {
        const response = await calendar.events.list({
            calendarId: CONFIG.CALENDAR_ID
        });

        return response.data.items.map(({ id, start, end, summary, description }) => ({
            id,
            start,
            end,
            summary,
            description
        }));
    } catch (error) {
        console.error('Failed to fetch Google Calendar events:', error);
        throw new Error(`Failed to fetch calendar events: ${error.message}`);
    }
};

/**
 * Inserts a new event into Google Calendar
 * @param {Object} evt - The event object to insert
 * @returns {Promise<Object>} A promise that resolves to the created event
 * @throws {Error} If the API call fails
 */
export const insertEvent = async (evt) => {
    try {
        const response = calendar.events.insert({
            calendarId: CONFIG.CALENDAR_ID,
            resource: evt
        });
        return response.data;
    } catch (error) {
        console.error('Failed to insert calendar event:', error);
        throw new Error(`Failed to insert event: ${error.message}`);
    }
};

/**
 * Updates an existing event in Google Calendar
 * @param {Object} evt - The event object with updated details
 * @param {string} id - The ID of the event to update
 * @returns {Promise<Object>} A promise that resolves to the updated event
 * @throws {Error} If the API call fails
 */
export const updateEvent = async (evt, id) => {
    try {
        const response = calendar.events.update({
            calendarId: CONFIG.CALENDAR_ID,
            eventId: id,
            resource: evt
        });
        return response.data;
    } catch (error) {
        console.error(`Failed to update calendar event ${id}:`, error);
        throw new Error(`Failed to update event: ${error.message}`);
    }
};
