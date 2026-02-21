import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function InterestAssessment() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    interest_math: 3,
    interest_science: 3,
    interest_business: 3,
    interest_creative: 3,
    interest_social: 3,
  });
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: parseInt(e.target.value) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/interest_assessment', formData, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      });
      if (response.data.success) {
        navigate('/career_roadmap'); // Navigate to roadmap or results page depending on flow
      } else {
        setError(response.data.message || 'Error submitting assessment');
      }
    } catch (err) {
      setError('An error occurred communicating with the server.');
      console.error(err);
    }
  };

  const renderSlider = (label, name) => (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">{label} (1-5)</label>
      <input 
        type="range" 
        name={name} 
        min="1" 
        max="5" 
        value={formData[name]} 
        onChange={handleInputChange} 
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[var(--color-royal)]"
      />
      <div className="flex justify-between text-xs text-gray-500 px-1 mt-1">
        <span>Low</span>
        <span>High</span>
      </div>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg border border-gray-100 p-8 mt-10">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-extrabold text-[var(--color-dark)]">Interest Assessment</h1>
        <p className="mt-2 text-gray-600">Rate your interest levels in the following areas.</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-gray-50 p-6 rounded-lg border border-gray-200">
        {renderSlider("Mathematics", "interest_math")}
        {renderSlider("Science", "interest_science")}
        {renderSlider("Business/Finance", "interest_business")}
        {renderSlider("Creative/Arts", "interest_creative")}
        {renderSlider("Social/Communications", "interest_social")}

        <div className="flex justify-end pt-4">
          <button type="submit" className="bg-[var(--color-royal)] text-white px-8 py-3 rounded-md font-medium hover:bg-[var(--color-royal-dark)] transition-colors shadow-md">
            Submit Assessment
          </button>
        </div>
      </form>
    </div>
  );
}
