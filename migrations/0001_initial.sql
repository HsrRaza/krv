CREATE TABLE projects (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    status TEXT NOT NULL,
    category TEXT NOT NULL,
    location TEXT NOT NULL,
    current_phase TEXT,
    description TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX projects_created_at_idx
ON projects(created_at);

CREATE INDEX projects_status_idx
ON projects(status);

CREATE TABLE project_images (
    id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL,
    object_key TEXT NOT NULL,
    image_type TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id)
        REFERENCES projects(id)
        ON DELETE CASCADE
);
