-- User table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT PRIMARY KEY,
    username VARCHAR NOT NULL,
    scratchteam BOOLEAN DEFAULT FALSE,
    joined TIMESTAMP,  -- history.joined

    profile_id BIGINT, -- profile.id
    profile_status VARCHAR,
    profile_bio TEXT,
    profile_country VARCHAR,

    image_90x90 VARCHAR,
    image_60x60 VARCHAR,
    image_55x55 VARCHAR,
    image_50x50 VARCHAR,
    image_32x32 VARCHAR
);

-- Project table
CREATE TABLE IF NOT EXISTS projects (
    id BIGINT PRIMARY KEY,
    title VARCHAR NOT NULL,
    description TEXT,
    instructions TEXT,
    visibility VARCHAR,
    public BOOLEAN,
    comments_allowed BOOLEAN,
    is_published BOOLEAN,

    author_id BIGINT,  -- reference to users.id
    author_username VARCHAR,
    author_snapteam BOOLEAN,  -- renamed from scratchteam
    author_joined TIMESTAMP,
    author_profile_id BIGINT,
    author_profile_status VARCHAR,
    author_profile_bio TEXT,
    author_profile_country VARCHAR,
    author_image_90x90 VARCHAR,
    author_image_60x60 VARCHAR,
    author_image_55x55 VARCHAR,
    author_image_50x50 VARCHAR,
    author_image_32x32 VARCHAR,

    image_main VARCHAR,
    image_282x218 VARCHAR,
    image_216x163 VARCHAR,
    image_200x200 VARCHAR,
    image_144x108 VARCHAR,
    image_135x102 VARCHAR,
    image_100x80 VARCHAR,

    created TIMESTAMP,
    modified TIMESTAMP,
    shared TIMESTAMP,

    views INT,
    loves INT,
    favorites INT,
    remixes INT,

    remix_parent BIGINT,
    remix_root BIGINT,

    project_token VARCHAR
);

-- Session table
CREATE TABLE IF NOT EXISTS session (
    id BIGINT PRIMARY KEY AUTOINCREMENT,
    username VARCHAR NOT NULL,
    cookie VARCHAR NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP  -- new column for session expiration
);
 
