import { useState } from 'react';
import axios from 'axios';
import { Search, Users, BookOpen, Activity, AlertCircle } from 'lucide-react';

function App() {
  const [username, setUsername] = useState('');
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!username.trim()) {
      setError('Please enter a GitHub username');
      return;
    }

    setLoading(true);
    setError('');
    setProfile(null);

    try {
      const response = await axios.post(
        'https://github-profile-analyzer-ln7p.onrender.com/api/analyze',
        {
          username: username.trim(),
        }
      );

      setProfile(response.data.data);
    } catch (err) {
  console.log("FULL ERROR:", err);

  if (err.response) {
    console.log("STATUS:", err.response.status);
    console.log("RESPONSE:", err.response.data);

    setError(
      JSON.stringify(err.response.data)
    );
  } else {
    setError("Unable to connect to backend");
  }
} finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-900">
      <div className="w-full max-w-md bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-700">
        <h1 className="text-3xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
          GitHub Analyzer
        </h1>

        <form onSubmit={handleSearch} className="flex gap-2 mb-8">
          <div className="relative flex-1">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter GitHub Username"
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500"
            />
            <Search className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg text-white"
          >
            {loading ? 'Loading...' : 'Analyze'}
          </button>
        </form>

        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 p-4 rounded-lg flex gap-2 mb-4">
            <AlertCircle />
            {error}
          </div>
        )}

        {profile && (
          <div className="bg-gray-700 p-6 rounded-xl">
            <div className="flex items-center gap-4 mb-4">
              <img
                src={profile.avatar_url}
                alt="avatar"
                className="w-20 h-20 rounded-full"
              />

              <div>
                <h2 className="text-white text-xl font-bold">
                  {profile.name || profile.username}
                </h2>

                <a
                  href={`https://github.com/${profile.username}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-400"
                >
                  @{profile.username}
                </a>
              </div>
            </div>

            {profile.bio && (
              <p className="text-gray-300 mb-4">{profile.bio}</p>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-800 p-4 rounded-lg text-center">
                <BookOpen className="mx-auto text-blue-400" />
                <h3 className="text-white text-xl">
                  {profile.public_repos}
                </h3>
                <p className="text-gray-400">Repositories</p>
              </div>

              <div className="bg-gray-800 p-4 rounded-lg text-center">
                <Users className="mx-auto text-green-400" />
                <h3 className="text-white text-xl">
                  {profile.followers}
                </h3>
                <p className="text-gray-400">Followers</p>
              </div>

              <div className="col-span-2 bg-gray-800 p-4 rounded-lg flex justify-between items-center">
                <div>
                  <p className="text-indigo-400 font-semibold">
                    Engagement Score
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Activity className="text-indigo-400" />
                  <span className="text-2xl text-white">
                    {profile.engagement_score}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
