import { useState, useEffect } from 'react';
import axios from 'axios';

export default function CareerRoadmap() {
  const [profileData, setProfileData] = useState(null);
  const [roadmap, setRoadmap] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        // 1. Get the career profile (scores and best stream)
        const profileRes = await axios.get('/api/career_profile', {
            withCredentials: true
        });
        
        if (profileRes.data.success) {
          setProfileData(profileRes.data.data);
          
          // 2. Request the roadmap from LLM
          const roadmapRes = await axios.post('/api/career_roadmap', {}, {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
          });

          if (roadmapRes.data.success) {
            setRoadmap(roadmapRes.data.roadmap);
          } else {
            setError(roadmapRes.data.message || 'Failed to generate roadmap');
          }
        } else {
          setError(profileRes.data.message || 'Failed to fetch career profile');
        }
      } catch (err) {
        setError('An error occurred while generating your career roadmap. Ensure AI backend is running.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRoadmap();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--color-pearl)]">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[var(--color-royal)] mb-4"></div>
        <p className="text-lg text-gray-700 font-medium">Analyzing your profile & generating AI roadmap...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg border border-gray-100 p-8 mt-10 mb-10">
      <div className="mb-8 text-center border-b pb-6">
        <h1 className="text-3xl font-extrabold text-[var(--color-dark)]">Your Career Roadmap</h1>
        <p className="mt-2 text-gray-600">Based on your Academic, Personality, and Interest assessments.</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {profileData && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
            <h3 className="text-xl font-bold text-[var(--color-royal)] mb-2">Recommended Stream</h3>
            <p className="text-3xl font-extrabold text-blue-900">{profileData.best_stream}</p>
            <p className="text-sm text-blue-700 mt-2 font-medium">Confidence: {profileData.confidence_level}</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Match Scores</h3>
            <div className="space-y-2">
              {Object.entries(profileData.scores).map(([stream, score]) => (
                <div key={stream}>
                  <div className="flex justify-between text-sm mb-1 text-gray-700 font-medium">
                    <span>{stream}</span>
                    <span>{(score * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-[var(--color-royal)] h-2 rounded-full" style={{ width: `${Math.min(100, score * 100)}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {roadmap && (
        <div className="bg-gray-50 p-8 rounded-lg border border-gray-200 shadow-inner prose max-w-none">
          <h2 className="text-2xl font-bold text-[var(--color-dark)] mb-6">AI Career Guidance</h2>
          <div className="whitespace-pre-wrap text-gray-800 leading-relaxed font-sans">{roadmap}</div>
        </div>
      )}

    </div>
  );
}
