import 'dotenv/config';
import express from 'express';
import { google } from 'googleapis';

const PORT = Number(process.env.OAUTH_PORT ?? 3000);
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI ?? `http://localhost:${PORT}/api/oauth2callback`;
const SCOPES = ['https://www.googleapis.com/auth/calendar'];

if (!CLIENT_ID || !CLIENT_SECRET) {
  throw new Error('Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET before running this helper.');
}

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
const app = express();

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

app.get('/', (_req, res) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: SCOPES,
  });

  res.type('html').send(`<!doctype html>
    <html>
      <head><meta charset="utf-8"><title>Google OAuth Helper</title></head>
      <body style="font-family: system-ui; padding: 2rem; line-height: 1.5;">
        <h1>Google OAuth Helper</h1>
        <p>Click the link below to open Google's consent screen:</p>
        <p><a href="${escapeHtml(authUrl)}">${escapeHtml(authUrl)}</a></p>
        <p><strong>Redirect URI to register in Google Cloud Console:</strong><br><code>${escapeHtml(REDIRECT_URI)}</code></p>
      </body>
    </html>`);
});

app.get('/api/oauth2callback', async (req, res) => {
  const code = typeof req.query.code === 'string' ? req.query.code : '';
  const error = typeof req.query.error === 'string' ? req.query.error : '';

  if (error) {
    res.status(400).type('html').send(`<pre>${escapeHtml(error)}</pre>`);
    return;
  }

  if (!code) {
    res.status(400).type('html').send('<pre>Missing authorization code.</pre>');
    return;
  }

  try {
    const { tokens } = await oauth2Client.getToken(code);
    const refreshToken = tokens.refresh_token ?? 'No refresh token returned. Revoke access and try again with prompt=consent.';
    const accessToken = tokens.access_token ?? '';

    res.type('html').send(`<!doctype html>
      <html>
        <head><meta charset="utf-8"><title>OAuth Complete</title></head>
        <body style="font-family: system-ui; padding: 2rem; line-height: 1.5;">
          <h1>OAuth complete</h1>
          <p>Copy this refresh token into Vercel:</p>
          <pre style="white-space: pre-wrap; padding: 1rem; background: #f3f4f6; border: 1px solid #d1d5db;">${escapeHtml(refreshToken)}</pre>
          <p>Access token:</p>
          <pre style="white-space: pre-wrap; padding: 1rem; background: #f3f4f6; border: 1px solid #d1d5db;">${escapeHtml(accessToken)}</pre>
        </body>
      </html>`);

    console.log('\nRefresh token:\n', refreshToken);
    process.stdout.write('\nAccess token:\n');
    process.stdout.write(`${accessToken}\n`);
  } catch (error) {
    console.error('OAuth exchange failed:', error);
    res.status(500).type('html').send('<pre>Unable to exchange authorization code.</pre>');
  }
});

app.listen(PORT, () => {
  console.log(`OAuth helper running on http://localhost:${PORT}`);
  console.log(`Redirect URI: ${REDIRECT_URI}`);
});
