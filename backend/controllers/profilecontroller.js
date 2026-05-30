const axios = require('axios');
const db = require('../configurations/db');

const analyzeprofile = async (req, res) => {
    const { username } = req.body;
    
    if (!username) {
        // FIX 1: Changed the comma to a dot here
        return res.status(400).json({ error: 'Github Username is required.' });
    }
    
    try {
        const githubResponse = await axios.get(`https://api.github.com/users/${username}`, {
            headers: {
                'User-Agent': 'GitHub-Profile-Analyzer-App',
                'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`
            }
        });
        
        // FIX 2: Corrected the spelling to match githubResponse exactly
        const data = githubResponse.data;
        
        let score = 0;
        if (data.following > 0) {
            score = (data.followers / data.following) + (data.public_repos * 0.5);
        } else {
            score = data.followers + (data.public_repos * 0.5);
        }
        
        const profileData = {
            username: data.login,
            name: data.name,
            bio: data.bio,
            public_repos: data.public_repos,
            followers: data.followers,
            following: data.following,
            avatar_url: data.avatar_url,
            engagement_score: score.toFixed(2)
        };
        
        const query = `
            INSERT INTO profiles (username, name, bio, public_repos, followers, following, avatar_url, engagement_score)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE 
            name=VALUES(name), bio=VALUES(bio), public_repos=VALUES(public_repos), 
            followers=VALUES(followers), following=VALUES(following), 
            avatar_url=VALUES(avatar_url), engagement_score=VALUES(engagement_score)
        `;
        
        const values = [
            profileData.username, profileData.name, profileData.bio, 
            profileData.public_repos, profileData.followers, profileData.following, 
            profileData.avatar_url, profileData.engagement_score
        ];
        
        await db.execute(query, values);
        
        res.status(201).json({
            message: 'profile analyzed and saved successfully',
            data: profileData
        });

    } catch (error) {
        if (error.response) {
            if (error.response.status === 404) {
                return res.status(404).json({ error: 'GitHub user not found.' });
            }
            // Specific check for rate limits
            if (error.response.status === 403 || error.response.status === 429) {
                return res.status(429).json({ error: 'GitHub API rate limit exceeded. Please try again later.' });
            }
        }
        console.error(error);
        res.status(500).json({ error: 'Server error during profile analysis.' });
    }
};

// fetch data of single profile 
const getprofileByUsername = async (req, res) => {
    const { username } = req.params;
    try {
        const [rows] = await db.execute('SELECT * FROM profiles WHERE username= ?', [username]);
        
        if (rows.length == 0) {
            return res.status(404).json({ error: 'Profile not found in database' });
        }
        
        res.status(200).json({ data: rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to retrieve profile.' });
    }
};

module.exports = { analyzeprofile, getprofileByUsername };