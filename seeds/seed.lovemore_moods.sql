INSERT INTO lovemore_moods (user_id, mood_level, energy_level, date_modified)
VALUES
(1, 3, 3, now() - '5 days'::INTERVAL),
(1, 4, 5, now() - '4 days'::INTERVAL),
(1, 5, 5, now() - '3 days'::INTERVAL),
(1, 1, 5, now() - '2 days'::INTERVAL),
(2, 4, 5, now() - '7 days'::INTERVAL),
(2, 4, 5, now() - '6 days'::INTERVAL),
(2, 3, 5, now() - '5 days'::INTERVAL),
(2, 4, 5, now() - '4 days'::INTERVAL),
(2, 5, 4, now() - '3 days'::INTERVAL),
(2, 5, 4, now() - '2 days'::INTERVAL),
(2, 4, 4, now() - '1 days'::INTERVAL),
(2, 5, 5, now() - '0 days'::INTERVAL);
