import React, { useState, useEffect, useRef } from 'react';
import { getRecapConfigForYear, type VideoClip } from '../config/annualRecapData.ts';
import { Icon } from '../components/Icon.tsx';

export const AnnualRecapPage: React.FC = () => {
  const selectedYear = 2026;
  const [currentVideoIndex, setCurrentVideoIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [videoError, setVideoError] = useState<boolean>(false);
  const [hasStarted, setHasStarted] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const yearConfig = getRecapConfigForYear(selectedYear);
  const videoList = yearConfig.videos;
  const currentVideo: VideoClip | undefined = videoList[currentVideoIndex];

  // Start playback only after the visitor chooses to play the reel.
  useEffect(() => {
    setVideoError(false);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      if (hasStarted) {
        videoRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      } else {
        setIsPlaying(false);
      }
    }
  }, [selectedYear, currentVideoIndex, hasStarted]);

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
      setHasStarted(true);
      videoRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setVideoError(true));
    }
  };

  return (
    <div className="editorial-page recap-page">
      {/* Top Header Card */}
      <section className="recap-hero">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <span className="landing-section-index">/ annual reflection · {yearConfig.year}</span>
            <h1 className="editorial-hero-title">
              {yearConfig.title}
            </h1>
            <p className="editorial-hero-copy">
              {yearConfig.summary}
            </p>
          </div>

          {/* Age Level & Stats Card */}
          <div className="w-full md:w-auto shrink-0">
            <div className="recap-year-note">
              <span className="editorial-overline">A year in review</span>
              <div className="recap-age">{yearConfig.age}<small> years</small></div>
              <div className="recap-birthday">{yearConfig.subtitle}</div>
            </div>
          </div>
        </div>

      </section>

      {/* Non-Stop Video Player & Playlist Grid */}
      <section className="surface-card p-6 md:p-10 lg:p-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[var(--border)]">
          <div>
            <p className="landing-section-index">02 / personal archive</p>
            <h2 className="editorial-section-title">A few moments on film.</h2>
          </div>
          <div className="text-xs font-mono text-[var(--color-text-muted)]">
            <span>{currentVideoIndex + 1} / {videoList.length} · Select play to start</span>
          </div>
        </div>

        {/* Video Player & Playlist Grid */}
        <div className="mt-8 grid gap-8 lg:grid-cols-[1.6fr_1fr] items-start">
          {/* Main Non-Stop Video Container */}
          <div className="rounded-xl border border-[var(--border)] bg-black/80 p-4 md:p-6 overflow-hidden relative">
            <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-slate-950 flex items-center justify-center border border-white/10 group">
              {currentVideo && !videoError ? (
                <>
                  <video
                    ref={videoRef}
                    src={currentVideo.videoUrl}
                    muted={isMuted}
                    playsInline
                    onEnded={handleVideoEnded}
                    onError={() => setVideoError(true)}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    className="h-full w-full object-cover"
                  />

                  {/* Non-Stop Player Controls Overlay */}
                  <div className="recap-player-controls absolute inset-0 flex flex-col justify-between p-4">
                    <div className="flex justify-between items-start pointer-events-auto">
                      <span className="recap-play-state">
                        {isPlaying ? 'Playing' : 'Paused'} · {currentVideo.title}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-4 pointer-events-auto">
                      <button
                        type="button"
                        onClick={handlePlayToggle}
                        aria-label={isPlaying ? 'Pause video' : 'Play video'}
                        className="flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--accent)] text-[var(--color-bg)] font-bold transition-colors hover:bg-[var(--color-text)] active:translate-y-px"
                      >
                        <span aria-hidden="true">{isPlaying ? 'Ⅱ' : '▶'}</span>
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setIsMuted(!isMuted)}
                          aria-label={isMuted ? 'Unmute video' : 'Mute video'}
                          className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-black/80 text-white transition-colors hover:bg-black"
                        >
                          <span aria-hidden="true">{isMuted ? '×' : '♪'}</span>
                        </button>

                        <button
                           type="button"
                           onClick={() =>
                             setCurrentVideoIndex(
                               (prev) => (prev - 1 + videoList.length) % videoList.length
                             )
                           }
                           aria-label="Previous video"
                           className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-black/80 text-white transition-colors hover:bg-black"
                        >
                          <Icon name="arrow-left" size={18} />
                        </button>

                        <button
                          type="button"
                          onClick={handleVideoEnded}
                          aria-label="Next video"
                           className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-black/80 text-white transition-colors hover:bg-black"
                        >
                          <Icon name="arrow-right" size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                /* Fallback if video file cannot be decoded */
                <div className="h-full w-full bg-slate-900 p-8 flex flex-col items-center justify-center text-center">
                  <span className="mb-3 font-mono text-3xl text-[var(--accent)]">/ /</span>
                  <h3 className="text-lg font-bold text-white">This clip could not be played.</h3>
                  <p className="mt-1 text-xs text-slate-400 max-w-sm">
                    Try another item in the playlist.
                  </p>
                </div>
              )}
            </div>

            {/* Video Title Details */}
            {currentVideo && (
              <div className="mt-4 rounded-lg border border-[var(--border)] bg-[var(--surface-soft)] p-4 flex items-center justify-between gap-4">
                    <div>
                      <h3 className="text-sm font-bold text-[var(--color-text)]">{currentVideo.title}</h3>
                      <p className="text-xs text-[var(--color-text-muted)]">{currentVideo.source}</p>
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--accent)] font-bold">Birthday reel</span>
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
                      w-full text-left rounded-lg border p-4 transition-colors flex items-center justify-between gap-3
                      ${
                        isActive
                          ? 'border-[var(--accent)] bg-[var(--accent-soft)]'
                          : 'border-[var(--border)] bg-[var(--surface-soft)] hover:border-[var(--accent)]/50 hover:bg-[var(--surface)]'
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <span className="editorial-index">{String(index + 1).padStart(2, '0')}</span>
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
                      <span aria-hidden="true" className={isActive ? 'text-[var(--accent)]' : 'text-[var(--color-text-muted)]'}>{isActive ? '●' : '↗'}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Surrounding Yearly Achievements & What Was Gained */}
      <section className="recap-milestones">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[var(--border)]">
          <div>
            <p className="landing-section-index">01 / milestones</p>
            <h2 className="editorial-section-title">What shaped this year.</h2>
          </div>
          <div className="text-xs font-mono text-[var(--color-text-muted)]">
            July 27, {selectedYear} Milestones
          </div>
        </div>

        <div className="recap-milestone-list">
          {yearConfig.gains.map((gain, i) => (
            <div
              key={i}
              className="recap-milestone-row"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="editorial-overline">
                  {gain.category}
                </span>
                <div className="recap-milestone-icon">
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
