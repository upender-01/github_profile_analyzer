const axios = require('axios');
const db = require('../configurations/db');

const analyzeprofile = async (req, res) => {
    try {
        console.log('Step 1: Request Received');
        console.log(req.body);

        const { username } = req.body;

        if (!username) {
            return res.status(400).json({
                error: 'GitHub username is required'
            });
        }

        console.log('Step 2: Fetching GitHub Profile');

        const githubResponse = await axios.get(
            `https://api.github.com/users/${username}`,
            {
                headers: {
                    'User-Agent': 'GitHub-Profile-Analyzer',
                    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`
                }
            }
        );

        console.log('Step 3: GitHub Profile Fetched');

        const data = githubResponse.data;

        let score = 0;

        if (data.following > 0) {
            score =
                data.followers / data.following +
                data.public_repos * 0.5;
        } else {
            score =
                data.followers +
                data.public_repos * 0.5;
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
            INSERT INTO profiles
            (
                username,
                name,
                bio,
                public_repos,
                followers,
                following,
                avatar_url,
                engagement_score
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)

            ON DUPLICATE KEY UPDATE

            name = VALUES(name),
            bio = VALUES(bio),
            public_repos = VALUES(public_repos),
            followers = VALUES(followers),
            following = VALUES(following),
            avatar_url = VALUES(avatar_url),
            engagement_score = VALUES(engagement_score)
        `;

        const values = [
            profileData.username,
            profileData.name,
            profileData.bio,
            profileData.public_repos,
            profileData.followers,
            profileData.following,
            profileData.avatar_url,
            profileData.engagement_score
        ];

        console.log('Step 4: Saving Profile To Database');

        await db.execute(query, values);

        console.log('Step 5: Profile Saved Successfully');

        return res.status(201).json({
            success: true,
            message: 'Profile analyzed successfully',
            data: profileData
        });

    } catch (error) {

        console.error(' ERROR OCCURRED');
        console.error(error);

        if (error.response) {

            if (error.response.status === 404) {
                return res.status(404).json({
                    error: 'GitHub user not found'
                });
            }

            if (
                error.response.status === 403 ||
                error.response.status === 429
            ) {
                return res.status(429).json({
                    error: 'GitHub API rate limit exceeded'
                });
            }
        }

        return res.status(500).json({
            error: error.message,
            code: error.code || null,
            sqlMessage: error.sqlMessage || null
        });
    }
};

const getprofileByUsername = async (req, res) => {
    try {

        const { username } = req.params;

        const [rows] = await db.execute(
            'SELECT * FROM profiles WHERE username = ?',
            [username]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                error: 'Profile not found'
            });
        }

        return res.status(200).json({
            success: true,
            data: rows[0]
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            error: error.message
        });
    }
};

module.exports = {
    analyzeprofile,
    getprofileByUsername
};
