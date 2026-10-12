// Helpers for YouTube trailers (we store only links, never video files).

/** Embed URL (privacy-friendly domain). */
export const youtubeEmbedUrl = (id: string) =>
  `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`;

/** Fallback when a movie has no trailer link yet: open a YouTube search. */
export const youtubeSearchUrl = (title: string) =>
  `https://www.youtube.com/results?search_query=${encodeURIComponent(`${title} official trailer`)}`;
