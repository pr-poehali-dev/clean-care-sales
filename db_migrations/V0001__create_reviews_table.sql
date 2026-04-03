CREATE TABLE IF NOT EXISTS t_p63186686_clean_care_sales.reviews (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  text TEXT NOT NULL,
  rating INTEGER NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP DEFAULT NOW()
);