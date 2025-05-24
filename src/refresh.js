import { getEvents } from './notion.js';
import { getGoogleEvents, insertEvent, updateEvent } from './gcal.js';
import { getDateTime } from './time.js';

// Configuration constants
const CONFIG = {
    TIMEZONE: 'Canada/Eastern',
    DELAY_MS: 1000,
    PERCENTAGE_MULTIPLIER: 100
};

/**
 * Formats event data for Google Calendar
 * @param {Object} eventData - Raw event data from Notion
 * @returns {Object} Formatted event data for Google Calendar
 */
const formatEventData = ({
    title,
    course,
    start_date,
    end_date,
    task,
    notes = '',
    weight,
    scored,
    weightage,
    status
}) => {
    const summary = `${course}: ${title}`;
    const formattedWeight = `${weight}/${weightage * CONFIG.PERCENTAGE_MULTIPLIER}`;
    const formattedScore = `${scored * CONFIG.PERCENTAGE_MULTIPLIER}%`;
    const formattedWeightage = `${weightage * CONFIG.PERCENTAGE_MULTIPLIER}%`;
    const formattedStatus = status ? 'Done' : 'Left';
    const { start_dateTime, end_dateTime } = getDateTime(start_date, end_date);

    return {
        summary,
        description: [
            `Course: ${course}`,
            `Status: ${formattedStatus}`,
            `Task: ${task}`,
            `Weightage: ${formattedWeightage}`,
            `Scored: ${formattedWeight}`,
            `Percentage: ${formattedScore}`,
            `Notes: ${notes}`
        ].join('\n'),
        start: {
            ...start_dateTime,
            timeZone: CONFIG.TIMEZONE
        },
        end: {
            ...end_dateTime,
            timeZone: CONFIG.TIMEZONE
        }
    };
};

/**
 * Processes a single event, either updating an existing one or creating a new one
 * @param {Object} event - Event data to process
 * @param {Array} existingEvents - List of existing Google Calendar events
 * @returns {Promise} Promise resolving to the event operation
 */
const processEvent = async (event, existingEvents) => {
    const formattedEvent = formatEventData(event);
    const foundEvent = existingEvents.find(
        ({ summary }) => summary === formattedEvent.summary
    );

    console.log(`Processing event: ${formattedEvent.summary}: ${formattedEvent.start.date}-${formattedEvent.end.date}`);
    
    try {
        if (foundEvent) {
            return await updateEvent(formattedEvent, foundEvent.id);
        }
        return await insertEvent(formattedEvent);
    } catch (error) {
        console.error(`Failed to process event ${formattedEvent.summary}:`, error);
        throw error;
    }
};

/**
 * Refreshes calendar events by syncing Notion events with Google Calendar
 * @returns {Promise<void>}
 */
const refresh = async () => {
    try {
        const [events, existingEvents] = await Promise.all([
            getEvents(),
            getGoogleEvents()
        ]);

        if (!events?.length) {
            console.log('No events found in Notion');
            return;
        }

        for (const event of events) {
            await processEvent(event, existingEvents);
            await delay(CONFIG.DELAY_MS);
        }

        console.log('All Calendar events successfully processed.');
    } catch (error) {
        console.error('Failed to refresh calendar events:', error);
        throw error;
    }
};

// Utility function for adding delays between operations
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default refresh;
