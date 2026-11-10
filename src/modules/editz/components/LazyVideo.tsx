'use client';

/**
 * Purpose: muted, looping background video that downloads nothing until it is near the viewport.
 *
 * Renders the same <video> element the EDITZ sections used before (same classes, poster, loop,
 * muted, playsInline) but with preload="none" and no autoplay attribute — the autoplay attribute
 * makes browsers fetch the file immediately. An IntersectionObserver starts playback when the video
 * comes within `rootMargin` of the viewport and pauses it when it leaves, so off-screen videos cost
 * no bandwidth or decode time. The poster (when given) is shown until the first frame plays,
 * exactly as before while an autoplay video was buffering.
 */
import { useEffect, useRef } from 'react';

type LazyVideoProps = {
  src: string;
  poster?: string;
  className?: string;
  /** How far outside the viewport playback (and the download) may start. */
  rootMargin?: string;
};

export default function LazyVideo({ src, poster, className, rootMargin = '200px 0px' }: LazyVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    // Autoplay is only allowed when muted; set the property explicitly (React may not hydrate it).
    video.muted = true;

    if (typeof IntersectionObserver === 'undefined') {
      video.play().catch(() => {});
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else if (!video.paused) {
          video.pause();
        }
      },
      { rootMargin }
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [rootMargin]);

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      preload="none"
      loop
      muted
      playsInline
      className={className}
    />
  );
}
