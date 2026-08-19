import React, { useEffect, useMemo, useState } from 'react';
import { toZonedTime } from 'date-fns-tz';
import { Icon } from '../components/Icon';
import { BOOKING_CONFIG } from '../booking/config';

type MonthAvailability = { month: string; days: string[] };
type DayAvailability = { date: string; slots: Array<{ start: string; end: string; label: string }> };

function availabilityErrorMessage(status?: number): string {
  if (status === 429) return 'Too many requests right now. Please wait a minute and try again.';
  return 'Availability is not loading right now. Please refresh or try again shortly.';
}

function bookingErrorMessage(status?: number): string {
  if (status === 400) return 'Please check your email, note, date, and time before trying again.';
  if (status === 409) return 'That slot was just taken. Please choose another open time.';
  if (status === 429) return 'Too many booking attempts right now. Please wait a minute and try again.';
  return 'The booking could not be completed right now. Please try again shortly.';
}

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

function formatBookingDay(date: string): { weekday: string; day: string; month: string } {
  const parsed = new Date(`${date}T12:00:00`);
  return {
    weekday: new Intl.DateTimeFormat('en', { weekday: 'short' }).format(parsed),
    day: new Intl.DateTimeFormat('en', { day: '2-digit' }).format(parsed),
    month: new Intl.DateTimeFormat('en', { month: 'short' }).format(parsed),
  };
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
  const [honeypot, setHoneypot] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'booking' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    let active = true;
    setStatus('loading');
    fetch(`/api/availability?month=${selectedMonth}`)
      .then(async (response) => {
        const data = await response.json().catch(() => null);
        if (!response.ok) throw new Error(availabilityErrorMessage(response.status));
        return data as MonthAvailability;
      })
      .then((data: MonthAvailability) => {
        if (!active) return;
        setAvailability(data);
        setStatus('idle');
      })
      .catch((error) => {
        if (!active) return;
        setMessage(error instanceof Error ? error.message : availabilityErrorMessage());
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
      .then(async (response) => {
        const data = await response.json().catch(() => null);
        if (!response.ok) throw new Error(availabilityErrorMessage(response.status));
        return data as DayAvailability;
      })
      .then((data: DayAvailability) => {
        if (!active) return;
        setDayAvailability(data);
        setSelectedTime('');
        setStatus('idle');
      })
      .catch((error) => {
        if (!active) return;
        setMessage(error instanceof Error ? error.message : availabilityErrorMessage());
        setStatus('error');
      });

    return () => {
      active = false;
    };
  }, [selectedDate]);

  const todayKey = useMemo(
    () =>
      `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`,
    [today],
  );
  const days = useMemo(
    () => (availability?.days ?? []).filter((day) => day >= todayKey),
    [availability, todayKey],
  );
  const selectedDay = selectedDate ? formatBookingDay(selectedDate) : null;

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
          honeypot,
        }),
      });

      await response.json().catch(() => null);
      if (!response.ok) throw new Error(bookingErrorMessage(response.status));

      setStatus('success');
      setMessage('Your call is booked. Google will send the calendar invite and Meet link.');
      setNotes('');
      setEmail('');
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : bookingErrorMessage());
    }
  };

  return (
    <div className="booking-shell space-y-5">
      <section className="booking-hero surface-card relative overflow-hidden p-6 md:p-8 lg:p-10">
        <div className="absolute right-0 top-0 h-32 w-32 border-b border-l border-dashed border-[var(--border)]" aria-hidden />
        <div className="booking-hero-index absolute right-7 top-6 font-mono text-5xl font-bold leading-none text-[var(--border)]" aria-hidden>03</div>
        <div className="relative grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div className="space-y-4">
            <p className="flex items-center gap-3 text-[10px] font-mono font-bold uppercase tracking-[0.35em] text-brand-cyan"><span className="booking-status-dot h-2 w-2 bg-[var(--accent)]" />Live scheduling terminal</p>
            <h1 className="max-w-3xl font-display text-5xl font-bold leading-[0.95] text-[var(--color-text)] sm:text-6xl">
              Pick a day, pick a slot, and I’ll meet you on Google Meet.
            </h1>
            <p className="max-w-2xl text-sm leading-relaxed text-[var(--color-text-muted)] md:text-base">
              Bookings are only available on Thursday and Friday, between 09:00 and 17:00 EAT. Calls are 30 minutes long with a 10 minute gap between slots, and you must book at least 2 hours ahead.
            </p>
          </div>
          <div className="booking-spec-grid grid gap-3 border border-dashed border-[var(--border)] bg-[var(--surface-soft)] p-4 sm:grid-cols-2">
            <div className="col-span-full flex items-center justify-between border-b border-[var(--border)] pb-3 text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[var(--color-text-muted)]"><span>Call protocol</span><span className="text-[var(--accent)]">Meet enabled</span></div>
            <div className="border-b border-[var(--border)] pb-3 sm:border-b-0 sm:border-r sm:pr-3">
              <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-[var(--color-text-muted)]">Timezone</p>
              <p className="mt-2 text-sm font-semibold text-[var(--color-text)]">{BOOKING_CONFIG.timezone}</p>
            </div>
            <div className="pb-3 sm:pl-1">
              <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-[var(--color-text-muted)]">Duration</p>
              <p className="mt-2 text-sm font-semibold text-[var(--color-text)]">30 minutes</p>
            </div>
            <div className="border-t border-[var(--border)] pt-3 sm:border-r sm:pr-3">
              <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-[var(--color-text-muted)]">Buffer</p>
              <p className="mt-2 text-sm font-semibold text-[var(--color-text)]">10 minutes</p>
            </div>
            <div className="border-t border-[var(--border)] pt-3 sm:pl-1">
              <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-[var(--color-text-muted)]">Notice</p>
              <p className="mt-2 text-sm font-semibold text-[var(--color-text)]">2 hours minimum</p>
            </div>
          </div>
        </div>
      </section>

      <section className="surface-card p-5 md:p-6">
        <div className="grid gap-3 md:grid-cols-3">
          {[
            ['01', 'Select a day', selectedDate ? 'Window chosen' : 'Thursday or Friday', Boolean(selectedDate)],
            ['02', 'Lock a time', selectedTime ? `${selectedTime} EAT` : 'Open windows', Boolean(selectedTime)],
            ['03', 'Confirm details', email ? 'Email captured' : 'Google Meet invite', Boolean(email)],
          ].map(([number, title, detail, complete]) => (
            <div key={number as string} className={`booking-flow-step flex min-h-20 items-center gap-4 border p-4 ${complete ? 'is-complete border-[var(--accent)] bg-[var(--accent-soft)]' : 'border-[var(--border)] bg-[var(--surface-soft)]'}`}>
              <span className={`font-mono text-xl font-bold ${complete ? 'text-[var(--accent)]' : 'text-[var(--color-text-muted)]'}`}>{number}</span>
              <div><p className="text-sm font-bold text-[var(--color-text)]">{title}</p><p className="mt-1 text-xs text-[var(--color-text-muted)]">{detail}</p></div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.08fr_0.92fr]">
        <div className="booking-panel surface-card p-6 md:p-8">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-dashed border-[var(--border)] pb-6">
            <div>
              <p className="text-[10px] font-mono font-bold uppercase tracking-[0.35em] text-[var(--brand-purple)]">01 / Date selection</p>
              <h2 className="mt-3 font-display text-3xl font-bold text-[var(--color-text)]">{buildMonthLabel(selectedMonth)}</h2>
            </div>
            <input
              type="month"
              value={selectedMonth}
              min={monthKey(today)}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="min-h-11 border border-[var(--border)] bg-[var(--surface-soft)] px-3 text-sm font-semibold text-[var(--color-text)]"
            />
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {status === 'loading' && !availability ? (
              Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="h-28 animate-pulse border border-[var(--border)] bg-[var(--surface-soft)]" />
              ))
            ) : days.length ? (
              days.map((day) => {
                const selected = selectedDate === day;
                const entry = formatBookingDay(day);
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => setSelectedDate(day)}
                    aria-pressed={selected}
                    className={`booking-date-card min-h-28 border p-4 text-left transition ${
                      selected
                        ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--color-text)]'
                        : 'border-[var(--border)] bg-[var(--surface-soft)] text-[var(--color-text-muted)] hover:border-[var(--accent)] hover:text-[var(--color-text)]'
                    }`}
                  >
                    <span className="block font-mono text-[10px] font-bold uppercase tracking-[0.22em]">{entry.weekday}</span>
                    <span className="mt-2 block font-display text-4xl font-bold leading-none">{entry.day}</span>
                    <span className="mt-2 block text-xs uppercase tracking-widest">{entry.month}</span>
                    <span className={`mt-3 block h-px w-full ${selected ? 'bg-[var(--accent)]' : 'bg-[var(--border)]'}`} aria-hidden />
                  </button>
                );
              })
            ) : (
              <div className="col-span-full border border-dashed border-[var(--border)] bg-[var(--surface-soft)] p-7 text-sm text-[var(--color-text-muted)]">
                No open Thursdays or Fridays in this month.
              </div>
            )}
          </div>
        </div>

        <div className="booking-panel surface-card p-6 md:p-8">
          <p className="text-[10px] font-mono font-bold uppercase tracking-[0.35em] text-brand-cyan">02 / Time selection</p>
          <div className="mt-3 flex items-center justify-between gap-3 border-b border-dashed border-[var(--border)] pb-6">
            <h2 className="font-display text-3xl font-bold text-[var(--color-text)]">{selectedDay ? `${selectedDay.weekday}, ${selectedDay.month} ${selectedDay.day}` : 'Choose a date'}</h2>
            {dayAvailability?.slots.length ? (
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[var(--color-text-muted)]">
                {dayAvailability.slots.length} open
              </span>
            ) : null}
          </div>

          <p className="mt-4 text-xs leading-6 text-[var(--color-text-muted)]">{dayAvailability?.slots.length ? `${dayAvailability.slots.length} clear windows in ${BOOKING_CONFIG.timezone}.` : 'Time windows unlock once a date is selected.'}</p>
          <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {dayAvailability?.slots?.length ? (
              dayAvailability.slots.map((slot) => (
                <button
                  key={slot.start}
                  type="button"
                  onClick={() => setSelectedTime(slot.start)}
                  aria-pressed={selectedTime === slot.start}
                  className={`min-h-16 border px-3 py-2 text-left transition ${
                    selectedTime === slot.start
                      ? 'border-[var(--accent)] bg-[var(--accent)] text-[var(--color-bg)]'
                      : 'border-[var(--border)] bg-[var(--surface-soft)] text-[var(--color-text-muted)] hover:border-[var(--accent)] hover:text-[var(--color-text)]'
                  }`}
                >
                  <span className="block font-mono text-sm font-bold">{slot.start}</span>
                  <span className="mt-1 block text-[10px] uppercase tracking-widest opacity-70">until {slot.end} / EAT</span>
                </button>
              ))
            ) : (
              <div className="col-span-full border border-dashed border-[var(--border)] bg-[var(--surface-soft)] p-7 text-sm text-[var(--color-text-muted)]">
                {selectedDate ? 'No slots are open for this day.' : 'Pick a date to reveal open time windows.'}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="booking-confirmation surface-card overflow-hidden">
        <div className="grid lg:grid-cols-[0.72fr_1.28fr]">
          <aside className="border-b border-dashed border-[var(--border)] bg-[var(--surface-soft)] p-6 md:p-8 lg:border-b-0 lg:border-r">
            <p className="text-[10px] font-mono font-bold uppercase tracking-[0.35em] text-brand-cyan">03 / Finalize</p>
            <h2 className="mt-3 font-display text-3xl font-bold text-[var(--color-text)]">Your call brief.</h2>
            <div className="mt-7 space-y-4 border-t border-dashed border-[var(--border)] pt-5 font-mono text-xs">
              <p><span className="block text-[10px] uppercase tracking-widest text-[var(--color-text-muted)]">Date</span><span className="mt-1 block text-[var(--color-text)]">{selectedDate || 'Awaiting selection'}</span></p>
              <p><span className="block text-[10px] uppercase tracking-widest text-[var(--color-text-muted)]">Time</span><span className="mt-1 block text-[var(--color-text)]">{selectedTime ? `${selectedTime} EAT` : 'Awaiting selection'}</span></p>
              <p><span className="block text-[10px] uppercase tracking-widest text-[var(--color-text-muted)]">Channel</span><span className="mt-1 block text-[var(--color-text)]">Google Meet invite</span></p>
              <p className="border-t border-dashed border-[var(--border)] pt-4 text-[10px] leading-5 text-[var(--color-text-muted)]">A calendar invite and private video link will be sent after confirmation.</p>
            </div>
          </aside>
          <div className="p-6 md:p-8">
            <div className="flex items-center gap-3">
              <Icon name="mail" size={18} className="text-[var(--accent)]" />
              <p className="text-sm font-semibold text-[var(--color-text)]">Where should Google send the invitation?</p>
            </div>

            <form onSubmit={handleBooking} className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="hidden">
            <label htmlFor="honeypot">Honeypot</label>
            <input
              id="honeypot"
              name="honeypot"
              type="text"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          <label className="space-y-2">
            <span className="block pl-1 font-mono text-[10px] uppercase tracking-widest text-brand-cyan">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-[var(--border)] bg-[var(--surface-soft)] p-4 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--accent)]"
              placeholder="you@example.com"
              autoComplete="email"
            />
          </label>

          <label className="space-y-2 md:col-span-2">
            <span className="flex items-center justify-between pl-1 font-mono text-[10px] uppercase tracking-widest text-brand-cyan"><span>Note</span><span className="text-[var(--color-text-muted)]">{notes.length}/{BOOKING_CONFIG.maxNotesLength}</span></span>
            <textarea
              required
              rows={5}
              maxLength={BOOKING_CONFIG.maxNotesLength}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full resize-none border border-[var(--border)] bg-[var(--surface-soft)] p-4 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--accent)]"
              placeholder="Tell me what you want to discuss."
            />
          </label>

          {message ? (
            <div
              className={`md:col-span-2 border p-4 text-sm ${
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
            className="inline-flex min-h-14 items-center justify-center gap-3 border border-[var(--accent)] bg-[var(--accent)] px-5 py-3 font-semibold text-[var(--color-bg)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50 md:col-span-2"
          >
            {status === 'booking' ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--color-bg)]/30 border-t-[var(--color-bg)]" /> : null}
            <span>Confirm booking</span>
          </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
