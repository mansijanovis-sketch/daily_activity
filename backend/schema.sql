CREATE DATABASE IF NOT EXISTS daily_db;
USE daily_db;

CREATE TABLE IF NOT EXISTS activities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    act_name VARCHAR(150) NOT NULL,
    act_description TEXT,
    act_date DATE NOT NULL,
    act_time TIME NOT NULL,
    act_duration INT NOT NULL DEFAULT 0,
    cat_name VARCHAR(50) NOT NULL DEFAULT 'Personal',
    cat_color VARCHAR(20) NOT NULL DEFAULT '#4f46e5',
    priority ENUM('High', 'Medium', 'Low') NOT NULL DEFAULT 'Medium',
    status ENUM('Pending', 'Completed') NOT NULL DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_activities_user_time (user_id, act_time)
);