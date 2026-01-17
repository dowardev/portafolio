-- Admin Mappings Table for Role-Based Access Control
-- Run this SQL in your MySQL database (portafolio_backend)

-- Create admin_mappings table
CREATE TABLE IF NOT EXISTS admin_mappings (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    sso_id BIGINT UNSIGNED NOT NULL UNIQUE,
    role VARCHAR(50) NOT NULL DEFAULT 'admin',
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Assign admin role to the test user (sso_id = 7, which is admin@admin.com)
-- IMPORTANT: sso_id comes from the SSO server, NOT the backend local user id
INSERT INTO admin_mappings (sso_id, role) VALUES (7, 'admin')
ON DUPLICATE KEY UPDATE role = 'admin', updated_at = CURRENT_TIMESTAMP;

-- Verify the record was created/updated
SELECT * FROM admin_mappings WHERE sso_id = 7;
