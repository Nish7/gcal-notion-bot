# Google Calendar - Notion Integration
[![refresh-events](https://github.com/Nish7/gcal-notion-bot/actions/workflows/refresh.yml/badge.svg?branch=node-bot)](https://github.com/Nish7/gcal-notion-bot/actions/workflows/refresh.yml)

Automatically syncs events from a Notion database to Google Calendar, including details like course, title, status, task, weightage, scores, and notes.

## Features
- Syncs Notion database entries to Google Calendar events
- Automatically updates existing events when Notion entries change
- Preserves all metadata including scores, weightage, and notes
- Runs on a schedule or can be triggered manually

## Setup

### 1. Notion Setup
1. Create a Notion integration at https://www.notion.so/my-integrations
2. Copy your integration secret (this will be your `NOTION_KEY`)
3. Share your Notion database with the integration
4. Copy your database ID from the URL (this will be your `DATABASE_ID`)
   - The ID is the part of the URL after the workspace name and before the query parameters
   - Example: `https://notion.so/workspace/1234567890abcdef1234567890abcdef`
   - In this case, `1234567890abcdef1234567890abcdef` is your database ID

### 2. Google Calendar Setup
1. Go to the Google Cloud Console: https://console.cloud.google.com
2. Create a new project or select an existing one
3. Enable the Google Calendar API
4. Go to Credentials and create OAuth 2.0 Client credentials
   - Set up the OAuth consent screen if needed
   - Add the required scopes for Google Calendar
5. Download the client credentials
   - `OAUTH_CLIENTID` and `OAUTH_SECRET` will be in this file
6. Get your `REFRESH_TOKEN` using Google OAuth 2.0 Playground:
   - Go to https://developers.google.com/oauthplayground/
   - Click ⚙️ (Settings) in the top right
   - Check "Use your own OAuth credentials"
   - Enter your OAuth Client ID and Secret
   - Close settings
   - On the left, find or search for:
     - `https://www.googleapis.com/auth/calendar`
     - `https://www.googleapis.com/auth/calendar.events`
   - Select both scopes
   - Click "Authorize APIs" and sign in
   - Click "Exchange authorization code for tokens"
   - Copy the "Refresh token" value

### 3. Environment Variables
1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Fill in your credentials in `.env`:
   - `OAUTH_CLIENTID`: Your Google OAuth Client ID
   - `OAUTH_SECRET`: Your Google OAuth Client Secret
   - `REFRESH_TOKEN`: Your Google OAuth Refresh Token (obtained from OAuth Playground)
   - `NOTION_KEY`: Your Notion Integration Secret
   - `DATABASE_ID`: Your Notion Database ID
   - `TZ`: Your timezone (default: Canada/Eastern)

## Running the Project

### With Bun

Bun has built-in support for loading environment variables from your `.env` file, so you do not need to use `dotenv` when running with Bun.

```bash
# Install dependencies
bun install

# Start the sync process
bun run start

# Development mode with hot reload
bun run dev
```

After running `bun install`, Bun will generate a `bun.lockb` file for reproducible installs. You should commit this file to version control.

### With Node

```bash
# Install dependencies
npm install

# Start the sync process
npm start
```

## Required Notion Database Structure

Your Notion database should have the following properties:
- `Name` (Title): Event title
- `Course` (Select): Course name
- `Dates` (Date): Event date/time
- `Task` (Multi-select): Task type
- `Weight` (Number): Score weight
- `Weightage` (Number): Total possible weight
- `Scored` (Number): Actual score
- `Status` (Checkbox): Completion status
- `Notes` (Text): Additional notes (optional)

## License
MIT
