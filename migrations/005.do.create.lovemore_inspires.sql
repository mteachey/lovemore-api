CREATE TYPE inspire_type AS ENUM (
    'emotional',
    'intellectual',
    'spiritual',
    'physical'
);

CREATE TABLE lovemore_inspires(
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    type inspire_type NOT NULL,
    content TEXT NOT NULL
)