CREATE TABLE applications (
  id text PRIMARY KEY,
  submission_key text NOT NULL UNIQUE,
  created_at bigint NOT NULL,
  updated_at bigint NOT NULL,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL DEFAULT '',
  role text NOT NULL,
  company text NOT NULL,
  website text NOT NULL DEFAULT '',
  city text NOT NULL,
  state text NOT NULL,
  service_area text NOT NULL,
  revenue text NOT NULL,
  team text NOT NULL,
  services text NOT NULL,
  challenge text NOT NULL,
  sharing text NOT NULL,
  consent_version text NOT NULL,
  source text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'received',
  notes text NOT NULL DEFAULT ''
);
CREATE INDEX applications_created_idx ON applications (created_at);
CREATE INDEX applications_status_idx ON applications (status);
CREATE TABLE request_limits (
  key text PRIMARY KEY,
  count integer NOT NULL DEFAULT 1,
  created_at bigint NOT NULL
);
CREATE INDEX request_limits_created_idx ON request_limits (created_at);
