CREATE TABLE IF NOT EXISTS news (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Regional update',
  summary TEXT NOT NULL,
  published_at DATE NOT NULL DEFAULT CURRENT_DATE
);

CREATE TABLE IF NOT EXISTS services (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Public service'
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id SERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(254) NOT NULL,
  subject VARCHAR(180) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO news (title, category, summary, published_at)
SELECT 'Building opportunity across Sidama', 'Development',
       'Regional institutions continue working with communities to strengthen inclusive growth and essential public services.',
       CURRENT_DATE - 2
WHERE NOT EXISTS (SELECT 1 FROM news);

INSERT INTO news (title, category, summary, published_at)
SELECT 'A region rich in culture and natural beauty', 'Culture',
       'Discover vibrant traditions, highland landscapes, and the coffee heritage that make Sidama distinctive.',
       CURRENT_DATE - 9
WHERE (SELECT COUNT(*) FROM news) = 1;

INSERT INTO news (title, category, summary, published_at)
SELECT 'Public service information in one place', 'Public notice',
       'Residents can explore regional services and find contact information through this public portal.',
       CURRENT_DATE - 16
WHERE (SELECT COUNT(*) FROM news) = 2;

INSERT INTO services (name, description, category)
SELECT 'Business registration', 'Register a business or update an existing license through the relevant regional bureau.', 'Business'
WHERE NOT EXISTS (SELECT 1 FROM services);

INSERT INTO services (name, description, category)
SELECT 'Investment support', 'Explore priority sectors, investment opportunities, and support available to investors.', 'Investment'
WHERE (SELECT COUNT(*) FROM services) = 1;

INSERT INTO services (name, description, category)
SELECT 'Public information', 'Find official notices, publications, and information from regional institutions.', 'Information'
WHERE (SELECT COUNT(*) FROM services) = 2;
