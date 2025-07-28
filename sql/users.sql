-- sql/users.sql
CREATE TABLE users (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    username VARCHAR(50) NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    hashed_password VARCHAR(255) DEFAULT NULL,
    google_id VARCHAR(255) DEFAULT NULL,
    github_id VARCHAR(255) DEFAULT NULL,
    blocked BOOLEAN NOT NULL DEFAULT FALSE,
    confirmed BOOLEAN NOT NULL DEFAULT FALSE,
    token VARCHAR(255) DEFAULT NULL,
    token_expiry DATETIME DEFAULT NULL,
    last_login_at DATETIME DEFAULT NULL,
    token_request_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_google_id (google_id),
    INDEX idx_github_id (github_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
