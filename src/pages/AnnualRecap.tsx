import React, { useState, useEffect, useRef } from 'react';
import {
  getRecapConfigForYear,
  BIRTH_YEAR,
  VideoClip,
} from '../config/annualRecapData.ts';
import { Icon } from '../components/Icon.tsx';

export const AnnualRecapPage: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [currentVideoIndex, setCurrentVideoIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [videoError, setVideoError] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const yearConfig = getRecapConfigForYear(selectedYear);
  const videoList = yearConfig.videos;
  const currentVideo: VideoClip | undefined = videoList[currentVideoIndex];

  // Auto-play and handle video changes
  useEffect(() => {
    setVideoError(false);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  }, [selectedYear, currentVideoIndex]);

  // Non-stop continuous playback handler
  const handleVideoEnded = () => {
    if (videoList.length > 0) {
      setCurrentVideoIndex((prev) => (prev + 1) % videoList.length);
    }
  };

  const handlePlayToggle = () => {
    if (!videoRef.current || videoError) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setVideoError(true));
    }
  };

  const availableYears = [2026, 2027];

  return (
    <div className="space-y-8 pb-12">
      {/* Top Header Card */}
      <section className="relative overflow-hidden surface-card p-6 md:p-10 lg:p-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/30 bg-[var(--accent-soft)] px-3.5 py-1 text-xs font-mono font-bold uppercase tracking-widest accent-text">
              <Icon name="sparkles" size={14} /> Annual Reflection & Video Vault
            </div>
            <h1 className="mt-4 font-display text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-[var(--color-text)]">
              {yearConfig.title}
            </h1>
            <p className="mt-3 text-sm sm:text-base text-[var(--color-text-muted)] leading-relaxed">
              {yearConfig.summary}
            </p>
          </div>

          {/* Age Level & Stats Card */}
          <div className="w-full md:w-auto shrink-0">
            <div className="rpg-card p-6 text-center min-w-[200px]">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[var(--color-text-muted)]">
                Completed Milestone
              </span>
              <div className="mt-1 font-display text-4xl sm:text-5xl font-extrabold text-[var(--accent)] age-counter">
                {yearConfig.age} YEARS
              </div>
              <div className="mt-2 text-xs font-semibold text-[var(--color-text-muted)]">
                Birth Date: July 27, {BIRTH_YEAR}
              </div>
              <div className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-[var(--surface-soft)] px-3 py-1 text-xs font-mono text-[var(--color-text)] border border-[var(--border)]">
                <Icon name="shield-check" size={14} /> July 27 Edition
              </div>
            </div>
          </div>
        </div>

        {/* Year Selector */}
        <div className="mt-8 flex flex-wrap items-center gap-3 pt-6 border-t border-[var(--border)]">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[var(--color-text-muted)] flex items-center gap-2">
            <Icon name="calendar" size={14} /> Select Year:
          </span>
          <div className="flex flex-wrap gap-2">
            {availableYears.map((yr) => {
              const isSelected = selectedYear === yr;
              const ageForYr = yr - BIRTH_YEAR;
              return (
                <button
                  type="button"
                  key={yr}
                  onClick={() => {
                    setSelectedYear(yr);
                    setCurrentVideoIndex(0);
                  }}
                  className={`
                    px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2
                    ${
                      isSelected
                        ? 'bg-[var(--accent)] text-[var(--color-bg)] shadow-md scale-105'
                        : 'border border-[var(--border)] bg-[var(--surface-soft)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:border-[var(--accent)]'
                    }
                  `}
                >
                  <span>July 27, {yr}</span>
                  <span className="opacity-75 font-mono">({ageForYr} yo)</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Non-Stop Video Player & Playlist Grid */}
      <section className="surface-card p-6 md:p-10 lg:p-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[var(--border)]">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-brand-cyan">
              <Icon name="film" size={14} /> Non-Stop Video Reel
            </div>
            <h2 className="mt-1 text-2xl font-bold text-[var(--color-text)]">
              Continuous Video Showcase 🎬
            </h2>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--color-text-muted)]">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Non-stop looping playlist ({currentVideoIndex + 1}/{videoList.length})</span>
          </div>
        </div>

        {/* Video Player & Playlist Grid */}
        <div className="mt-8 grid gap-8 lg:grid-cols-[1.6fr_1fr] items-start">
          {/* Main Non-Stop Video Container */}
          <div className="rounded-3xl border border-[var(--border)] bg-black/80 p-4 md:p-6 shadow-2xl overflow-hidden relative">
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-950 flex items-center justify-center border border-white/10 group">
              {currentVideo && !videoError ? (
                <>
                  <video
                    ref={videoRef}
                    src={currentVideo.videoUrl}
                    muted={isMuted}
                    playsInline
                    autoPlay
                    onEnded={handleVideoEnded}
                    onError={() => setVideoError(true)}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    className="h-full w-full object-cover"
                  />

                  {/* Non-Stop Player Controls Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4 pointer-events-none">
                    <div className="flex justify-between items-start pointer-events-auto">
                      <span className="rounded-xl bg-black/70 backdrop-blur-md px-3 py-1 text-xs font-mono font-bold text-emerald-400 border border-emerald-500/30">
                        ▶ Playing: {currentVideo.title}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-4 pointer-events-auto">
                      <button
                        type="button"
                        onClick={handlePlayToggle}
                        className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--accent)] text-[var(--color-bg)] font-bold shadow-lg hover:scale-110 transition"
                      >
                        <Icon name={isPlaying ? 'pause' : 'play'} size={24} />
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setIsMuted(!isMuted)}
                          className="flex h-10 w-10 items-center justify-center rounded-xl bg-black/70 text-white backdrop-blur-md hover:bg-black/90 transition border border-white/10"
                          title={isMuted ? 'Unmute' : 'Mute'}
                        >
                          <Icon name={isMuted ? 'volume-x' : 'volume-2'} size={18} />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            setCurrentVideoIndex(
                              (prev) => (prev - 1 + videoList.length) % videoList.length
                            )
                          }
                          className="flex h-10 w-10 items-center justify-center rounded-xl bg-black/70 text-white backdrop-blur-md hover:bg-black/90 transition border border-white/10"
                          title="Previous Video"
                        >
                          <Icon name="chevron-left" size={18} />
                        </button>

                        <button
                          type="button"
                          onClick={handleVideoEnded}
                          className="flex h-10 w-10 items-center justify-center rounded-xl bg-black/70 text-white backdrop-blur-md hover:bg-black/90 transition border border-white/10"
                          title="Next Video"
                        >
                          <Icon name="chevron-right" size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                /* Fallback if video file cannot be decoded */
                <div className="h-full w-full bg-slate-900 p-8 flex flex-col items-center justify-center text-center">
                  <Icon name="film" size={48} className="text-[var(--accent)] opacity-60 mb-3" />
                  <h3 className="text-lg font-bold text-white">Video Footage Loaded</h3>
                  <p className="mt-1 text-xs text-slate-400 max-w-sm">
                    Playing files from <code className="text-emerald-400">dist/images/videos/</code>
                  </p>
                </div>
              )}
            </div>

            {/* Video Title Details */}
            {currentVideo && (
              <div className="mt-4 p-4 rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--accent-soft)] accent-text">
                    <Icon name="play" size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[var(--color-text)]">
                      {currentVideo.title}
                    </h3>
                    <p className="text-xs text-[var(--color-text-muted)] font-mono">
                      Location: {currentVideo.videoUrl}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--accent)] font-bold">
                  Non-Stop Reel
                </span>
              </div>
            )}
          </div>

          {/* Video Playlist selector */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-[var(--color-text-muted)]">
              Playlist Queue ({videoList.length} Videos):
            </h3>

            <div className="space-y-2.5">
              {videoList.map((vid, index) => {
                const isActive = index === currentVideoIndex;
                return (
                  <button
                    type="button"
                    key={vid.id}
                    onClick={() => setCurrentVideoIndex(index)}
                    className={`
                      w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between gap-3
                      ${
                        isActive
                          ? 'border-[var(--accent)] bg-[var(--accent-soft)] shadow-md scale-[1.01]'
                          : 'border-[var(--border)] bg-[var(--surface-soft)] hover:border-[var(--accent)]/50 hover:bg-[var(--surface)]'
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--surface)] font-bold text-xs accent-text border border-[var(--border)]">
                        {index + 1}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-[var(--color-text)]">
                          {vid.title}
                        </div>
                        <div className="text-xs text-[var(--color-text-muted)] font-mono">
                          {vid.source}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {isActive && (
                        <span className="flex h-2 w-2 rounded-full bg-[var(--accent)] animate-ping" />
                      )}
                      <Icon
                        name={isActive ? 'play' : 'chevron-right'}
                        size={16}
                        className={isActive ? 'accent-text' : 'text-[var(--color-text-muted)]'}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Surrounding Yearly Achievements & What Was Gained */}
      <section className="surface-card p-6 md:p-10 lg:p-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[var(--border)]">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-[var(--accent)]">
              <Icon name="shield-check" size={14} /> Yearly Achievements
            </div>
            <h2 className="mt-1 text-2xl font-bold text-[var(--color-text)]">
              What Was Gained for Age {yearConfig.age} 🚀
            </h2>
          </div>
          <div className="text-xs font-mono text-[var(--color-text-muted)]">
            July 27, {selectedYear} Milestones
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {yearConfig.gains.map((gain, i) => (
            <div
              key={i}
              className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-5 hover:border-[var(--accent)] transition-all"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-widest text-[var(--accent)]">
                  {gain.category}
                </span>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--accent-soft)] accent-text">
                  <Icon name={gain.icon} size={18} />
                </div>
              </div>

              <h3 className="mt-4 text-lg font-bold text-[var(--color-text)]">{gain.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-muted)]">
                {gain.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AnnualRecapPage;
