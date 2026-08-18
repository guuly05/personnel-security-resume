import React, { useEffect, useMemo, useState } from 'react';
import { toZonedTime } from 'date-fns-tz';
import { Icon } from '../components/Icon';
import { BOOKING_CONFIG } from '../booking/config';

type MonthAvailability = { month: string; days: string[] };
type DayAvailability = { date: string; slots: Array<{ start: string; end: string; label: string }> };

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

function monthKey(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}`;
}

function buildMonthLabel(month: string): string {
  const [year, monthNum] = month.split('-').map(Number);
  return new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric' }).format(new Date(year, monthNum - 1, 1));
}

export default function BookCallPage() {
  const today = useMemo(() => toZonedTime(new Date(), BOOKING_CONFIG.timezone), []);
  const [selectedMonth, setSelectedMonth] = useState(monthKey(today));
  const [availability, setAvailability] = useState<MonthAvailability | null>(null);
  const [dayAvailability, setDayAvailability] = useState<DayAvailability | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'booking' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    let active = true;
    setStatus('loading');
    fetch(`/api/availability?month=${selectedMonth}`)
      .then((response) => response.json())
      .then((data: MonthAvailability) => {
        if (!active) return;
        setAvailability(data);
        setStatus('idle');
      })
      .catch(() => {
        if (!active) return;
        setMessage('Could not load availability right now.');
        setStatus('error');
      });
    return () => {
      active = false;
    };
  }, [selectedMonth]);

  useEffect(() => {
    if (!selectedDate) {
      setDayAvailability(null);
      return;
    }

    let active = true;
    setStatus('loading');
    fetch(`/api/availability?date=${selectedDate}`)
      .then((response) => response.json())
      .then((data: DayAvailability) => {
        if (!active) return;
        setDayAvailability(data);
        setSelectedTime('');
        setStatus('idle');
      })
      .catch(() => {
        if (!active) return;
        setMessage('Could not load time slots right now.');
        setStatus('error');
      });

    return () => {
      active = false;
    };
  }, [selectedDate]);

  const days = useMemo(() => availability?.days ?? [], [availability]);

  const handleBooking = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus('booking');
    setMessage('');

    try {
      const response = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: selectedDate,
          time: selectedTime,
          email,
          notes,
          honeypot: '',
        }),
      });

      const payload = (await response.json().catch(() => null)) as { error?: string } | null;
      if (!response.ok) throw new Error(payload?.error ?? 'Booking failed.');

      setStatus('success');
      setMessage('Your call is booked. Google will send the calendar invite and Meet link.');
      setNotes('');
      setEmail('');
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Booking failed.');
    }
  };

  return (
    <div className="space-y-5">
      <section className="surface-card p-6 md:p-8 lg:p-10">
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-4">
            <p className="text-[10px] font-mono font-bold uppercase tracking-[0.35em] text-brand-cyan">Book a call</p>
            <h1 className="text-4xl font-bold leading-tight text-[var(--color-text)] md:text-5xl">
              Pick a day, pick a slot, and I’ll meet you on Google Meet.
            </h1>
            <p className="max-w-2xl text-sm leading-relaxed text-[var(--color-text-muted)] md:text-base">
              Bookings are only available on Thursday and Friday, between 09:00 and 17:00 EAT. Calls are 30 minutes long with a 10 minute gap between slots, and you must book at least 2 hours ahead.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-4">
              <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-[var(--color-text-muted)]">Timezone</p>
              <p className="mt-2 text-sm font-semibold text-[var(--color-text)]">{BOOKING_CONFIG.timezone}</p>
            </div>
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-4">
              <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-[var(--color-text-muted)]">Duration</p>
              <p className="mt-2 text-sm font-semibold text-[var(--color-text)]">30 minutes</p>
            </div>
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-4">
              <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-[var(--color-text-muted)]">Buffer</p>
              <p className="mt-2 text-sm font-semibold text-[var(--color-text)]">10 minutes</p>
            </div>
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-4">
              <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-[var(--color-text-muted)]">Notice</p>
              <p className="mt-2 text-sm font-semibold text-[var(--color-text)]">2 hours minimum</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="surface-card p-6 md:p-8">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-mono font-bold uppercase tracking-[0.35em] text-[var(--brand-purple)]">Choose a day</p>
              <h2 className="mt-2 text-2xl font-bold text-[var(--color-text)]">{buildMonthLabel(selectedMonth)}</h2>
            </div>
            <input
              type="month"
              value={selectedMonth}
              min={monthKey(today)}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-2 text-sm font-semibold text-[var(--color-text)]"
            />
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {status === 'loading' && !availability ? (
              Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="h-12 rounded-xl border border-[var(--border)] bg-[var(--surface-soft)]" />
              ))
            ) : days.length ? (
              days.map((day) => {
                const selected = selectedDate === day;
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => setSelectedDate(day)}
                    className={`min-h-12 rounded-xl border px-3 py-2 text-left text-sm font-semibold transition ${
                      selected
                        ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--color-text)]'
                        : 'border-[var(--border)] bg-[var(--surface-soft)] text-[var(--color-text-muted)] hover:border-[var(--accent)] hover:text-[var(--color-text)]'
                    }`}
                  >
                    <span className="block font-mono text-[10px] uppercase tracking-widest">{day}</span>
                  </button>
                );
              })
            ) : (
              <div className="col-span-full rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface-soft)] p-6 text-sm text-[var(--color-text-muted)]">
                No open Thursdays or Fridays in this month.
              </div>
            )}
          </div>
        </div>

        <div className="surface-card p-6 md:p-8">
          <p className="text-[10px] font-mono font-bold uppercase tracking-[0.35em] text-brand-cyan">Choose a slot</p>
          <div className="mt-2 flex items-center justify-between gap-3">
            <h2 className="text-2xl font-bold text-[var(--color-text)]">{selectedDate || 'Select a day first'}</h2>
            {dayAvailability?.slots.length ? (
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[var(--color-text-muted)]">
                {dayAvailability.slots.length} open
              </span>
            ) : null}
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            {dayAvailability?.slots?.length ? (
              dayAvailability.slots.map((slot) => (
                <button
                  key={slot.start}
                  type="button"
                  onClick={() => setSelectedTime(slot.start)}
                  className={`min-h-12 rounded-xl border px-3 py-2 text-sm font-semibold transition ${
                    selectedTime === slot.start
                      ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--color-text)]'
                      : 'border-[var(--border)] bg-[var(--surface-soft)] text-[var(--color-text-muted)] hover:border-[var(--accent)] hover:text-[var(--color-text)]'
                  }`}
                >
                  {slot.label}
                </button>
              ))
            ) : (
              <div className="col-span-full rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface-soft)] p-6 text-sm text-[var(--color-text-muted)]">
                {selectedDate ? 'No slots are open for this day.' : 'Pick a day to see its open slots.'}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="surface-card p-6 md:p-8">
        <div className="flex items-center gap-3">
          <Icon name="calendar" size={18} className="text-brand-cyan" />
          <h2 className="text-2xl font-bold text-[var(--color-text)]">Confirm booking</h2>
        </div>

        <form onSubmit={handleBooking} className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="hidden">
            <label htmlFor="honeypot">Honeypot</label>
            <input id="honeypot" name="honeypot" type="text" tabIndex={-1} autoComplete="off" />
          </div>

          <label className="space-y-2">
            <span className="block pl-1 font-mono text-[10px] uppercase tracking-widest text-brand-cyan">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] p-4 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--accent)]"
              placeholder="you@example.com"
              autoComplete="email"
            />
          </label>

          <label className="space-y-2 md:col-span-2">
            <span className="block pl-1 font-mono text-[10px] uppercase tracking-widest text-brand-cyan">Note</span>
            <textarea
              required
              rows={5}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full resize-none rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] p-4 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--accent)]"
              placeholder="Tell me what you want to discuss."
            />
          </label>

          {message ? (
            <div
              className={`md:col-span-2 rounded-2xl border p-4 text-sm ${
                status === 'success'
                  ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-200'
                  : 'border-rose-500/20 bg-rose-500/10 text-rose-200'
              }`}
            >
              {message}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={!selectedDate || !selectedTime || status === 'booking'}
            className="inline-flex min-h-12 items-center justify-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--accent)] px-5 py-3 font-semibold text-[var(--color-bg)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50 md:col-span-2"
          >
            {status === 'booking' ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--color-bg)]/30 border-t-[var(--color-bg)]" /> : null}
            <span>Confirm booking</span>
          </button>
        </form>
      </section>
    </div>
  );
}
