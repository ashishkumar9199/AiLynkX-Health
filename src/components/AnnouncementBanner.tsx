import React from 'react';

export const AnnouncementBanner: React.FC = () => {
  // Define the core message string as requested
  const messageSegment = "🚧 COMING SOON • New Features Are Under Development • Stay Tuned • Launching Soon • ";
  
  // Repeat the message multiple times per track to ensure it overflows the screen width
  // even on ultra-wide desktop monitors, preventing any visual gaps in the marquee.
  const repeatedText = Array(4).fill(messageSegment).join(" ");

  return (
    <div 
      id="announcement-coming-soon-banner"
      className="relative w-full h-[45px] bg-[#FFD54F] text-[#111827] flex items-center overflow-hidden shadow-sm hover:shadow-[0_4px_20px_rgba(255,213,79,0.35)] transition-all duration-300 border-b border-[#FFB300]/50 select-none rounded-b-md"
      role="alert"
      aria-label="Coming Soon announcement: New features are under development"
    >
      {/* Inject custom modular stylesheet styles to implement the high-performance pure CSS marquee */}
      <style>{`
        @keyframes bannerMarquee {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-100%, 0, 0);
          }
        }
        .banner-marquee-container {
          display: flex;
          width: max-content;
          will-change: transform;
        }
        .banner-marquee-track {
          display: inline-flex;
          align-items: center;
          white-space: nowrap;
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          animation: bannerMarquee 35s linear infinite;
          padding-right: 2rem;
        }
        /* Pause the marquee animation when the user hovers over the banner */
        .banner-marquee-container:hover .banner-marquee-track {
          animation-play-state: paused;
        }
        /* Add a subtle highlight or scale shift on hover for delightful micro-interaction */
        #announcement-coming-soon-banner:hover {
          background-color: #ffe082;
        }
      `}</style>

      {/* Marquee Container wrapper */}
      <div className="absolute inset-0 flex items-center">
        <div className="banner-marquee-container">
          {/* First track */}
          <div className="banner-marquee-track">
            <span>{repeatedText}</span>
          </div>
          {/* Second identical track to make the scrolling loop perfectly seamless */}
          <div className="banner-marquee-track" aria-hidden="true">
            <span>{repeatedText}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
