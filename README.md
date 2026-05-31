# GitHub Profile Analyzer API 🚀

A robust Node.js and Express backend service that fetches public GitHub profile data, calculates custom engagement metrics, and stores the insights in a MySQL database. 

## 📖 Overview
This API was built to demonstrate clean architecture, third-party API integration, and cloud database management. It takes a GitHub username, fetches their public data via the GitHub API, calculates a unique "Engagement Score," and stores the results securely.

## 💻 Tech Stack
* **Backend:** Node.js, Express.js
* **Database:** MySQL2 (Configured with connection pooling for Railway Cloud)
* **API Integration:** Axios, GitHub Public API
* **Security & Config:** Dotenv, CORS

## ✨ Key Features
* **Custom Engagement Score:** Calculates a unique metric based on the user's follower-to-following ratio and public repository count.
* **Rate Limit Protection:** Configured with GitHub Personal Access Tokens and custom error handling for `429 Too Many Requests`.
* **Cloud Database Ready:** Pre-configured to connect to cloud-hosted MySQL instances (like Railway) using TCP proxy routing.
* **Upsert Logic:** Intelligently updates existing records (`ON DUPLICATE KEY UPDATE`) rather than creating duplicate database entries.

---

## 🛠️ Setup & Installation

### 1. Prerequisites
* Node.js installed on your machine
* A GitHub Personal Access Token (PAT)
* A MySQL Database (Local or Cloud-hosted like Railway)

### 2. Database Initialization
Run the following SQL script in your MySQL environment to create the necessary table:

```sql
CREATE DATABASE IF NOT EXISTS github_analyzer;
USE github_analyzer;

CREATE TABLE IF NOT EXISTS profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    bio TEXT,
    public_repos INT,
    followers INT,
    following INT,
    avatar_url VARCHAR(255),
    engagement_score DECIMAL(10, 2), 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
