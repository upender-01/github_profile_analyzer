import  { useState } from 'react';
import axios from 'axios';
import { Search, Users, BookOpen, Activity, AlertCircle } from 'lucide-react';

function App() {
  const [username, setUsername] = useState('');
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!username.trim()) return;

    setLoading(true);
    setError('');
    setProfile(null);

   try {
  const response = await axios.post(
    "https://github-profile-analyzer-ln7p.onrender.com/api/analyze",
    {
      username: username.trim()
    }
  );

  setProfile(response.data.data);
}
catch (err) {
  if (err.response?.data?.error) {
    setError(err.response.data.error);
  } else {
    setError("Failed to connect to the server.");
  }
}
      
      setProfile(response.data.data);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError('Failed to connect to the server. Is the backend running?');
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

        {/* Search Form */}
        <form onSubmit={handleSearch} className="flex gap-2 mb-8">
          <div className="relative flex-1">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter GitHub Username"
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500 transition-colors"
            />
            <Search className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 px-6 py-3 rounded-lg font-semibold transition-colors text-white flex items-center justify-center"
          >
            {loading ? '...' : 'Analyze'}
          </button>
        </form>

        {/* Error Message */}
        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 p-4 rounded-lg flex items-center gap-3 mb-6 animate-pulse">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Profile Card */}
        {profile && (
          <div className="bg-gray-700 p-6 rounded-xl border border-gray-600 shadow-inner">
            <div className="flex items-center gap-5 mb-6">
              <img 
                src={profile.avatar_url} 
                alt={`${profile.username}'s avatar`} 
                className="w-20 h-20 rounded-full border-4 border-gray-800 shadow-md"
              />
              <div>
                <h2 className="text-2xl font-bold text-white">{profile.name || profile.username}</h2>
                <a 
                  href={`https://github.com/${profile.username}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                >
                  @{profile.username}
                </a>
              </div>
            </div>

            {profile.bio && (
              <p className="text-gray-300 text-sm mb-6 italic border-l-2 border-gray-500 pl-3">
                "{profile.bio}"
              </p>
            )}

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-800 p-4 rounded-lg border border-gray-600 flex flex-col items-center justify-center">
                <BookOpen className="text-blue-400 mb-2 w-6 h-6" />
                <span className="text-2xl font-bold text-white">{profile.public_repos}</span>
                <span className="text-xs text-gray-400 uppercase tracking-wider mt-1">Repositories</span>
              </div>
              
              <div className="bg-gray-800 p-4 rounded-lg border border-gray-600 flex flex-col items-center justify-center">
                <Users className="text-emerald-400 mb-2 w-6 h-6" />
                <span className="text-2xl font-bold text-white">{profile.followers}</span>
                <span className="text-xs text-gray-400 uppercase tracking-wider mt-1">Followers</span>
              </div>

              <div className="col-span-2 bg-gradient-to-r from-gray-800 to-gray-750 p-4 rounded-lg border border-indigo-500/30 flex justify-between items-center relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Activity className="w-16 h-16" />
                </div>
                <div>
                  <span className="block text-xs text-indigo-300 uppercase tracking-wider font-semibold mb-1">Engagement Score</span>
                  <span className="text-sm text-gray-400">Based on follower ratio & repos</span>
                </div>
                <span className="text-3xl font-extrabold text-indigo-400">{profile.engagement_score}</span>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

export default App;
