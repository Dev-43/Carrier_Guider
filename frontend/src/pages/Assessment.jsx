import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Assessment() {
  const navigate = useNavigate();
  // Assume we get education from an auth context later. For now, defaulting for demonstration.
  const education = "Grade 10"; 

  const [formData, setFormData] = useState({
    english: '',
    math: '',
    science: '',
    socialscience: '',
    secondlanguage: '',
    n_eng: '',
    n_math: '',
    n_sci: '',
    n_social: '',
    n_second: '',
  });

  const [showNinth, setShowNinth] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/assessment', formData, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      });
      if (response.data.success) {
        navigate('/personality_assessment');
      } else {
        setError(response.data.message || 'Error submitting assessment');
      }
    } catch (err) {
      setError('An error occurred communicating with the server.');
      console.error(err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg border border-gray-100 p-8 mt-10">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-extrabold text-[var(--color-dark)]">Academic Assessment</h1>
        <p className="mt-2 text-gray-600">Current Pursuing / Completed {education}</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {education === "Grade 10" && (
        <form onSubmit={handleSubmit} className="space-y-8">
          
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h2 className="text-xl font-semibold mb-6 text-[var(--color-royal)] border-b pb-2 cursor-pointer">
              Enter 10th Marks (Mandatory)
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">English</label>
                <input type="number" name="english" required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[var(--color-royal)] focus:border-[var(--color-royal)]" value={formData.english} onChange={handleInputChange} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mathematics</label>
                <input type="number" name="math" required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[var(--color-royal)] focus:border-[var(--color-royal)]" value={formData.math} onChange={handleInputChange} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Science</label>
                <input type="number" name="science" required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[var(--color-royal)] focus:border-[var(--color-royal)]" value={formData.science} onChange={handleInputChange} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Social Science</label>
                <input type="number" name="socialscience" required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[var(--color-royal)] focus:border-[var(--color-royal)]" value={formData.socialscience} onChange={handleInputChange} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Second Language</label>
                <input type="number" name="secondlanguage" required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[var(--color-royal)] focus:border-[var(--color-royal)]" value={formData.secondlanguage} onChange={handleInputChange} />
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input type="checkbox" className="w-5 h-5 text-[var(--color-royal)] rounded focus:ring-[var(--color-royal)]" checked={showNinth} onChange={(e) => setShowNinth(e.target.checked)} />
              <span className="text-gray-800 font-medium text-lg">I want to enter 9th marks (Optional)</span>
            </label>

            {showNinth && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h2 className="text-xl font-semibold mb-6 text-[var(--color-royal)]">Enter 9th Marks</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">English</label>
                     <input type="number" name="n_eng" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[var(--color-royal)] focus:border-[var(--color-royal)]" value={formData.n_eng} onChange={handleInputChange} />
                  </div>
                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Mathematics</label>
                     <input type="number" name="n_math" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[var(--color-royal)] focus:border-[var(--color-royal)]" value={formData.n_math} onChange={handleInputChange} />
                  </div>
                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Science</label>
                     <input type="number" name="n_sci" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[var(--color-royal)] focus:border-[var(--color-royal)]" value={formData.n_sci} onChange={handleInputChange} />
                  </div>
                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Social Science</label>
                     <input type="number" name="n_social" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[var(--color-royal)] focus:border-[var(--color-royal)]" value={formData.n_social} onChange={handleInputChange} />
                  </div>
                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Second Language</label>
                     <input type="number" name="n_second" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[var(--color-royal)] focus:border-[var(--color-royal)]" value={formData.n_second} onChange={handleInputChange} />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end pt-4">
            <button type="submit" className="bg-[var(--color-royal)] text-white px-8 py-3 rounded-md font-medium hover:bg-[var(--color-royal-dark)] transition-colors shadow-md">
              Submit Marks & Proceed
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
