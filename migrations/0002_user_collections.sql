CREATE TABLE IF NOT EXISTS magazines (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  subtitle TEXT,
  cover TEXT,
  description TEXT,
  issue_number REAL,
  category TEXT,
  published_at TEXT,
  featured INTEGER,
  price REAL,
  pdf_file TEXT,
  pages REAL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS audios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  artist TEXT NOT NULL,
  cover TEXT,
  audio_file TEXT,
  description TEXT,
  genre TEXT,
  duration REAL,
  published_at TEXT,
  featured INTEGER,
  price REAL,
  free INTEGER,
  album TEXT,
  lyrics TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS videos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  thumbnail TEXT,
  video_url TEXT,
  video_file TEXT,
  description TEXT,
  category TEXT,
  duration REAL,
  published_at TEXT,
  featured INTEGER,
  free INTEGER,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS hero_sections (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  page TEXT NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  background_image TEXT,
  cta_label TEXT,
  cta_url TEXT,
  active INTEGER,
  display_order REAL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
