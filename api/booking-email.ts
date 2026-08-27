import { Resend } from 'resend';
import { BOOKING_CONFIG } from '../src/booking/config.js';
import { BookingRecord } from './booking-store.js';

function escapeHtml(value: string): string {
  return value.replace(/[&<>'"]/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;',
  }[character] ?? character));
}

function getManageUrl(token: string): string {
  const base = (process.env.APP_URL ?? '').replace(/\/$/, '');
  return `${base}/book?manage=${encodeURIComponent(token)}`;
}

export async function sendBookingConfirmation(record: BookingRecord, manageToken: string): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.BOOKING_CONFIRMATION_FROM_EMAIL ?? process.env.CONTACT_FROM_EMAIL;
  if (!apiKey || !from) return false;

  const manageUrl = getManageUrl(manageToken);
  const calendarLink = record.calendarLink;
  const meetLink = record.meetLink;
  const subject = `Booking confirmed for ${record.date} at ${record.time} (${BOOKING_CONFIG.timezone})`;
  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#172033">
      <h2>Your cybersecurity call is confirmed</h2>
      <p><strong>When:</strong> ${escapeHtml(record.date)} at ${escapeHtml(record.time)} (${escapeHtml(BOOKING_CONFIG.timezone)})</p>
      <p><strong>Duration:</strong> ${BOOKING_CONFIG.slotMinutes} minutes</p>
      ${meetLink ? `<p><a href="${escapeHtml(meetLink)}">Join Google Meet</a></p>` : ''}
      ${calendarLink ? `<p><a href="${escapeHtml(calendarLink)}">Open calendar event</a></p>` : ''}
      <p><a href="${escapeHtml(manageUrl)}">Manage, cancel, or reschedule this booking</a></p>
      <p style="color:#526176">Your calendar invite was also sent by Google Calendar.</p>
    </div>`;
  const text = [
    'Your cybersecurity call is confirmed.',
    `When: ${record.date} at ${record.time} (${BOOKING_CONFIG.timezone})`,
    meetLink ? `Join Google Meet: ${meetLink}` : '',
    calendarLink ? `Open calendar event: ${calendarLink}` : '',
    `Manage, cancel, or reschedule: ${manageUrl}`,
  ].filter(Boolean).join('\n');

  try {
    const resend = new Resend(apiKey);
    await resend.emails.send({ from, to: [record.email], subject, text, html });
    return true;
  } catch (error) {
    console.error('Booking confirmation email error:', error);
    return false;
  }
}
