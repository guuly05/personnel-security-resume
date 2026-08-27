let cachedCalendar: any = null;

export async function getGoogleCalendarClient() {
  if (cachedCalendar) return cachedCalendar;

  const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN } = process.env;
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_REFRESH_TOKEN) {
    throw new Error('Google Calendar OAuth environment variables are not configured.');
  }

  // Load Google only when a request reaches this route. This keeps the serverless
  // function bootable even if its dependency initialization fails.
  const { google } = await import('googleapis');
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
