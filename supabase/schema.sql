
CREATE TABLE beats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  title text,
  fingerprint text NOT NULL,
  file_url text NOT NULL,
  created_at timestamp DEFAULT now()
);

CREATE TABLE matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  beat_id uuid REFERENCES beats(id),
  source_url text,
  confidence float,
  match_time text,
  created_at timestamp DEFAULT now()
);
