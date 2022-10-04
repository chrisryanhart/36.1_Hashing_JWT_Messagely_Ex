\c messagely_test

DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS messages;

CREATE TABLE users (
    username text PRIMARY KEY,
    password text NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    phone text NOT NULL,
    join_at timestamp without time zone NOT NULL,
    last_login_at timestamp with time zone
);

CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    from_username text NOT NULL REFERENCES users,
    to_username text NOT NULL REFERENCES users,
    body text NOT NULL,
    sent_at timestamp with time zone NOT NULL,
    read_at timestamp with time zone
);


-- INSERT INTO messages (from_username,to_username,body,sent_at)
-- VALUES ('spongebob','Mr. Crabs','Bikini Bottoms',current_timestamp);
-- INSERT INTO messages (from_username,to_username,body,sent_at)
-- VALUES ('spongebob','Mr. Crabs','I promise I wont bother you',current_timestamp);

-- INSERT INTO messages (from_username,to_username,body,sent_at)
-- VALUES ('Mr. Crabs','spongebob','Buy Crabbie patties',current_timestamp);
-- INSERT INTO messages (from_username,to_username,body,sent_at)
-- VALUES ('Mr. Crabs','spongebob','They are on sale',current_timestamp);
