import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    education: 'Grade 10',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Setup the API call (requires flask changes later)
      const response = await axios.post('/api/register', formData, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });
      if (response.data.success) {
        navigate('/main');
      } else {
        setError(response.data.message || 'Registration failed');
      }
    } catch (err) {
      setError('An error occurred. Make sure the backend is running.');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-pearl)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg border border-gray-100">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-[var(--color-dark)]">
            Create an account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or <Link to="/login" className="font-medium text-[var(--color-royal)] hover:text-[var(--color-royal-dark)]">sign in to your existing account</Link>
          </p>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="name" className="sr-only">Full Name</label>
              <input id="name" name="name" type="text" required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-[var(--color-royal)] focus:border-[var(--color-royal)] focus:z-10 sm:text-sm"
                placeholder="Full Name"
                value={formData.name} onChange={handleInputChange} />
            </div>
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <input id="email" name="email" type="email" required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-[var(--color-royal)] focus:border-[var(--color-royal)] focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={formData.email} onChange={handleInputChange} />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input id="password" name="password" type="password" required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-[var(--color-royal)] focus:border-[var(--color-royal)] focus:z-10 sm:text-sm"
                placeholder="Password"
                value={formData.password} onChange={handleInputChange} />
            </div>
            <div>
              <label htmlFor="education" className="block text-sm font-medium text-gray-700">Current Education Level</label>
              <select id="education" name="education"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[var(--color-royal)] focus:border-[var(--color-royal)] sm:text-sm rounded-md"
                value={formData.education} onChange={handleInputChange}>
                <option value="Grade 10">Grade 10</option>
                <option value="Grade 12 Science(PCM)">Grade 12 Science (PCM)</option>
                <option value="Grade 12 Science(PCB)">Grade 12 Science (PCB)</option>
                <option value="Grade 12 Science(PCMB)">Grade 12 Science (PCMB)</option>
                <option value="Grade 12 Commerce">Grade 12 Commerce</option>
                <option value="Grade 12 Arts">Grade 12 Arts</option>
                <option value="Diploma/Polytechnic">Diploma / Polytechnic</option>
                <option value="UG">Undergraduate (UG)</option>
              </select>
            </div>
          </div>

          <div>
            <button type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[var(--color-royal)] hover:bg-[var(--color-royal-dark)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-royal)]">
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
