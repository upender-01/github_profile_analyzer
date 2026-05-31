const axios = require('axios');
const db = require('../configurations/db');

const analyzeprofile = async (req, res) => {
    try {
        console.log("========== NEW REQUEST ==========");
        console.log("Request Body:", req.body);

        const { username } = req.body;

        if (!username) {
            return res.status(400).json({
                error: 'GitHub username is required'
            });
        }

        console.log("GitHub Token Present:", !!process.env.GITHUB_TOKEN);

        const githubResponse = await axios.get(
            `https://api.github.com/users/${username}`,
            {
                headers: {
                    'User-Agent': 'GitHub-Profile-Analyzer-App',
                    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`
                }
            }
        );

        console.log("GitHub API Success");

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

        console.log("Profile Data:", profileData);

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

        await db.execute(query, [
            profileData.username,
            profileData.name,
            profileData.bio,
            profileData.public_repos,
            profileData.followers,
            profileData.following,
            profileData.avatar_url,
            profileData.engagement_score
        ]);

        console.log("Database Insert Success");

        return res.status(200).json({
            success: true,
            data: profileData
        });

    } catch (error) {

        console.error("===== ERROR =====");
        console.error(error);

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
