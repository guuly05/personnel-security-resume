import { google } from 'googleapis';

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function getBaseUrl(req: any): string {
  const envUrl = process.env.APP_URL || process.env.VERCEL_URL;
  if (envUrl) {
    return envUrl.startsWith('http') ? envUrl : `https://${envUrl}`;
  }

  const host = req.headers.host ?? 'localhost:3000';
  const proto = host.includes('localhost') || host.includes('127.0.0.1') ? 'http' : 'https';
  return `${proto}://${host}`;
}

function getRedirectUri(req: any): string {
  return process.env.GOOGLE_REDIRECT_URI || `${getBaseUrl(req)}/api/oauth2callback`;
}

function getOAuthClient(req: any) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error('GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are required.');
  }
  return new google.auth.OAuth2(clientId, clientSecret, getRedirectUri(req));
}

export default async function handler(req: any, res: any) {
  const oauth2Client = getOAuthClient(req);
  const redirectUri = getRedirectUri(req);

  if (req.method === 'GET' && !req.query.code && !req.query.error) {
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      scope: ['https://www.googleapis.com/auth/calendar'],
      redirect_uri: redirectUri,
    });

    return res
      .status(200)
      .setHeader('Content-Type', 'text/html; charset=utf-8')
      .send(`<!doctype html>
        <html>
          <head><meta charset="utf-8"><title>Google OAuth Setup</title></head>
          <body style="font-family: system-ui; padding: 2rem; line-height: 1.5;">
            <h1>Google OAuth Setup</h1>
            <p><a href="${escapeHtml(authUrl)}">Click here to authorize Google Calendar access</a></p>
            <p>After approval, Google will redirect back here and the page will display your refresh token.</p>
            <p><strong>Redirect URI for Google Cloud Console:</strong><br><code>${escapeHtml(redirectUri)}</code></p>
          </body>
        </html>`);
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (req.query.error) {
    return res.status(400).json({ error: String(req.query.error) });
  }

  const code = typeof req.query.code === 'string' ? req.query.code : '';
  if (!code) {
    return res.status(400).json({ error: 'Missing authorization code.' });
  }

  try {
    const { tokens } = await oauth2Client.getToken(code);
    const refreshToken = tokens.refresh_token ?? null;
    const accessToken = tokens.access_token ?? null;

    return res
      .status(200)
      .setHeader('Content-Type', 'text/html; charset=utf-8')
      .send(`<!doctype html>
        <html>
          <head><meta charset="utf-8"><title>OAuth Complete</title></head>
          <body style="font-family: system-ui; padding: 2rem; line-height: 1.5;">
            <h1>OAuth complete</h1>
            <p>Copy this refresh token into Vercel:</p>
            <pre style="white-space: pre-wrap; padding: 1rem; background: #f3f4f6; border: 1px solid #d1d5db;">${escapeHtml(refreshToken || 'No refresh token returned. Re-run consent with prompt=consent, or revoke previous access and try again.')}</pre>
            <p>Access token: <code>${escapeHtml(accessToken || '')}</code></p>
            <p>Redirect URI used: <code>${escapeHtml(redirectUri)}</code></p>
          </body>
        </html>`);
  } catch (error) {
    console.error('OAuth exchange failed:', error);
    return res.status(500).json({ error: 'Unable to exchange authorization code.' });
  }
}
