import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function PersonalityAssessment() {
  const navigate = useNavigate();

  // Initialize form data for 5 questions x 6 dimensions
  const initialData = {};
  for (let i = 1; i <= 5; i++) {
    ['r', 'i', 'a', 's', 'e', 'c'].forEach(dim => {
      initialData[`q${i}_${dim}`] = 3; // Default middle value 1-5
    });
  }

  const [formData, setFormData] = useState(initialData);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: parseInt(e.target.value) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/personality_assessment', formData, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      });
      if (response.data.success) {
        navigate('/interest_assessment');
      } else {
        setError(response.data.message || 'Error submitting assessment');
      }
    } catch (err) {
      setError('An error occurred communicating with the server.');
      console.error(err);
    }
  };

  const renderQuestion = (qNum) => (
    <div className="mb-8 border-b pb-6" key={`q${qNum}`}>
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Activity Set {qNum}</h3>
      <p className="text-sm text-gray-600 mb-4">Rate how much you would enjoy the following types of work (1 = Dislike, 5 = Enjoy highly):</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { key: 'r', label: 'Hands-on / Practical tools (Realistic)' },
          { key: 'i', label: 'Research / Problem solving (Investigative)' },
          { key: 'a', label: 'Creative / Arts (Artistic)' },
          { key: 's', label: 'Helping / Teaching others (Social)' },
          { key: 'e', label: 'Leading / Selling (Enterprising)' },
          { key: 'c', label: 'Organizing / Data (Conventional)' }
        ].map(dim => (
          <div key={`${qNum}_${dim.key}`} className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">{dim.label}</label>
            <input 
              type="range" 
              name={`q${qNum}_${dim.key}`} 
              min="1" 
              max="5" 
              value={formData[`q${qNum}_${dim.key}`]} 
              onChange={handleInputChange} 
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[var(--color-royal)]"
            />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg border border-gray-100 p-8 mt-10">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-extrabold text-[var(--color-dark)]">Personality Assessment</h1>
        <p className="mt-2 text-gray-600">Discover your Holland Code (RIASEC) personality type.</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 bg-gray-50 p-6 rounded-lg border border-gray-200">
        {[1, 2, 3, 4, 5].map(q => renderQuestion(q))}

        <div className="flex justify-end pt-4">
          <button type="submit" className="bg-[var(--color-royal)] text-white px-8 py-3 rounded-md font-medium hover:bg-[var(--color-royal-dark)] transition-colors shadow-md">
            Next: Interest Assessment
          </button>
        </div>
      </form>
    </div>
  );
}
