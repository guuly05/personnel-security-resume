import { google } from 'googleapis';

type GoogleAuthBundle = {
  client: ReturnType<typeof google.calendar>;
};

let cachedCalendar: ReturnType<typeof google.calendar> | null = null;

export function getGoogleCalendarClient() {
  if (cachedCalendar) return cachedCalendar;

  const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN } = process.env;
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_REFRESH_TOKEN) {
    throw new Error('Google Calendar OAuth environment variables are not configured.');
  }

  const auth = new google.auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET);
  auth.setCredentials({ refresh_token: GOOGLE_REFRESH_TOKEN });
  cachedCalendar = google.calendar({ version: 'v3', auth });
  return cachedCalendar;
}

export function getCalendarId(): string {
  const calendarId = process.env.GOOGLE_CALENDAR_ID;
  if (!calendarId) {
    throw new Error('GOOGLE_CALENDAR_ID is not configured.');
  }
  return calendarId;
}
