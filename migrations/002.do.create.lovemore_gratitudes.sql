CREATE TABLE lovemore_gratitudes(
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    content TEXT NOT NULL,
    date_modified TIMESTAMPTZ NOT NULL DEFAULT now(),
    user_id INTEGER REFERENCES lovemore_users(id) ON DELETE CASCADE NOT NULL
)