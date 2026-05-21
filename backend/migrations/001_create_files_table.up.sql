CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE files (
    uuid         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name         VARCHAR(255) NOT NULL,
    path         TEXT NOT NULL,
    size         BIGINT NOT NULL DEFAULT 0,
    type         VARCHAR(100) NOT NULL DEFAULT '',
    thumbnail_url TEXT NOT NULL DEFAULT '',
    user_id      UUID NOT NULL,
    parent_id    UUID REFERENCES files(uuid) ON DELETE CASCADE,
    is_folder    BOOLEAN NOT NULL DEFAULT false,
    is_starred   BOOLEAN NOT NULL DEFAULT false,
    is_trash     BOOLEAN NOT NULL DEFAULT false,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_files_user_id    ON files(user_id);
CREATE INDEX idx_files_parent_id  ON files(parent_id);
CREATE INDEX idx_files_is_trash   ON files(is_trash) WHERE is_trash = true;
CREATE INDEX idx_files_is_starred ON files(is_starred) WHERE is_starred = true;
