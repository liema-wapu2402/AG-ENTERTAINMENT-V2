// Text shown on the About page. Edit here to change the page.

export const SITE = {
  name: 'AG Entertainment',
  version: 'Version 2',
  tagline: 'Movies, music and books in one place.',
  summary:
    'AG Entertainment is a free entertainment website where anyone can browse movies and TV series, stream music and discover books - no account needed. ' +
    'Version 2 is a full rebuild of the original HTML/PHP site with Laravel, React and MySQL, a responsive design and a content admin panel.',
  highlights: [
    { title: 'Movies & series', text: 'Upcoming, top rated and TV series with YouTube trailers.' },
    { title: 'Music', text: 'Real mp3 streaming with a player that keeps playing while you browse.' },
    { title: 'Books', text: 'A library arranged on shelves per genre.' },
    { title: 'Your look', text: 'Dark or light mode with your own background and accent colours.' },
  ],
  stack: ['Laravel', 'React', 'TypeScript', 'Tailwind CSS', 'MySQL', 'Vite'],
  roles: [
    { title: 'Visitors', text: 'Open the site and browse every module. No sign in. View only.' },
    { title: 'Admin', text: 'Signs in from Settings to add, edit, delete and import movies, music and books.' },
  ],
};

export const DEVELOPER = {
  name: 'Amiel Andrei C. Reyes',
  role: 'Full-stack developer & data analyst',
  location: 'Philippines',
  bio:
    'Amiel builds and maintains web systems across the database, backend and frontend layers. ' +
    'He created AG Entertainment and rebuilt it as Version 2.',
  skills: ['Laravel / PHP', 'React', 'TypeScript', 'MySQL', 'Java Swing', 'Python'],
};
